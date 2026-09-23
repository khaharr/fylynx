'use client';

import React from 'react';
import Link from 'next/link';

interface FylynxLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
  href?: string;
  className?: string;
}

export default function FylynxLogo({
  size = 'md',
  variant = 'auto',
  showText = true,
  href = '/',
  className = '',
}: FylynxLogoProps) {
  const sizeClasses = {
    sm: { box: 'h-8 w-8 rounded-xl', text: 'text-lg', fSize: 'text-base font-black' },
    md: { box: 'h-10 w-10 rounded-xl', text: 'text-xl', fSize: 'text-lg font-black' },
    lg: { box: 'h-12 w-12 rounded-2xl', text: 'text-2xl', fSize: 'text-xl font-black' },
    xl: { box: 'h-14 w-14 rounded-2xl', text: 'text-3xl', fSize: 'text-2xl font-black' },
  };

  const currentSize = sizeClasses[size];

  const logoContent = (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Custom Stylized "F" Emblem */}
      <div
        className={`relative flex ${currentSize.box} items-center justify-center bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 text-white font-black shadow-xl shadow-brand-500/25 ring-2 ring-white/10 group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-brand-500/40`}
      >
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
        <span className={`relative z-10 ${currentSize.fSize} tracking-tighter drop-shadow-md select-none font-mono`}>
          F
        </span>
        {/* Futuristic accent dot */}
        <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`${currentSize.text} font-black tracking-tight ${
              variant === 'dark'
                ? 'text-white'
                : variant === 'light'
                ? 'text-slate-900'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            Fylynx<span className="text-brand-500 font-extrabold">.</span>
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{logoContent}</Link>;
  }

  return logoContent;
}
