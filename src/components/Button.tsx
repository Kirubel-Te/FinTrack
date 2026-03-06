import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", children, className = "", ...props }) => {
  const baseStyles = "w-full flex items-center justify-center rounded-lg py-3.5 text-sm font-bold transition-all active:scale-[0.98]";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90",
    outline: "border border-slate-200 dark:border-primary/50 bg-white dark:bg-primary/20 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-primary/30",
  };

  return (
    <button 
      {...props}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
