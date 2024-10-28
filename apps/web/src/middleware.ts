import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { IDecodedLoginToken } from './type/authType';

export const middleware = (req: NextRequest) => {
    const res = NextResponse.next();
    // const cookieToken = req.cookies.get('loginToken');
    // const userLogin: IDecodedLoginToken  = jwtDecode(cookieToken?.value!);

}