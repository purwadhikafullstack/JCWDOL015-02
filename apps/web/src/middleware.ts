import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { IDecodedLoginToken } from './type/authType';

export const middleware = (req: NextRequest) => {
  const url = req.nextUrl.clone();
  const isUserLoggedIn = req.cookies.get('loginToken');
  const res = NextResponse.next();

  if(isUserLoggedIn) {
      const userLogin: IDecodedLoginToken  = jwtDecode(isUserLoggedIn.value);
      const role = userLogin.role;
      if(
        url.pathname.startsWith('/auth/register') ||
        url.pathname.startsWith('/auth/login')
        ) { return NextResponse.redirect(new URL('/', req.url)) }
      if(role == "customer"){
          if(url.pathname.startsWith('/dashboard')){
            return NextResponse.redirect(new URL('/', req.url));
          }
      }
  }
  if (!isUserLoggedIn) {
    if (
      url.pathname.startsWith('/user/profile') ||
      url.pathname.match(/^\/services\/([^\/]+)/)
    ) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return res;
};
