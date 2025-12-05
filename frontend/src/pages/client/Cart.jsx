import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { 
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  TruckIcon,
  CreditCardIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ClientCart() {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'cod'
  });

  // Mock cart data - replace with API call
  useEffect(() => {
    const mockCart = [
      {
        id: 1,
        product_id: 2,
        name: 'Blue Light Blocking Glasses',
        description: 'Reduce eye strain from digital screens',
        price: 1800,
        quantity: 1,
        image: 'https://placehold.co/100x100/10B981/FFFFFF?text=Blue+Light',
        stock: 25
      },
      {
        id: 2,
        product_id: 3,
        name: 'Monthly Contact Lenses',
        description: 'Comfortable all-day wear, 6 pack',
        price: 1200,
        quantity: 2,
        image: 'https://placehold.co/100x100/8B5CF6/FFFFFF?text=Contacts',
        stock: 50
      },
      {
        id: 3,
        product_id: 1,
        name: 'Classic Aviator Sunglasses',
        description: 'Timeless aviator design with UV protection',
        price: 2500,
        quantity: 1,
        image: 'https://placehold.co/100x100/3B82F6/FFFFFF?text=Aviator',
        stock: 15
      },
    ];
    setCartItems(mockCart);
  }, []);

  const updateQuantity = (itemId, change) => {
    setCartItems(items => items.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return item;
        if (newQuantity > item.stock) {
          toast.error(`Only ${item.stock} items available`);
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (itemId) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const applyPromoCode = () => {
    // Mock promo code validation
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(0.10);
      toast.success('Promo code applied! 10% discount');
    } else if (promoCode.toUpperCase() === 'WELCOME20') {
      setDiscount(0.20);
      toast.success('Promo code applied! 20% discount');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = subtotal * discount;
    const shipping = subtotal > 0 ? 100 : 0; // Free shipping over certain amount could be added
    return subtotal - discountAmount + shipping;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Validate form
    if (!checkoutForm.fullName || !checkoutForm.phone || !checkoutForm.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // API call to place order would go here
    toast.success('Order placed successfully!');
    setShowCheckoutModal(false);
    setCartItems([]);
    setPromoCode('');
    setDiscount(0);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">Shopping Cart</h1>
        <p className="text-gray-600 mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in-up">
            {cartItems.map((item, index) => (
              <Card 
                key={item.id} 
                className="animate-slide-in-right"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg bg-gradient-to-br from-gray-100 to-gray-200"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MinusIcon className="h-4 w-4 text-gray-600" />
                        </button>
                        <span className="px-3 font-medium text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 rounded hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PlusIcon className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">₱{item.price} each</p>
                        <p className="text-lg font-bold text-[#1ABC9C]">₱{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>

                    {item.quantity >= item.stock && (
                      <p className="text-xs text-red-500 mt-2">Maximum quantity reached</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-4 animate-fade-in-up animate-delay-100">
            {/* Promo Code */}
            <Card title="Promo Code">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button onClick={applyPromoCode} className="bg-gradient-to-r from-green-500 to-emerald-500">
                  Apply
                </Button>
              </div>
              {discount > 0 && (
                <div className="mt-3 p-2 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                  <TagIcon className="h-4 w-4" />
                  {(discount * 100)}% discount applied
                </div>
              )}
            </Card>

            {/* Order Summary */}
            <Card title="Order Summary">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₱{calculateSubtotal().toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({(discount * 100)}%)</span>
                    <span className="font-medium">-₱{(calculateSubtotal() * discount).toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <TruckIcon className="h-4 w-4" />
                    Shipping
                  </span>
                  <span className="font-medium">₱100.00</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#1ABC9C]">₱{calculateTotal().toFixed(2)}</span>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1ABC9C] to-[#16A085] hover:from-[#16A085] hover:to-[#148F77] py-3"
                >
                  <CreditCardIcon className="h-5 w-5" />
                  Proceed to Checkout
                </Button>

                <Link to="/client/shop">
                  <button className="w-full text-[#1ABC9C] hover:text-[#16A085] font-medium py-2 transition-colors">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </Card>

            {/* Benefits */}
            <Card>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <TruckIcon className="h-5 w-5 text-[#1ABC9C]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Fast Delivery</p>
                    <p className="text-sm text-gray-600">3-5 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <ShoppingBagIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Secure Payment</p>
                    <p className="text-sm text-gray-600">100% secure transactions</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="animate-fade-in-up">
          <div className="text-center py-12">
            <ShoppingCartIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-gray-500 mt-2">Add some products to get started!</p>
            <Link to="/client/shop">
              <Button className="mt-6 bg-gradient-to-r from-[#1ABC9C] to-[#16A085]">
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Browse Products
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Order Summary */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({cartItems.length})</span>
                    <span className="font-medium">₱{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₱{(calculateSubtotal() * discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">₱100.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-[#1ABC9C]">₱{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={checkoutForm.fullName}
                    onChange={(e) => setCheckoutForm({...checkoutForm, fullName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                <textarea
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={checkoutForm.city}
                    onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                  <input
                    type="text"
                    value={checkoutForm.zipCode}
                    onChange={(e) => setCheckoutForm({...checkoutForm, zipCode: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={checkoutForm.paymentMethod === 'cod'}
                      onChange={(e) => setCheckoutForm({...checkoutForm, paymentMethod: e.target.value})}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-2">
                      <TruckIcon className="h-5 w-5 text-gray-600" />
                      <span>Cash on Delivery</span>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={checkoutForm.paymentMethod === 'card'}
                      onChange={(e) => setCheckoutForm({...checkoutForm, paymentMethod: e.target.value})}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="h-5 w-5 text-gray-600" />
                      <span>Credit/Debit Card</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-[#1ABC9C] to-[#16A085]"
                >
                  <CreditCardIcon className="h-5 w-5 mr-2" />
                  Place Order
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
