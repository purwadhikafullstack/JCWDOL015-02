import { Request, Response } from 'express';
import prisma from '@/prisma';
import {compare, genSalt, hash} from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()


export class SampleController {
  async registerUserWithMail(req:Request, res:Response) {
    const {username,email} = req.body
    const now = new Date();
    const expDate = new Date(now.setHours(now.getHours() + 1));
    
    try {
      // validasi email dan username jika sudah digunakan
      const existingUsername = await prisma.user.findFirst({where: {username:username}})
      if (existingUsername) throw 'username already exists!'
      const existingEmail = await prisma.user.findUnique({where: {email:email}})
      if (existingEmail) throw 'email already exists!'
      // membuat user baru
      const newUser = await prisma.user.create({
        data : {username,email}
      })

      res.status(200).send({
        status: "success",
        message: "register user successfully",
        newUser
      })
    } catch (error) {
      if(error instanceof Error) {
        res.status(400).send({
          status: "error",
          message: error.message
        })
      }
      res.status(400).send({
        status: "error",
        message: error
      })
    }
  }

  async loginUser(req:Request, res:Response){
    try {
      const { email, password } = req.body

      // mencari user berdasarkan email dan validasi jika email tidak ditemukan
      const existingUser = await prisma.user.findUnique({
          where: { email: email }
      })
      if (!existingUser) throw "user not found !"

      // validasi jika password yang di inputkan salah (compare)
      if (existingUser.password){
        const isValidPass = await compare(password, existingUser.password)
        if (!isValidPass) throw "incorrect password !"
      }

      // membuat accessToken dan refreshToken jwt
      const payload = {id: existingUser.id,username: existingUser.username, email: existingUser.email}
      const userToken = sign(payload,process.env.SECRET_JWT!,{expiresIn: '30d'})
      // memasukan user token yang baru dibuat ke db
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { userToken },
      });
      // membuat user token di httpOnly cookie (key,value,option)
      res.cookie("userToken", userToken, {
        httpOnly: true, // tidak dapat diakses dari client langsung
        maxAge: 90 * 24 * 60 * 60 * 1000, // expires dalam 3 bulan (90 hari)
        // secure: true // jika menggunakan https
      });

      res.status(200).send({
        status: 'ok',
        message: "login success !",
        userLogin: existingUser
      })
    } catch (error) {
      res.status(400).send({
        status: "error",
        message: error
      })
    }
  }

  async logoutUser(req:Request, res:Response){
    try {
      // mengambil value dari token yang sudah di set di cookie (mengambil refresh token di cookie)
      const userToken = req.cookies.userToken
      // validasi jika tidak ada token di cookie (tidak ada refresh token)
      if (!userToken) throw "no user is logged in !"

      // cari user dengan membandingkan refresh token yang ada di cookie dengan refresh token yang ada di db
      const user = await prisma.user.findFirst({
          where:{userToken}
      })
      // validasi jika user tidak ditemukan
      if (!user) throw "user not found !"
      // set token yang ada di user DB berdasarkan id menjadi null (delete)
      await prisma.user.update({
        where: { id: user.id }, // di ID ini
        data: { userToken: null }, // userToken nya menjadi null
      })
      // menghapus user token di cookie
      res.clearCookie("userToken")

      res.status(201).send({
        status: "ok",
        message: "logout success !"
      })
    } catch (error) {
      if(error instanceof Error) {
        res.status(400).send({
          status: "error",
          message: error.message
        })
      }
      res.status(400).send({
        status: "error",
        message: error
      })
    }
  }

  async deleteUser(req:Request, res:Response){
    const { id } = req.params
    try {
      const existingUser = await prisma.user.delete({
        where: { id: Number(id) }
      })

      res.status(200).send({
        status: "ok", 
        message: "delete user success !",
        existingUser
      })
    } catch (error) {
      if(error instanceof Error) {
        res.status(400).send({
          status: "error",
          message: error.message
        })
      }
      res.status(400).send({
        status: "error",
        message: error
      })
    }
  }
}