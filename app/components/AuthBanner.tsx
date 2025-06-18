"use client";

import React from 'react';

interface AuthBannerProps {
  title: string;
  subtitle: string;
}

export default function AuthBanner({ title, subtitle }: AuthBannerProps) {
  return (
    <div className="relative w-full h-[300px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-lg md:text-xl max-w-2xl">{subtitle}</p>
      </div>
    </div>
  );
} 