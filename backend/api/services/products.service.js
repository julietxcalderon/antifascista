import { ProductModel } from '../models/product.model.js';

export const getAllProducts = async () => {
  return await ProductModel.getAll();
};

export const getProductById = async (id) => {
  return await ProductModel.getById(id);
};

export const createProduct = async (producto) => {
  return await ProductModel.create(producto);
};

export const deleteProduct = async (id) => {
  return await ProductModel.delete(id);
};

export const updateProduct = async (id, data) => {
  return await ProductModel.update(id, data);
};
