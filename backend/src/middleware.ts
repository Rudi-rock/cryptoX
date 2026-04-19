import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, extractToken } from '@/lib/jwt';

// CORS headers for localhost development
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export async function middleware(request: NextRequest) {
  // Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers: corsHeaders });
  }

  // Get the pathname
  const pathname = request.nextUrl.pathname;

  // Skip authentication for public routes
  const publicRoutes = ['/api/auth', '/api/price', '/api/orderbook'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    const response = NextResponse.next();
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Extract and verify JWT token from Authorization header
  const authHeader = request.headers.get('Authorization');
  const token = extractToken(authHeader ?? undefined);

  if (!token) {
    const response = NextResponse.json(
      { error: 'Missing authentication token' },
      { status: 401 }
    );
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    const response = NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Add user info to request headers for use in API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-email', payload.email);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
