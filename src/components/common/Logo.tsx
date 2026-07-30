import React from "react";
import logoImg from "../../assets/logo.jpg";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  textSub?: string;
}

export function Logo({
  size = "md",
  className = "",
  showText = false,
  textSub = "GRAND HOTEL & RESTAURANT",
}: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-11 h-11 rounded-xl",
    lg: "w-16 h-16 rounded-2xl",
    xl: "w-24 h-24 rounded-3xl",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
        <img
          src={logoImg}
          alt="Bright Day Logo"
          className={`relative object-cover border border-amber-500/30 shadow-md ${sizeClasses[size]}`}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight text-foreground ${textSizes[size]}`}>
            Bright Day
          </span>
          {textSub && (
            <span className="text-[10px] tracking-wider text-amber-500 font-semibold uppercase -mt-0.5">
              {textSub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default Logo;
