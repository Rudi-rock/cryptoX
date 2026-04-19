import { NextRequest, NextResponse } from 'next/server';
import { getUSDTINRPrice } from '@/lib/price';

export async function GET(request: NextRequest) {
  try {
    // Fetch current USDT/INR price
    const priceData = await getUSDTINRPrice();

    // Set cache headers (5 minutes)
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    };

    return NextResponse.json(
      {
        success: true,
        price: {
          rate: priceData.rate,
          symbol: priceData.symbol,
          timestamp: priceData.timestamp,
        },
      },
      { headers }
    );
  } catch (error) {
    console.error('Price fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price' },
      { status: 500 }
    );
  }
}
