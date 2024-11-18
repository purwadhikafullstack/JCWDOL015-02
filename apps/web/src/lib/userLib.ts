import { IRegisterUser } from '@/type/authType';
import { IUpdateMail, IUpdateUsername } from '@/type/customerType';
import dotenv from 'dotenv';
dotenv.config();
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getProfileFetchDb = async () => {
  const res = await fetch(`${BASE_URL}/user/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const result = await res.json();
  return { result, ok: res.ok };
};

export const deleteUserFetchDb = async (id: number) => {
  const res = await fetch(`${BASE_URL}/user/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const result = await res.json();
  return { result, ok: res.ok };
};

export const UpdateAvatarFetchDb = async (formData: any) => {
  const res = await fetch(`${BASE_URL}/user/update-avatar`, {
    method: 'PATCH',
    body: formData,
    credentials: 'include',
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

export const DeleteAvatarFetchDb = async () => {
  const res = await fetch(`${BASE_URL}/user/delete-avatar`, {
    method: 'PATCH',
    credentials: 'include',
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

export const updateUsernameFetchDb = async (data: IUpdateUsername) => {
  const res = await fetch(`${BASE_URL}/user/update-username`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const result = await res.json();
  return { result, ok: res.ok };
};

export const updateMailFetchDb = async (data: IUpdateMail) => { // oldMail, newMail, Token
  const res = await fetch(`${BASE_URL}/user/update-mail`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {'Content-Type' : 'application/json'},
    credentials: 'include'
  });
  const result = await res.json();
  return { result, ok : res.ok };
}

export const onlyVerifyFetchDb = async (data: any) => { // token
  const res = await fetch(`${BASE_URL}/user/only-verify`,{
    method: 'PATCH',
    body : JSON.stringify(data),
    headers: {'Content-Type' : 'application/json'},
    credentials: 'include'
  });
  const result = await res.json();
  return { result , ok: res.ok }
}