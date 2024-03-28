import { model, Schema } from 'mongoose';
import mongoose from 'mongoose';
const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    properties: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);
console.log(mongoose.models);
export const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
