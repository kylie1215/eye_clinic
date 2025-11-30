import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { 
  ShoppingBagIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ShoppingCartIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { clientAPI } from '../../api';

export default function ClientShop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getProducts();
      const data = response.data.products?.data || response.data.products || response.data.data || response.data || [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Products error:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange !== 'all') {
      const ranges = {
        'under-1500': [0, 1500],
        '1500-2500': [1500, 2500],
        'over-2500': [2500, Infinity]
      };
      const [min, max] = ranges[priceRange];
      filtered = filtered.filter(p => p.price >= min && p.price < max);
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, priceRange, products]);

  const handleAddToCart = (product) => {
    // Add to cart functionality - replace with API call
    toast.success(`${product.name} added to cart!`);
  };

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'eyeglasses', name: 'Eyeglasses', count: products.filter(p => p.category === 'eyeglasses').length },
    { id: 'sunglasses', name: 'Sunglasses', count: products.filter(p => p.category === 'sunglasses').length },
    { id: 'contact-lenses', name: 'Contact Lenses', count: products.filter(p => p.category === 'contact-lenses').length },
  ];

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      i < Math.floor(rating) ? 
        <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" /> :
        <StarIcon key={i} className="h-4 w-4 text-gray-300" />
    ));
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">Shop Products</h1>
        <p className="text-gray-600 mt-1">Browse our collection of premium eyewear and eye care products</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4 animate-fade-in-up">
          {/* Categories */}
          <Card title="Categories">
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-[#1ABC9C] to-[#16A085] text-white shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <span className={`text-sm ${selectedCategory === category.id ? 'text-white' : 'text-gray-500'}`}>
                      {category.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Price Range */}
          <Card title="Price Range">
            <div className="space-y-2">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-1500', label: 'Under ₱1,500' },
                { id: '1500-2500', label: '₱1,500 - ₱2,500' },
                { id: 'over-2500', label: 'Over ₱2,500' },
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setPriceRange(range.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                    priceRange === range.id
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="font-medium">{range.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3 animate-fade-in-up animate-delay-100">
          {/* Search Bar */}
          <Card className="mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mt-3 text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredProducts.length}</span> products
            </div>
          </Card>

          {/* Products */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="animate-scale-in hover:shadow-xl transition-all duration-300 group overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=' + product.name.split(' ')[0];
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {product.stock < 10 && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        Only {product.stock} left
                      </span>
                    )}
                    
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <p className="text-xs font-bold text-gray-900">{product.brand}</p>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#1ABC9C] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.description}</p>
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {product.features?.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-[#E8F8F5] text-[#1ABC9C] px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                      <span className="text-xs text-gray-500">({Math.floor(Math.random() * 50) + 10} reviews)</span>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          ₱{product.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600 font-medium">Free shipping</p>
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#1ABC9C] to-[#16A085] hover:from-[#16A085] hover:to-[#148F77] shadow-lg hover:shadow-xl"
                      >
                        <ShoppingCartIcon className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium">No products found</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search term</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
