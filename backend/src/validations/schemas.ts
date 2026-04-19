import { z } from 'zod';

// Auth Schemas
export const AuthSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SignupSchema = AuthSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Wallet Schemas
export const GenerateDepositAddressSchema = z.object({
  currency: z.enum(['USDT', 'BUSD']).default('USDT'),
});

// Order Schemas
export const PlaceOrderSchema = z.object({
  side: z.enum(['buy', 'sell']),
  orderType: z.enum(['limit', 'market']),
  price: z.number().positive('Price must be positive'),
  amount: z.number().positive('Amount must be positive'),
  totalCost: z.number().positive('Total cost must be positive'),
});

export const CancelOrderSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
});

// P2P Schemas
export const CreateP2PAd = z.object({
  side: z.enum(['buy', 'sell']),
  rate: z.number().positive('Rate must be positive'),
  minLimit: z.number().positive('Min limit must be positive'),
  maxLimit: z.number().positive('Max limit must be positive'),
  paymentMethods: z.array(z.string()),
});

export const InitiateP2PTradeSchema = z.object({
  adId: z.string().uuid('Invalid ad ID'),
  amount: z.number().positive('Amount must be positive'),
});

// KYC Schemas
export const KYCSubmissionSchema = z.object({
  selfieImage: z.string().startsWith('data:image/', 'Invalid image format'),
  aadhaarImage: z.string().startsWith('data:image/', 'Invalid image format'),
  fullName: z.string().min(3, 'Full name is required'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format YYYY-MM-DD'),
});

// Withdrawal Schemas
export const WithdrawINRSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  upiId: z.string().includes('@', 'Invalid UPI ID'),
});

export const WithdrawUSDTSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  toAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$|^T[a-zA-Z0-9]{33}$/, 'Invalid TRC-20 address'),
});

// Types
export type AuthInput = z.infer<typeof AuthSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type GenerateDepositAddressInput = z.infer<typeof GenerateDepositAddressSchema>;
export type PlaceOrderInput = z.infer<typeof PlaceOrderSchema>;
export type CreateP2PAdInput = z.infer<typeof CreateP2PAd>;
export type InitiateP2PTradeInput = z.infer<typeof InitiateP2PTradeSchema>;
export type KYCSubmissionInput = z.infer<typeof KYCSubmissionSchema>;
export type WithdrawINRInput = z.infer<typeof WithdrawINRSchema>;
export type WithdrawUSDTInput = z.infer<typeof WithdrawUSDTSchema>;
