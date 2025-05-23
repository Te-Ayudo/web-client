// components/atoms/Button.jsx
import React from "react";
import { cn } from "@/lib/utils"; // o usa clsx si usas clsx

export default function Button({
  href,
  onClick,
  children,
  className,
  decoration,
  ...props
}) {
  const classes = cn(
    `inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm sm:text-base
     font-semibold text-orange-500 bg-white 
     transition-colors duration-200 hover:bg-orange-50`,
    className
  );

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {decoration}
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} {...props}>
      {decoration}
      {children}
    </button>
  );
}
