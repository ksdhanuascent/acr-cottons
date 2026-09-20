'use client';

import React from 'react';
import { MapPin, Clock, Phone, Navigation, Building } from 'lucide-react';

export function AtelierMap() {
  const latitude = 11.32568;
  const longitude = 77.701291;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=16&output=embed`;

  return (
    <section id="showroom" className="py-16 sm:py-24 bg-[#E9E1D3]/40 border-b border-[#DFD7C7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#B89A52] font-semibold mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>Visit the Erode Loom House</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#332C26] font-normal">
            Atelier & Showroom
          </h2>
          <p className="text-xs sm:text-sm text-[#6E6459] max-w-xl mt-2 font-light leading-relaxed">
            Experience our combed cotton collections in person. Inspect tactile weaves, examine bespoke pattern archives, and consult directly with our textile experts at our Erode headquarters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left: Atelier Location Info Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Address Card */}
              <div className="bg-[#F8F5EE] rounded-2xl p-6 border border-[#DFD7C7] shadow-sm">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#E9E1D3] text-[#B89A52]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#B89A52] block">
                      Physical Atelier Address
                    </span>
                    <h3 className="font-serif text-lg text-[#332C26] mt-0.5 font-medium">
                      ACR Cottons Showroom
                    </h3>
                    <p className="text-xs text-[#6E6459] mt-1 leading-relaxed">
                      2, Sathya Moorthy Street, Surampatti Valasu,<br />
                      Erode — 638009, Tamil Nadu, India.
                    </p>
                    <span className="inline-block text-[11px] font-mono text-[#332C26] bg-[#E9E1D3] px-2 py-0.5 rounded mt-2">
                      GPS: 11.325680° N, 77.701291° E
                    </span>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-[#F8F5EE] rounded-2xl p-6 border border-[#DFD7C7] shadow-sm">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#E9E1D3] text-[#B89A52]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#B89A52] block">
                      Showroom Hours
                    </span>
                    <h3 className="font-serif text-base text-[#332C26] mt-0.5 font-medium">
                      Monday through Friday
                    </h3>
                    <p className="text-xs text-[#6E6459] mt-1">
                      8:00 AM – 8:00 PM IST
                    </p>
                    <p className="text-[11px] text-[#6E6459] mt-0.5">
                      <em>Closed on Saturdays & Sundays for loom maintenance</em>
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Phone Card */}
              <div className="bg-[#F8F5EE] rounded-2xl p-6 border border-[#DFD7C7] shadow-sm">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#E9E1D3] text-[#B89A52]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#B89A52] block">
                      Direct Atelier Telephone
                    </span>
                    <a
                      href="tel:8778824123"
                      className="font-sans font-semibold tracking-wide text-lg text-[#332C26] hover:text-[#B89A52] transition block mt-0.5"
                    >
                      +91 87788 24123
                    </a>
                    <p className="text-[11px] text-[#6E6459] mt-0.5">
                      Customer assistance, wholesale inquiries & bespoke orders
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Directions Action Button */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <Navigation className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              <span>Get Real-Time Directions (Google Maps)</span>
            </a>
          </div>

          {/* Right: Embedded Interactive Map */}
          <div className="lg:col-span-7 rounded-[2rem] overflow-hidden border-2 border-[#DFD7C7] shadow-2xl bg-[#E9E1D3] relative min-h-[420px] flex">
            <iframe
              title="ACR Cottons Atelier Showroom Location Map"
              src={mapEmbedUrl}
              className="w-full h-full min-h-[420px] border-0"
              loading="lazy"
              allowFullScreen
            />

            {/* Subtle Overlay Pin Badge */}
            <div className="absolute top-4 left-4 bg-[#332C26]/90 backdrop-blur-md text-[#F8F5EE] px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg pointer-events-none border border-[#DFD7C7]/20">
              <span className="w-2 h-2 rounded-full bg-[#B89A52]"></span>
              <span className="font-semibold">Surampatti Valasu Atelier Pin</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
