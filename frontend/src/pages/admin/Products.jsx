import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { ShoppingBagIcon, PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { adminAPI } from '../../api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    brand: '',
    image_url: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      const response = await adminAPI.getProducts(params);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category,
        price: product.price,
        stock: product.stock,
        brand: product.brand || '',
        image_url: product.image_url || ''
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        brand: '',
        image_url: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        await adminAPI.updateProduct(selectedProduct.id, formData);
        toast.success('Product updated successfully');
      } else {
        await adminAPI.createProduct(formData);
        toast.success('Product created successfully');
      }
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async () => {
    try {
      await adminAPI.deleteProduct(selectedProduct.id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Sunglasses': return 'bg-amber-100 text-amber-800';
      case 'Eyeglasses': return 'bg-[#E8F8F5] text-[#1ABC9C]';
      case 'Contact Lenses': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 animate-fade-in-down">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your eyewear inventory</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Product
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6 animate-fade-in-up">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] transition-all duration-300"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Eyeglasses">Eyeglasses</option>
            <option value="Sunglasses">Sunglasses</option>
            <option value="Contact Lenses">Contact Lenses</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </Card>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1ABC9C]"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="text-center py-12">
          <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-500 mb-4">Start by adding your first product</p>
          <Button onClick={() => handleOpenModal()}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Product
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up animate-delay-200">
          {filteredProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className="hover-lift animate-scale-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center mb-4">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-3 transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <ShoppingBagIcon className="h-16 w-16 text-gray-300" />
                  </div>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                  {product.category}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
              {product.brand && (
                <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              )}
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-2xl font-bold text-[#2C3E50]">₱{Number(product.price).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(product)}
                  className="flex-1 px-3 py-2 bg-[#E8F8F5] text-[#1ABC9C] rounded-lg hover:bg-[#D5F5EE] transition-all duration-300 flex items-center justify-center gap-1"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </button>
                <button 
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowDeleteConfirm(true);
                  }}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-300"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
              >
                <option value="">Select Category</option>
                <option value="Eyeglasses">Eyeglasses</option>
                <option value="Sunglasses">Sunglasses</option>
                <option value="Contact Lenses">Contact Lenses</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <Input
              label="Price"
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <Input
            label="Stock Quantity"
            type="number"
            required
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />

          <Input
            label="Image URL"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ABC9C]"
              rows="4"
              placeholder="Enter product description..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {selectedProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
