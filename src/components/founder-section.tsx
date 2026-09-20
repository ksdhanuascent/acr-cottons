'use client';

import React from 'react';
import Image from 'next/image';
import { Quote, Sparkles, MapPin } from 'lucide-react';

export function FounderSection() {
  return (
    <section id="heritage" className="py-10 sm:py-24 bg-[#F8F5EE] border-b border-[#DFD7C7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Founder Portrait Frame */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-md h-[320px] sm:h-[540px] rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl bg-[#E9E1D3] border-4 border-[#F8F5EE]">
              <Image
                src="/assets/founder/owner.webp"
                alt="A.C. Raj Kumar — Founder of ACR Cottons"
                fill
                sizes="(max-width: 640px) 100vw, 450px"
                className="object-cover object-top hover:scale-102 transition-transform duration-700"
              />

              {/* Founder Title Pill */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 bg-[#332C26]/90 backdrop-blur-md text-[#F8F5EE] p-3 sm:p-4 rounded-2xl border border-[#DFD7C7]/20 shadow-lg">
                <span className="block text-xs sm:text-sm font-serif font-medium text-[#F8F5EE]">
                  A.C. Raj Kumar
                </span>
                <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-[#B89A52] font-semibold mt-0.5">
                  Founder & Master Visionary • ACR Cottons
                </span>
              </div>
            </div>

            {/* Decorative Gold Accent Badge — Visible on Mobile & Desktop */}
            <div className="flex absolute -top-3 left-4 sm:-top-4 sm:-left-4 bg-[#B89A52] text-[#F8F5EE] px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl shadow-lg items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider z-10">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Bringing Designs You Desire to Life</span>
            </div>
          </div>

          {/* Right Column: Editorial Bio & Heritage Narrative */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-8">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#B89A52] font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Erode, Tamil Nadu • Textile Valley of South India</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#332C26] font-normal leading-[1.2]">
              Redefining home comfort through artisanal excellence.
            </h2>

            {/* Pull Quote */}
            <div className="relative pl-6 border-l-2 border-[#B89A52] py-2">
              <Quote className="w-6 h-6 text-[#B89A52]/30 absolute -top-2 left-2 pointer-events-none" />
              <p className="font-serif italic text-lg sm:text-xl text-[#332C26] leading-relaxed">
                “From Thread to Treasure — crafting designs to create an evolution in the textile industry.”
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#6E6459] font-light leading-relaxed">
              <p>
                Based in Erode along the historic banks of the Cauvery, <strong>ACR Cottons</strong> is dedicated to crafting bedspreads and matching pillow suites that impart a royal, peaceful serenity into every home.
              </p>
              <p>
                Our philosophy — <em>“Textiles Woven for Everyday Luxury”</em> — focuses on bringing the immersive comfort of a five-star boutique hotel suite into residential living. By combining pure long-staple combed cotton with intricate damask patterns and architectural jacquard weaves, each piece is engineered for lasting softness and zero pilling.
              </p>
            </div>

            {/* Core Enterprise Pillars */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-[#DFD7C7]">
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#E9E1D3]/50 border border-[#DFD7C7]">
                <span className="font-serif text-xs sm:text-lg text-[#332C26] block font-medium">Boutique</span>
                <span className="text-[9px] sm:text-[11px] text-[#6E6459] block mt-0.5 sm:mt-1 line-clamp-2">Rich damask weaves for serene sleep</span>
              </div>
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#E9E1D3]/50 border border-[#DFD7C7]">
                <span className="font-serif text-xs sm:text-lg text-[#332C26] block font-medium">Combed</span>
                <span className="text-[9px] sm:text-[11px] text-[#6E6459] block mt-0.5 sm:mt-1 line-clamp-2">Short fibers removed for softness</span>
              </div>
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#E9E1D3]/50 border border-[#DFD7C7]">
                <span className="font-serif text-xs sm:text-lg text-[#332C26] block font-medium">Heritage</span>
                <span className="text-[9px] sm:text-[11px] text-[#6E6459] block mt-0.5 sm:mt-1 line-clamp-2">Empowering Erode weaving masters</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
