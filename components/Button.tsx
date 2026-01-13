import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'disabled';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 shadow-lg border-2";
  
  const variants = {
    primary: "bg-orange-600 border-orange-400 hover:bg-orange-500 text-white",
    secondary: "bg-gray-700 border-gray-500 hover:bg-gray-600 text-gray-100",
    danger: "bg-red-700 border-red-500 hover:bg-red-600 text-white",
    disabled: "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed hover:transform-none hover:-translate-y-0 opacity-50"
  };

  const widthClass = fullWidth ? "w-full" : "";
  const variantClass = props.disabled ? variants.disabled : variants[variant];

  return (
    <button 
      className={`${baseStyle} ${variantClass} ${widthClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;