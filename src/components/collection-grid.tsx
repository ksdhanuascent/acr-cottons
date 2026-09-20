'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, Eye, ShoppingBag, ChevronDown } from 'lucide-react';
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
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#B89A52] font-semibold mb-2">
              <span>Textile Masterworks</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#332C26] font-normal">
              The Bedding Collection
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6459] max-w-lg mt-2 font-light">
              Every set contains an authentic combed cotton bedspread alongside matching tailored pillow covers, woven with meticulous precision in Erode.
            </p>
          </div>

          {/* Sort Controller */}
          {showFilters && (
            <div className="flex items-center space-x-3 text-xs text-[#6E6459]">
              <span className="uppercase tracking-widest text-[10px]">Sort by:</span>
              <div className="relative inline-flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="appearance-none bg-[#E9E1D3] border border-[#DFD7C7] text-[#332C26] text-xs rounded-full pl-4 pr-9 py-2 outline-none cursor-pointer hover:border-[#B89A52] focus:border-[#B89A52] transition shadow-xs font-medium"
                >
                  <option value="featured">Featured Editions</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#6E6459] absolute right-3 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Category Pill Tabs */}
        {showFilters && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs uppercase tracking-widest px-5 py-2.5 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
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

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={() => setQuickViewProduct(product)}
              onAddToCart={() => addToCart(product, product.sizes[0]?.name || 'Standard', 1)}
            />
          ))}
        </div>

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

  return (
    <article
      className="group flex flex-col bg-[#E9E1D3]/40 rounded-3xl p-3.5 sm:p-4 border border-[#DFD7C7] hover:border-[#B89A52]/60 hover:shadow-xl transition-all duration-300 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Plate Frame */}
      <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden bg-[#E9E1D3] mb-4 select-none cursor-pointer"
        onClick={onQuickView}
      >
        <Image
          src={product.thumbnail || product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3.5 left-3.5 bg-[#F8F5EE]/90 backdrop-blur-sm text-[#332C26] text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full border border-[#DFD7C7] shadow-xs">
            {product.badge}
          </span>
        )}

        {/* Set Contents Pill */}
        <span className="absolute bottom-3.5 left-3.5 right-3.5 bg-[#332C26]/85 backdrop-blur-md text-[#E9E1D3] text-[10px] text-center font-medium tracking-wider uppercase py-1 px-2 rounded-lg truncate">
          {product.setContents}
        </span>

        {/* Quick View Hover Button */}
        <div
          className={`absolute inset-0 bg-[#332C26]/20 backdrop-blur-[2px] flex items-center justify-center gap-3 transition-opacity duration-300 ${
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
      <div className="flex flex-col flex-grow justify-between px-1">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex text-[#B89A52]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-[#332C26]">{product.rating}</span>
            <span className="text-[11px] text-[#6E6459]">({product.reviewCount} reviews)</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={onQuickView}
            className="font-serif text-lg font-medium text-[#332C26] group-hover:text-[#B89A52] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Material Specs */}
          <p className="text-xs text-[#6E6459] mt-1 font-light line-clamp-1">
            {product.highlightedMaterial}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#DFD7C7]/70">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-medium text-[#332C26]">
              ₹{product.price}.00
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-[#6E6459] line-through">
                ₹{product.compareAtPrice}.00
              </span>
            )}
          </div>

          <button
            onClick={onAddToCart}
            className="inline-flex items-center gap-1.5 bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </article>
  );
}
