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
      <nav className="fixed top-0 w-full glass-effect shadow-lg z-50 animate-fade-in-down border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1ABC9C] to-cyan-500 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-[#2C3E50] to-[#1ABC9C] p-2 rounded-xl">
                  <EyeIcon className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">Eye Clinic</span>
                <div className="text-xs text-gray-600 font-medium">Vision Care Excellence</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setShowLoginModal(true)} className="hover:scale-105 transition-transform">Sign In</Button>
              <Button onClick={() => setShowRegisterModal(true)} className="shadow-lg hover:shadow-xl hover:scale-105 transition-all">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm">24/7 Online Booking Available</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
                <span className="inline-block animate-slide-in-left">Your Vision,</span> <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-[length:200%_auto] animate-gradient inline-block animate-slide-in-right">Our Mission</span>
              </h1>
              <p className="text-xl mb-8 text-[#ECF0F1]/90 animate-fade-in-up animate-delay-100 leading-relaxed">
                Experience comprehensive eye care with modern technology and compassionate service. 
                Book appointments, shop for eyewear, and manage your eye health all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-200">
                <Button size="lg" variant="accent" onClick={() => setShowRegisterModal(true)} className="shadow-xl shadow-cyan-500/50 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/70 transition-all duration-300 group">
                  <CalendarIcon className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Book Appointment
                </Button>
                <Button size="lg" className="bg-white text-[#2C3E50] hover:bg-[#ECF0F1] hover:shadow-2xl hover:scale-105 transition-all duration-300 group" onClick={() => setShowRegisterModal(true)}>
                  <ShoppingBagIcon className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Browse Eyewear
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 animate-fade-in-up animate-delay-300">
                <div className="text-center group cursor-pointer transform hover:-translate-y-2 transition-all duration-300">
                  <div className="text-4xl font-bold text-cyan-300 mb-1 group-hover:scale-125 transition-all duration-300">1000+</div>
                  <div className="text-sm text-[#ECF0F1]/80 group-hover:text-white transition-colors">Happy Patients</div>
                </div>
                <div className="text-center group cursor-pointer transform hover:-translate-y-2 transition-all duration-300" style={{animationDelay: '0.2s'}}>
                  <div className="text-4xl font-bold text-cyan-300 mb-1 group-hover:scale-125 transition-all duration-300">500+</div>
                  <div className="text-sm text-[#ECF0F1]/80 group-hover:text-white transition-colors">Eyewear Products</div>
                </div>
                <div className="text-center group cursor-pointer transform hover:-translate-y-2 transition-all duration-300" style={{animationDelay: '0.4s'}}>
                  <div className="text-4xl font-bold text-cyan-300 mb-1 group-hover:scale-125 transition-all duration-300">15+</div>
                  <div className="text-sm text-[#ECF0F1]/80 group-hover:text-white transition-colors">Expert Doctors</div>
                </div>
              </div>
            </div>
            
            {/* Glasses Image */}
            <div className="hidden lg:flex justify-center items-center animate-fade-in-up animate-delay-200">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
                
                {/* Image Container */}
                <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl group-hover:scale-105 group-hover:shadow-cyan-500/50 transition-all duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=800&auto=format&fit=crop" 
                    alt="Stylish Eyeglasses" 
                    className="w-full h-auto max-w-md object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-br from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold">Premium Quality</span>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl"></div>
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-blue-400/20 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block bg-gradient-to-r from-[#1ABC9C]/10 to-cyan-500/10 px-4 py-2 rounded-full mb-4">
              <span className="text-sm font-semibold text-[#1ABC9C]">OUR FEATURES</span>
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Modern eye care solutions for the digital age with cutting-edge technology</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg hover-lift group animate-fade-in-up border border-gray-100 hover:border-[#1ABC9C]/20 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1ABC9C]/20 to-transparent rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-[#E8F8F5] to-[#D5F5EE] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                    <feature.icon className="h-8 w-8 text-[#1ABC9C]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#1ABC9C] transition-colors">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1ABC9C] to-[#16A085] rounded-full mb-3">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2C3E50]">Eye Clinic</h2>
          </div>
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

          <Button type="submit" loading={loginLoading} className="w-full">
            Sign In
          </Button>

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
      >
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1ABC9C] to-[#16A085] rounded-full mb-3">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#2C3E50]">Eye Clinic</h2>
          </div>
          
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

          <Button type="submit" loading={registerLoading} className="w-full mt-6">
            Create Account
          </Button>

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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-[#1ABC9C]/10 to-cyan-500/10 px-4 py-2 rounded-full mb-4">
              <span className="text-sm font-semibold text-[#1ABC9C]">WHAT WE OFFER</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Comprehensive eye care solutions for all your needs with cutting-edge technology</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Eye Care Services</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We provide comprehensive eye care services to keep your vision healthy and clear with state-of-the-art equipment and experienced professionals.
              </p>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-gray-100">
                    <div className="bg-gradient-to-br from-[#1ABC9C]/10 to-cyan-500/10 p-2 rounded-lg">
                      <CheckCircleIcon className="h-6 w-6 text-[#1ABC9C] flex-shrink-0" />
                    </div>
                    <span className="text-lg text-gray-700 font-medium">{service}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" onClick={() => setShowRegisterModal(true)} className="mt-8 shadow-lg hover:shadow-xl">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Schedule Your Visit
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#1ABC9C] rounded-3xl p-8 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl"></div>
                <h3 className="text-3xl font-bold mb-8 relative">What Our Patients Say</h3>
                <div className="space-y-6 relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[#ECF0F1] mb-4 leading-relaxed italic">
                      "Amazing service! The online booking made it so easy to schedule my appointment. 
                      The doctors are professional and caring."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">SJ</div>
                      <div>
                        <p className="font-semibold">Sarah Johnson</p>
                        <p className="text-sm text-[#ECF0F1]/70">Verified Patient</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-[#ECF0F1] mb-4 leading-relaxed italic">
                      "Love the eyewear collection! Found the perfect glasses and the whole process 
                      was seamless from consultation to purchase."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">MC</div>
                      <div>
                        <p className="font-semibold">Michael Chen</p>
                        <p className="text-sm text-[#ECF0F1]/70">Verified Patient</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Certified</h3>
              <p className="text-sm text-gray-600">Licensed Professionals</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">1000+</h3>
              <p className="text-sm text-gray-600">Happy Patients</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">24/7</h3>
              <p className="text-sm text-gray-600">Online Support</p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Fast</h3>
              <p className="text-sm text-gray-600">Quick Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#1ABC9C] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm">Limited Time: Free First Consultation</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Ready to See Clearly?</h2>
          <p className="text-xl mb-10 text-[#ECF0F1]/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied patients who trust us with their eye care needs. Get started today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#2C3E50] hover:bg-[#ECF0F1] shadow-xl hover:shadow-2xl hover:scale-105 transition-all" onClick={() => setShowRegisterModal(true)}>
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Create Account
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#2C3E50] transition-all" onClick={() => setShowLoginModal(true)}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-[#2C3E50] to-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#1ABC9C]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-[#1ABC9C] to-cyan-600 p-2 rounded-xl">
                  <EyeIcon className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold">Eye Clinic</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Your trusted partner for comprehensive eye care and quality eyewear.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#1ABC9C] rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#1ABC9C] rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-[#1ABC9C] rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Services</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-[#1ABC9C] transition-colors cursor-pointer flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#1ABC9C] rounded-full"></span>
                  Eye Exams
                </li>
                <li className="hover:text-[#1ABC9C] transition-colors cursor-pointer flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#1ABC9C] rounded-full"></span>
                  Contact Lenses
                </li>
                <li className="hover:text-[#1ABC9C] transition-colors cursor-pointer flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#1ABC9C] rounded-full"></span>
                  Eyeglasses
                </li>
                <li className="hover:text-[#1ABC9C] transition-colors cursor-pointer flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#1ABC9C] rounded-full"></span>
                  Sunglasses
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li><button onClick={() => setShowRegisterModal(true)} className="hover:text-[#1ABC9C] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#1ABC9C] rounded-full"></span>
                  Book Appointment
                </button></li>
                <li><button onClick={() => setShowRegisterModal(true)} className="hover:text-[#1ABC9C] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#1ABC9C] rounded-full"></span>
                  Shop Eyewear
                </button></li>
                <li><button onClick={() => setShowLoginModal(true)} className="hover:text-[#1ABC9C] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#1ABC9C] rounded-full"></span>
                  Sign In
                </button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-white">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#1ABC9C] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>info@eyeclinic.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#1ABC9C] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>(123) 456-7890</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#1ABC9C] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>123 Vision Street, City</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">&copy; 2025 Eye Clinic Management System. All rights reserved.</p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-[#1ABC9C] transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-[#1ABC9C] transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-[#1ABC9C] transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
