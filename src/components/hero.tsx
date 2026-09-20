'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '@/lib/catalog';

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroProducts = PRODUCTS.filter((p) => p.category === 'bedspread-sets').slice(0, 10);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroProducts.length);
    }, 5500); // Serene 5.5s luxury cadence
  }, [heroProducts.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
    resetTimer();
  }, [heroProducts.length, resetTimer]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % heroProducts.length);
    resetTimer();
  }, [heroProducts.length, resetTimer]);

  const handleSelect = useCallback((idx: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex(idx);
    resetTimer();
  }, [resetTimer]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 12; // max tilt degrees
    const y = ((clientY - top) / height - 0.5) * -12;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section className="relative overflow-hidden bg-[#F8F5EE] border-b border-[#DFD7C7] py-10 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Editorial Narrative & Metrics */}
          <div className="lg:col-span-6 space-y-7 sm:space-y-8">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 border border-[#B89A52]/30 rounded-full px-4 py-1.5 text-[11px] tracking-[0.25em] uppercase font-semibold text-[#332C26] bg-[#E9E1D3]/70 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#B89A52] animate-pulse"></span>
              100% Combed Erode Cotton
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[4.2rem] font-normal leading-[1.08] tracking-tight text-[#332C26]">
              Woven for<br />
              <span className="italic font-normal font-serif text-[#B89A52]">everyday luxury.</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#6E6459] max-w-lg leading-relaxed font-light">
              Crafted in Erode, the Textile Valley of South India. Artisanal bedspreads and matching pillow suites engineered with pure combed cotton to bring serene, boutique hotel elegance into your bedroom.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 bg-[#332C26] text-[#F8F5EE] px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-[#B89A52] transition-all duration-300 shadow-md group"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#heritage"
                className="text-xs uppercase tracking-widest font-semibold text-[#332C26] underline underline-offset-8 hover:text-[#B89A52] transition-colors"
              >
                Meet Our Founder
              </a>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-6 sm:pt-8 grid grid-cols-2 gap-8 border-t border-[#DFD7C7] max-w-md">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#6E6459] mb-1 font-medium flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#B89A52]" />
                  Artisanal Heritage
                </span>
                <span className="font-serif text-2xl sm:text-3xl text-[#332C26] font-normal">Erode, TN</span>
                <span className="block text-[11px] text-[#6E6459] mt-0.5">Textile Valley of South India</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#6E6459] mb-1 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B89A52]" />
                  Thread Purity
                </span>
                <span className="font-serif text-2xl sm:text-3xl text-[#332C26] font-normal">400 TC</span>
                <span className="block text-[11px] text-[#6E6459] mt-0.5">Zero Pilling Combed Staple</span>
              </div>
            </div>

          </div>

          {/* Right Composition Image Frame with Synchronized Crossfade & Subtle Controls */}
          <div className="lg:col-span-6 flex flex-col items-center py-6">
            <div
              className="relative w-full flex justify-center items-center"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ perspective: '1000px' }}
            >
              {/* Main Tailored Bedspread Card with Subtle Architectural Inset Border */}
              <div
                className="relative w-full max-w-md sm:max-w-lg h-[500px] sm:h-[580px] rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-2xl rounded-bl-2xl overflow-hidden shadow-2xl bg-[#E9E1D3] border border-[#B89A52]/40 ring-1 ring-[#DFD7C7] transition-transform duration-500 ease-out will-change-transform"
                style={{
                  transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
                }}
              >
                {heroProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      idx === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      priority={idx < 2}
                      sizes="(max-width: 640px) 100vw, 500px"
                      className="object-cover object-center select-none"
                    />
                  </div>
                ))}

                {/* Floating Set Breakdown Tag at bottom-right */}
                <div className="absolute bottom-5 right-5 z-20 bg-[#332C26]/90 backdrop-blur-md text-[#E9E1D3] px-4 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-medium border border-[#B89A52]/30 shadow-md">
                  1 Bedspread + 2 Pillow Covers
                </div>

                {/* Active Design Identifier Tag at top-left */}
                <div className="absolute top-5 left-5 z-20 bg-[#332C26]/90 backdrop-blur-md text-[#F8F5EE] px-3.5 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-mono font-medium border border-[#B89A52]/30 shadow-sm transition-all">
                  Edition {activeIndex + 1 < 10 ? `0${activeIndex + 1}` : activeIndex + 1}
                </div>
              </div>

              {/* Circular Rotating Watermark Badge with Exact Storefront Logo */}
              <div className="hidden sm:flex absolute -top-4 -right-4 w-32 h-32 rounded-full items-center justify-center pointer-events-none select-none z-30">
                <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9.5px] uppercase tracking-[0.24em] fill-[#332C26] font-medium font-sans">
                    <textPath href="#circlePath" startOffset="0%">
                      ACR COTTONS • ERODE TEXTILE VALLEY • 100% COMBED COTTON •
                    </textPath>
                  </text>
                </svg>
                <div className="absolute w-14 h-14 rounded-full overflow-hidden border-2 border-[#B89A52]/60 shadow-lg bg-[#332C26] p-1 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Image
                      src="/assets/brand/shoplogo_circular.png"
                      alt="ACR Cottons Official Storefront Logo"
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Macro Detail Inset Card (Bottom-Left) - Synchronized with Active Design */}
              <div className="absolute -bottom-4 -left-2 sm:left-2 w-52 sm:w-60 rounded-2xl overflow-hidden border border-[#B89A52]/40 shadow-2xl bg-[#E9E1D3] z-20">
                <div className="relative h-28 sm:h-32">
                  {heroProducts.map((product, idx) => (
                    <div
                      key={`macro-${product.id}`}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <Image
                        src={product.thumbnail}
                        alt={`Fine jacquard relief weave macro for ${product.name}`}
                        fill
                        sizes="240px"
                        className="object-cover object-bottom"
                      />
                    </div>
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#332C26]/95 via-[#332C26]/50 to-transparent flex flex-col justify-end p-3.5 text-[#F8F5EE] z-20 pointer-events-none">
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-[#F8F5EE]">
                      Weave Architecture
                    </span>
                    <span className="text-xs font-serif font-medium text-[#F8F5EE] line-clamp-1 transition-all">
                      {heroProducts[activeIndex]?.weave || 'Royal Jacquard Relief Weave'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Subtle Minimalist Low-Opacity Carousel Arrow Controls Under Hero Image */}
            <div className="flex items-center justify-center gap-3 pt-7 z-10 select-none">
              <button
                onClick={handlePrev}
                aria-label="Previous Design Edition"
                className="p-1.5 rounded-full text-[#332C26] opacity-35 hover:opacity-100 hover:bg-[#E9E1D3] transition-all duration-200 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {heroProducts.map((_, i) => (
                  <button
                    key={`hero-dot-${i}`}
                    onClick={(e) => handleSelect(i, e)}
                    aria-label={`View design edition ${i + 1}`}
                    className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                      i === activeIndex
                        ? 'w-5 bg-[#B89A52] opacity-90'
                        : 'w-1 bg-[#332C26] opacity-30 hover:opacity-75'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                aria-label="Next Design Edition"
                className="p-1.5 rounded-full text-[#332C26] opacity-35 hover:opacity-100 hover:bg-[#E9E1D3] transition-all duration-200 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
