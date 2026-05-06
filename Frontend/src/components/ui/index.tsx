import React, { type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes } from "react";

// Theme tokens
const colors = {
  primary: "#002e33",
  secondary: "#86d9e1",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  muted: "#6b7280",
  background: "#f9fafb",
  surface: "#ffffff",
};

const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
};

const radius = {
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
};

// ─────────────────────────────────────────────────────────────
// Primary Button - Consistent across all pages
// ─────────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-bold uppercase tracking-wide
    rounded-lg shadow-md active:scale-95 transition-all
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      text-white hover:opacity-90
    `,
    secondary: `
      text-primary border-2 border-primary hover:bg-primary/5
    `,
    outline: `
      border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50
    `,
    ghost: `
      text-gray-600 hover:bg-gray-100 shadow-none
    `,
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-7 py-4 text-lg",
  };

  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
    style={{
  backgroundColor: variant === "primary" ? colors.primary : "transparent",
  color: variant === "primary" ? colors.secondary : colors.primary,
  borderColor: variant === "secondary" ? colors.primary : undefined,
}}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          Loading...
        </span>
      ) : children}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
// Input Field - Consistent across all pages
// ─────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold uppercase tracking-widest mb-2" style={{ color: colors.primary }}>
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-lg border-2 bg-white font-medium
          focus:border-[${colors.primary}] focus:ring-2 focus:ring-[${colors.primary}]/20
          outline-none transition-all placeholder:text-gray-400
          ${error ? "border-red-500" : "border-gray-200"}
          ${className}
        `}
        style={{ color: colors.primary }}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1 font-bold">{error}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Select Field - Consistent across all pages
// ─────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold uppercase tracking-widest mb-2" style={{ color: colors.primary }}>
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-3 rounded-lg border-2 bg-white font-medium
          focus:border-[${colors.primary}] focus:ring-2 focus:ring-[${colors.primary}]/20
          outline-none transition-all
          ${error ? "border-red-500" : "border-gray-200"}
          ${className}
        `}
        style={{ color: colors.primary }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1 font-bold">{error}</p>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Card Component - Consistent across all pages
// ─────────────────────────────────────────────────────────────
interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = "",
  padding = "md",
}) => {
  const paddingSizes = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };

  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100
        ${paddingSizes[padding]} ${className}
      `}
    >
      {title && (
        <h3
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: colors.primary }}
        >
          {title}
        </h3>
      )}
      <div className="text-gray-800">{children}</div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Badge/Pill Component - Consistent across all pages
// ───────────────────────────���─────────────────────────────────
interface BadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "sm",
}) => {
  const variants = {
    success: { bg: "#d1fae5", text: "#065f46" },
    warning: { bg: "#fef3c7", text: "#92400e" },
    error: { bg: "#fee2e2", text: "#991b1b" },
    info: { bg: "#e0f2fe", text: "#075985" },
    default: { bg: colors.primary + "10", text: colors.primary },
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider
        ${sizes[size]}
      `}
      style={{
        backgroundColor: variants[variant].bg,
        color: variants[variant].text,
      }}
    >
      {variant !== "default" && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: variants[variant].text }}
        />
      )}
      {children}
    </span>
  );
};

export { colors, spacing, radius };
export default {
  Button,
  Input,
  Select,
  Card,
  Badge,
  colors,
  spacing,
  radius,
};