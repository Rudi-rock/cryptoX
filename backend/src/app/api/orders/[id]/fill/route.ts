import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { transferUSDT } from '@/lib/tatum';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id: orderId } = params;
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch order
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // If this is a sell order, initiate USDT transfer
    if (order.side === 'sell') {
      try {
        // Note: In production, you'd get the buyer's address from the trade details
        // For now, this is a placeholder
        const toAddress = body.buyerAddress;

        if (!toAddress) {
          return NextResponse.json(
            { error: 'Buyer address required' },
            { status: 400 }
          );
        }

        // Transfer USDT via Tatum
        const transfer = await transferUSDT(
          process.env.TATUM_PRIVATE_KEY || '',
          toAddress,
          order.amount.toString()
        );

        // Update order status
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'filled',
            filled_pct: 100,
            tx_hash: transfer.txId,
          })
          .eq('id', orderId);

        if (updateError) {
          throw updateError;
        }

        // Create transaction record
        await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            type: 'transfer',
            amount: order.amount,
            currency: 'USDT',
            status: 'completed',
            txhash: transfer.txId,
          });

        return NextResponse.json({
          success: true,
          message: 'Order filled successfully',
          txHash: transfer.txId,
        });
      } catch (error) {
        console.error('Error filling order:', error);
        return NextResponse.json(
          { error: 'Failed to fill order' },
          { status: 500 }
        );
      }
    }

    // For buy orders, just update status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'filled',
        filled_pct: 100,
      })
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: 'Order marked as filled',
    });
  } catch (error) {
    console.error('Order fill error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
