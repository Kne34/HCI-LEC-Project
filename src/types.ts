export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  series: string;
  isReady?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  rating: number;
  sold: number;
  category: string;
  location: string;
  condition: 'Baru' | 'Bekas';
  shipping: string[];
  addedAt: string;
  weight: number;
  gallery: string[];
  description: string;
}
