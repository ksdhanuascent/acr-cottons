'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Star, Check, Truck, ShieldCheck, RefreshCw, ZoomIn, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PRODUCTS } from '@/lib/catalog';
import { Product } from '@/lib/types';
import { validateReview, checkRateLimit } from '@/lib/moderation';

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, user, setAuthModalOpen, setCheckoutModalOpen, getProductReviews, addReview } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // Review Form States
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestCity, setGuestCity] = useState('');
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!quickViewProduct) return null;

  const currentSize = selectedSize || quickViewProduct.sizes[0]?.name || 'Standard';
  const reviews = getProductReviews(quickViewProduct.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomOrigin({ x, y });
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus('Available! Express Delivery in 2–4 business days. Cash on Delivery available.');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian pincode.');
    }
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, currentSize, quantity);
    setQuickViewProduct(null);
    if (!user) {
      setAuthModalOpen(true, 'checkout');
    } else {
      setCheckoutModalOpen(true);
    }
  };

  const handleSwitchDesign = (p: Product) => {
    setQuickViewProduct(p);
    setSelectedSize(p.sizes[0]?.name || '');
    setIsWritingReview(false);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModerationError(null);

    // Rate limit check (cooldown 10s)
    if (!checkRateLimit('review', 10)) {
      setModerationError('Please wait 10 seconds before posting another review.');
      return;
    }

    const reviewerName = user ? user.name : (guestName.trim() || 'Verified Patron');
    const reviewerCity = user
      ? (user.addresses?.[0]?.city ? `${user.addresses[0].city}, ${user.addresses[0].state}` : 'Erode, TN')
      : (guestCity.trim() || 'Tamil Nadu');

    const validation = validateReview({
      name: reviewerName,
      city: reviewerCity,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      rating: reviewRating,
    });

    if (!validation.allowed) {
      setModerationError(validation.reason || 'Review validation failed.');
      return;
    }

    addReview({
      productId: quickViewProduct.id,
      userName: reviewerName,
      userCity: reviewerCity,
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      verifiedPurchase: true,
    });
    setReviewTitle('');
    setReviewComment('');
    setGuestName('');
    setGuestCity('');
    setIsWritingReview(false);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  // Sister bedspread designs (if current is bedspread set)
  const bedspreadSets = PRODUCTS.filter((p) => p.category === 'bedspread-sets');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#332C26]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div
        className="relative w-full max-w-5xl bg-[#F8F5EE] rounded-[2rem] shadow-2xl border border-[#DFD7C7] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 p-2 sm:p-2.5 rounded-full bg-[#E9E1D3] text-[#332C26] hover:bg-[#B89A52] hover:text-[#F8F5EE] transition shadow-md cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: High-Res Weave Inspection View */}
          <div className="lg:col-span-6 bg-[#E9E1D3]/50 p-4 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#DFD7C7]">
            <div>
              <div
                className="relative w-full h-[280px] sm:h-[480px] rounded-2xl overflow-hidden bg-[#E9E1D3] border border-[#DFD7C7] group cursor-crosshair select-none"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseMove={handleMouseMove}
              >
                <div
                  className="w-full h-full relative transition-transform duration-150 ease-out"
                  style={{
                    transform: isHovering ? 'scale(2.3)' : 'scale(1)',
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  }}
                >
                  <Image
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                </div>
                
                {/* Zoom indicator */}
                <div className={`absolute bottom-4 left-4 bg-[#F8F5EE]/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-semibold text-[#332C26] flex items-center gap-1.5 shadow-sm pointer-events-none transition-opacity duration-200 ${isHovering ? 'opacity-0' : 'opacity-100'}`}>
                  <ZoomIn className="w-3.5 h-3.5 text-[#B89A52]" />
                  <span>Hover to Inspect Weave</span>
                </div>

                {isHovering && (
                  <div className="absolute top-4 right-4 bg-[#332C26]/90 backdrop-blur-md text-[#F8F5EE] px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-mono font-medium pointer-events-none shadow-md">
                    2.3× Weave Zoom
                  </div>
                )}

                {/* Badge */}
                {quickViewProduct.badge && (
                  <div className="absolute top-4 left-4 bg-[#332C26]/90 text-[#F8F5EE] text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                    {quickViewProduct.badge}
                  </div>
                )}
              </div>

              {/* Sister Swatch Bar (if in Bedspread Sets) */}
              {quickViewProduct.category === 'bedspread-sets' && (
                <div className="mt-4">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[#6E6459] block mb-2">
                    Explore Sister Editions (10 Masterworks):
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {bedspreadSets.map((bp) => (
                      <button
                        key={bp.id}
                        onClick={() => handleSwitchDesign(bp)}
                        className={`relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition cursor-pointer ${
                          bp.id === quickViewProduct.id
                            ? 'border-[#B89A52] ring-2 ring-[#B89A52]/40 scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        title={bp.name}
                      >
                        <Image
                          src={bp.thumbnail || bp.image}
                          alt={bp.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Set Contents Pill */}
            <div className="mt-4 p-3 bg-[#E9E1D3] rounded-xl border border-[#DFD7C7] flex items-center gap-2 text-xs text-[#332C26]">
              <Check className="w-4 h-4 text-[#B89A52] flex-shrink-0" />
              <span className="font-medium">Complete Package: {quickViewProduct.setContents}</span>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Category & Title */}
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#B89A52]">
                  {quickViewProduct.categoryLabel}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#332C26] mt-1 font-normal">
                  {quickViewProduct.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-[#B89A52]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(quickViewProduct.rating)
                            ? 'fill-current'
                            : 'stroke-current fill-none'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#332C26]">{quickViewProduct.rating}</span>
                  <span className="text-xs text-[#6E6459]">({reviews.length} verified reviews)</span>
                </div>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 pb-4 border-b border-[#DFD7C7]">
                <span className="font-serif text-3xl font-medium text-[#332C26]">
                  ₹{quickViewProduct.price}.00
                </span>
                {quickViewProduct.compareAtPrice && (
                  <span className="text-sm text-[#6E6459] line-through">
                    ₹{quickViewProduct.compareAtPrice}.00
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Cash on Delivery Available
                </span>
              </div>

              {/* Tab Navigation (Details vs. Reviews) */}
              <div className="flex border-b border-[#DFD7C7] text-xs font-medium uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2.5 px-3 border-b-2 cursor-pointer transition ${
                    activeTab === 'details'
                      ? 'border-[#B89A52] text-[#332C26]'
                      : 'border-transparent text-[#6E6459] hover:text-[#332C26]'
                  }`}
                >
                  Textile Specs
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2.5 px-3 border-b-2 cursor-pointer transition ${
                    activeTab === 'reviews'
                      ? 'border-[#B89A52] text-[#332C26]'
                      : 'border-transparent text-[#6E6459] hover:text-[#332C26]'
                  }`}
                >
                  Reviews ({reviews.length})
                </button>
              </div>

              {/* Tab Content: Details */}
              {activeTab === 'details' ? (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-[#6E6459] leading-relaxed font-light">
                    {quickViewProduct.description}
                  </p>

                  {/* Size Selector */}
                  {quickViewProduct.sizes.length > 0 && (
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-2">
                        Select Bedding Dimension:
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {quickViewProduct.sizes.map((sz) => (
                          <button
                            key={sz.id}
                            onClick={() => setSelectedSize(sz.name)}
                            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                              currentSize === sz.name
                                ? 'border-[#B89A52] bg-[#E9E1D3] text-[#332C26] ring-1 ring-[#B89A52]'
                                : 'border-[#DFD7C7] bg-[#F8F5EE] text-[#6E6459] hover:border-[#332C26]'
                            }`}
                          >
                            <span className="block text-xs font-semibold">{sz.name}</span>
                            <span className="block text-[10px] text-[#6E6459] mt-0.5">{sz.dimensions}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pincode Estimator */}
                  <div className="bg-[#E9E1D3]/50 p-3.5 rounded-xl border border-[#DFD7C7]">
                    <span className="block text-[11px] uppercase tracking-wider font-semibold text-[#332C26] mb-1.5 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#B89A52]" />
                      Check Delivery to Pincode
                    </span>
                    <form onSubmit={handlePincodeCheck} className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 638009 or 560001"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-lg px-3 py-1.5 text-xs text-[#332C26] outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-[#332C26] text-[#F8F5EE] text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-[#B89A52] transition flex-shrink-0 cursor-pointer"
                      >
                        Check
                      </button>
                    </form>
                    {pincodeStatus && (
                      <p className="text-[11px] mt-1.5 text-[#332C26] font-medium">
                        {pincodeStatus}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Tab Content: Reviews */
                <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DFD7C7]/60">
                    <span className="text-xs font-semibold text-[#332C26]">
                      {reviews.length} Verified Patron Review{reviews.length === 1 ? '' : 's'}
                    </span>
                    <button
                      onClick={() => setIsWritingReview(!isWritingReview)}
                      className="text-[11px] uppercase tracking-wider font-semibold text-[#B89A52] hover:text-[#332C26] transition underline cursor-pointer"
                    >
                      {isWritingReview ? 'Cancel' : '+ Write a Review'}
                    </button>
                  </div>

                  {/* Non-authenticated Prompt */}
                  {!user && !isWritingReview && (
                    <div className="p-2.5 bg-[#E9E1D3]/50 rounded-xl border border-[#DFD7C7] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#6E6459]">Have you experienced this suite?</span>
                      <button
                        onClick={() => setIsWritingReview(true)}
                        className="text-[10px] uppercase tracking-wider font-bold text-[#332C26] underline hover:text-[#B89A52] cursor-pointer"
                      >
                        Write a Review
                      </button>
                    </div>
                  )}

                  {/* In-place Review Submission Form */}
                  {isWritingReview && (
                    <form onSubmit={handleReviewSubmit} className="p-3 bg-[#E9E1D3]/70 rounded-xl border border-[#B89A52]/40 space-y-2.5 animate-in fade-in duration-200">
                      {user ? (
                        <div className="text-[11px] text-[#6E6459] flex items-center justify-between">
                          <span>Reviewing as: <strong className="text-[#332C26]">{user.name}</strong></span>
                          <span className="text-[#B89A52] text-[10px] font-semibold">✓ Verified Patron</span>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Your Name (e.g. Rajesh K.)"
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              required
                              className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-lg px-2.5 py-1.5 text-xs text-[#332C26] outline-none font-sans"
                            />
                            <input
                              type="text"
                              placeholder="City / Town (e.g. Erode, TN)"
                              value={guestCity}
                              onChange={(e) => setGuestCity(e.target.value)}
                              required
                              className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-lg px-2.5 py-1.5 text-xs text-[#332C26] outline-none font-sans"
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-[#6E6459]">
                            <span>Writing as Patron Guest</span>
                            <button
                              type="button"
                              onClick={() => setAuthModalOpen(true)}
                              className="text-[#B89A52] underline hover:text-[#332C26] cursor-pointer"
                            >
                              Sign In for profile auto-fill
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#332C26]">Your Rating:</span>
                        <div className="flex gap-1 text-[#B89A52]">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="cursor-pointer hover:scale-110 transition p-0.5"
                            >
                              <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-current' : 'stroke-current fill-none'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Review Headline (e.g. Pure five-star hotel luxury)"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        required
                        className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-lg px-3 py-1.5 text-xs text-[#332C26] outline-none font-sans"
                      />
                      <textarea
                        rows={2}
                        placeholder="Describe the weave texture, cooling comfort, and hand feel..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                        className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-lg p-2 text-xs text-[#332C26] outline-none font-sans resize-none"
                      />
                      {moderationError && (
                        <div className="p-2 bg-red-100 border border-red-200 text-red-800 text-[11px] rounded-lg flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{moderationError}</span>
                        </div>
                      )}
                      <button
                        type="submit"
                        className="w-full py-2 bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] rounded-lg text-xs uppercase tracking-wider font-semibold transition cursor-pointer"
                      >
                        Publish Atelier Review
                      </button>
                    </form>
                  )}

                  {reviewSubmitted && (
                    <div className="p-2 bg-emerald-100 text-emerald-800 text-xs rounded-lg font-medium text-center">
                      ✓ Thank you! Your verified review has been published.
                    </div>
                  )}

                  {reviews.length === 0 ? (
                    <p className="text-xs text-[#6E6459] py-3 text-center">Be the first to review this atelier masterwork.</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="p-3 bg-[#E9E1D3]/40 rounded-xl border border-[#DFD7C7]">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1 text-[#B89A52]">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          <span className="text-[10px] text-[#6E6459]">{rev.createdAt}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-[#332C26]">{rev.title}</h4>
                        <p className="text-xs text-[#6E6459] mt-1 font-light leading-relaxed">{rev.comment}</p>
                        <span className="block text-[10px] text-[#B89A52] mt-1.5">
                          ✓ Verified Connoisseur: {rev.userName} ({rev.userCity})
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Quantity Selector & Action Buttons (Mobile Sticky Bar) */}
              <div className="pt-3 sm:pt-4 border-t border-[#DFD7C7] space-y-3 sticky bottom-0 bg-[#F8F5EE]/95 backdrop-blur-md -mx-6 px-6 pb-3 sm:pb-0 sm:static sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-none z-10 shadow-[0_-4px_16px_rgba(51,44,38,0.08)] sm:shadow-none">
                <div className="flex items-center justify-between sm:justify-start gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#332C26]">
                      Qty:
                    </span>
                    <div className="flex items-center border border-[#DFD7C7] bg-[#E9E1D3] rounded-full overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2.5 py-0.5 sm:px-3 sm:py-1 text-sm text-[#332C26] hover:bg-[#B89A52] hover:text-white transition cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2.5 sm:px-3 text-xs font-semibold text-[#332C26]">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2.5 py-0.5 sm:px-3 sm:py-1 text-sm text-[#332C26] hover:bg-[#B89A52] hover:text-white transition cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#332C26] sm:hidden">
                    ₹{(quickViewProduct.price * quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, currentSize, quantity);
                      setQuickViewProduct(null);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 px-3 sm:px-4 rounded-full border border-[#332C26] text-[#332C26] hover:bg-[#332C26] hover:text-[#F8F5EE] text-[11px] sm:text-xs uppercase tracking-widest font-semibold transition shadow-xs cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 px-3 sm:px-4 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-[11px] sm:text-xs uppercase tracking-widest font-semibold transition shadow-md cursor-pointer"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Value Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-[#6E6459] border-t border-[#DFD7C7]">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B89A52] mb-1" />
                  <span>100% Cotton Weave</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-3.5 h-3.5 text-[#B89A52] mb-1" />
                  <span>Free Shipping on 2+</span>
                </div>
                <div className="flex flex-col items-center">
                  <RefreshCw className="w-3.5 h-3.5 text-[#B89A52] mb-1" />
                  <span>Pay on Delivery</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
