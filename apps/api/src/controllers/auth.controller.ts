import { Request, Response } from 'express';
import prisma from '@/prisma';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { transporter } from '@/helpers/nodemailer';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

export class AuthController {
  async registerUserWithMail(req: Request, res: Response) {
    try {
      const { email, password } = req.body; // Assuming email and password are sent in the request body
      const user = await prisma.user.findUnique({
        // Gunakan Prisma untuk mengambil user
        where: { email },
      });

      if (!user || !user.password)
        throw new Error('User not found or password not set!');

      const isValidPass = await compare(password, user.password); // Compare the provided password with the stored hash

      //If password doesn't match
      if (!isValidPass) throw new Error('Incorrect password!');

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      const loginToken = sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '30d',
      });

      // const updateData = {
      //   loginToken,
      // };

      // await prisma.user.update({
      //   where: { id: user.id },
      //   data: updateData,
      // });

      res
        .status(200)
        .send({ status: 'ok', message: 'Login success!', data: user });
    } catch (error) {
      res
        .status(400)
        .send({ message: error instanceof Error ? error.message : error });
    }
  }

  async setPassword(req: Request, res: Response) {
    const { verifyToken, password } = req.body;
    try {
      const registerUser = await prisma.user.findFirst({
        where: { verifyToken: verifyToken },
      });
      const resetPassUser = await prisma.user.findFirst({
        where: { userToken: verifyToken },
      });
      if (!registerUser && !resetPassUser) throw 'user not found !';

      const hashedPassword = await hash(password, 10);
      if (resetPassUser) {
        await prisma.user.update({
          where: { userToken: verifyToken },
          data: {
            password: hashedPassword,
            userToken: null,
            userTokenExp: null,
          },
        });
      }
      if (registerUser) {
        await prisma.user.update({
          where: { verifyToken },
          data: {
            password: hashedPassword,
            verified: true,
            verifyToken: null,
            verifyTokenExp: null,
          },
        });
      }

      return res.status(200).send({
        status: 'ok',
        message: 'Password set successfully, you can now login',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({
          status: 'error',
          message: error.message,
        });
      }
      res.status(400).send({
        status: 'error',
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
      if (!existingUser) throw 'user not found !';
      if (existingUser.password === null)
        throw 'Please login with google if you dont have a password';
      const isValidPass = await compare(password, existingUser.password);
      if (!isValidPass) throw 'incorrect password !';
      const payload = {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      };
      const loginToken = sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '30d',
      });
      res.cookie('loginToken', loginToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res
        .status(200)
        .send({ status: 'ok', message: 'login success !', data: existingUser });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({ status: 'error', message: error.message });
      }
      res.status(400).send({ status: 'error', message: error });
    }
  }

  async logoutUser(req: Request, res: Response) {
    try {
      const loginToken = req.cookies.loginToken;
      if (!loginToken) throw 'no user is logged in !';
      res.clearCookie('loginToken');
      res.status(201).send({ status: 'ok', message: 'logout success !' });
    } catch (error) {
      res
        .status(400)
        .send({ message: error instanceof Error ? error.message : error });
    }
  }
}
