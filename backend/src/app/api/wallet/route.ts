import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUSDTBalance, generateTRC20Wallet } from '@/lib/tatum';
import { GenerateDepositAddressSchema } from '@/validations/schemas';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch wallet data from database
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (walletError) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Fetch USDT balance from Tatum if address exists
    let usdtBalance = wallet.usdt_balance || 0;
    if (wallet.trc20_address) {
      try {
        usdtBalance = await getUSDTBalance(wallet.trc20_address);
      } catch (error) {
        console.error('Error fetching balance from Tatum:', error);
      }
    }

    return NextResponse.json({
      success: true,
      wallet: {
        userId: wallet.user_id,
        usdtBalance: parseFloat(usdtBalance),
        inrBalance: wallet.inr_balance,
        trc20Address: wallet.trc20_address,
      },
    });
  } catch (error) {
    console.error('Wallet fetch error:', error);
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
    const validation = GenerateDepositAddressSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Check if user already has a TRC-20 address
    const { data: wallet } = await supabase
      .from('wallets')
      .select('trc20_address')
      .eq('user_id', userId)
      .single();

    if (wallet?.trc20_address) {
      return NextResponse.json({
        success: true,
        address: wallet.trc20_address,
        message: 'Address already exists',
      });
    }

    // Generate new TRC-20 wallet
    try {
      const newWallet = await generateTRC20Wallet();

      // Update wallet with new address
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ trc20_address: newWallet.address })
        .eq('user_id', userId);

      if (updateError) {
        throw new Error('Failed to save wallet address');
      }

      return NextResponse.json({
        success: true,
        address: newWallet.address,
        message: 'Deposit address generated successfully',
      });
    } catch (error) {
      console.error('Error generating wallet:', error);
      return NextResponse.json(
        { error: 'Failed to generate deposit address' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Wallet generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
