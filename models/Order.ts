export interface OrderFormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  notes?: string;
}

export interface Order extends OrderFormData {
  id: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  totalPrice: number;
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'delivered';
}
