import { Request, Response } from "express";
import prisma from "@/prisma";
import { verify } from "jsonwebtoken";
import { compare } from "bcrypt";
import dayjs from 'dayjs';
export class UserController {
  backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'

  async getUserProfile(req: Request, res: Response) {
    try {
      const cookiesLoginToken = req.cookies.loginToken
      if(!cookiesLoginToken) throw "no user is logged in !"
      const decoded = verify(cookiesLoginToken,process.env.JWT_SECRET!) as { id: number };
      const userId = decoded.id
      const existingUser = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      res.status(200).send({ 
        status: "ok",
        message: "get user success !",
        data: existingUser,
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
  async updateAvatar(req: Request, res: Response) {
    try {
      const ava = req.file?.filename
      if(!ava) throw "File not found" 
      const linkAva = `${this.backendUrl}/api/public/avatar/${ava}`
      const cookies = req.cookies.loginToken
      if(!cookies) throw "no user is logged in !"
      const decoded = verify(cookies,process.env.JWT_SECRET!) as { id: number };
      const userId = decoded.id

      const user = await prisma.user.update({
        where: { id: userId },
        data: { avatar: linkAva },
      })
      return res.status(200).send({
        status: "success",
        message: "Edit avatar successfully",
        data: user
      });
    } catch (error) {
      if(error instanceof Error) {
        return res.status(400).send({
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
  async deleteAvatar(req: Request, res: Response) {
    try {
      const cookies = req.cookies.loginToken
      if(!cookies) throw "no user is logged in !"
      const decoded = verify(cookies,process.env.JWT_SECRET!) as { id: number };
      const userId = decoded.id
      const user = await prisma.user.update({
        where: { id: userId },
        data: { avatar: "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_960_720.png" },
      })
      return res.status(200).send({status: "success",message: "Delete avatar successfully",data: user});
    } catch (error) {
      if(error instanceof Error) return res.status(400).send({status: "error",message: error.message})
      res.status(400).send({status: "error",message: error})
    }
  }
  async updateUsername(req: Request, res: Response) {
    try {
      const { username } = req.body;
      const cookies = req.cookies.loginToken
      console.log(cookies)
      if(!cookies) throw "no user is logged in !"
      const decoded = verify(cookies,process.env.JWT_SECRET!) as { id: number };
      const userId = decoded.id
      const user = await prisma.user.update({
        where: { id: userId },
        data: { username },
      })
      return res.status(200).send({status: "success",message: "Edit username successfully",data: user});
    } catch (error) {
      if(error instanceof Error) return res.status(400).send({status: "error",message: error.message})
      res.status(400).send({status: "error",message: error})
    }
  }
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const existingUser = await prisma.user.delete({
        where: { id: Number(id) },
      });
      if(!existingUser) throw "User not found"
      res.status(200).send({status: "ok",message: "delete user success !",data:existingUser});
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({status: "error",message: error.message});
      }
      res.status(400).send({status: "error",message: error});
    }
  }
  async updateMailUser(req: Request, res: Response){
    const {oldEmail, newEmail, token} = req.body
    try {
      const user = await prisma.user.findFirst({where:{email: oldEmail}})
      const newMailUse = await prisma.user.findFirst({where:{email: newEmail}})
      if(!user) throw "your old email is not exist !"
      if(newMailUse) throw "mail already exist !"
      if(token !== user.userToken) throw "Verification Expired !"
      await prisma.user.update({
        where:{email: oldEmail},
        data:{email: newEmail, userToken: null, userTokenExp: null, verified: false}
      })
      res.status(200).send({status: "ok",message: "update email success !",data:user});
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({status: "error",message: error.message});
      }
      res.status(400).send({status: "error",message: error});
    }
  }
  async updatePasswordUser(req: Request, res: Response){
    const {userId,oldPassword,newPassword} = req.body
    try {
      const user = await prisma.user.findFirst({where:{id:userId}})
      if(!user) throw "user not found !"
      if(user.password !== null) {
        const isValid = await compare(oldPassword, user.password)
        if(!isValid) throw "incorrect password !"
      }
      await prisma.user.update({where:{id:userId},data:{password:newPassword}})
      res.status(200).send({status: "ok",message: "update password success !"});
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({status: "error",message: error.message});
      }
      res.status(400).send({status: "error",message: error});
    }
  }
  async onlyVerifyAccount(req: Request, res: Response) {
    const { token } = req.body;
    try {
      const user = await prisma.user.findFirst({
        where: { userToken: token },
      })
      if(!user) throw "user not found !"
      if(user.userTokenExp && dayjs().isBefore(dayjs(user.verifyTokenExp))) {
        return res.status(400).json({ message: 'Email already sent, please try again 1 hour after the previous email was sent' });
      }
      if(user.verified) throw "user already verified !"
      await prisma.user.update({
        where: { id: user.id },
        data: {verified: true,userToken: null,userTokenExp: null},
      })
      res.status(200).send({status: "ok",message: "verify account success !"});
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({status: "error",message: error.message});
      }
      res.status(400).send({status: "error",message: error});
    }
  }
}
