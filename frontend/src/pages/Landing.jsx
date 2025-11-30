import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  EyeIcon, 
  CalendarIcon, 
  ShoppingBagIcon, 
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Landing() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
    date_of_birth: '',
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginErrors({});
    setLoginLoading(true);

    try {
      const user = await login(loginData);
      setShowLoginModal(false);
      
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setLoginErrors(error.response.data.errors);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterErrors({});
    setRegisterLoading(true);

    try {
      await register(registerData);
      setShowRegisterModal(false);
      navigate('/client/dashboard');
    } catch (error) {
      if (error.response?.data?.errors) {
        setRegisterErrors(error.response.data.errors);
      }
    } finally {
      setRegisterLoading(false);
    }
  };
  const features = [
    {
      icon: CalendarIcon,
      title: 'Easy Appointment Booking',
      description: 'Schedule your eye checkup with our expert optometrists in just a few clicks.'
    },
    {
      icon: ClipboardDocumentCheckIcon,
      title: 'Digital Prescriptions',
      description: 'Access your eye prescriptions anytime, anywhere with our secure digital records.'
    },
    {
      icon: ShoppingBagIcon,
      title: 'Eyewear Shop',
      description: 'Browse our collection of stylish eyeglasses, sunglasses, and contact lenses.'
    },
    {
      icon: UserGroupIcon,
      title: 'Expert Doctors',
      description: 'Our certified optometrists provide professional eye care with years of experience.'
    }
  ];

  const services = [
    'Comprehensive Eye Exams',
    'Contact Lens Fitting',
    'Prescription Eyeglasses',
    'Designer Sunglasses',
    'Pediatric Eye Care',
    'Vision Therapy'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass-effect shadow-lg z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 group">
              <EyeIcon className="h-8 w-8 text-[#2C3E50] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">Eye Clinic</span>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowLoginModal(true)}>Sign In</Button>
              <Button onClick={() => setShowRegisterModal(true)}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in-up">
              <h1 className="text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
                Your Vision, <span className="text-cyan-300">Our Mission</span>
              </h1>
              <p className="text-xl mb-8 text-[#ECF0F1] animate-fade-in-up animate-delay-100">
                Experience comprehensive eye care with modern technology and compassionate service. 
                Book appointments, shop for eyewear, and manage your eye health all in one place.
              </p>
              <div className="flex gap-4 animate-fade-in-up animate-delay-200">
                <Button size="lg" variant="accent" onClick={() => setShowRegisterModal(true)}>
                  Book Appointment
                </Button>
                <Button size="lg" className="bg-white text-[#2C3E50] hover:bg-[#ECF0F1] hover:shadow-2xl" onClick={() => setShowRegisterModal(true)}>
                  Browse Eyewear
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in-up animate-delay-300">
              <div className="glass-effect rounded-3xl p-8 border border-white/30 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-xl hover-lift animate-scale-in">
                    <CalendarIcon className="h-12 w-12 text-cyan-500 mb-4 transition-transform duration-300 hover:scale-110" />
                    <h3 className="font-semibold text-gray-900 mb-2">Online Booking</h3>
                    <p className="text-sm text-gray-600">24/7 appointment scheduling</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-xl hover-lift animate-scale-in animate-delay-100">
                    <ShoppingBagIcon className="h-12 w-12 text-[#2C3E50] mb-4 transition-transform duration-300 hover:scale-110" />
                    <h3 className="font-semibold text-gray-900 mb-2">Eyewear Store</h3>
                    <p className="text-sm text-gray-600">Premium quality products</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-xl hover-lift animate-scale-in animate-delay-200">
                    <ClipboardDocumentCheckIcon className="h-12 w-12 text-emerald-500 mb-4 transition-transform duration-300 hover:scale-110" />
                    <h3 className="font-semibold text-gray-900 mb-2">Digital Records</h3>
                    <p className="text-sm text-gray-600">Secure prescription storage</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-xl hover-lift animate-scale-in animate-delay-300">
                    <UserGroupIcon className="h-12 w-12 text-purple-500 mb-4 transition-transform duration-300 hover:scale-110" />
                    <h3 className="font-semibold text-gray-900 mb-2">Expert Care</h3>
                    <p className="text-sm text-gray-600">Certified optometrists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600">Modern eye care solutions for the digital age</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg hover-lift group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-to-br from-[#E8F8F5] to-[#D5F5EE] w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <feature.icon className="h-8 w-8 text-[#1ABC9C]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Sign In to Your Account"
        size="sm"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            error={loginErrors.email?.[0]}
            required
          />

          <Input
            label="Password"
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            error={loginErrors.password?.[0]}
            required
          />

          <div className="bg-gradient-to-br from-[#E8F8F5] to-[#D5F5EE] p-4 rounded-lg text-sm text-gray-600 border-2 border-[#1ABC9C]/20 animate-fade-in">
            <p className="font-semibold mb-2 text-[#2C3E50]">Test Credentials:</p>
            <p><strong>Admin:</strong> admin@eyeclinic.com</p>
            <p><strong>Doctor:</strong> doctor@eyeclinic.com</p>
            <p><strong>Client:</strong> client@eyeclinic.com</p>
            <p className="mt-2"><strong>Password:</strong> password</p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowLoginModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={loginLoading} className="flex-1">
              Sign In
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setShowLoginModal(false);
                setShowRegisterModal(true);
              }}
              className="text-[#1ABC9C] font-medium hover:underline"
            >
              Sign up
            </button>
          </p>
        </form>
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        title="Create Your Account"
        size="lg"
      >
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              error={registerErrors.name?.[0]}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              error={registerErrors.email?.[0]}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              value={registerData.phone}
              onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
              error={registerErrors.phone?.[0]}
            />

            <Input
              label="Date of Birth"
              type="date"
              value={registerData.date_of_birth}
              onChange={(e) => setRegisterData({ ...registerData, date_of_birth: e.target.value })}
              error={registerErrors.date_of_birth?.[0]}
            />
          </div>

          <Input
            label="Address"
            type="text"
            value={registerData.address}
            onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
            error={registerErrors.address?.[0]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              error={registerErrors.password?.[0]}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={registerData.password_confirmation}
              onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowRegisterModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={registerLoading} className="flex-1">
              Create Account
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setShowRegisterModal(false);
                setShowLoginModal(true);
              }}
              className="text-[#1ABC9C] font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </form>
      </Modal>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Services</h2>
              <p className="text-lg text-gray-600 mb-8">
                We provide comprehensive eye care services to keep your vision healthy and clear.
              </p>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" onClick={() => setShowRegisterModal(true)} className="mt-8">
                Schedule Your Visit
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#2C3E50] to-[#1ABC9C] rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">What Our Patients Say</h3>
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <p className="text-[#ECF0F1] mb-4">
                      "Amazing service! The online booking made it so easy to schedule my appointment. 
                      The doctors are professional and caring."
                    </p>
                    <p className="font-semibold">- Sarah Johnson</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <p className="text-[#ECF0F1] mb-4">
                      "Love the eyewear collection! Found the perfect glasses and the whole process 
                      was seamless from consultation to purchase."
                    </p>
                    <p className="font-semibold">- Michael Chen</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to See Clearly?</h2>
          <p className="text-xl mb-8 text-[#ECF0F1]">
            Join thousands of satisfied patients who trust us with their eye care needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#2C3E50] hover:bg-[#ECF0F1]" onClick={() => setShowRegisterModal(true)}>
              Create Account
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => setShowLoginModal(true)}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <EyeIcon className="h-8 w-8" />
                <span className="text-xl font-bold">Eye Clinic</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for comprehensive eye care and quality eyewear.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Eye Exams</li>
                <li>Contact Lenses</li>
                <li>Eyeglasses</li>
                <li>Sunglasses</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setShowRegisterModal(true)} className="hover:text-white">Book Appointment</button></li>
                <li><button onClick={() => setShowRegisterModal(true)} className="hover:text-white">Shop Eyewear</button></li>
                <li><button onClick={() => setShowLoginModal(true)} className="hover:text-white">Sign In</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@eyeclinic.com</li>
                <li>📞 (123) 456-7890</li>
                <li>📍 123 Vision Street</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Eye Clinic Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
