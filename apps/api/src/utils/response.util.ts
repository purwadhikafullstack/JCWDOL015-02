import { Response } from 'express';

interface ResponseData {
  success: boolean;
  data: any; // Bisa disesuaikan dengan tipe data yang lebih spesifik
  message: string;
}

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  data: any,
  message: string = '',
): void => {
  const response: ResponseData = {
    success,
    data,
    message,
  };

  res.status(statusCode).json(response);
};
