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

const fetcher = async (url: string): Promise<ApiProduct[]> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  return data.products || [];
};

const PRODUCTS_KEY = '/api/products?limit=50';

export function useProducts() {
  const { data, error, isLoading } = useSWR<ApiProduct[]>(PRODUCTS_KEY, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 120000, // 2 min – давхар дуудлага багасгана
    errorRetryCount: 2,
    revalidateIfStale: true,
  });

  return {
    products: data || [],
    isLoading,
    isError: error,
  };
}
