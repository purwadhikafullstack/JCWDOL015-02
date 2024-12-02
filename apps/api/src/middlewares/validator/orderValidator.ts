import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateCreateOrder = [ //userId, addressId, pickupSchedule
    body("userId")
      .notEmpty()
      .withMessage("userId is required"),
    body("addressId")
      .notEmpty()
      .withMessage("addressId is required"),
    body("pickupSchedule")
      .notEmpty()
      .withMessage("pickupSchedule is required"),
  
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