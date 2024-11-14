import dotenv from 'dotenv';
dotenv.config();
const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getOrdersByUserFetchDb = async (data: any) => {
  const res = await fetch(
    `${BASE_URL}/order/user/${data.id}?page=${data.currentPage}`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  );
  const result = await res.json();
  return { result, ok: res.ok };
};
