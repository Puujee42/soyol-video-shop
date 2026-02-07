'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stockStatus: string;
};

/**
 * Create a new product in the database
 */
export async function createProduct(data: ProductFormData) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        category: data.category,
        stockStatus: data.stockStatus,
      },
    });

    // Revalidate pages to show new product immediately
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/ready-to-ship');
    revalidatePath('/pre-order');

    return { success: true, product };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

/**
 * Delete a product from the database
 */
export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    // Revalidate pages to remove deleted product immediately
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/ready-to-ship');
    revalidatePath('/pre-order');

    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

/**
 * Get all products for admin dashboard
 */
export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Update a product
 */
export async function updateProduct(productId: string, data: Partial<ProductFormData>) {
  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/ready-to-ship');
    revalidatePath('/pre-order');

    return { success: true, product };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Failed to update product' };
  }
}
