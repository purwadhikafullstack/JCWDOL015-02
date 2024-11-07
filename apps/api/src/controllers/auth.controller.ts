import { Request, Response } from "express";
import prisma from "@/prisma";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { transporter } from "@/helpers/nodemailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
const verifyToken = uuidv4();
const verifyTokenExp = dayjs().add(1, 'hour').toDate();

export class AuthController {
  async registerUserWithMail(req: Request, res: Response) {
    const { username, email } = req.body;
    try {
      const existingUser = await prisma.user.findFirst({
        where: { username },
      });
      if (existingUser?.username && existingUser.verified == true) throw "username already exists!";
      if (existingUser?.email && existingUser.verified == true) throw "email already exists!";
      if (existingUser && existingUser.verifyTokenExp && dayjs().isBefore(dayjs(existingUser.verifyTokenExp))) {
        return res.status(400).json({ message: 'Email already sent, please try again 1 hour after the previous email was sent' });
      }

      if (existingUser) {
        await prisma.user.update({
          where: { email },
          data: {
            verifyToken: verifyToken,
            verifyTokenExp: verifyTokenExp,
          }
        })
      } else {
        await prisma.user.create({
          data: {
            username,
            email,
            verifyToken:verifyToken,
            verifyTokenExp: verifyTokenExp,
          },
        });
      }

      const templatePath = path.join(__dirname, "../templates/verificationMail.hbs");
      const tempalteSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(tempalteSource);
      const html = compiledTemplate({username, link: `${process.env.FRONTEND_URL}/auth/set-password/${verifyToken}`});

      transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Email Confirmation and set password",
        html: html,
      }, (err) => {
        if (err) throw 'Error sending email'
        return res.status(200).send({ 
          status: "ok",
          message: "Please check your email to set password/confirm your account",
          verifyToken
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

  async setPassword(req: Request, res: Response) {
    const { verifyToken, password } = req.body;
    try {
      const registerUser = await prisma.user.findFirst({
        where: { verifyToken: verifyToken },
      })
      const resetPassUser = await prisma.user.findFirst({
        where: { userToken: verifyToken },
      })
      if(!registerUser && !resetPassUser) throw "user not found !";

      const hashedPassword = await hash(password, 10);
      if(resetPassUser){
        await prisma.user.update({
          where: { userToken: verifyToken },
          data: {password: hashedPassword, userToken: null, userTokenExp: null},
        })
      }
      if(registerUser){
        await prisma.user.update({
          where: { verifyToken },
          data: { password: hashedPassword,verified: true,verifyToken: null,verifyTokenExp: null},
        });
      }

      return res.status(200).send({
        status: "ok",
        message: "Password set successfully, you can now login"
      });
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

  async loginWithMail(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const existingUser = await prisma.user.findUnique({
          where: { email: email },
        });
        if (!existingUser) throw "user not found !";
        if(existingUser.password === null) throw 'Please login with google if you dont have a password'
        const isValidPass = await compare(password, existingUser.password);
        if (!isValidPass) throw "incorrect password !";
        const payload = {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role
        };
        const loginToken = sign(payload, process.env.JWT_SECRET!, {
          expiresIn: "30d",
        });
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { loginToken: loginToken },
        });
        res.cookie("loginToken", loginToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
  
        res.status(200).send({status: "ok",message: "login success !",data: existingUser});
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send({status: "error",message: error.message});
        }
        res.status(400).send({status: "error",message: error});
      }
  }
  async logoutUser(req: Request, res: Response) {
    try {
      const loginToken = req.cookies.loginToken;
      if (!loginToken) throw "no user is logged in !";
      const user = await prisma.user.findFirst({
        where:{loginToken}
      })
      if (!user) throw "user not found !"
      await prisma.user.update({
        where: { id: user.id },
        data: { loginToken: null },
      })

      res.clearCookie("loginToken");
      res.status(201).send({status: "ok",message: "logout success !"});
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({status: "error",message: error.message});
      }
      res.status(400).send({status: "error",message: error});
    }
  }
}