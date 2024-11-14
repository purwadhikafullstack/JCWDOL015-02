import { ILoginUser, IRegisterUser, ISetPassUser } from '@/type/authType';
import dotenv from 'dotenv';
dotenv.config();
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const loginFetchDb = async (data: ILoginUser) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const result = await res.json();
  return { result, ok: res.ok };
};

export const registerFetchDb = async (data: IRegisterUser) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  return { result, ok: res.ok };
};

export const setPassFetchDb = async (data: ISetPassUser) => {
  const res = await fetch(`${BASE_URL}/auth/set-password`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const result = await res.json();
  return { result, ok: res.ok };
};

export const logoutFetchDb = async () => {
  try {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Logout failed with status ${res.status}`);
    }

    const result = await res.json();
    console.log('Logout response:', result);
    return { result, ok: res.ok };
  } catch (error) {
    console.error('Logout error:', error);
    return { result: null, ok: false };
  }
};
