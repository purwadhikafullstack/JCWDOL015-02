import mongoose, { Document, Schema } from 'mongoose';

// Antarmuka IUser yang mencakup properti email
export interface IUser extends Document {
  username: string;
  password: string;
  role: 'admin' | 'outlet' | 'worker' | 'driver';
  email: string; // Menambahkan properti email
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true }, // Menambahkan validasi unique
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'outlet', 'worker', 'driver'],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Menambahkan validasi unique pada email
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'], // Validasi format email
    },
  },
  { timestamps: true },
); // Menambahkan timestamps untuk createdAt dan updatedAt

// Membuat model User berdasarkan schema yang ada
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
