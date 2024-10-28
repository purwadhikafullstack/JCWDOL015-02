import mongoose, { Document, Schema } from 'mongoose';

interface Outlet extends Document {
  name: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  adminId: mongoose.Types.ObjectId;
}

const outletSchema = new Schema({
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  adminId: { type: mongoose.Types.ObjectId, required: true },
});

export default mongoose.model<Outlet>('Outlet', outletSchema);
