import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const isAdmin = cookies().get('admin_session')?.value === 'authenticated';
  return NextResponse.json({ isAdmin });
}

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  return NextResponse.json(
    { error: 'Mot de passe incorrect' },
    { status: 401 }
  );
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}
