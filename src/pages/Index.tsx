import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { FaceTracker } from '@/components/FaceTracker';
import { sampleProducts, categories } from '@/data/products';
import { useFaceNavigation } from '@/hooks/useFaceNavigation';
import { Camera, CameraOff, ShoppingBag, Truck, Shield, RefreshCw } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState(sampleProducts.slice(0, 8));
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const { handleNavigation } = useFaceNavigation({
    onLeft: () => {
      setCurrentProductIndex(prev => Math.max(0, prev - 1));
    },
    onRight: () => {
      setCurrentProductIndex(prev => Math.min(featuredProducts.length - 1, prev + 1));
    },
    onUp: () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onDown: () => {
      navigate('/products');
    }
  });

  const toggleCamera = async () => {
    if (isCameraEnabled) {
      // Stop camera
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setIsCameraEnabled(false);
    } else {
      // Start camera
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsCameraEnabled(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Camera access denied. Emotion-based recommendations will not be available.');
      }
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Smart Shopping with
            <span className="text-walmart-yellow block">Emotion AI</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience personalized shopping that adapts to your reactions. 
            Find the perfect products at prices that make you smile.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-walmart-yellow text-walmart-blue hover:bg-walmart-yellow/90 font-semibold px-8"
              asChild
            >
              <Link to="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={toggleCamera}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8"
            >
              {isCameraEnabled ? (
                <>
                  <CameraOff className="mr-2 h-5 w-5" />
                  Disable Emotion AI
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-5 w-5" />
                  Enable Emotion AI
                </>
              )}
            </Button>
          </div>

          {/* Face Tracker */}
          {isCameraEnabled && (
            <div className="max-w-2xl mx-auto">
              <FaceTracker
                currentProduct={featuredProducts[currentProductIndex]}
                onNavigate={handleNavigation}
                onEmotionRecommendation={(products) => {
                  // Update featured products with emotion-based recommendations
                  setFeaturedProducts(prev => [...products, ...prev.slice(products.length)]);
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-walmart-md transition-shadow">
              <CardContent className="p-6">
                <div className="bg-walmart-light-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-walmart-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Emotion Recognition</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your facial expressions to recommend products at comfortable price points
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-walmart-md transition-shadow">
              <CardContent className="p-6">
                <div className="bg-walmart-light-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-walmart-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Free 2-day shipping on orders over ₹499. Same-day delivery available in select cities
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-walmart-md transition-shadow">
              <CardContent className="p-6">
                <div className="bg-walmart-light-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-walmart-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Price Protection</h3>
                <p className="text-muted-foreground">
                  Best price guarantee. If you find it cheaper elsewhere, we'll match the price
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((category) => (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group"
              >
                <Card className="hover:shadow-walmart-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="bg-walmart-light-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 group-hover:bg-walmart-blue group-hover:text-white transition-colors">
                      <span className="text-2xl">
                        {category === 'Electronics' ? '📱' :
                         category === 'Apparel' ? '👕' :
                         category === 'Grocery' ? '🛒' :
                         category === 'Beauty' ? '💄' :
                         category === 'Home' ? '🏠' :
                         category === 'Toys' ? '🧸' :
                         category === 'Pharmacy' ? '💊' :
                         category === 'Sports' ? '⚽' :
                         category === 'Automotive' ? '🚗' :
                         '📚'}
                      </span>
                    </div>
                    <h3 className="font-semibold group-hover:text-walmart-blue transition-colors">
                      {category}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button
              variant="outline"
              onClick={() => setFeaturedProducts(sampleProducts.slice(0, 8).sort(() => Math.random() - 0.5))}
              className="border-walmart-blue text-walmart-blue hover:bg-walmart-blue hover:text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-walmart-blue hover:bg-walmart-dark-blue text-white"
              asChild
            >
              <Link to="/products">
                View All Products
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-walmart-dark-blue text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-walmart-yellow text-walmart-blue px-3 py-1 rounded-lg font-bold text-xl">
                  W
                </div>
                <span className="text-xl font-bold">Walmart</span>
              </div>
              <p className="text-white/80">
                Smart shopping with emotion AI. Discover products that match your mood and budget.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/80">
                <li><Link to="/products" className="hover:text-walmart-yellow transition-colors">All Products</Link></li>
                <li><Link to="/products?category=Electronics" className="hover:text-walmart-yellow transition-colors">Electronics</Link></li>
                <li><Link to="/products?category=Apparel" className="hover:text-walmart-yellow transition-colors">Fashion</Link></li>
                <li><Link to="/cart" className="hover:text-walmart-yellow transition-colors">Cart</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-walmart-yellow transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-walmart-yellow transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-walmart-yellow transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-walmart-yellow transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-walmart-yellow transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-walmart-yellow transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-walmart-yellow transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-walmart-yellow transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 Walmart Hackathon Project. Built with React, Tailwind & MongoDB.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}