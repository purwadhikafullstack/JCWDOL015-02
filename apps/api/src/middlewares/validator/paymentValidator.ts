import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validatePayment = [
  //orderId, email, totalPrice, customerName
  body('orderId').notEmpty().withMessage('orderId is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isString()
    .withMessage('email must be strings')
    .isEmail()
    .withMessage('invalid email'),
  body('totalPrice').notEmpty().withMessage('totalPrice is required'),
  body('customerName')
    .notEmpty()
    .withMessage('customerName is required')
    .isString()
    .withMessage('state must be strings'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        status: 'error',
        message: errors.array(),
      });
    }
    next();
  },
];
