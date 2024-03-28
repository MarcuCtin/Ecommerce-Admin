import { Category } from 'models/category';
import { mongooseConnect } from 'models/mongoose';
import { getServerSession } from 'next-auth';
import { AuthOptions, isAdminRequest } from './auth/[...nextauth]';
export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);
  if (method === 'POST') {
    const { name, parentCategory, properties } = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties,
    });
    res.json(categoryDoc);
  }
  if (method === 'GET') {
    res.json(await Category.find({}).populate('parent'));
  }
  if (method === 'PUT') {
    const { name, parentCategory, _id, properties } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id },
      { name, parent: parentCategory, properties }
    );
    res.json(categoryDoc);
  }
  if (method === 'DELETE') {
    const { _id } = req.query;
    if (_id) {
      await Category.deleteOne({ _id });
      res.json('deleted');
    }
  }
}
