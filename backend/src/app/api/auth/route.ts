import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { signJWT } from '@/lib/jwt';
import { AuthSchema, SignupSchema } from '@/validations/schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, action, confirmPassword } = body;

    // Validate input
    if (action === 'signup') {
      const validation = SignupSchema.safeParse({
        email,
        password,
        confirmPassword,
      });
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validation.error.errors },
          { status: 400 }
        );
      }
    } else {
      const validation = AuthSchema.safeParse({ email, password });
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validation.error.errors },
          { status: 400 }
        );
      }
    }

    // Handle signup
    if (action === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return NextResponse.json(
          { error: 'Signup failed', details: error.message },
          { status: 400 }
        );
      }

      if (!data.user) {
        return NextResponse.json(
          { error: 'User creation failed' },
          { status: 400 }
        );
      }

      // Create user record in wallets table
      const { error: walletError } = await supabase
        .from('wallets')
        .insert({
          user_id: data.user.id,
          usdt_balance: 0,
          inr_balance: 0,
        });

      if (walletError) {
        console.error('Error creating wallet:', walletError);
      }

      // Generate JWT token
      const token = await signJWT({
        userId: data.user.id,
        email: data.user.email || '',
      });

      return NextResponse.json({
        success: true,
        message: 'Signup successful',
        token,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      });
    }

    // Handle login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Login failed', details: error?.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await signJWT({
      userId: data.user.id,
      email: data.user.email || '',
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
