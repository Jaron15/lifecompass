import React from 'react';
'use client'
import useCheckAuth from '../hooks/useCheckAuth';

const PlaceholderPage = ({ pageName }) => {
  useCheckAuth('/')
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Coming Soon!</h1>
      <p className="text-lg text-gray-600">
        The {pageName} page is currently under construction. Please check back later!
      </p>
    </div>
  );
};

export default PlaceholderPage;
