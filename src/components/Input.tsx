import * as React from "react";
import type { LucideIcon } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor={props.id}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
        )}
        <input
          {...props}
          className={`w-full rounded-lg border border-slate-200 dark:border-primary/50 bg-white dark:bg-primary/20 py-3 ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${className}`}
        />
      </div>
    </div>
  );
};
