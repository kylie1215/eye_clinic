import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserCircleIcon, CameraIcon } from '@heroicons/react/24/outline';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    date_of_birth: user?.date_of_birth || '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        date_of_birth: formData.date_of_birth,
      };

      // Only include password fields if user is changing password
      if (formData.current_password) {
        updateData.current_password = formData.current_password;
        updateData.new_password = formData.new_password;
        updateData.new_password_confirmation = formData.new_password_confirmation;
      }

      const response = await axios.put(`${API_URL}/profile`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.user);
      toast.success('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      }));
    } catch (error) {
      console.error('Update error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 200MB)
    if (file.size > 200 * 1024 * 1024) {
      toast.error('File size must be less than 200MB');
      return;
    }

    setImageLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await axios.post(`${API_URL}/profile/picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.user);
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Image upload error:', error);
      if (error.response?.data?.errors) {
        // Show all validation errors
        Object.values(error.response.data.errors).flat().forEach(err => {
          toast.error(err);
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to upload image');
      }
    } finally {
      setImageLoading(false);
    }
  };

  const getProfileImageUrl = () => {
    if (user?.profile_picture) {
      // If it's a full URL, use it directly
      if (user.profile_picture.startsWith('http')) {
        return user.profile_picture;
      }
      // Otherwise, construct the URL
      return `${API_URL.replace('/api', '')}/storage/${user.profile_picture}`;
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">My Profile</h2>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#1ABC9C] to-[#16A085] flex items-center justify-center">
              {getProfileImageUrl() ? (
                <img
                  src={getProfileImageUrl()}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-24 h-24 text-white" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={imageLoading}
              className="absolute bottom-0 right-0 bg-[#1ABC9C] hover:bg-[#16A085] text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
            >
              {imageLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <CameraIcon className="w-5 h-5" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <p className="mt-4 text-gray-600 text-sm">Click the camera icon to upload a new picture</p>
          <p className="text-gray-500 text-xs">Max size: 200MB</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name?.[0]}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email?.[0]}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone?.[0]}
              />

              <Input
                label="Date of Birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                error={errors.date_of_birth?.[0]}
              />
            </div>

            <div className="mt-4">
              <Input
                label="Address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={errors.address?.[0]}
              />
            </div>
          </div>

          {/* Change Password Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Change Password</h3>
            <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>
            <div className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={formData.current_password}
                onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                error={errors.current_password?.[0]}
                autoComplete="current-password"
              />

              <Input
                label="New Password"
                type="password"
                value={formData.new_password}
                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                error={errors.new_password?.[0]}
                autoComplete="new-password"
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={formData.new_password_confirmation}
                onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
                error={errors.new_password_confirmation?.[0]}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button type="submit" loading={loading} className="px-8">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
