import { notFound } from 'next/navigation';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import ProductDetailClient from '@/components/ProductDetailClient';

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const products = await getCollection('products');
    const product = await products.findOne({ _id: new ObjectId(id) });

    if (!product) {
      notFound();
    }

    const productData = {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stockStatus: product.stockStatus || product.stock_status || 'in-stock',
      createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
      rating: 4.5,
    };

    return <ProductDetailClient product={productData} />;
  } catch {
    notFound();
  }
}
