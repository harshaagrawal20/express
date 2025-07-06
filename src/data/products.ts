import { Product } from '@/types/product';

export const sampleProducts: Product[] = [
  // Electronics
  {
    id: 'electronics-001',
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Electronics',
    subcategory: 'Smartphones',
    image: '/images/galaxy-s24.jpg',
    description: 'Latest flagship smartphone with advanced AI features and S Pen',
    features: ['6.8" AMOLED Display', '200MP Camera', '5000mAh Battery', 'S Pen Included'],
    variants: [
      { price: 124999, brand: 'Samsung', seller: 'Walmart', rating: 4.5, stock: 15 },
      { price: 119999, brand: 'Samsung', seller: 'ElectroMart', rating: 4.3, stock: 8, discount: 4 }
    ],
    tags: ['premium', 'flagship', 'camera']
  },
  {
    id: 'electronics-002',
    name: 'iPhone 15 Pro',
    category: 'Electronics',
    subcategory: 'Smartphones',
    image: '/images/iphone-15-pro.jpg',
    description: 'Professional iPhone with titanium design and ProRAW camera',
    features: ['6.1" Super Retina XDR', 'A17 Pro Chip', '48MP ProRAW', 'Titanium Build'],
    variants: [
      { price: 134900, brand: 'Apple', seller: 'Walmart', rating: 4.7, stock: 12 },
      { price: 129900, brand: 'Apple', seller: 'TechHub', rating: 4.6, stock: 5 }
    ],
    tags: ['premium', 'apple', 'professional']
  },
  {
    id: 'electronics-003',
    name: 'OnePlus Nord 3',
    category: 'Electronics',
    subcategory: 'Smartphones',
    image: '/images/oneplus-nord3.jpg',
    description: 'Mid-range smartphone with flagship features',
    features: ['6.74" AMOLED', '50MP Camera', '5000mAh Battery', '80W Fast Charging'],
    variants: [
      { price: 33999, brand: 'OnePlus', seller: 'Walmart', rating: 4.2, stock: 25 },
      { price: 31999, brand: 'OnePlus', seller: 'MobileMart', rating: 4.1, stock: 18, discount: 6 }
    ],
    tags: ['mid-range', 'fast-charging', 'value']
  },
  {
    id: 'electronics-004',
    name: 'MacBook Air M3',
    category: 'Electronics',
    subcategory: 'Laptops',
    image: '/images/macbook-air-m3.jpg',
    description: 'Ultra-thin laptop with M3 chip for creative professionals',
    features: ['13.6" Liquid Retina', 'M3 Chip', '18hr Battery', '1.24kg Weight'],
    variants: [
      { price: 114900, brand: 'Apple', seller: 'Walmart', rating: 4.8, stock: 8 },
      { price: 109900, brand: 'Apple', seller: 'TechWorld', rating: 4.7, stock: 3, discount: 4 }
    ],
    tags: ['laptop', 'apple', 'creative', 'portable']
  },
  {
    id: 'electronics-005',
    name: 'Dell XPS 13',
    category: 'Electronics',
    subcategory: 'Laptops',
    image: '/images/dell-xps13.jpg',
    description: 'Premium ultrabook with Intel 13th gen processors',
    features: ['13.4" InfinityEdge', 'Intel i7-1360P', '16GB RAM', '512GB SSD'],
    variants: [
      { price: 89999, brand: 'Dell', seller: 'Walmart', rating: 4.4, stock: 12 },
      { price: 84999, brand: 'Dell', seller: 'LaptopZone', rating: 4.3, stock: 7, discount: 6 }
    ],
    tags: ['laptop', 'business', 'premium', 'intel']
  },

  // Apparel
  {
    id: 'apparel-001',
    name: 'Men\'s Slim Fit Shirt',
    category: 'Cloths',
    subcategory: 'Shirts',
    image: '/images/mens-slim-fit-shirt.jpg',
    description: 'Slim fit shirt for men with a modern look',
    features: ['Slim Fit', 'Cotton', 'Full Sleeve', 'Button Down'],
    variants: [
      { price: 1299, brand: 'Arrow', seller: 'Walmart', rating: 4.2, stock: 50 },
      { price: 1199, brand: 'Arrow', seller: 'FashionMart', rating: 4.0, stock: 30, discount: 8 }
    ],
    tags: ['shirt', 'men', 'slim-fit']
  },
  {
    id: 'apparel-002',
    name: 'Nike Air Force 1 Low',
    category: 'Cloths',
    subcategory: 'Shoes',
    image: '/images/nike-af1.jpg',
    description: 'Iconic basketball shoe with classic white leather design',
    features: ['Leather Upper', 'Air Sole Unit', 'Rubber Outsole', 'Classic Design'],
    variants: [
      { price: 7995, brand: 'Nike', seller: 'Walmart', rating: 4.6, stock: 40 },
      { price: 7495, brand: 'Nike', seller: 'SportsWorld', rating: 4.5, stock: 25, discount: 6 }
    ],
    tags: ['sneakers', 'basketball', 'classic', 'nike']
  },
  {
    id: 'apparel-003',
    name: 'Uniqlo Heattech Crew Neck T-Shirt',
    category: 'Cloths',
    subcategory: 'T-Shirts',
    image: '/images/uniqlo-heattech.jpg',
    description: 'Thermal t-shirt with moisture-wicking technology',
    features: ['Heattech Fabric', 'Crew Neck', 'Long Sleeve', 'Thermal Protection'],
    variants: [
      { price: 1499, brand: 'Uniqlo', seller: 'Walmart', rating: 4.1, stock: 80 },
      { price: 1299, brand: 'Uniqlo', seller: 'ClothingMart', rating: 4.0, stock: 60, discount: 13 }
    ],
    tags: ['thermal', 'basic', 'winter']
  },

  // Grocery
  {
    id: 'grocery-001',
    name: 'Organic Quinoa',
    category: 'Grocery',
    subcategory: 'Grains',
    image: '/images/organic-quinoa.jpg',
    description: 'Premium organic quinoa rich in protein and nutrients',
    features: ['Organic Certified', 'High Protein', 'Gluten Free', '1kg Pack'],
    variants: [
      { price: 899, brand: 'Great Value', seller: 'Walmart', rating: 4.4, stock: 100 },
      { price: 799, brand: 'Organic India', seller: 'HealthMart', rating: 4.3, stock: 75, discount: 11 }
    ],
    tags: ['organic', 'healthy', 'protein']
  },
  {
    id: 'grocery-002',
    name: 'Extra Virgin Olive Oil',
    category: 'Grocery',
    subcategory: 'Oils',
    image: '/images/olive-oil.jpg',
    description: 'Cold-pressed extra virgin olive oil from Mediterranean olives',
    features: ['Cold Pressed', 'Extra Virgin', '500ml Bottle', 'Mediterranean Source'],
    variants: [
      { price: 1299, brand: 'Bertolli', seller: 'Walmart', rating: 4.5, stock: 60 },
      { price: 1199, brand: 'Figaro', seller: 'GroceryPlus', rating: 4.3, stock: 45, discount: 8 }
    ],
    tags: ['cooking', 'healthy', 'mediterranean']
  },

  // Beauty
  {
    id: 'beauty-001',
    name: 'The Ordinary Niacinamide 10% + Zinc 1%',
    category: 'Beauty',
    subcategory: 'Skincare',
    image: '/images/the-ordinary-niacinamide.jpg',
    description: 'High-strength vitamin and mineral serum for clearer skin',
    features: ['10% Niacinamide', '1% Zinc', '30ml Bottle', 'Vegan Formula'],
    variants: [
      { price: 1499, brand: 'The Ordinary', seller: 'Walmart', rating: 4.6, stock: 35 },
      { price: 1399, brand: 'The Ordinary', seller: 'BeautyHub', rating: 4.5, stock: 20, discount: 7 }
    ],
    tags: ['skincare', 'serum', 'acne-treatment']
  },
  {
    id: 'beauty-002',
    name: 'Maybelline Fit Me Foundation',
    category: 'Beauty',
    subcategory: 'Makeup',
    image: '/images/maybelline-fitme.jpg',
    description: 'Medium coverage foundation that matches your skin tone',
    features: ['Medium Coverage', '40 Shades', 'Oil-Free', 'Non-Comedogenic'],
    variants: [
      { price: 899, brand: 'Maybelline', seller: 'Walmart', rating: 4.2, stock: 55 },
      { price: 799, brand: 'Maybelline', seller: 'CosmeticCorner', rating: 4.1, stock: 40, discount: 11 }
    ],
    tags: ['makeup', 'foundation', 'coverage']
  },

  // Home
  {
    id: 'home-001',
    name: 'IKEA HEMNES Daybed',
    category: 'Home',
    subcategory: 'Furniture',
    image: '/images/ikea-hemnes-daybed.jpg',
    description: 'Versatile daybed that converts to single or double bed',
    features: ['Solid Pine', 'Converts to Double', 'Storage Drawers', 'White Stain'],
    variants: [
      { price: 24999, brand: 'IKEA', seller: 'Walmart', rating: 4.3, stock: 8 },
      { price: 22999, brand: 'IKEA', seller: 'FurnitureMart', rating: 4.2, stock: 5, discount: 8 }
    ],
    tags: ['furniture', 'bedroom', 'convertible', 'storage']
  },
  {
    id: 'home-002',
    name: 'Philips Air Fryer XXL',
    category: 'Home',
    subcategory: 'Kitchen',
    image: '/images/philips-airfryer.jpg',
    description: 'Large capacity air fryer for healthy cooking with less oil',
    features: ['7.3L Capacity', 'Rapid Air Technology', 'Digital Display', 'Dishwasher Safe'],
    variants: [
      { price: 18999, brand: 'Philips', seller: 'Walmart', rating: 4.7, stock: 15 },
      { price: 17499, brand: 'Philips', seller: 'KitchenWorld', rating: 4.6, stock: 10, discount: 8 }
    ],
    tags: ['kitchen', 'healthy-cooking', 'appliance']
  },

  // Toys
  {
    id: 'toys-001',
    name: 'LEGO Creator 3-in-1 Deep Sea Creatures',
    category: 'Toys',
    subcategory: 'Building Sets',
    image: '/images/lego-deep-sea.jpg',
    description: 'Build a shark, squid, or angler fish with this creative set',
    features: ['3-in-1 Build', '230 Pieces', 'Ages 7+', 'Creative Play'],
    variants: [
      { price: 2999, brand: 'LEGO', seller: 'Walmart', rating: 4.8, stock: 25 },
      { price: 2799, brand: 'LEGO', seller: 'ToyKingdom', rating: 4.7, stock: 18, discount: 7 }
    ],
    tags: ['building', 'creative', 'educational']
  },

  // Additional affordable alternatives for emotion-based recommendations
  {
    id: 'electronics-budget-001',
    name: 'Redmi Note 13',
    category: 'Electronics',
    subcategory: 'Smartphones',
    image: '/images/redmi-note13.jpg',
    description: 'Budget-friendly smartphone with great camera and battery life',
    features: ['6.67" AMOLED', '108MP Camera', '5000mAh Battery', 'Fast Charging'],
    variants: [
      { price: 15999, brand: 'Xiaomi', seller: 'Walmart', rating: 4.1, stock: 40 },
      { price: 14999, brand: 'Xiaomi', seller: 'BudgetPhones', rating: 4.0, stock: 35, discount: 6 }
    ],
    tags: ['budget', 'value', 'camera', 'affordable']
  },
  {
    id: 'apparel-budget-001',
    name: 'Basic Cotton T-Shirt',
    category: 'Cloths',
    subcategory: 'T-Shirts',
    image: '/images/basic-tshirt.jpg',
    description: 'Comfortable cotton t-shirt in multiple colors',
    features: ['100% Cotton', 'Regular Fit', 'Multiple Colors', 'Pre-Shrunk'],
    variants: [
      { price: 299, brand: 'Walmart Basics', seller: 'Walmart', rating: 4.0, stock: 200 },
      { price: 249, brand: 'Value Wear', seller: 'BudgetClothing', rating: 3.9, stock: 150, discount: 17 }
    ],
    tags: ['basic', 'affordable', 'cotton', 'everyday']
  },
  {
    id: 'home-budget-001',
    name: 'Manual Air Fryer Alternative - Crispy Basket',
    category: 'Home',
    subcategory: 'Kitchen',
    image: '/images/crispy-basket.jpg',
    description: 'Achieve air-fried results in your oven with this perforated basket',
    features: ['Oven Compatible', 'Stainless Steel', 'Easy Clean', 'Space Saving'],
    variants: [
      { price: 1299, brand: 'Kitchen Basics', seller: 'Walmart', rating: 3.9, stock: 50 },
      { price: 999, brand: 'CookSmart', seller: 'HomeEssentials', rating: 3.8, stock: 40, discount: 23 }
    ],
    tags: ['budget', 'oven-accessory', 'healthy-cooking', 'alternative']
  }
];

export const categories = [
  'Electronics',
  'Cloths', 
  'Grocery',
  'Beauty',
  'Home',
  'Toys',
  'Pharmacy',
  'Sports',
  'Automotive',
  'Books'
] as const;

export function getProductsByCategory(category: string): Product[] {
  return sampleProducts.filter(product => product.category === category);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return sampleProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function getRecommendedProducts(currentProduct: Product, priceLimit?: number): Product[] {
  const sameCategory = sampleProducts.filter(p => 
    p.category === currentProduct.category && 
    p.id !== currentProduct.id
  );
  
  if (priceLimit) {
    return sameCategory.filter(p => 
      Math.min(...p.variants.map(v => v.price)) <= priceLimit
    ).slice(0, 4);
  }
  
  return sameCategory.slice(0, 4);
}