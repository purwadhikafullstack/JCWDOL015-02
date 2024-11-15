import mongoose, { Document, Schema } from 'mongoose';

interface LaundryItem extends Document {
  name: string;
  description: string;
  price: number;
}

const laundryItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
});

export default mongoose.model<LaundryItem>('LaundryItem', laundryItemSchema);
