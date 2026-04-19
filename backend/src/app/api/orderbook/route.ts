import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Fetch all open buy and sell orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'open')
      .order('price', { ascending: false });

    if (ordersError) {
      throw ordersError;
    }

    // Aggregate orders into buy and sell sides
    const buyOrders = orders
      ?.filter((order) => order.side === 'buy')
      .map((order) => ({
        price: order.price,
        amount: order.amount,
        total: order.total_cost,
      })) || [];

    const sellOrders = orders
      ?.filter((order) => order.side === 'sell')
      .map((order) => ({
        price: order.price,
        amount: order.amount,
        total: order.total_cost,
      })) || [];

    // Sort for orderbook display
    buyOrders.sort((a, b) => b.price - a.price);
    sellOrders.sort((a, b) => a.price - b.price);

    return NextResponse.json({
      success: true,
      orderBook: {
        bids: buyOrders.slice(0, 50),
        asks: sellOrders.slice(0, 50),
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error('Orderbook fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
