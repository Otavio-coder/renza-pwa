
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'light' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', fullWidth = false, children, className, ...props }) => {
  let baseStyle = "font-semibold rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-60";
  
  if (fullWidth) {
    baseStyle += " w-full";
  }

  // Size styles
  if (size === 'sm') {
    baseStyle += " py-2 px-4 text-sm";
  } else if (size === 'md') {
    baseStyle += " py-3 px-8 text-lg";
  } else if (size === 'lg') {
    baseStyle += " py-4 px-10 text-xl";
  }

  // Variant styles
  if (variant === 'primary') {
    // Updated to Terracota-like color
    baseStyle += " bg-orange-700 hover:bg-orange-800 text-white focus:ring-orange-600";
  } else if (variant === 'secondary') {
    // Kept as is (yellow), can be harmonized later if needed
    baseStyle += " bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500";
  } else if (variant === 'light') {
    // Updated to Beige-like color
    baseStyle += " bg-orange-100 hover:bg-orange-200 text-orange-900 focus:ring-orange-300";
  } else if (variant === 'danger') {
    baseStyle += " bg-red-600 hover:bg-red-700 text-white focus:ring-red-500";
  } else if (variant === 'ghost') {
    baseStyle += " bg-transparent hover:bg-stone-700 text-stone-300 hover:text-white focus:ring-stone-500 border border-stone-600";
  }


  return (
    <button className={`${baseStyle} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
