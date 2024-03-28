import { mongooseConnect } from 'models/mongoose';
import { Order } from '../../models/orders';
export default async function handler(req, res) {
  await mongooseConnect();
  res.json(await Order.find().sort({ createdAt: -1 }));
}
