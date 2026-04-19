import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, extractToken } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname;

  // Skip authentication for public routes
  const publicRoutes = ['/api/auth', '/api/price', '/api/orderbook'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Extract and verify JWT token from Authorization header
  const authHeader = request.headers.get('Authorization');
  const token = extractToken(authHeader ?? undefined);

  if (!token) {
    return NextResponse.json(
      { error: 'Missing authentication token' },
      { status: 401 }
    );
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Add user info to request headers for use in API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-email', payload.email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/api/:path*'],
};
