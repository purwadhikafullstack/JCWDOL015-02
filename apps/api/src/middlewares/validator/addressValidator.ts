import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validateAddress = [
  body('phone').notEmpty().withMessage('phone is required'),
  body('address')
    .notEmpty()
    .withMessage('address is required')
    .isString()
    .withMessage('address must be strings'),
  body('city')
    .notEmpty()
    .withMessage('city is required')
    .isString()
    .withMessage('city must be strings'),
  body('state')
    .notEmpty()
    .withMessage('state is required')
    .isString()
    .withMessage('state must be strings'),
  body('country')
    .notEmpty()
    .withMessage('country is required')
    .isString()
    .withMessage('country must be strings'),
  body('postalCode').notEmpty().withMessage('postalCode is required'),

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
