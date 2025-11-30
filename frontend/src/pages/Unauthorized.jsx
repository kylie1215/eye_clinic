import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
        <Link to="/login">
          <Button>Go to Login</Button>
        </Link>
      </div>
    </div>
  );
}
