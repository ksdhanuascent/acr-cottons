'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock, ArrowUp, Shield } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2B2520] text-[#E9E1D3] pt-16 pb-12 border-t border-[#B89A52]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-[#E9E1D3]/10">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-5">
            <div className="relative h-12 w-48">
              <Image
                src="/assets/brand/logo_gold_transparent.png"
                alt="ACR Cottons"
                fill
                sizes="192px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-xs text-[#E9E1D3]/70 max-w-sm leading-relaxed font-light">
              Artisanal luxury bedspreads and matching pillow suites woven in the historic Textile Valley of Erode, Tamil Nadu. Bringing the serene, quiet elegance of a five-star boutique hotel into residential sanctuaries.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-[#B89A52]">
              <Shield className="w-4 h-4" />
              <span className="tracking-wider uppercase text-[10px] font-semibold">
                100% Combed Pure Cotton • Artisanal Loom Guarantee
              </span>
            </div>
          </div>

          {/* Nav Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-light">
            
            <div>
              <span className="font-semibold text-[#F8F5EE] uppercase tracking-[0.2em] text-[10px] block mb-4">
                Collections
              </span>
              <ul className="space-y-2.5 text-[#E9E1D3]/70">
                <li><Link href="/shop" className="hover:text-[#B89A52] transition">Bedspread & Pillow Sets</Link></li>
                <li><Link href="/shop" className="hover:text-[#B89A52] transition">Curated Gift Boxes</Link></li>
                <li><Link href="/shop" className="hover:text-[#B89A52] transition">Plush Velvet Lumbar</Link></li>
                <li><Link href="/shop" className="hover:text-[#B89A52] transition">Satin European Shams</Link></li>
              </ul>
            </div>

            <div>
              <span className="font-semibold text-[#F8F5EE] uppercase tracking-[0.2em] text-[10px] block mb-4">
                The Atelier
              </span>
              <ul className="space-y-2.5 text-[#E9E1D3]/70">
                <li><Link href="/#bespoke" className="hover:text-[#B89A52] transition">Bespoke Orders</Link></li>
                <li><Link href="/#heritage" className="hover:text-[#B89A52] transition">Founder & Story</Link></li>
                <li><Link href="/#showroom" className="hover:text-[#B89A52] transition">Erode Showroom</Link></li>
                <li><a href="tel:8778824123" className="hover:text-[#B89A52] transition">Direct Phone Desk</a></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="font-semibold text-[#F8F5EE] uppercase tracking-[0.2em] text-[10px] block mb-4">
                Showroom Desk
              </span>
              <div className="space-y-2.5 text-[11px] text-[#E9E1D3]/70 leading-relaxed">
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B89A52] mt-0.5 flex-shrink-0" />
                  <span>2, Sathya Moorthy Street, Surampatti Valasu, Erode - 638009</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#B89A52] flex-shrink-0" />
                  <a href="tel:8778824123" className="hover:text-[#B89A52]">+91 87788 24123</a>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#B89A52] flex-shrink-0" />
                  <span>Mon–Fri: 8 AM – 8 PM IST</span>
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#E9E1D3]/50 tracking-wider">
          <span>&copy; 2026 ACR COTTONS. ALL RIGHTS RESERVED. FOUNDED BY A.C. RAJ KUMAR.</span>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <span>ERODE, TAMIL NADU, INDIA</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-[#B89A52] transition cursor-pointer"
            >
              <span>TOP</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
