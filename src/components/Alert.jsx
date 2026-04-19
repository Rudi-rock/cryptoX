import React from 'react';

const Alert = ({ 
  type = 'info', 
  title = '', 
  message, 
  onClose,
  ...props 
}) => {
  const types = {
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    error: 'bg-red-100 border-red-500 text-red-700',
  };

  return (
    <div 
      className={`border-l-4 p-4 rounded ${types[type]}`}
      {...props}
    >
      <div className="flex justify-between items-start">
        <div>
          {title && <p className="font-semibold">{title}</p>}
          <p>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-lg hover:opacity-70"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
