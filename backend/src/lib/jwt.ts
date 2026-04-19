import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long');

export interface JWTPayload extends JoseJWTPayload {
  userId: string;
  email: string;
}

/**
 * Sign and create a JWT token
 */
export async function signJWT(payload: JWTPayload, expiresIn: string = '24h'): Promise<string> {
  const token = await new SignJWT(payload as JoseJWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}
