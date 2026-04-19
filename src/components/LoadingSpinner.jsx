import React from 'react';

const LoadingSpinner = ({ size = 'md', message = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}></div>
      {message && <p className="mt-2 text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
