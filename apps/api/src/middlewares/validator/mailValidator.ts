import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";


export const validateVerifyAccount = [
    body("email")
      .notEmpty()
      .withMessage("email is required"),
  
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({
          status: "error",
          message: errors.array(),
        });
      }
      next();
    },
  ];
  