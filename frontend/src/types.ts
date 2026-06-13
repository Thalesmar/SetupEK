export interface Product {
  id: number;
  title: string;
  brand: string;
  price: string;
  discount: string;
  stock: number | string;
  inStock?: boolean;
  image: string;
  images: string[];
  category: string;
  sku: string;
  description: string;
  specs: [string, string][];
}

