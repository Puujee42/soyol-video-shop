import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

async function safeHandler(
  req: Request,
  handlerFn: (req: Request) => Promise<Response>
): Promise<Response> {
  try {
    const res = await handlerFn(req);
    const url = new URL(req.url);
    if (!url.pathname.endsWith('/session')) {
      return res;
    }
    const text = await res.text();
    if (!text || text.trim() === '') {
      return NextResponse.json({ session: null }, { status: 200 });
    }
    return new Response(text, { status: res.status, headers: res.headers });
  } catch {
    return NextResponse.json({ session: null }, { status: 200 });
  }
}

export const GET = (req: Request) => safeHandler(req, (r) => handler(r));
export const POST = (req: Request) => safeHandler(req, (r) => handler(r));
