'use server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Konfigurasi CORS di server
export function corsMiddleware(req: Request) {
  const response = NextResponse.next();
  response.headers.set(
    'Access-Control-Allow-Origin',
    'http://localhost:3000, http://localhost:8000/api',
  );
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS',
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );
  return response;
}

const TOKEN_KEY = 'token';
const USER_ID_KEY = 'userId';
const ROLE_KEY = 'role';

export async function createToken(
  token: string,
  userId: string,
  role: string,
): Promise<void> {
  const oneDay = 24 * 60 * 60 * 1000;
  cookies().set(TOKEN_KEY, token, { expires: Date.now() + oneDay });
  cookies().set(USER_ID_KEY, userId);
  cookies().set(ROLE_KEY, role);
}

export async function getToken(): Promise<string | undefined> {
  console.log(cookies().get(TOKEN_KEY));
  return cookies().get(TOKEN_KEY)?.value;
}

export async function getUserId(): Promise<string | undefined> {
  return cookies().get(USER_ID_KEY)?.value;
}

export async function getRole(): Promise<string | undefined> {
  return cookies().get(ROLE_KEY)?.value;
}

export async function deleteToken(): Promise<void> {
  cookies().delete(TOKEN_KEY);
  cookies().delete(USER_ID_KEY);
  cookies().delete(ROLE_KEY);
}
