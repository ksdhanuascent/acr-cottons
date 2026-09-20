'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, CheckCircle2, Sparkles, MessageCircle, Clock, Trash2, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { validateBespokeRequest, checkRateLimit } from '@/lib/moderation';

export function BespokeSection() {
  const { user, setAuthModalOpen, submitCustomOrder, deleteCustomOrder, customOrders } = useStore();
  const [fabric, setFabric] = useState('Combed Erode Cotton (400 TC)');
  const [dimensions, setDimensions] = useState('King Suite (108″ × 108″ + 2 Shams)');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [deletionNotice, setDeletionNotice] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDesignFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawUrl = event.target?.result as string;
        // Compress on canvas to prevent localStorage quota overflow
        const img = new window.Image();
        img.onload = () => {
          const maxDim = 800;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            setDesignPreview(compressed);
          } else {
            setDesignPreview(rawUrl);
          }
        };
        img.src = rawUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true, 'custom_order');
      return;
    }

    setModerationError(null);

    // Rate limiting check (cooldown 15s)
    if (!checkRateLimit('bespoke', 15)) {
      setModerationError('Please allow 15 seconds before submitting another bespoke inquiry.');
      return;
    }

    // Input moderation & anti-abuse validation
    const check = validateBespokeRequest({
      fabric,
      dimensions,
      notes,
      quantity,
    });

    if (!check.allowed) {
      setModerationError(check.reason || 'Input validation failed.');
      return;
    }

    const order = submitCustomOrder({
      fabric,
      dimensions,
      quantity,
      notes,
      designImage: designPreview || undefined,
      designFileName: designFile?.name || 'Custom Pattern Description',
    });

    setSubmittedId(order.id);
    setNotes('');
    setDesignFile(null);
    setDesignPreview(null);
  };

  // WhatsApp link helper
  const getWhatsAppMessage = (refId: string) => {
    const text = encodeURIComponent(
      `Hello ACR Cottons Atelier! I just submitted a Bespoke Weave Request (Ref: ${refId}) for ${quantity}x ${dimensions} in ${fabric}. Looking forward to discussing feasibility with the master weaver.`
    );
    return `https://wa.me/918778824123?text=${text}`;
  };

  return (
    <section id="bespoke" className="py-10 sm:py-24 bg-[#E9E1D3]/50 border-b border-[#DFD7C7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#B89A52] font-semibold mb-1.5 sm:mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customized Weaving Atelier</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#332C26] font-normal">
            Bespoke Bedding Commissions
          </h2>
          <p className="text-[11px] sm:text-sm text-[#6E6459] max-w-xl mt-1.5 sm:mt-2 font-light leading-relaxed">
            Have a distinct bedroom palette, vintage motif, or architectural suite dimension? Upload your reference sketch or pattern plate. Our Erode master weavers will review loom feasibility and consult with you directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          
          {/* Left Form */}
          <div className="lg:col-span-7 bg-[#F8F5EE] rounded-[2rem] p-5 sm:p-8 border border-[#DFD7C7] shadow-xl">
            {submittedId ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-[#B89A52]" />
                </div>
                <h3 className="font-serif text-2xl text-[#332C26]">
                  Bespoke Commission Received
                </h3>
                <p className="text-xs text-[#6E6459] max-w-md mx-auto leading-relaxed">
                  Your reference has been logged under ID <span className="font-mono font-bold text-[#332C26]">{submittedId}</span>. The ACR Cottons weaving committee will review thread density, yarn dyeing requirements, and reach out to you within 24–48 hours.
                </p>

                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <a
                    href={getWhatsAppMessage(submittedId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold tracking-wider uppercase transition shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Discuss on WhatsApp Now</span>
                  </a>
                  <button
                    onClick={() => setSubmittedId(null)}
                    className="py-3 px-6 rounded-full border border-[#332C26] text-[#332C26] hover:bg-[#E9E1D3] text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                  >
                    Submit Another Commission
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* File / Design Upload Frame */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-2">
                    Upload Your Design Sketch or Motif Photo (Optional)
                  </label>
                  <label className="relative border-2 border-dashed border-[#DFD7C7] hover:border-[#B89A52] rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#E9E1D3]/30">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {designPreview ? (
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#DFD7C7]">
                          <Image
                            src={designPreview}
                            alt="Custom design preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-left text-xs">
                          <span className="font-semibold text-[#332C26] block truncate max-w-xs">
                            {designFile?.name}
                          </span>
                          <span className="text-[#B89A52] text-[11px] underline">
                            Click to change image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-1.5 py-3">
                        <Upload className="w-7 h-7 text-[#B89A52] mx-auto" />
                        <span className="text-xs font-medium text-[#332C26] block">
                          Drag & drop photo or click to browse
                        </span>
                        <span className="text-[10px] text-[#6E6459] block">
                          PNG, JPG, WEBP up to 20MB
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Fabric Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1.5">
                      Preferred Fabric Weave
                    </label>
                    <select
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl px-3.5 py-2.5 text-xs text-[#332C26] outline-none cursor-pointer focus:border-[#B89A52]"
                    >
                      <option>Combed Erode Cotton (400 TC)</option>
                      <option>Royal Jacquard Relief Weave</option>
                      <option>Reversible Damask Pattern</option>
                      <option>Pure Silk Charmeuse</option>
                      <option>Plush Velvet Finish</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1.5">
                      Dimensions / Target Sizing
                    </label>
                    <select
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl px-3.5 py-2.5 text-xs text-[#332C26] outline-none cursor-pointer focus:border-[#B89A52]"
                    >
                      <option>King Suite (108″ × 108″ + 2 Shams)</option>
                      <option>Queen Suite (90″ × 100″ + 2 Shams)</option>
                      <option>Super King (120″ × 120″ + 4 Shams)</option>
                      <option>Custom Architectural Dimensions</option>
                    </select>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1.5">
                    Quantity Required (Suites)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl px-3.5 py-2.5 text-xs text-[#332C26] outline-none focus:border-[#B89A52]"
                  />
                </div>

                {/* Design Specifications & Notes */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1.5">
                    Specific Requirements or Colorway Palette
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe specific motifs, embroidery requests, border flange widths, or color matching needs..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl p-3 text-xs text-[#332C26] outline-none focus:border-[#B89A52]"
                  />
                </div>

                {moderationError && (
                  <div className="p-3 bg-red-100 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{moderationError}</span>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 sm:py-4 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs uppercase tracking-widest font-semibold transition-all shadow-md cursor-pointer"
                >
                  {user ? 'Submit Bespoke Inquiry' : 'Sign In & Submit Commission'}
                </button>
                <p className="text-[10px] text-center text-[#6E6459]">
                  * Requires sign in so the atelier team can link updates to your patron account.
                </p>
              </form>
            )}
          </div>

          {/* Right Explanatory & Patron Past Requests */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F8F5EE] rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 border border-[#DFD7C7] shadow-sm space-y-3 sm:space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#B89A52]">
                The Atelier Process
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-[#332C26]">
                From Thread to Commission
              </h3>

              {/* Mobile 3-Step Horizontal Stepper Grid */}
              <div className="grid grid-cols-3 gap-2 sm:hidden pt-1">
                <div className="bg-[#E9E1D3]/60 rounded-xl p-2 text-center space-y-1">
                  <span className="w-5 h-5 rounded-full bg-[#332C26] text-[#F8F5EE] font-semibold text-[9px] inline-flex items-center justify-center">1</span>
                  <span className="text-[10px] font-semibold text-[#332C26] block">Design Review</span>
                  <span className="text-[8.5px] text-[#6E6459] block leading-tight">Yarn count & motif inspection</span>
                </div>
                <div className="bg-[#E9E1D3]/60 rounded-xl p-2 text-center space-y-1">
                  <span className="w-5 h-5 rounded-full bg-[#332C26] text-[#F8F5EE] font-semibold text-[9px] inline-flex items-center justify-center">2</span>
                  <span className="text-[10px] font-semibold text-[#332C26] block">Consultation</span>
                  <span className="text-[8.5px] text-[#6E6459] block leading-tight">Palette & quote finalization</span>
                </div>
                <div className="bg-[#E9E1D3]/60 rounded-xl p-2 text-center space-y-1">
                  <span className="w-5 h-5 rounded-full bg-[#332C26] text-[#F8F5EE] font-semibold text-[9px] inline-flex items-center justify-center">3</span>
                  <span className="text-[10px] font-semibold text-[#332C26] block">Loom Craft</span>
                  <span className="text-[8.5px] text-[#6E6459] block leading-tight">Handcrafted in Erode</span>
                </div>
              </div>

              {/* Desktop Stepper List */}
              <ul className="hidden sm:block space-y-3.5 text-xs text-[#6E6459] font-light">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E9E1D3] text-[#332C26] font-semibold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <span><strong>Design Review:</strong> Master weavers inspect pattern repeat, yarn count, and warp/weft tension.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E9E1D3] text-[#332C26] font-semibold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <span><strong>Consultation & Swatch:</strong> The team contacts you via phone or WhatsApp to finalize colorways and quote.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E9E1D3] text-[#332C26] font-semibold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <span><strong>Loom Production:</strong> Your suite is dedicatedly woven in Surampatti Valasu, Erode.</span>
                </li>
              </ul>
            </div>

            {/* Existing Inquiries (if logged in) */}
            {user && customOrders.length > 0 && (
              <div className="bg-[#F8F5EE] rounded-[2rem] p-5 sm:p-6 border border-[#DFD7C7] shadow-sm">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#332C26] mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B89A52]" />
                  Your Active Bespoke Requests ({customOrders.length})
                </h4>

                {deletionNotice && (
                  <div className="mb-2.5 p-2 bg-emerald-100 text-emerald-800 text-[11px] rounded-lg">
                    ✓ {deletionNotice}
                  </div>
                )}

                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {customOrders.map((co) => (
                    <div
                      key={co.id}
                      className="p-3 bg-[#E9E1D3]/60 rounded-xl border border-[#DFD7C7] text-xs flex justify-between items-center gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-[#332C26] block truncate">
                          {co.fabric}
                        </span>
                        <span className="text-[10px] text-[#6E6459] block">
                          {co.dimensions} • Qty: {co.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[9px] uppercase font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                          {co.status.replace('_', ' ')}
                        </span>
                        {co.status === 'UNDER_REVIEW' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Withdraw this unreviewed bespoke commission request?')) {
                                deleteCustomOrder(co.id);
                                setDeletionNotice('Bespoke request withdrawn successfully.');
                                setTimeout(() => setDeletionNotice(null), 3000);
                              }
                            }}
                            className="p-1 rounded text-[#6E6459] hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                            title="Withdraw unreviewed request"
                            aria-label="Withdraw unreviewed request"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
