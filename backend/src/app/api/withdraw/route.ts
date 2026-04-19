import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requestPayout } from '@/lib/cashfree';
import { transferUSDT } from '@/lib/tatum';
import { WithdrawINRSchema, WithdrawUSDTSchema } from '@/validations/schemas';
import { v4 as uuidv4 } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const body = await request.json();
    const { type } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Handle INR withdrawal
    if (type === 'inr') {
      const validation = WithdrawINRSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validation.error.errors },
          { status: 400 }
        );
      }

      const { amount, upiId } = validation.data;

      // Check wallet balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('inr_balance')
        .eq('user_id', userId)
        .single();

      if (!wallet || wallet.inr_balance < amount) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        );
      }

      try {
        // Request payout via Cashfree
        const transferId = `payout_${uuidv4()}`;
        const payout = await requestPayout({
          transferId,
          beneficiary: {
            name: 'User',
            email: userEmail || '',
            phone: '',
            vpa: upiId,
          },
          amount,
        });

        // Deduct from wallet
        await supabase
          .from('wallets')
          .update({ inr_balance: wallet.inr_balance - amount })
          .eq('user_id', userId);

        // Create transaction record
        await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            type: 'withdrawal',
            amount,
            currency: 'INR',
            status: payout.status || 'pending',
          });

        return NextResponse.json({
          success: true,
          message: 'INR withdrawal initiated',
          transferId,
          status: payout.status,
        });
      } catch (error) {
        console.error('Cashfree payout error:', error);
        return NextResponse.json(
          { error: 'Payout failed' },
          { status: 500 }
        );
      }
    }

    // Handle USDT withdrawal
    if (type === 'usdt') {
      const validation = WithdrawUSDTSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validation.error.errors },
          { status: 400 }
        );
      }

      const { amount, toAddress } = validation.data;

      // Check wallet balance
      const { data: wallet } = await supabase
        .from('wallets')
        .select('usdt_balance')
        .eq('user_id', userId)
        .single();

      if (!wallet || wallet.usdt_balance < amount) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        );
      }

      try {
        // Transfer USDT via Tatum
        const transfer = await transferUSDT(
          process.env.TATUM_PRIVATE_KEY || '',
          toAddress,
          amount.toString()
        );

        // Deduct from wallet
        await supabase
          .from('wallets')
          .update({ usdt_balance: wallet.usdt_balance - amount })
          .eq('user_id', userId);

        // Create transaction record
        await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            type: 'withdrawal',
            amount,
            currency: 'USDT',
            status: 'completed',
            txhash: transfer.txId,
          });

        return NextResponse.json({
          success: true,
          message: 'USDT withdrawal completed',
          txHash: transfer.txId,
        });
      } catch (error) {
        console.error('USDT transfer error:', error);
        return NextResponse.json(
          { error: 'Withdrawal failed' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid withdrawal type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
