import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema(
  {
    lineItems: Object,
    name: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    email: String,
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Order =
  mongoose.models?.Order || mongoose.model('Order', OrderSchema);
