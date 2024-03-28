import clientPromise from 'lib/mongoDB';
import { Product } from 'models/product';
import { isAdminRequest } from './auth/[...nextauth]';
import { mongooseConnect } from 'models/mongoose';
export default async function handler(req, res) {
  const { method, url } = req;

  await mongooseConnect();

  if (method === 'POST') {
    await isAdminRequest(req, res);
    const { title, description, price, images, category, properties } =
      req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
    });
    res.json(productDoc);
  }
  //
  if (method === 'GET') {
    if (req.query?._id) {
      res.json(await Product.findById(req.query._id));
    } else {
      const products = await Product.find({});
      res.json(products);
    }
  }
  if (method === 'PUT') {
    await isAdminRequest(req, res);
    const { title, description, price, _id, images, category, properties } =
      req.body;
    await Product.updateOne(
      { _id },
      { title, description, price, images, category, properties }
    );
    res.json('updated');
  }

  if (method === 'DELETE') {
    await isAdminRequest(req, res);
    const { _id } = req.query;
    if (_id) {
      await Product.deleteOne({ _id });
      res.json('deleted');
    }
  }
}
