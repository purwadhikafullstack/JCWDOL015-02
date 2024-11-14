import { IRegisterUser } from '@/type/authType';
import { IUpdateMail, IUpdateUsername } from '@/type/customerType';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

// Fetch profile
export const getProfileFetchDb = async () => {
  try {
    const res = await fetch(`${BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
      },
      credentials: 'include', // Memastikan cookie dikirim
    });

    if (!res.ok) {
      console.error('Failed to fetch profile:', res.status, res.statusText);
      const result = await res.json();
      throw new Error(`Error: ${result.message || res.statusText}`);
    }

    const result = await res.json();
    return { result, ok: res.ok };
  } catch (error) {
    console.error('Fetch error:', error);
    return { result: null, ok: false, error };
  }
};

// Delete a user by ID
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

// Update avatar
export const UpdateAvatarFetchDb = async (formData: any) => {
  const res = await fetch(`${BASE_URL}/user/update-avatar`, {
    method: 'PATCH',
    body: formData, // Pastikan formData dikirim sesuai format yang benar
    credentials: 'include',
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

// Delete avatar
export const DeleteAvatarFetchDb = async () => {
  const res = await fetch(`${BASE_URL}/user/delete-avatar`, {
    method: 'PATCH',
    credentials: 'include',
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

// Update username
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

// Update email
export const updateMailFetchDb = async (data: IUpdateMail) => {
  const res = await fetch(`${BASE_URL}/user/update-mail`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

// Verify user
export const onlyVerifyFetchDb = async (data: any) => {
  const res = await fetch(`${BASE_URL}/user/only-verify`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

// Register a new user
export const registerUserFetchDb = async (data: IRegisterUser) => {
  const res = await fetch(`${BASE_URL}/user/register`, {
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

// Fetch all users (Account Management)
export const getAllUsersFetchDb = async () => {
  const res = await fetch(`${BASE_URL}/user/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

// Fetch a single user by ID
export const getUserByIdFetchDb = async (id: number) => {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const result = await res.json();
  return { result, ok: res.ok };
};

// Update user information (username, email, etc.)
export const updateUserFetchDb = async (id: number, data: any) => {
  const res = await fetch(`${BASE_URL}/user/update/${id}`, {
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
export const getAllOutletAddressFetchDb = async (page: number) => {
  try {
    const res = await fetch(`${BASE_URL}/outlets?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Jangan lupa credentials untuk session/cookie
    });

    const result = await res.json();
    console.log('API result for outlets:', result); // Debug API result
    return result; // Pastikan respons memiliki `data` dan `totalPages`
  } catch (error) {
    console.error('Error fetching outlets:', error);
    return { data: [], totalPages: 0, ok: false };
  }
};
