'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const image = formData.get('image') as string;
    const categoryId = formData.get('categoryId') as string;
    const rating = parseFloat(formData.get('rating') as string) || 4.5;
    const featured = formData.get('featured') === 'on';
    const wholesale = formData.get('wholesale') === 'on';

    await prisma.product.create({
      data: {
        name,
        price,
        image,
        categoryId,
        rating,
        featured,
        wholesale,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/categories');

    return { success: true, message: 'Бараа амжилттай нэмэгдлээ!' };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, message: 'Бараа нэмэхэд алдаа гарлаа' };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/categories');

    return { success: true, message: 'Бараа амжилттай устгагдлаа!' };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, message: 'Бараа устгахад алдаа гарлаа' };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const image = formData.get('image') as string;
    const categoryId = formData.get('categoryId') as string;
    const rating = parseFloat(formData.get('rating') as string);
    const featured = formData.get('featured') === 'on';
    const wholesale = formData.get('wholesale') === 'on';

    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        image,
        categoryId,
        rating,
        featured,
        wholesale,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/categories');

    return { success: true, message: 'Бараа амжилттай шинэчлэгдлээ!' };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, message: 'Бараа шинэчлэхэд алдаа гарлаа' };
  }
}
