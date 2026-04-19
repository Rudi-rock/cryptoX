import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { submitKYCVerification } from '@/lib/hyperverge';
import { KYCSubmissionSchema } from '@/validations/schemas';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = KYCSubmissionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { selfieImage, aadhaarImage, fullName, dateOfBirth } = validation.data;

    // Convert base64 to Buffer
    const selfieBuffer = Buffer.from(selfieImage.split(',')[1], 'base64');
    const aadhaarBuffer = Buffer.from(aadhaarImage.split(',')[1], 'base64');

    // Submit to HyperVerge
    try {
      const verification = await submitKYCVerification({
        selfieImage: selfieBuffer,
        documentFrontImage: aadhaarBuffer,
        fullName,
        dateOfBirth,
        documentType: 'AADHAAR',
      });

      // Update user KYC status in database
      const { error: updateError } = await supabase
        .from('users')
        .update({
          kyc_status: verification.status === 'success' ? 'verified' : 'pending',
          kyc_verification_id: verification.verificationId,
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating KYC status:', updateError);
      }

      return NextResponse.json({
        success: true,
        message: 'KYC submission successful',
        verificationId: verification.verificationId,
        status: verification.status,
        result: verification.result,
      });
    } catch (error) {
      console.error('HyperVerge error:', error);
      return NextResponse.json(
        { error: 'KYC verification failed', details: (error as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('KYC submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user KYC status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('kyc_status, kyc_verification_id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      kycStatus: user.kyc_status,
      verificationId: user.kyc_verification_id,
    });
  } catch (error) {
    console.error('KYC status fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
