'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Eye, ShoppingBag, ChevronDown, Search, X } from 'lucide-react';
import { Product, ProductCategory } from '@/lib/types';
import { PRODUCTS } from '@/lib/catalog';
import { useStore } from '@/lib/store';

interface CollectionGridProps {
  initialCategory?: ProductCategory | 'all';
  searchQuery?: string;
  limit?: number;
  showFilters?: boolean;
}

export function CollectionGrid({
  initialCategory = 'all',
  searchQuery,
  limit,
  showFilters = true,
}: CollectionGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const { addToCart, setQuickViewProduct } = useStore();

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Collections' },
    { id: 'bedspread-sets', label: 'Bedspread & Pillow Sets' },
    { id: 'curated-boxes', label: 'Curated Gift Boxes' },
    { id: 'cushions', label: 'Accent Cushions' },
    { id: 'pillowcases', label: 'Pillowcases & Shams' },
  ];

  // Filter products
  let filtered = selectedCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.highlightedMaterial.toLowerCase().includes(q) ||
      p.weave.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q)
    );
  }

  // Sort products
  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  const displayedProducts = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section id="collection" className="py-16 sm:py-24 bg-[#F8F5EE] border-b border-[#DFD7C7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 sm:gap-6 mb-6 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#B89A52] font-semibold mb-1.5 sm:mb-2">
              <span>Textile Masterworks</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#332C26] font-normal">
              The Bedding Collection
            </h2>
            <p className="text-[11px] sm:text-sm text-[#6E6459] max-w-lg mt-1 sm:mt-2 font-light">
              Every set contains an authentic combed cotton bedspread alongside matching tailored pillow covers, woven with meticulous precision in Erode.
            </p>
          </div>

          {/* Sort Controller */}
          {showFilters && (
            <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-[#6E6459]">
              <span className="uppercase tracking-widest text-[9px] sm:text-[10px]">Sort by:</span>
              <div className="relative inline-flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="appearance-none bg-[#E9E1D3] border border-[#DFD7C7] text-[#332C26] text-[11px] sm:text-xs rounded-full pl-3 pr-8 sm:pl-4 sm:pr-9 py-1.5 sm:py-2 outline-none cursor-pointer hover:border-[#B89A52] focus:border-[#B89A52] transition shadow-xs font-medium"
                >
                  <option value="featured">Featured Editions</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6E6459] absolute right-2.5 sm:right-3 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Category Pill Tabs */}
        {showFilters && (
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-4 mb-6 sm:mb-10 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#332C26] text-[#F8F5EE] shadow-sm'
                    : 'bg-[#E9E1D3]/80 text-[#6E6459] hover:text-[#332C26] hover:bg-[#E9E1D3]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Active Search Query Pill */}
        {searchQuery && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-[#E9E1D3]/70 border border-[#DFD7C7] rounded-xl sm:rounded-2xl px-4 py-3 text-xs text-[#332C26]">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#B89A52] flex-shrink-0" />
              <span>
                Showing {displayedProducts.length} {displayedProducts.length === 1 ? 'masterwork' : 'masterworks'} matching <strong className="text-[#332C26] font-semibold">&ldquo;{searchQuery}&rdquo;</strong>
              </span>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#B89A52] hover:text-[#332C26] transition underline underline-offset-4 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </Link>
          </div>
        )}

        {/* Product Cards Grid or Empty State */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-16 sm:py-24 bg-[#E9E1D3]/30 rounded-3xl border border-dashed border-[#DFD7C7] p-8 max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#E9E1D3] border border-[#B89A52]/40 text-[#B89A52] flex items-center justify-center mx-auto shadow-xs">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#332C26]">
              No Masterworks Found
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6459] max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? `We couldn't find any products matching "${searchQuery}". Try exploring our pure combed cotton jacquards or reset your search.`
                : 'There are currently no items matching your criteria in this collection.'}
            </p>
            <div className="pt-2">
              {searchQuery ? (
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-[#332C26] text-[#F8F5EE] text-xs uppercase tracking-widest font-semibold hover:bg-[#B89A52] transition cursor-pointer shadow-sm"
                >
                  <span>Reset Search & View All</span>
                </Link>
              ) : (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full bg-[#332C26] text-[#F8F5EE] text-xs uppercase tracking-widest font-semibold hover:bg-[#B89A52] transition cursor-pointer shadow-sm"
                >
                  <span>View All Collections</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-8 lg:gap-10">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={() => setQuickViewProduct(product)}
                onAddToCart={() => addToCart(product, product.sizes[0]?.name || 'Standard', 1)}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

interface ProductCardProps {
  product: Product;
  onQuickView: () => void;
  onAddToCart: () => void;
}

export function ProductCard({ product, onQuickView, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { getProductReviews } = useStore();
  const reviews = getProductReviews(product.id);
  const reviewCount = reviews.length > 0 ? reviews.length : product.reviewCount;

  return (
    <article
      className="group flex flex-col bg-[#E9E1D3]/40 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-[#DFD7C7] hover:border-[#B89A52]/60 hover:shadow-xl transition-all duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Plate Frame */}
      <div
        className="relative w-full h-[180px] sm:h-[420px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#E9E1D3] mb-2.5 sm:mb-4 select-none cursor-pointer"
        onClick={onQuickView}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 bg-[#F8F5EE]/95 backdrop-blur-sm text-[#332C26] text-[8px] sm:text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#DFD7C7] shadow-xs">
            {product.badge}
          </span>
        )}

        {/* Set Contents Pill */}
        <span className="absolute bottom-2 left-1.5 right-1.5 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 bg-[#332C26]/85 backdrop-blur-md text-[#E9E1D3] text-[8px] sm:text-[10px] text-center font-medium tracking-wider uppercase py-0.5 px-1 sm:py-1 sm:px-2 rounded-md sm:rounded-lg truncate">
          {product.setContents}
        </span>

        {/* Quick View Hover Button (Desktop) */}
        <div
          className={`hidden sm:flex absolute inset-0 bg-[#332C26]/20 backdrop-blur-[2px] items-center justify-center gap-3 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView();
            }}
            className="p-3 rounded-full bg-[#F8F5EE] text-[#332C26] hover:bg-[#B89A52] hover:text-[#F8F5EE] shadow-lg transition-transform hover:scale-110"
            aria-label="Quick View Product"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Information Container */}
      <div className="flex flex-col flex-grow justify-between px-0.5 sm:px-1">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
            <div className="flex text-[#B89A52]">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-[#332C26]">{product.rating}</span>
            <span className="text-[9px] sm:text-[11px] text-[#6E6459]">({reviewCount})</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={onQuickView}
            className="font-serif text-xs sm:text-lg font-medium text-[#332C26] group-hover:text-[#B89A52] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Material Specs */}
          <p className="text-[9.5px] sm:text-xs text-[#6E6459] mt-0.5 sm:mt-1 font-light line-clamp-1">
            {product.highlightedMaterial}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-2 sm:pt-4 mt-2 sm:mt-3 border-t border-[#DFD7C7]/70">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="font-serif text-sm sm:text-xl font-medium text-[#332C26]">
              ₹{product.price}
            </span>
            {product.compareAtPrice && (
              <span className="text-[10px] sm:text-xs text-[#6E6459] line-through">
                ₹{product.compareAtPrice}
              </span>
            )}
          </div>

          <button
            onClick={onAddToCart}
            className="inline-flex items-center justify-center gap-1 bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-200 shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Add to Bag</span>
            <span className="sm:hidden text-[9.5px]">Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
