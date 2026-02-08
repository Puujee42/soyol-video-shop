import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from '@/components/ProductDetailClient';

/** ISR: 60 секунд тутамд статик кэшийг шинэчилнэ */
export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const productData = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category,
    stockStatus: product.stockStatus,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    rating: 4.5,
  };

  return <ProductDetailClient product={productData} />;
}
