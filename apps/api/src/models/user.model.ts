import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  role: 'admin' | 'outlet' | 'worker' | 'driver';
  email: string;
}

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'outlet', 'worker', 'driver'],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
  },
  { timestamps: true },
);

const User = model<IUser>('User', UserSchema);

export default User;
