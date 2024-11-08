import mongoose, { Document, Schema, Types, SchemaTypes } from 'mongoose';

export interface OutletDocument extends Document {
  name: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  adminId: Types.ObjectId;
}

const outletSchema = new Schema<OutletDocument>({
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  adminId: { type: SchemaTypes.ObjectId, required: true, ref: 'Admin' },
});

const Outlet = mongoose.model<OutletDocument>('Outlet', outletSchema);

export default Outlet;
