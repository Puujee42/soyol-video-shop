export type StockStatus = 'in-stock' | 'pre-order';

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  category: string;
  featured?: boolean;
  wholesale?: boolean;
  stockStatus?: StockStatus; // 'in-stock' = Бэлэн байгаа, 'pre-order' = Захиалгаар
}
