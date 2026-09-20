'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Award } from 'lucide-react';

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

          {/* Right Composition Image Frame (design1.png in rounded card) */}
          <div
            className="lg:col-span-6 relative flex justify-center items-center py-6"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1000px' }}
          >
            {/* Main Rounded Bedspread Card */}
            <div
              className="relative w-full max-w-md sm:max-w-lg h-[500px] sm:h-[580px] rounded-[2.5rem] overflow-hidden shadow-2xl bg-[#E9E1D3] border-4 border-[#F8F5EE] transition-transform duration-200 ease-out"
              style={{
                transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`,
              }}
            >
              <Image
                src="/assets/designs/design1.webp"
                alt="ACR Cottons Royal Damask Bedspread Design No. 1"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 500px"
                className="object-cover object-center select-none hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Floating Top-Left Badge */}
              <div className="absolute top-5 left-5 bg-[#F8F5EE]/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-semibold text-[#332C26] shadow-sm border border-[#DFD7C7] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Atelier Signature • Edition 01
              </div>

              {/* Floating Set Breakdown Tag at bottom-right */}
              <div className="absolute bottom-5 right-5 bg-[#332C26]/85 backdrop-blur-md text-[#E9E1D3] px-3.5 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-medium">
                1 Bedspread + 2 Pillow Covers
              </div>
            </div>

            {/* Circular Rotating Watermark Badge (Right Edge) */}
            <div className="hidden sm:flex absolute -top-4 -right-4 w-32 h-32 rounded-full items-center justify-center pointer-events-none select-none">
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
              <div className="absolute w-12 h-12 rounded-full bg-[#B89A52] flex items-center justify-center text-[#F8F5EE] font-serif text-xs font-bold shadow-md">
                ACR
              </div>
            </div>

            {/* Floating Macro Detail Inset Card (Bottom-Left) */}
            <div className="absolute -bottom-4 -left-2 sm:left-2 w-52 sm:w-60 rounded-2xl overflow-hidden border-2 border-[#F8F5EE] shadow-2xl bg-[#E9E1D3] z-20">
              <div className="relative h-28 sm:h-32">
                <Image
                  src="/assets/designs/design1_thumb.webp"
                  alt="Fine jacquard relief weave macro"
                  fill
                  sizes="240px"
                  className="object-cover object-bottom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#332C26]/90 via-[#332C26]/30 to-transparent flex flex-col justify-end p-3 text-[#F8F5EE]">
                  <span className="text-[9px] tracking-widest uppercase font-semibold text-[#B89A52]">
                    Weave Architecture
                  </span>
                  <span className="text-xs font-serif font-medium text-[#F8F5EE]">
                    Royal Jacquard Relief Weave
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
