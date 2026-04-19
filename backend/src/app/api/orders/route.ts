import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PlaceOrderSchema, CancelOrderSchema } from '@/validations/schemas';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user's open orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
      count: orders?.length || 0,
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
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
    const validation = PlaceOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { side, orderType, price, amount, totalCost } = validation.data;

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        side,
        order_type: orderType,
        price,
        amount,
        total_cost: totalCost,
        filled_pct: 0,
        status: 'open',
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Broadcast order via Supabase Realtime
    await supabase
      .from('orders')
      .on('*', { event: '*', schema: 'public' }, (payload) => {
        console.log('Order change:', payload);
      })
      .subscribe();

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      order,
    }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!userId || !orderId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify order belongs to user
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Cancel order
    const { error: cancelError } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);

    if (cancelError) {
      throw cancelError;
    }

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    console.error('Order cancellation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
