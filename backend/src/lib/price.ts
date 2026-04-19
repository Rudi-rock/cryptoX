import axios from 'axios';

const priceClient = axios.create({
  baseURL: process.env.PRICE_FEED_URL,
  timeout: 10000,
});

export interface PriceData {
  rate: number;
  symbol: string;
  timestamp: number;
}

/**
 * Fetch USDT/INR price from CoinGecko
 */
export async function getUSDTINRPrice(): Promise<PriceData> {
  try {
    const response = await priceClient.get('/simple/price', {
      params: {
        ids: 'tether',
        vs_currencies: 'inr',
        include_market_cap: false,
        include_24hr_vol: false,
        include_24hr_change: false,
      },
    });

    const rate = response.data.tether?.inr || 0;
    return {
      rate,
      symbol: 'USDT/INR',
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching USDT/INR price:', error);
    throw new Error('Failed to fetch price');
  }
}

/**
 * Fetch multiple crypto prices
 */
export async function getCryptoPrices(
  cryptoIds: string[],
  vsCurrency: string = 'inr',
): Promise<Record<string, number>> {
  try {
    const response = await priceClient.get('/simple/price', {
      params: {
        ids: cryptoIds.join(','),
        vs_currencies: vsCurrency,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw new Error('Failed to fetch prices');
  }
}

export default priceClient;
