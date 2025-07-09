
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, icon, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-stone-300 mb-1">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          id={id}
          className={`bg-stone-700 border border-stone-600 text-white placeholder-stone-400 text-md rounded-xl focus:ring-orange-500 focus:border-orange-500 block w-full p-4 ${icon ? 'pl-10' : ''} ${className || ''}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default InputField;
