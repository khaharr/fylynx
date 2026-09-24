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
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Official Fylynx Lynx Logo Emblem */}
      <div
        className={`relative flex ${currentSize.box} items-center justify-center bg-slate-900/90 rounded-xl p-1 shadow-lg shadow-brand-500/20 ring-1 ring-brand-500/30 group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-brand-500/40 shrink-0`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/fylynx-logo.png"
          alt="Fylynx Logo"
          className="h-full w-full object-contain drop-shadow"
        />
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
