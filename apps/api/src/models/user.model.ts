// File: src/models/user.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  role: 'admin' | 'outlet' | 'worker' | 'driver';
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'outlet', 'worker', 'driver'],
    required: true,
  },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
