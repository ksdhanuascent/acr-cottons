'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, Truck, Banknote, X } from 'lucide-react';

export function ShopHeader() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-[#E9E1D3]/45 border-b border-[#DFD7C7] py-5 sm:py-8 lg:py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-10 items-center">
            
            {/* Left Column: Editorial Headline & Single-Line Assurances */}
            <div className="lg:col-span-6 space-y-2.5 sm:space-y-4 text-center lg:text-left">
              
              {/* Handcrafted Atelier Eyebrow (Identical to Hero Section) */}
              <div className="flex items-center justify-center lg:justify-start gap-2.5 select-none">
                <span className="w-5 h-px bg-[#B89A52]/50"></span>
                <span className="text-[9.5px] sm:text-[11px] uppercase tracking-[0.28em] sm:tracking-[0.32em] font-medium text-[#332C26]/60">
                  Complete Erode Weaving Catalog
                </span>
              </div>

              {/* Display Headline */}
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-[2.6rem] text-[#332C26] font-normal leading-[1.14] tracking-tight">
                The Bedding Collection
              </h1>

              {/* Editorial Description */}
              <p className="text-[11px] sm:text-sm text-[#6E6459] max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
                Browse our 10 signature bedspread sets (each featuring a premium bedspread with 2 matching pillow covers), curated subscription gift boxes, and hand-embroidered accent cushions.
              </p>

              {/* Value Assurances Aligned in ONE Continuous Line */}
              <div className="pt-0.5 sm:pt-1 flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-[9.5px] sm:text-[11.5px] text-[#332C26] font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B89A52] flex-shrink-0" />
                  <span>100% Combed Pure Cotton</span>
                </span>
                <span className="text-[#B89A52]/40 select-none">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#B89A52] flex-shrink-0" />
                  <span>Complimentary Shipping on 2+ Items</span>
                </span>
                <span className="text-[#B89A52]/40 select-none">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Banknote className="w-3.5 h-3.5 text-[#B89A52] flex-shrink-0" />
                  <span>Cash on Delivery Available</span>
                </span>
              </div>

              {/* Micro Provenance Details */}
              <div className="pt-1 sm:pt-2 flex items-center justify-center lg:justify-start gap-4 sm:gap-5 text-xs text-[#6E6459]">
                <span className="text-[9.5px] sm:text-[10.5px] uppercase tracking-wider text-[#6E6459]">
                  10 Heritage Editions
                </span>
                <span className="text-[#DFD7C7]">/</span>
                <span className="text-[9.5px] sm:text-[10.5px] uppercase tracking-wider text-[#6E6459]">
                  400 TC Jacquard Damask
                </span>
                <span className="text-[#DFD7C7]">/</span>
                <span className="text-[9.5px] sm:text-[10.5px] uppercase tracking-wider text-[#6E6459]">
                  Erode Handloom
                </span>
              </div>

            </div>

            {/* Right Column: Pristine Framed Campaign Poster (Clean, Zero Buttons/Overlays, Compact on Mobile) */}
            <div className="lg:col-span-6 flex justify-center">
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="relative w-full max-w-[280px] sm:max-w-md lg:max-w-[450px] aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden border border-[#B89A52]/35 shadow-md hover:shadow-xl bg-[#E9E1D3] cursor-pointer select-none transition-all duration-300"
              >
                <Image
                  src="/assets/campaign/poster.webp"
                  alt="ACR Cottons — Woven for Everyday Luxury 2026 Collection Campaign"
                  fill
                  priority
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 440px, 500px"
                  className="object-cover object-center hover:scale-[1.015] transition-transform duration-700 ease-out"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Fullscreen Campaign Poster Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#332C26]/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-[#B89A52]/50 bg-[#2B2520]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/assets/campaign/poster.webp"
              alt="ACR Cottons Campaign Poster Fullscreen"
              fill
              unoptimized
              sizes="100vw"
              className="object-contain"
            />
            <button
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close Lightbox"
              className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 rounded-full bg-[#332C26]/80 text-[#F8F5EE] hover:bg-[#B89A52] transition shadow-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
