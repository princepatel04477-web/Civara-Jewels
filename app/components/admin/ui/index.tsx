"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Check, AlertCircle, Loader2 } from "lucide-react";

// --- BUTTON ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium uppercase tracking-[0.18em] transition-all rounded-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeClasses = {
    sm: "px-4 py-1.5 text-[11px]",
    md: "px-6 py-2.5 text-xs",
    lg: "px-8 py-3.5 text-xs tracking-[0.2em]",
  }[size];

  const variantClasses = {
    primary: "bg-[#241F1B] text-[#C9A961] hover:bg-[#181412] border border-transparent",
    secondary: "bg-[#FAF7F0] text-[#241F1B] border border-[#C9A961] hover:bg-[#F4EDE2]",
    danger: "bg-red-900/10 text-red-700 border border-red-300 hover:bg-red-100",
    ghost: "bg-transparent text-[#6E6459] hover:text-[#241F1B] border-transparent",
  }[variant];

  return (
    <button
      className={`${base} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin text-current" />}
      {children}
    </button>
  );
};

// --- INPUT ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-[11px] uppercase tracking-[0.2em] text-[#6E6459] font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3.5 py-2.5 bg-[#FAF7F0] border ${
            error ? "border-red-400 focus:border-red-500" : "border-[#E6DFD3] focus:border-[#C9A961]"
          } text-xs text-[#241F1B] outline-none transition-colors ${className}`}
          {...props}
        />
        {error && <p className="text-[11px] text-red-600">{error}</p>}
        {helper && !error && <p className="text-[10.5px] text-[#6E6459]/80">{helper}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// --- TEXTAREA ---
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helper, className = "", rows = 4, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-[11px] uppercase tracking-[0.2em] text-[#6E6459] font-medium">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`w-full px-3.5 py-2.5 bg-[#FAF7F0] border ${
            error ? "border-red-400 focus:border-red-500" : "border-[#E6DFD3] focus:border-[#C9A961]"
          } text-xs text-[#241F1B] outline-none transition-colors resize-y ${className}`}
          {...props}
        />
        {error && <p className="text-[11px] text-red-600">{error}</p>}
        {helper && !error && <p className="text-[10.5px] text-[#6E6459]/80">{helper}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// --- SELECT ---
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-[11px] uppercase tracking-[0.2em] text-[#6E6459] font-medium">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-3 py-2.5 bg-[#FAF7F0] border ${
            error ? "border-red-400" : "border-[#E6DFD3] focus:border-[#C9A961]"
          } text-xs text-[#241F1B] outline-none cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[11px] text-red-600">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

// --- SWITCH ---
export interface SwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#E6DFD3]/60">
      <div>
        <div className="text-xs font-medium text-[#241F1B] uppercase tracking-wider">{label}</div>
        {description && <div className="text-[11px] text-[#6E6459]">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
          checked ? "bg-[#241F1B]" : "bg-[#E6DFD3]"
        }`}
      >
        <div
          className={`bg-[#FAF7F0] w-4 h-4 rounded-full shadow-md transform transition-transform ${
            checked ? "translate-x-5 bg-[#C9A961]" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

// --- CHIP INPUT ---
export interface ChipInputProps {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export const ChipInput: React.FC<ChipInputProps> = ({
  label,
  values,
  onChange,
  placeholder = "Type & press Enter...",
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = inputValue.trim().replace(/^,|,$/g, "");
      if (trimmed && !values.includes(trimmed)) {
        onChange([...values, trimmed]);
      }
      setInputValue("");
    }
  };

  const removeChip = (indexToRemove: number) => {
    onChange(values.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-[11px] uppercase tracking-[0.2em] text-[#6E6459] font-medium">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2 p-2 bg-[#FAF7F0] border border-[#E6DFD3] min-h-[42px] items-center">
        {values.map((chip, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F4EDE2] border border-[#C9A961]/40 text-[#241F1B] text-[11px] uppercase tracking-wider rounded-none"
          >
            {chip}
            <button
              type="button"
              onClick={() => removeChip(idx)}
              className="text-[#6E6459] hover:text-red-700 font-bold"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? placeholder : ""}
          className="bg-transparent text-xs text-[#241F1B] outline-none flex-1 min-w-[120px]"
        />
      </div>
    </div>
  );
};

// --- MODAL ---
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#241F1B]/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FBF7F0] border border-[#C9A961] max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD3] mb-4">
          <h3 className="font-serif text-2xl font-medium text-[#241F1B]">{title}</h3>
          <button onClick={onClose} className="text-[#6E6459] hover:text-[#241F1B]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// --- TAB BAR ---
export interface TabBarProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex items-center border-b border-[#E6DFD3] gap-8 text-xs uppercase tracking-[0.18em]">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`pb-3 font-medium transition-all ${
              isActive
                ? "text-[#9E7F3C] border-b-2 border-[#9E7F3C]"
                : "text-[#6E6459] hover:text-[#241F1B]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
