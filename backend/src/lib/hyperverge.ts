import axios from 'axios';
import FormData from 'form-data';

const hypervergeClient = axios.create({
  baseURL: process.env.HYPERVERGE_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.HYPERVERGE_API_KEY}`,
  },
});

export interface KYCVerificationRequest {
  documentFrontImage: Buffer;
  documentBackImage?: Buffer;
  selfieImage: Buffer;
  fullName: string;
  dateOfBirth: string;
  documentType?: string;
  phoneNumber?: string;
  email?: string;
}

export interface KYCVerificationResponse {
  status: 'success' | 'failure';
  verificationId: string;
  result?: {
    facialMatch?: boolean;
    documentVerified?: boolean;
    livelinessDetected?: boolean;
    ageEstimated?: number;
  };
  error?: string;
}

/**
 * Submit KYC verification documents to HyperVerge
 */
export async function submitKYCVerification(
  request: KYCVerificationRequest,
): Promise<KYCVerificationResponse> {
  try {
    const formData = new FormData();
    
    formData.append('fullName', request.fullName);
    formData.append('dateOfBirth', request.dateOfBirth);
    formData.append('documentType', request.documentType || 'AADHAAR');
    formData.append('phoneNumber', request.phoneNumber || '');
    formData.append('email', request.email || '');
    
    formData.append('documentFrontImage', request.documentFrontImage, 'aadhaar_front.jpg');
    if (request.documentBackImage) {
      formData.append('documentBackImage', request.documentBackImage, 'aadhaar_back.jpg');
    }
    formData.append('selfieImage', request.selfieImage, 'selfie.jpg');

    const response = await hypervergeClient.post('/verify/individual', formData, {
      headers: formData.getHeaders(),
    });

    return {
      status: response.data.status || 'success',
      verificationId: response.data.verificationId,
      result: response.data.result,
    };
  } catch (error) {
    console.error('Error submitting KYC verification:', error);
    throw new Error('Failed to submit KYC verification');
  }
}

/**
 * Get KYC verification status
 */
export async function getKYCStatus(verificationId: string): Promise<KYCVerificationResponse> {
  try {
    const response = await hypervergeClient.get(`/verify/individual/${verificationId}`);
    return {
      status: response.data.status || 'success',
      verificationId,
      result: response.data.result,
    };
  } catch (error) {
    console.error('Error fetching KYC status:', error);
    throw new Error('Failed to fetch KYC status');
  }
}

export default hypervergeClient;
