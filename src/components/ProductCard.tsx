import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isRecommended?: boolean;
  compact?: boolean;
}

export function ProductCard({ product, isRecommended, compact = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const highestPrice = Math.max(...product.variants.map(v => v.price));
  const bestVariant = product.variants.reduce((best, current) => 
    current.price < best.price ? current : best
  );
  const lowestPriceIndex = product.variants.findIndex(v => v.price === lowestPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, lowestPriceIndex, 1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className={`group hover:shadow-walmart-lg transition-all duration-300 hover:-translate-y-1 border-border/50 ${compact ? 'h-auto' : ''}`}>
      <Link to={`/product/${product.id}`} className="block">
        <div className={`relative overflow-hidden rounded-t-lg ${compact ? 'h-32' : ''}`}>
          <img
            src={product.image}
            alt={product.name}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${compact ? 'h-32' : 'h-48'}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&auto=format`;
            }}
          />
          {isRecommended && (
            <Badge className="absolute top-2 left-2 bg-walmart-yellow text-walmart-blue">
              Recommended
            </Badge>
          )}
          {bestVariant.discount && (
            <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
              {bestVariant.discount}% OFF
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <Link to={`/product/${product.id}`}>
          <h3 className={`font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 ${compact ? 'text-sm' : ''}`}>
            {product.name}
          </h3>
          {!compact && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {product.description}
            </p>
          )}
        </Link>

        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className={`font-bold text-primary ${compact ? 'text-base' : 'text-lg'}`}>
              {formatPrice(lowestPrice)}
            </span>
            {!compact && lowestPrice !== highestPrice && (
              <span className="text-sm text-muted-foreground">
                - {formatPrice(highestPrice)}
              </span>
            )}
          </div>
          
          <div className={`flex items-center justify-between text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
            <span>⭐ {bestVariant.rating}</span>
            {!compact && (
              <span>{product.variants.length} seller{product.variants.length > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </CardContent>

      {!compact && (
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-walmart-blue hover:bg-walmart-dark-blue text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}