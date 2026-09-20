'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export function WhatsAppConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '918778824123';
  const defaultMessage = encodeURIComponent(
    'Hello ACR Cottons! I am browsing your luxury bedding collection and would like personal assistance.'
  );

  return (
    <aside aria-label="Atelier WhatsApp Concierge" className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="mb-3 w-80 rounded-2xl bg-[#F8F5EE] border border-[#DFD7C7] p-5 shadow-2xl transition-all">
          <div className="flex items-start justify-between pb-3 border-b border-[#DFD7C7]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#B89A52] flex items-center justify-center text-[#F8F5EE] font-serif font-bold text-sm shadow-sm">
                ACR
              </div>
              <div>
                <h3 className="font-serif text-sm font-semibold text-[#332C26]">Atelier Concierge</h3>
                <p className="text-[11px] text-[#6E6459] flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
                  Erode Weaving Desk • Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#6E6459] hover:text-[#332C26] p-1 transition"
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
          <p className="text-[10px] text-center text-[#6E6459] mt-2">
            Store Hours: Mon–Fri, 8:00 AM – 8:00 PM IST
          </p>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Atelier WhatsApp Concierge"
        className="group relative flex items-center space-x-2.5 bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 border border-[#B89A52]/30"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        <MessageCircle className="w-5 h-5 text-[#B89A52] group-hover:text-[#F8F5EE] transition-colors" />
        <span className="hidden sm:inline text-xs font-medium tracking-wider uppercase">
          Atelier Concierge
        </span>
      </button>
    </aside>
  );
}
