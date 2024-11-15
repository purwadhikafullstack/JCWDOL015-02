import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import prisma from '@/prisma'; // Pastikan Prisma client sudah diinisialisasi di sini
import { sign } from 'jsonwebtoken';

export class GoogleController {
  private oAuth2Client: OAuth2Client;

  constructor() {
    this.oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
  }

  async googleLogin(req: Request, res: Response) {
    const url = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
    });
    res.redirect(url);
  }

  async googleCallback(req: Request, res: Response) {
    // const code = req.query.code as string;
    try {
      const code = req.query.code as string;

      if (!code) {
        return res.status(400).send('Tidak ada kode autentikasi yang diterima');
      }

      const { tokens } = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(tokens);

      const ticket = await this.oAuth2Client.verifyIdToken({
        idToken: tokens.id_token || '',
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) return res.status(400).send('Token Google tidak valid');

      const { sub, email, name, picture } = payload;

      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            username: name || 'Pengguna Tanpa Nama',
            email: email || '',
            avatar: picture || '',
            verified: true,
          },
        });
      }

      const payloadJwt = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      const loginToken = sign(payloadJwt, process.env.JWT_SECRET!, {
        expiresIn: '30d',
      });
      res.cookie('loginToken', loginToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.redirect('http://localhost:3000/');
    } catch (error) {
      console.error('Error during Google authentication:', error);
      res.status(500).send('Gagal melakukan autentikasi Google');
    }
  }
}
