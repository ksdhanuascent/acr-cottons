'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, X } from 'lucide-react';

export function WhatsAppConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '918778824123';
  const defaultMessage = encodeURIComponent(
    'Hello ACR Cottons! I am browsing your luxury bedding collection and would like personal assistance.'
  );

  return (
    <aside aria-label="Atelier WhatsApp Concierge" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-xs sm:w-80 rounded-2xl bg-[#F8F5EE] border border-[#DFD7C7] p-4 sm:p-5 shadow-2xl transition-all">
          <div className="flex items-start justify-between pb-3 border-b border-[#DFD7C7]">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#B89A52]/50 bg-[#332C26] flex-shrink-0 shadow-sm">
                <Image
                  src="/assets/brand/shoplogo_circular.png"
                  alt="ACR Cottons"
                  fill
                  unoptimized
                  sizes="48px"
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-sm font-semibold text-[#332C26]">Atelier Concierge</h3>
                <p className="text-[11px] text-[#6E6459] font-sans">
                  Erode Weaving Desk • Mon–Fri, 8 AM–8 PM
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#6E6459] hover:text-[#332C26] p-1 transition cursor-pointer"
              aria-label="Close Concierge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="py-3 text-xs text-[#332C26] leading-relaxed">
            Directly connect with our master weavers in Erode for custom sizing, fabric samples, or order assistance.
          </p>

          <a
            href={`https://wa.me/${phoneNumber}?text=${defaultMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold tracking-wider uppercase transition shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <p className="text-[10px] text-center text-[#6E6459] mt-2 font-sans">
            Store Hours: Mon–Fri, 8:00 AM – 8:00 PM IST
          </p>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Atelier WhatsApp Concierge"
        className={`group relative flex items-center justify-center space-x-2 bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-700 ease-in-out border border-[#B89A52]/30 cursor-pointer ${
          isOpen ? 'opacity-100' : 'opacity-25 hover:opacity-100'
        }`}
      >
        <MessageCircle className="w-4 h-4 text-[#B89A52] group-hover:text-[#F8F5EE] transition-colors duration-500 flex-shrink-0" />
        <span className="hidden sm:inline text-xs font-medium tracking-wider uppercase text-left leading-none">
          Atelier Concierge
        </span>
      </button>
    </aside>
  );
}
