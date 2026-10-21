export interface CatalogProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  thumbnail: string;
}

export interface AddToCartRequest {
  userId: number;
  products: Array<{
    id: number;
    quantity: number;
  }>;
}

export interface ShoppingCart {
  id: number;
  userId: number;
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
  products: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountedPrice: number;
    thumbnail: string;
  }>;
}
