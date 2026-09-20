'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, User as UserIcon, Menu, X, Search, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PRODUCTS } from '@/lib/catalog';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, setCartOpen, user, setAuthModalOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Track active section on homepage based on scroll position
  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sections = ['bespoke', 'heritage', 'showroom'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Active status helpers
  const isCollectionActive = pathname === '/shop' || pathname.startsWith('/product');
  const isBespokeActive = pathname === '/' && activeSection === 'bespoke';
  const isHeritageActive = pathname === '/' && activeSection === 'heritage';
  const isShowroomActive = pathname === '/' && activeSection === 'showroom';

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  // Close search on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSelectProduct = (productId: string) => {
    router.push(`/product/${productId}`);
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setSearchQuery('');
  };

  // Instant matching products for live dropdown
  const trimmedQuery = searchQuery.trim().toLowerCase();
  const matchingProducts = trimmedQuery.length > 0
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(trimmedQuery) ||
        p.categoryLabel.toLowerCase().includes(trimmedQuery) ||
        p.highlightedMaterial.toLowerCase().includes(trimmedQuery) ||
        p.weave.toLowerCase().includes(trimmedQuery) ||
        p.shortDescription.toLowerCase().includes(trimmedQuery)
      )
    : [];

  return (
    <>
      {/* Announcement Bar */}
      <aside className="bg-[#332C26] text-[#E9E1D3] text-[9.5px] sm:text-[11px] uppercase tracking-wider sm:tracking-[0.25em] py-1.5 sm:py-2 px-3 sm:px-4 text-center font-medium border-b border-[#B89A52]/20">
        <span className="sm:hidden">Handcrafted in Erode • Free Delivery on 2+</span>
        <span className="hidden sm:inline">Atelier Handcrafted in Erode • Complimentary Delivery on Orders of 2+ Items</span>
      </aside>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#F8F5EE]/95 backdrop-blur-md border-b border-[#DFD7C7] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group select-none">
            <div className="relative h-10 w-36 sm:h-12 sm:w-44">
              <Image
                src="/assets/brand/logo_gold_transparent.png"
                alt="ACR Cottons Logo"
                fill
                priority
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain object-left group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-9 text-xs font-medium uppercase tracking-[0.22em]">
            <Link
              href="/shop"
              className={`py-1 transition-all border-b-2 ${
                isCollectionActive
                  ? 'text-[#332C26] border-[#B89A52] font-semibold'
                  : 'text-[#6E6459] border-transparent hover:text-[#332C26] hover:border-[#B89A52]'
              }`}
            >
              Collection
            </Link>
            <Link
              href="/#bespoke"
              className={`py-1 transition-all border-b-2 ${
                isBespokeActive
                  ? 'text-[#332C26] border-[#B89A52] font-semibold'
                  : 'text-[#6E6459] border-transparent hover:text-[#332C26] hover:border-[#B89A52]'
              }`}
            >
              Bespoke Atelier
            </Link>
            <Link
              href="/#heritage"
              className={`py-1 transition-all border-b-2 ${
                isHeritageActive
                  ? 'text-[#332C26] border-[#B89A52] font-semibold'
                  : 'text-[#6E6459] border-transparent hover:text-[#332C26] hover:border-[#B89A52]'
              }`}
            >
              Our Heritage
            </Link>
            <Link
              href="/#showroom"
              className={`py-1 transition-all border-b-2 ${
                isShowroomActive
                  ? 'text-[#332C26] border-[#B89A52] font-semibold'
                  : 'text-[#6E6459] border-transparent hover:text-[#332C26] hover:border-[#B89A52]'
              }`}
            >
              Showroom
            </Link>
          </nav>

          {/* Action Bar */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-[#332C26]">
            {/* Search Trigger */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              aria-label="Search Collection"
              className={`p-1.5 transition-colors cursor-pointer rounded-full ${
                searchOpen ? 'text-[#B89A52] bg-[#E9E1D3]' : 'hover:text-[#B89A52]'
              }`}
            >
              <Search className="w-5 h-5 stroke-[1.7]" />
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping Bag (${itemCount} items)`}
              className="p-1.5 hover:text-[#B89A52] transition-colors relative flex items-center cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.7]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-4.5 h-4.5 px-1 bg-[#B89A52] text-[#F8F5EE] text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Profile / Auth Trigger */}
            {user ? (
              <Link
                href="/profile"
                className="flex items-center space-x-2 pl-2 border-l border-[#DFD7C7] hover:text-[#B89A52] transition group cursor-pointer"
                aria-label="View User Profile"
              >
                <div className="w-7 h-7 rounded-full bg-[#E9E1D3] border border-[#B89A52] text-[#332C26] flex items-center justify-center text-xs font-semibold uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden lg:inline text-xs uppercase tracking-wider font-medium text-[#332C26] group-hover:text-[#B89A52]">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center space-x-2 pl-2 border-l border-[#DFD7C7] hover:text-[#B89A52] transition cursor-pointer"
                aria-label="Sign In"
              >
                <UserIcon className="w-5 h-5 stroke-[1.7]" />
                <span className="hidden lg:inline text-xs uppercase tracking-wider font-semibold">
                  Sign In
                </span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (searchOpen) setSearchOpen(false);
              }}
              className="md:hidden p-1.5 text-[#332C26] hover:text-[#B89A52] transition cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar with Live Instant Results */}
        {searchOpen && (
          <div className="border-t border-[#DFD7C7] bg-[#F8F5EE]/98 shadow-xl py-3.5 px-4 sm:px-8 animate-in slide-in-from-top-1 duration-200">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 sm:gap-3 bg-[#E9E1D3]/80 rounded-full px-3.5 sm:px-4 py-2 border border-[#DFD7C7] focus-within:border-[#B89A52] transition-colors">
                <Search className="w-4 h-4 text-[#B89A52] flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search bedspreads, cotton weave, jacquard, cushions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#332C26] placeholder-[#6E6459] font-sans"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[#6E6459] hover:text-[#332C26] p-1 cursor-pointer"
                    aria-label="Clear Search Input"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-[#F8F5EE] bg-[#B89A52] hover:bg-[#977d3f] px-3.5 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap shadow-xs"
                >
                  Find
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-[11px] sm:text-xs text-[#6E6459] hover:text-[#332C26] px-1 cursor-pointer"
                >
                  Cancel
                </button>
              </form>

              {/* Live Instant Results Dropdown */}
              {trimmedQuery.length > 0 && (
                <div className="mt-3 bg-[#F8F5EE] border border-[#DFD7C7] rounded-2xl p-3 sm:p-4 shadow-xl space-y-2.5 max-h-[380px] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DFD7C7] text-[10px] sm:text-[11px] uppercase tracking-wider text-[#6E6459]">
                    <span>Suggested Editions ({matchingProducts.length})</span>
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="text-[#B89A52] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                    >
                      <span>View in catalog</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {matchingProducts.length > 0 ? (
                    <div className="divide-y divide-[#DFD7C7]/60">
                      {matchingProducts.slice(0, 5).map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod.id)}
                          className="flex items-center gap-3 py-2 sm:py-2.5 px-2 hover:bg-[#E9E1D3]/50 rounded-xl cursor-pointer transition group"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#E9E1D3] flex-shrink-0 border border-[#DFD7C7]">
                            <Image
                              src={prod.image}
                              alt={prod.name}
                              fill
                              sizes="48px"
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-medium text-[#332C26] group-hover:text-[#B89A52] truncate transition-colors">
                              {prod.name}
                            </h4>
                            <p className="text-[10px] text-[#6E6459] truncate">
                              {prod.highlightedMaterial}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs sm:text-sm font-semibold text-[#332C26] block">
                              ₹{prod.price}.00
                            </span>
                            <span className="text-[9px] text-[#B89A52] uppercase tracking-wider block">
                              In Stock
                            </span>
                          </div>
                        </div>
                      ))}

                      {matchingProducts.length > 5 && (
                        <div className="pt-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleSearchSubmit()}
                            className="text-xs text-[#B89A52] hover:underline font-semibold cursor-pointer py-1"
                          >
                            + {matchingProducts.length - 5} more masterworks match &ldquo;{trimmedQuery}&rdquo;. View all &rarr;
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-[#6E6459]">
                      <p className="font-medium text-[#332C26] mb-1">No matching editions found</p>
                      <p className="text-[11px]">
                        Try searching for &ldquo;damask&rdquo;, &ldquo;indigo&rdquo;, &ldquo;cotton&rdquo;, &ldquo;jacquard&rdquo;, or &ldquo;cushion&rdquo;.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F8F5EE] border-b border-[#DFD7C7] px-6 py-6 space-y-5 animate-in slide-in-from-top-2">
            
            {/* Mobile In-Drawer Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-[#E9E1D3] rounded-full px-3.5 py-2 border border-[#DFD7C7]">
              <Search className="w-4 h-4 text-[#B89A52] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search bedspread sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xs text-[#332C26] placeholder-[#6E6459]"
              />
              <button
                type="submit"
                className="text-[10px] uppercase tracking-wider font-semibold text-[#F8F5EE] bg-[#B89A52] px-3 py-1 rounded-full cursor-pointer"
              >
                Go
              </button>
            </form>

            <nav className="flex flex-col space-y-4 text-sm font-medium uppercase tracking-[0.2em]">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1 transition ${
                  isCollectionActive
                    ? 'text-[#B89A52] font-semibold border-l-2 border-[#B89A52] pl-2.5'
                    : 'text-[#332C26] hover:text-[#B89A52]'
                }`}
              >
                Complete Collection
              </Link>
              <Link
                href="/#bespoke"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1 transition ${
                  isBespokeActive
                    ? 'text-[#B89A52] font-semibold border-l-2 border-[#B89A52] pl-2.5'
                    : 'text-[#332C26] hover:text-[#B89A52]'
                }`}
              >
                Bespoke Atelier Orders
              </Link>
              <Link
                href="/#heritage"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1 transition ${
                  isHeritageActive
                    ? 'text-[#B89A52] font-semibold border-l-2 border-[#B89A52] pl-2.5'
                    : 'text-[#332C26] hover:text-[#B89A52]'
                }`}
              >
                Our Heritage & Founder
              </Link>
              <Link
                href="/#showroom"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1 transition ${
                  isShowroomActive
                    ? 'text-[#B89A52] font-semibold border-l-2 border-[#B89A52] pl-2.5'
                    : 'text-[#332C26] hover:text-[#B89A52]'
                }`}
              >
                Atelier Showroom & Map
              </Link>
            </nav>

            <div className="pt-4 border-t border-[#DFD7C7] space-y-3">
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 rounded-full bg-[#E9E1D3] text-[#332C26] text-xs uppercase tracking-widest font-semibold border border-[#DFD7C7] cursor-pointer"
                >
                  My Account ({user.name.split(' ')[0]})
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center py-2.5 rounded-full bg-[#332C26] text-[#F8F5EE] text-xs uppercase tracking-widest font-semibold hover:bg-[#B89A52] transition cursor-pointer"
                >
                  Sign In / Create Account
                </button>
              )}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="tel:8778824123"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#E9E1D3] text-[#332C26] text-[11px] font-semibold border border-[#DFD7C7] hover:border-[#B89A52] transition"
                >
                  <Phone className="w-3.5 h-3.5 text-[#B89A52]" />
                  <span>Call Atelier</span>
                </a>
                <a
                  href="https://wa.me/918778824123?text=Hello%20ACR%20Cottons!%20I%20am%20browsing%20your%20collection%20and%20would%20like%20assistance."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#25D366] text-white text-[11px] font-semibold transition shadow-xs hover:bg-[#20ba59]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
              <p className="text-[10px] text-center text-[#6E6459]">
                Mon–Fri, 8:00 AM – 8:00 PM IST • Erode Weaving Desk
              </p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

