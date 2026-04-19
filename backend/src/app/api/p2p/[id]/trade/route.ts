import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { InitiateP2PTradeSchema } from '@/validations/schemas';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id: adId } = params;
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate input
    const validation = InitiateP2PTradeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { amount } = validation.data;

    // Fetch the P2P ad
    const { data: ad, error: adError } = await supabase
      .from('p2p_ads')
      .select('*')
      .eq('id', adId)
      .single();

    if (adError || !ad) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      );
    }

    // Validate amount against limits
    if (amount < ad.min_limit || amount > ad.max_limit) {
      return NextResponse.json(
        { error: 'Amount outside of allowed limits' },
        { status: 400 }
      );
    }

    // Determine buyer and seller
    const isBuyerAd = ad.side === 'sell'; // If ad is selling, current user is buying
    const buyerId = isBuyerAd ? userId : ad.user_id;
    const sellerId = isBuyerAd ? ad.user_id : userId;
    const usdtAmount = amount / ad.rate;

    // Create escrow record
    const { data: escrow, error: escrowError } = await supabase
      .from('escrow')
      .insert({
        trade_id: `trade_${Date.now()}`,
        buyer_id: buyerId,
        seller_id: sellerId,
        usdt_amount: usdtAmount,
        inr_amount: amount,
        status: 'locked',
      })
      .select()
      .single();

    if (escrowError) {
      throw escrowError;
    }

    return NextResponse.json({
      success: true,
      message: 'P2P trade initiated',
      escrow,
    }, { status: 201 });
  } catch (error) {
    console.error('P2P trade error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
