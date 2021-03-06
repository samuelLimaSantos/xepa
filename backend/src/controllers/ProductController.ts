import { Request, Response } from 'express';
import db from '../database/connections';

class ProductController {
  async create(request: Request, response: Response) {
    const { title, value, amount, image } = request.body;
    const { user_id } = request;

    const productId = await db('products').insert({
      title,
      value,
      amount,
      image,
      user_id,
    });

    const product = await db('products')
      .select('products.*')
      .where('products.id', '=', productId);

    return response.json(product);
  }

  async index(request: Request, response: Response) {
    const products = await db('products')
      .select('products.*')
      .join('users', 'products.user_id', '=', 'users.id')
      .select(['products.*', 'users.name', 'users.email', 'users.category']);

    return response.json(products);
  }

  async sell(request: Request, response: Response) {
    const { id } = request.params;
    const { quantity } = request.body;

    const [{ amount, value }] = await db('products')
      .select('products.*')
      .where('products.id', '=', id);

    if (quantity > amount) {
      return response.json({ error: 'This product does not have stock' });
    }

    const newAmount = amount - quantity;

    await db('products').where('products.id', '=', id).update({
      id,
      value,
      amount: newAmount,
    });

    const product = await db('products')
      .select('products.*')
      .where('products.id', '=', id)
      .join('users', 'products.user_id', '=', 'users.id')
      .select(['products.*', 'users.name', 'users.email', 'users.category']);

    return response.status(201).json(product);
  }

  async filter(request: Request, response: Response) {
    const filters = request.query;

    const title = filters.title as string;
    const price = filters.price as string;

    console.log(title, price);

    const product = await db('products')
      .select('products.*')
      .where('products.title', 'like', `%${title}%`)
      .andWhere('products.value', '<=', Number(price))
      .join('users', 'products.user_id', '=', 'users.id')
      .select(['products.*', 'users.name', 'users.email', 'users.category']);

    console.log(product);

    return response.json(product);
  }
}

export default ProductController;
