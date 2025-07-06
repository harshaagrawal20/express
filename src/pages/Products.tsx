import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { sampleProducts, categories, getProductsByCategory } from '@/data/products';
import { Product } from '@/types/product';
import { Search, Filter, X } from 'lucide-react';
import clothsData from '../../cloths_data.json';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const navigate = useNavigate();

  useEffect(() => {
    let filtered: any[] = [...products];

    // Use clothsData if category is 'Cloths'
    if (selectedCategory === 'Cloths') {
      filtered = clothsData;
    } else if (selectedCategory !== 'all') {
      filtered = getProductsByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        (product.name?.toLowerCase?.().includes(query) ||
         product.title?.toLowerCase?.().includes(query) ||
         product.description?.toLowerCase?.().includes(query) ||
         product.tags?.some?.(tag => tag.toLowerCase().includes(query))
        )
      );
    }

    // Filter by price range
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(product => {
        const minPrice = product.price ?? Math.min(...(product.variants?.map?.(v => v.price) || [0]));
        const min = parseFloat(priceRange.min) || 0;
        const max = parseFloat(priceRange.max) || Infinity;
        return minPrice >= min && minPrice <= max;
      });
    }

    // Sort products
    if (selectedCategory !== 'Cloths') {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return (a.price ?? Math.min(...(a.variants?.map?.(v => v.price) || [0]))) - (b.price ?? Math.min(...(b.variants?.map?.(v => v.price) || [0])));
          case 'price-high':
            return (b.price ?? Math.min(...(b.variants?.map?.(v => v.price) || [0]))) - (a.price ?? Math.min(...(a.variants?.map?.(v => v.price) || [0])));
          case 'rating':
            const aRating = a.rating ?? Math.max(...(a.variants?.map?.(v => v.rating) || [0]));
            const bRating = b.rating ?? Math.max(...(b.variants?.map?.(v => v.rating) || [0]));
            return bRating - aRating;
          case 'name':
          default:
            return (a.name || a.title).localeCompare(b.name || b.title);
        }
      });
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('name');
    setPriceRange({ min: '', max: '' });
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || priceRange.min || priceRange.max;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Filters</h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <Search className="h-4 w-4 absolute left-2.5 top-3 text-muted-foreground" />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range (₹)</label>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              />
              <Input
                placeholder="Max"
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                {selectedCategory === 'all' ? 'All Products' : selectedCategory}
              </h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {searchQuery && (
                <Badge variant="secondary" className="bg-walmart-light-blue text-walmart-blue">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="bg-walmart-light-blue text-walmart-blue">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(priceRange.min || priceRange.max) && (
                <Badge variant="secondary" className="bg-walmart-light-blue text-walmart-blue">
                  Price: ₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}
                  <button
                    onClick={() => setPriceRange({ min: '', max: '' })}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                selectedCategory === 'Cloths' && 'product_id' in product ? (
                  (() => {
                    const cloth = product as typeof clothsData[number];
                    return (
                      <div
                        key={cloth.product_id}
                        className="bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
                        onClick={() => navigate(`/product-detail/cloths/${cloth.product_id}`)}
                      >
                        <img src={cloth.image_url} alt={cloth.title} className="w-32 h-32 object-cover rounded mb-3" />
                        <h4 className="font-semibold text-lg mb-1">{cloth.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{cloth.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-walmart-blue font-bold">${cloth.price}</span>
                          <span className="text-xs text-gray-500">{cloth.size}</span>
                          <span className="text-xs text-gray-500">{cloth.color}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm">{cloth.rating} ({cloth.reviews_count} reviews)</span>
                        </div>
                        <span className={`text-xs font-semibold ${cloth.in_stock ? 'text-green-600' : 'text-red-500'}`}>{cloth.in_stock ? 'In Stock' : 'Out of Stock'}</span>
                      </div>
                    );
                  })()
                ) : (
                  <ProductCard key={product.id} product={product} />
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}