import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('username')
    .notEmpty()
    .withMessage('username is required')
    .isString()
    .withMessage('username must be strings')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email'),

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

export const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email'),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isString()
    .withMessage('password must be strings'),

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

export const validateSetPass = [
  body('verifyToken').notEmpty().withMessage('verifyToken is required'),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isString()
    .withMessage('password must be strings'),

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
