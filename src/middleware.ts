import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/firebase'; // Assuming a basic admin-initialized firebase

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session')?.value;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  // If the user is trying to access auth pages but is already logged in,
  // redirect them to the dashboard.
  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is trying to access a protected page but is not logged in,
  // redirect them to the login page.
  if (!sessionCookie && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (pathname === '/') {
     return NextResponse.redirect(new URL('/login', request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
