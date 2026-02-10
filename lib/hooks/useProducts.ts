import useSWR from 'swr';
import type { Product } from '@models/Product';

/** API-аас ирсэн бүтээгдэхүүн (createdAt, updatedAt орно) */
export type ApiProduct = Omit<Product, 'image'> & {
  image?: string | null;
  description?: string | null;
  stockStatus?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

type ProductsResponse = {
  products: ApiProduct[];
  connectionError?: boolean;
};

const fetcher = async (url: string): Promise<ProductsResponse> => {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || 'Failed to fetch products');
  return {
    products: data.products || [],
    connectionError: data.connectionError === true,
  };
};

const PRODUCTS_KEY = '/api/products?limit=50';

export function useProducts() {
  const { data, error, isLoading } = useSWR<ProductsResponse>(PRODUCTS_KEY, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 120000,
    errorRetryCount: 2,
    revalidateIfStale: true,
  });

  return {
    products: data?.products ?? [],
    isLoading,
    isError: error,
    /** Өгөгдлийн сан холбогдохгүй үед (API 200 буцаасан ч бараа хоосон) */
    connectionError: data?.connectionError === true,
  };
}
