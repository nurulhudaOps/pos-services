import { Context } from 'hono';
import { ProductDomain } from '../domains/product.domain.js';
import { createProductSchema, updateProductSchema, productIdSchema } from '../validators/product.validator.js';
import { successResponse, errorResponse } from '../utils/wrapper.js';

const domain = new ProductDomain();

export const getAllProductsHandler = async (c: Context) => {
  try {
    const products = await domain.getAllProducts();
    return c.json(successResponse(products, 'Products retrieved successfully'));
  } catch (error) {
    console.log(error)
    return c.json(errorResponse('Failed to fetch products', 500), 500);
  }
};

export const getProductByIdHandler = async (c: Context) => {
  try {
    const { id } = productIdSchema.parse({ id: c.req.param('id') });
    const product = await domain.getProductById(id);
    if (!product) {
      return c.json(errorResponse('Product not found', 404), 404);
    }
    return c.json(successResponse(product, 'Product retrieved successfully'));
  } catch (error) {
    return c.json(errorResponse('Invalid ID or server error', 400), 400);
  }
};

export const createProductHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedData = createProductSchema.parse(body);
    const product = await domain.createProduct(validatedData);
    return c.json(successResponse(product, 'Product created successfully'), 201);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json(errorResponse('Validation error', 400, error.errors), 400);
    }
    return c.json(errorResponse(error.message, 400), 400);
  }
};

export const updateProductHandler = async (c: Context) => {
  try {
    const { id } = productIdSchema.parse({ id: c.req.param('id') });
    const body = await c.req.json();
    const validatedData = updateProductSchema.parse(body);
    const product = await domain.updateProduct(id, validatedData);
    if (!product) {
      return c.json(errorResponse('Product not found', 404), 404);
    }
    return c.json(successResponse(product, 'Product updated successfully'));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json(errorResponse('Validation error', 400, error.errors), 400);
    }
    return c.json(errorResponse(error.message, 400), 400);
  }
};

export const deleteProductHandler = async (c: Context) => {
  try {
    const { id } = productIdSchema.parse({ id: c.req.param('id') });
    await domain.deleteProduct(id);
    return c.json(successResponse(null, 'Product deleted successfully'));
  } catch (error) {
    return c.json(errorResponse('Invalid ID or server error', 400), 400);
  }
};