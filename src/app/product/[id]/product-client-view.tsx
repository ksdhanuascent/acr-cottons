'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Check, Truck, ShieldCheck, RefreshCw, ZoomIn, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';
import { Product } from '@/lib/types';
import { PRODUCTS } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { validateReview, checkRateLimit } from '@/lib/moderation';

export function ProductClientView({ product }: { product: Product }) {
  const { addToCart, user, setAuthModalOpen, setCheckoutModalOpen, getProductReviews, addReview } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]?.name || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  // Review Form States
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestCity, setGuestCity] = useState('');
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const reviews = getProductReviews(product.id);
  const bedspreadSets = PRODUCTS.filter((p) => p.category === 'bedspread-sets');

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
      productId: product.id,
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
    addToCart(product, selectedSize, quantity);
    if (!user) {
      setAuthModalOpen(true, 'checkout');
    } else {
      setCheckoutModalOpen(true);
    }
  };

  return (
    <div className="bg-[#F8F5EE] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-[#6E6459] mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#332C26] transition">Atelier</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#332C26] transition">Collection</Link>
          <span>/</span>
          <span className="text-[#332C26] font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Image Gallery & Dynamic Hover Magnifier */}
          <div className="lg:col-span-6 space-y-6">
            <div
              className="relative w-full h-[450px] sm:h-[580px] rounded-[2.5rem] overflow-hidden bg-[#E9E1D3] border-4 border-[#F8F5EE] shadow-2xl cursor-crosshair group select-none"
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
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              {product.badge && (
                <div className="absolute top-5 left-5 bg-[#332C26]/90 text-[#F8F5EE] text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full font-semibold pointer-events-none">
                  {product.badge}
                </div>
              )}

              {/* Hover Indicator / Magnifier Badge */}
              <div className={`absolute bottom-5 left-5 bg-[#F8F5EE]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-semibold text-[#332C26] flex items-center gap-1.5 shadow-sm pointer-events-none transition-opacity duration-200 ${isHovering ? 'opacity-0' : 'opacity-100'}`}>
                <ZoomIn className="w-3.5 h-3.5 text-[#B89A52]" />
                <span>Hover over image to inspect weave</span>
              </div>

              {isHovering && (
                <div className="absolute top-5 right-5 bg-[#332C26]/90 backdrop-blur-md text-[#F8F5EE] px-3.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-mono font-medium pointer-events-none shadow-md">
                  Weave Magnifier 2.3×
                </div>
              )}
            </div>

            {/* Sister Editions Swatch Bar */}
            {product.category === 'bedspread-sets' && (
              <div className="bg-[#E9E1D3]/50 p-4 rounded-2xl border border-[#DFD7C7]">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-[#6E6459] block mb-2.5">
                  Browse Sister Masterwork Editions (10 Designs):
                </span>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                  {bedspreadSets.map((bp) => (
                    <Link
                      key={bp.id}
                      href={`/product/${bp.id}`}
                      className={`relative w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                        bp.id === product.id
                          ? 'border-[#B89A52] ring-2 ring-[#B89A52]/40 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      title={bp.name}
                    >
                      <Image
                        src={bp.thumbnail || bp.image}
                        alt={bp.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Specification & Purchase Controls */}
          <div className="lg:col-span-6 space-y-7">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#B89A52] block">
                {product.categoryLabel}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#332C26] mt-1 font-normal leading-[1.1]">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-[#B89A52]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-current'
                          : 'stroke-current fill-none'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#332C26]">{product.rating}</span>
                <span className="text-xs text-[#6E6459]">({reviews.length} verified reviews)</span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-[#DFD7C7]">
              <span className="font-serif text-3xl sm:text-4xl font-medium text-[#332C26]">
                ₹{product.price}.00
              </span>
              {product.compareAtPrice && (
                <span className="text-base text-[#6E6459] line-through">
                  ₹{product.compareAtPrice}.00
                </span>
              )}
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Cash on Delivery Available
              </span>
            </div>

            {/* Set Package Pill */}
            <div className="p-4 bg-[#E9E1D3] rounded-2xl border border-[#DFD7C7] flex items-center gap-3 text-xs text-[#332C26]">
              <Check className="w-5 h-5 text-[#B89A52] flex-shrink-0" />
              <div>
                <span className="font-bold block">Package Guarantee:</span>
                <span className="text-[#6E6459]">{product.setContents} in {product.highlightedMaterial}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#6E6459] leading-relaxed font-light">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-2">
                  Select Dimension / Sizing:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz.id}
                      onClick={() => setSelectedSize(sz.name)}
                      className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                        selectedSize === sz.name
                          ? 'border-[#B89A52] bg-[#E9E1D3] text-[#332C26] ring-1 ring-[#B89A52]'
                          : 'border-[#DFD7C7] bg-[#F8F5EE] text-[#6E6459] hover:border-[#332C26]'
                      }`}
                    >
                      <span className="block text-xs font-semibold text-[#332C26]">{sz.name}</span>
                      <span className="block text-[10px] text-[#6E6459] mt-0.5">{sz.dimensions}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pincode Estimator */}
            <div className="bg-[#E9E1D3]/50 p-4 rounded-2xl border border-[#DFD7C7]">
              <span className="block text-xs uppercase tracking-wider font-semibold text-[#332C26] mb-2 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#B89A52]" />
                Check Pincode Delivery Availability
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 638009 or 600001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-xs text-[#332C26] outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#332C26] text-[#F8F5EE] text-xs px-4 py-2 rounded-xl font-semibold hover:bg-[#B89A52] transition flex-shrink-0 cursor-pointer"
                >
                  Verify
                </button>
              </form>
              {pincodeStatus && (
                <p className="text-xs mt-2 text-[#332C26] font-medium">
                  {pincodeStatus}
                </p>
              )}
            </div>

            {/* Quantity & CTAs */}
            <div className="space-y-4 pt-4 border-t border-[#DFD7C7]">
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#332C26]">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#DFD7C7] bg-[#E9E1D3] rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1 text-sm text-[#332C26] hover:bg-[#B89A52] hover:text-white transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-semibold text-[#332C26]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1 text-sm text-[#332C26] hover:bg-[#B89A52] hover:text-white transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product, selectedSize, quantity)}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full border border-[#332C26] text-[#332C26] hover:bg-[#332C26] hover:text-[#F8F5EE] text-xs uppercase tracking-widest font-semibold transition shadow-sm cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs uppercase tracking-widest font-semibold transition shadow-lg cursor-pointer"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#DFD7C7] text-center text-[11px] text-[#6E6459]">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-[#B89A52] mb-1" />
                <span>100% Combed Cotton</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-[#B89A52] mb-1" />
                <span>Free Delivery on 2+</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="w-4 h-4 text-[#B89A52] mb-1" />
                <span>Cash on Delivery</span>
              </div>
            </div>

          </div>

        </div>

        {/* Verified Reviews Section for this Product */}
        <div className="mt-16 pt-12 border-t border-[#DFD7C7]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#332C26]">
                Verified Patron Reviews ({reviews.length})
              </h2>
              <p className="text-xs text-[#6E6459] mt-1">
                Authentic testimonials from connoisseurs and interior designers across India.
              </p>
            </div>
            <button
              onClick={() => setIsWritingReview(!isWritingReview)}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-6 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs uppercase tracking-wider font-semibold transition cursor-pointer self-start sm:self-auto shadow-sm"
            >
              {isWritingReview ? 'Close Form' : '+ Write a Review'}
            </button>
          </div>

          {/* In-place Review Submission Form */}
          {isWritingReview && (
            <div className="mb-10 p-6 bg-[#E9E1D3]/70 rounded-2xl border border-[#B89A52]/40 max-w-2xl animate-in fade-in duration-200">
              <h3 className="font-serif text-base text-[#332C26] mb-3">Share Your Atelier Experience</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {user ? (
                  <div className="text-xs text-[#6E6459] flex items-center justify-between p-2.5 bg-[#F8F5EE]/60 rounded-xl">
                    <span>Reviewing as: <strong className="text-[#332C26]">{user.name}</strong></span>
                    <span className="text-[#B89A52] font-semibold text-[11px]">✓ Verified Patron Account</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#332C26] mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Rajesh Kumar"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          required
                          className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-xs text-[#332C26] outline-none font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#332C26] mb-1">
                          City / Region
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Erode, TN"
                          value={guestCity}
                          onChange={(e) => setGuestCity(e.target.value)}
                          required
                          className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-xs text-[#332C26] outline-none font-sans"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#6E6459]">
                      <span>Writing as a Guest Patron</span>
                      <button
                        type="button"
                        onClick={() => setAuthModalOpen(true)}
                        className="text-[#B89A52] underline hover:text-[#332C26] cursor-pointer"
                      >
                        Sign In to use your account profile
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#332C26]">Rating:</span>
                  <div className="flex gap-1 text-[#B89A52]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="cursor-pointer hover:scale-110 transition p-0.5"
                      >
                        <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'stroke-current fill-none'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#332C26] mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure five-star hotel luxury and soothing cooling comfort"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    required
                    className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-xs text-[#332C26] outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#332C26] mb-1">
                    Your Review
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the weave texture, cooling comfort, durability, and hand feel..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-xl p-3 text-xs text-[#332C26] outline-none font-sans resize-none"
                  />
                </div>

                {moderationError && (
                  <div className="p-3 bg-red-100 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{moderationError}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="py-3 px-6 bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] rounded-full text-xs uppercase tracking-wider font-semibold transition cursor-pointer shadow-md"
                  >
                    Publish Atelier Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWritingReview(false)}
                    className="py-3 px-5 border border-[#DFD7C7] text-[#6E6459] hover:text-[#332C26] rounded-full text-xs uppercase tracking-wider font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {reviewSubmitted && (
            <div className="mb-8 p-3.5 bg-emerald-100 text-emerald-800 text-xs rounded-xl font-medium max-w-2xl">
              ✓ Thank you! Your verified patron review has been published and added to this edition.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 bg-[#E9E1D3]/50 rounded-2xl border border-[#DFD7C7] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex text-[#B89A52]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#6E6459]">{rev.createdAt}</span>
                </div>
                <h3 className="font-serif text-sm font-semibold text-[#332C26]">{rev.title}</h3>
                <p className="text-xs text-[#6E6459] leading-relaxed font-light">{rev.comment}</p>
                <span className="block text-[11px] text-[#B89A52] pt-1">
                  ✓ Verified Connoisseur: {rev.userName} ({rev.userCity})
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
