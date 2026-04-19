import axios from 'axios';

const tatumClient = axios.create({
  baseURL: process.env.TATUM_API_URL,
  headers: {
    'x-api-key': process.env.TATUM_API_KEY,
    'Content-Type': 'application/json',
  },
});

export interface TRC20WalletResponse {
  address: string;
  currency: string;
}

export interface BalanceResponse {
  address: string;
  balance: string;
  incoming: string;
  outgoing: string;
}

export interface TransferResponse {
  txId: string;
  completed: boolean;
}

/**
 * Generate a new TRC-20 wallet address
 */
export async function generateTRC20Wallet(): Promise<TRC20WalletResponse> {
  try {
    const response = await tatumClient.post('/tron/account', {
      mnemonic: process.env.TATUM_MNEMONIC || undefined,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating TRC-20 wallet:', error);
    throw new Error('Failed to generate wallet address');
  }
}

/**
 * Get balance of a USDT wallet (TRC-20)
 */
export async function getUSDTBalance(address: string): Promise<string> {
  try {
    const response = await tatumClient.get(
      `/tron/account/${address}/trc20?contractAddress=${process.env.USDT_TRC20_CONTRACT || 'TR7NHqjeKQxGTCi8q282XEXS4rtTZGR73c'}`
    );
    return response.data.balance || '0';
  } catch (error) {
    console.error('Error fetching USDT balance:', error);
    throw new Error('Failed to fetch balance');
  }
}

/**
 * Transfer USDT (TRC-20) from one address to another
 */
export async function transferUSDT(
  fromPrivateKey: string,
  toAddress: string,
  amount: string,
): Promise<TransferResponse> {
  try {
    const response = await tatumClient.post('/tron/trc20/transfer', {
      to: toAddress,
      tokenAddress: process.env.USDT_TRC20_CONTRACT || 'TR7NHqjeKQxGTCi8q282XEXS4rtTZGR73c',
      amount,
      fromPrivateKey,
      feeLimit: 100,
    });
    return {
      txId: response.data.txId,
      completed: true,
    };
  } catch (error) {
    console.error('Error transferring USDT:', error);
    throw new Error('Failed to transfer USDT');
  }
}

/**
 * Get transaction details
 */
export async function getTransaction(txHash: string): Promise<any> {
  try {
    const response = await tatumClient.get(`/tron/transaction/${txHash}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw new Error('Failed to fetch transaction details');
  }
}

export default tatumClient;
