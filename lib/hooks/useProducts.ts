import useSWR from 'swr';
import type { Product } from '@models/Product';

interface ProductsResponse {
  products: Product[];
  nextCursor: string | null;
  hasMore: boolean;
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  // API returns { products, nextCursor, hasMore }
  return data.products || [];
};

export function useProducts() {
  const { data, error, isLoading } = useSWR<Product[]>('/api/products?limit=50', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // Cache for 1 minute
  });

  return {
    products: data || [],
    isLoading,
    isError: error,
  };
}
