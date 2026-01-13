import { db } from '../libs/db.js';
import { products } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types/product.type.js';

// Helper function to convert Drizzle result to our Product type
function convertToProduct(drizzleProduct: any): Product {
  return {
    id: drizzleProduct.id,
    name: drizzleProduct.name,
    description: drizzleProduct.description || undefined,
    price: parseFloat(drizzleProduct.price),
    created_at: drizzleProduct.createdAt?.toISOString(),
    updated_at: drizzleProduct.updatedAt?.toISOString(),
  };
}

export class ProductRepository {
  async getAllProducts(): Promise<Product[]> {
    const result = await db.select().from(products).orderBy(products.createdAt);
    return result.map(convertToProduct);
  }

  async getProductById(id: string): Promise<Product | null> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0] ? convertToProduct(result[0]) : null;
  }

  async createProduct(product: CreateProductRequest): Promise<Product> {
    const result = await db.insert(products).values({
      ...product,
      price: product.price.toString(),
    }).returning();
    return convertToProduct(result[0]);
  }

  async updateProduct(id: string, updates: UpdateProductRequest): Promise<Product | null> {
    const updateData: any = { updatedAt: new Date() };

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.price !== undefined) updateData.price = updates.price.toString();

    const result = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    return result[0] ? convertToProduct(result[0]) : null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return true; // Drizzle doesn't return affected rows, assume success
  }
}