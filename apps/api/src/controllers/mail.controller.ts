import { Request, Response } from 'express';
import prisma from '@/prisma';
import { transporter } from "@/helpers/nodemailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
const userToken = uuidv4();
const userTokenExp = dayjs().add(1, 'hour').toDate();

export class MailController {
  async sendMailOnlyVerification(req: Request, res: Response) {
    try {
      const {email} = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
      })
      if(!user) throw 'Email not found';
      if(user.userTokenExp && dayjs().isBefore(dayjs(user.userTokenExp))) {
        throw 'email already sent, please try again 1 hour after the previous email was sent'
      }
      const username = user.username;
      await prisma.user.update({
        where: { email },
        data: {
          userToken,
          userTokenExp,
        }
      })
      const templatePath = path.join(__dirname, "../templates/verificationMail.hbs");
      const tempalteSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(tempalteSource);
      const html = compiledTemplate({username, link: `${process.env.FRONTEND_URL}/auth/verify-account/${userToken}`});
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email, 
        subject: "Email Confirmation to verify your account",
        html: html,
      }, (err) => {
        if (err) throw 'Error sending email'
        return res.status(200).send({ 
          status: "ok",
          message: "Please check your email and confirm to verify your account",
          userToken
         });
      })
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({status: "error",message: error.message,
        });
      }
      res.status(400).send({status: "error",message: error});
    }
  }
    async sendMailResetPassword(req: Request, res: Response) {
        try {
          const {email} = req.body;
          const existingUser = await prisma.user.findUnique({
            where: { email },
          })
          if(!existingUser) throw 'Email not found';
          if(existingUser.password == null) throw 'Only accounts logged in with an email can reset their password.'
          if (existingUser && existingUser.userTokenExp && dayjs().isBefore(dayjs(existingUser.userTokenExp))) {
            throw 'Email already sent, please try again 1 hour after the previous email was sent'
          }
          const username = existingUser.username;
          await prisma.user.update({
            where: { email },
            data: {
              userToken,
              userTokenExp,
            }
          })
          const templatePath = path.join(__dirname, "../templates/resetPassword.hbs");
          const tempalteSource = fs.readFileSync(templatePath, "utf-8");
          const compiledTemplate = handlebars.compile(tempalteSource);
          const html = compiledTemplate({username, link: `${process.env.FRONTEND_URL}/auth/set-password/${userToken}`});
          await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Email Confirmation to Reset your password",
            html: html,
          }, (err) => {
            if (err) throw 'Error sending email'
            return res.status(200).send({ 
              status: "ok",
              message: "Please check your email and confirm to reset your password",
              userToken
             });
          })
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).send({
              status: "error",
              message: error.message,
            });
          }
          res.status(400).send({
            status: "error",
            message: error,
          });
        }
      }
      async sendMailUpdateEmail(req: Request, res: Response) {
        try {
          const {email} = req.body;
          const user = await prisma.user.findUnique({
            where: { email },
          })
          if(!user) throw 'Email not found';
          if (user && user.userTokenExp && dayjs().isBefore(dayjs(user.userTokenExp))) {
            throw 'Email already sent, please try again 1 hour after the previous email was sent'
          }
          const username = user.username;
          await prisma.user.update({
            where: { email },
            data: {
              userToken,
              userTokenExp,
            }
          })
          const templatePath = path.join(__dirname, "../templates/updateMail.hbs");
          const tempalteSource = fs.readFileSync(templatePath, "utf-8");
          const compiledTemplate = handlebars.compile(tempalteSource);
          const html = compiledTemplate({username, link: `${process.env.FRONTEND_URL}/auth/update-mail/${userToken}`});
          await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Email Confirmation to Set new email",
            html: html,
          }, (err) => {
            if (err) throw 'Error sending email'
            return res.status(200).send({ 
              status: "ok",
              message: "Please check your email and confirm to Set new email",
              userToken
             });
          })
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).send({status: "error",message: error.message,
            });
          }
          res.status(400).send({status: "error",message: error});
        }
      }
}
