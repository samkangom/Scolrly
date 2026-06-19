"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: "bg-brand hover:bg-brand-hover text-black font-semibold",
  secondary: "bg-card hover:bg-card2 text-text-primary border border-border-dark",
  danger: "bg-accent-orange hover:bg-accent-orange/80 text-white font-semibold",
};

export default function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand/50 disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
