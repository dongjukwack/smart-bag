import React from 'react';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg shadow-blue-500/30",
    secondary: "bg-gray-800 hover:bg-gray-900 text-white shadow-md hover:shadow-lg",
    outline: "bg-white/80 backdrop-blur-md border-2 border-gray-200 hover:border-blue-500 text-gray-800 hover:text-blue-600 shadow-sm",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg shadow-red-500/30"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-4 text-base",
    lg: "px-8 py-5 text-lg"
  };

  const classes = [
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <button className={classes} {...props}>
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
};
