import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Search, ShoppingCart } from 'lucide-react';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-gradient-primary text-white shadow-walmart-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <div className="bg-walmart-yellow text-walmart-blue px-3 py-1 rounded-lg font-bold text-xl">
              W
            </div>
            <span className="text-xl font-bold hidden sm:block">Walmart</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 rounded-full border-0 text-foreground focus:ring-2 focus:ring-walmart-yellow"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-walmart-yellow hover:bg-walmart-yellow/90 text-walmart-blue"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/products" 
              className="text-white hover:text-walmart-yellow transition-colors hidden sm:block"
            >
              Products
            </Link>
            <Link 
              to="/categories" 
              className="text-white hover:text-walmart-yellow transition-colors hidden sm:block"
            >
              Categories
            </Link>
            
            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative flex items-center space-x-1 text-white hover:text-walmart-yellow transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="hidden sm:block">Cart</span>
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-walmart-yellow text-walmart-blue text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                  {totalItems > 99 ? '99+' : totalItems}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}