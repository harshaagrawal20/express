import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/ProductCard';
import { FaceTracker } from '@/components/FaceTracker';
import { sampleProducts, getRecommendedProducts } from '@/data/products';
import { Product, ProductVariant } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Star, Truck, Shield, RefreshCw, Heart, Camera, CameraOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [emotionRecommendations, setEmotionRecommendations] = useState<Product[]>([]);
  const [showEmotionAlert, setShowEmotionAlert] = useState(false);
  const [isFaceTrackingEnabled, setIsFaceTrackingEnabled] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProduct = sampleProducts.find(p => p.id === id);
      setProduct(foundProduct || null);
      
      if (foundProduct) {
        setRecommendations(getRecommendedProducts(foundProduct));
        
        // Simulate emotion detection triggering cheaper alternatives
        const currentVariant = foundProduct.variants[selectedVariantIndex];
        if (currentVariant.price > 10000) {
          // Simulate negative emotion detected for expensive products
          setTimeout(() => {
            const cheaperAlternatives = getRecommendedProducts(foundProduct, currentVariant.price * 0.7);
            if (cheaperAlternatives.length > 0) {
              setEmotionRecommendations(cheaperAlternatives);
              setShowEmotionAlert(true);
            }
          }, 3000); // Simulate 3 second delay for emotion analysis
        }
      }
    }
  }, [id, selectedVariantIndex]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedVariantIndex, quantity);
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Face Tracking Toggle */}
      <div className="mb-6 flex justify-end">
        <Button
          variant="outline"
          onClick={() => setIsFaceTrackingEnabled(!isFaceTrackingEnabled)}
          className="border-walmart-blue text-walmart-blue hover:bg-walmart-blue hover:text-white"
        >
          {isFaceTrackingEnabled ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" />
              Disable Emotion AI
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Enable Emotion AI
            </>
          )}
        </Button>
      </div>

      {/* Face Tracker */}
      {isFaceTrackingEnabled && (
        <div className="mb-6">
          <FaceTracker
            currentProduct={product}
            onEmotionRecommendation={(products) => {
              setEmotionRecommendations(products);
              setShowEmotionAlert(true);
            }}
          />
        </div>
      )}

      {/* Emotion-based recommendation alert */}
      {showEmotionAlert && emotionRecommendations.length > 0 && (
        <Card className="mb-6 border-walmart-yellow bg-walmart-yellow/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-walmart-yellow rounded-full p-2">
                <Heart className="h-4 w-4 text-walmart-blue" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-walmart-blue mb-1">
                  💡 We noticed you might be interested in more budget-friendly options
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Based on your reaction, here are some great alternatives that might fit your budget better:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {emotionRecommendations.slice(0, 2).map(rec => (
                    <div key={rec.id} className="flex items-center gap-3 bg-white rounded-lg p-3">
                      <img
                        src={rec.image}
                        alt={rec.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&auto=format`;
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{rec.name}</p>
                        <p className="text-walmart-blue font-semibold">
                          {formatPrice(Math.min(...rec.variants.map(v => v.price)))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmotionAlert(false)}
                className="text-muted-foreground"
              >
                ×
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop&auto=format`;
              }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2 bg-walmart-light-blue text-walmart-blue">{product.category}</Badge>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-muted-foreground text-lg">{product.description}</p>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <h3 className="font-semibold">Choose Seller & Variant</h3>
            <div className="space-y-2">
              {product.variants.map((variant, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all ${
                    selectedVariantIndex === index
                      ? 'ring-2 ring-walmart-blue bg-walmart-light-blue/50'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedVariantIndex(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{variant.brand}</span>
                          <Badge variant="outline">{variant.seller}</Badge>
                          {variant.discount && (
                            <Badge className="bg-destructive text-destructive-foreground">
                              {variant.discount}% OFF
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            {variant.rating}
                          </span>
                          {variant.stock && (
                            <span className="text-sm text-muted-foreground">
                              {variant.stock} in stock
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(variant.price)}
                        </div>
                        {variant.discount && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatPrice(Math.round(variant.price / (1 - variant.discount / 100)))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={selectedVariant.stock && quantity >= selectedVariant.stock}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-walmart-blue hover:bg-walmart-dark-blue text-white"
              onClick={handleAddToCart}
              disabled={selectedVariant.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart - {formatPrice(selectedVariant.price * quantity)}
            </Button>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Key Features</h3>
              <ul className="space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-walmart-blue rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              Free shipping on orders over ₹499
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              1 year warranty included
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Similar Products</h2>
            <Button
              variant="outline"
              onClick={() => setRecommendations(getRecommendedProducts(product))}
              className="border-walmart-blue text-walmart-blue hover:bg-walmart-blue hover:text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map(rec => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}