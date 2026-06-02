import { NextRequest, NextResponse } from 'next/server';

const VERCEL_HOST = 'gbsw-gg.vercel.app';
const CANONICAL_HOST = 'gbsw-gg.gbsw.hs.kr';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';

  if (host === VERCEL_HOST || host.endsWith('.vercel.app')) {
    const url = request.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.port = '';
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
