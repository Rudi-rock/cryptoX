import axios from 'axios';
import crypto from 'crypto';

const cashfreeClient = axios.create({
  baseURL: process.env.CASHFREE_API_URL,
  headers: {
    'X-Client-Id': process.env.CASHFREE_CLIENT_ID,
    'X-Client-Secret': process.env.CASHFREE_CLIENT_SECRET,
    'Content-Type': 'application/json',
  },
});

export interface PayoutRequest {
  transferId: string;
  beneficiary: {
    name: string;
    email: string;
    phone: string;
    bankAccount?: string;
    ifsc?: string;
    vpa: string;
  };
  amount: number;
  batchTransferId?: string;
  notifyUrl?: string;
}

export interface PayoutResponse {
  transferId: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'CANCELLED';
  amount: number;
  utr?: string;
  failureReason?: string;
}

/**
 * Request a payout via Cashfree
 */
export async function requestPayout(request: PayoutRequest): Promise<PayoutResponse> {
  try {
    const response = await cashfreeClient.post('/transfers', {
      transferId: request.transferId,
      beneficiary: request.beneficiary,
      amount: request.amount,
      batchTransferId: request.batchTransferId,
      notifyUrl: request.notifyUrl,
    });
    return response.data;
  } catch (error) {
    console.error('Error requesting payout:', error);
    throw new Error('Failed to request payout');
  }
}

/**
 * Get payout status
 */
export async function getPayoutStatus(transferId: string): Promise<PayoutResponse> {
  try {
    const response = await cashfreeClient.get(`/transfers/${transferId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payout status:', error);
    throw new Error('Failed to fetch payout status');
  }
}

/**
 * Verify webhook signature from Cashfree
 */
export function verifyWebhookSignature(
  timestamp: string,
  signature: string,
  body: string,
): boolean {
  const message = `${timestamp}.${body}`;
  const secret = process.env.CASHFREE_CLIENT_SECRET || '';
  const hash = crypto.createHmac('sha256', secret).update(message).digest('base64');
  return hash === signature;
}

export default cashfreeClient;
