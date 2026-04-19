import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { CreateP2PAd } from '@/validations/schemas';

export async function GET(request: NextRequest) {
  try {
    // Fetch all active P2P ads
    const { data: ads, error: adsError } = await supabase
      .from('p2p_ads')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (adsError) {
      throw adsError;
    }

    return NextResponse.json({
      success: true,
      ads: ads || [],
      count: ads?.length || 0,
    });
  } catch (error) {
    console.error('P2P ads fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate input
    const validation = CreateP2PAd.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { side, rate, minLimit, maxLimit, paymentMethods } = validation.data;

    // Create P2P ad
    const { data: ad, error: adError } = await supabase
      .from('p2p_ads')
      .insert({
        user_id: userId,
        side,
        rate,
        min_limit: minLimit,
        max_limit: maxLimit,
        payment_methods: paymentMethods,
        status: 'active',
      })
      .select()
      .single();

    if (adError) {
      throw adError;
    }

    return NextResponse.json({
      success: true,
      message: 'P2P ad created successfully',
      ad,
    }, { status: 201 });
  } catch (error) {
    console.error('P2P ad creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
