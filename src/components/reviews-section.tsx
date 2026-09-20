'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PRODUCTS } from '@/lib/catalog';

export function ReviewsSection() {
  const { reviews, addReview } = useStore();
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('Bangalore, KA');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !title || !comment) return;

    addReview({
      productId: selectedProductId,
      userName,
      userCity,
      rating,
      title,
      comment,
      verifiedPurchase: true,
    });

    setIsWriteModalOpen(false);
    setTitle('');
    setComment('');
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F8F5EE] border-b border-[#DFD7C7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B89A52] font-semibold block mb-2">
              Patron Reflections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#332C26] font-normal">
              Words From Our Connoisseurs
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6459] max-w-lg mt-2 font-light">
              Verified experiences from luxury residences, heritage homes, and boutique retreats across India.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1 text-[#B89A52]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#332C26] block mt-0.5">
                4.9 Average Rating (180+ Reviews)
              </span>
            </div>

            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="inline-flex items-center gap-2 py-3 px-5 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs uppercase tracking-wider font-semibold transition shadow-md cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid (Desktop) & Horizontal Snap-Swipe Track (Mobile) */}
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-4 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {reviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="w-[82vw] max-w-[320px] md:w-auto md:max-w-none flex-shrink-0 snap-center bg-[#E9E1D3]/50 rounded-2xl p-5 sm:p-6 border border-[#DFD7C7] flex flex-col justify-between space-y-3.5 sm:space-y-4 hover:border-[#B89A52]/50 transition-colors shadow-xs"
            >
              <div className="space-y-2 sm:space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#B89A52]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#6E6459]">{rev.createdAt}</span>
                </div>

                <h3 className="font-serif text-sm sm:text-base font-medium text-[#332C26]">
                  {rev.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#6E6459] leading-relaxed font-light line-clamp-4 md:line-clamp-none">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-2.5 sm:pt-3 border-t border-[#DFD7C7]/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#332C26] block">
                    {rev.userName}
                  </span>
                  <span className="text-[10px] text-[#6E6459] block">
                    {rev.userCity}
                  </span>
                </div>
                {rev.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Cue */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 pt-2 text-[10px] text-[#6E6459]">
          <span>Swipe to explore verified reviews</span>
          <span>&rarr;</span>
        </div>

      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#332C26]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-[#F8F5EE] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#DFD7C7] shadow-2xl relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6E6459] hover:text-[#332C26] hover:bg-[#E9E1D3]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#B89A52]">
                Share Your Experience
              </span>
              <h3 className="font-serif text-2xl text-[#332C26] mt-0.5">
                Review Your ACR Cottons Piece
              </h3>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                  Select Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-xs text-[#332C26] outline-none"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Rao"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-xs text-[#332C26] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                    City, State
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Coimbatore, TN"
                    value={userCity}
                    onChange={(e) => setUserCity(e.target.value)}
                    className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-xs text-[#332C26] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className={`p-2 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                        rating >= num
                          ? 'bg-[#B89A52] text-[#F8F5EE] border-[#B89A52]'
                          : 'bg-[#E9E1D3] text-[#332C26] border-[#DFD7C7]'
                      }`}
                    >
                      ★ {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unbelievable weave density and softness"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-xs text-[#332C26] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                  Detailed Feedback
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details on texture, washing experience, breathability, or bedroom aesthetic..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl p-3 text-xs text-[#332C26] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs uppercase tracking-widest font-semibold transition cursor-pointer shadow-md"
              >
                Publish Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
