'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, User as UserIcon, Menu, X, Search } from 'lucide-react';
import { useStore } from '@/lib/store';

export function Navbar() {
  const router = useRouter();
  const { itemCount, setCartOpen, user, setAuthModalOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  return (
    <>
      {/* Announcement Bar */}
      <aside className="bg-[#332C26] text-[#E9E1D3] text-[11px] uppercase tracking-[0.25em] py-2 px-4 text-center font-medium border-b border-[#B89A52]/20">
        <span>Atelier Handcrafted in Erode • Complimentary Delivery on Orders of 2+ Items</span>
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
          <nav className="hidden md:flex items-center space-x-9 text-xs font-medium uppercase tracking-[0.22em] text-[#6E6459]">
            <Link href="/shop" className="hover:text-[#332C26] hover:border-b-2 hover:border-[#B89A52] py-1 transition-colors">
              Collection
            </Link>
            <Link href="/#bespoke" className="hover:text-[#332C26] hover:border-b-2 hover:border-[#B89A52] py-1 transition-colors">
              Bespoke Atelier
            </Link>
            <Link href="/#heritage" className="hover:text-[#332C26] hover:border-b-2 hover:border-[#B89A52] py-1 transition-colors">
              Our Heritage
            </Link>
            <Link href="/#showroom" className="hover:text-[#332C26] hover:border-b-2 hover:border-[#B89A52] py-1 transition-colors">
              Showroom
            </Link>
          </nav>

          {/* Action Bar */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-[#332C26]">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search Collection"
              className="p-1.5 hover:text-[#B89A52] transition-colors"
            >
              <Search className="w-5 h-5 stroke-[1.7]" />
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping Bag (${itemCount} items)`}
              className="p-1.5 hover:text-[#B89A52] transition-colors relative flex items-center"
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
                className="flex items-center space-x-2 pl-2 border-l border-[#DFD7C7] hover:text-[#B89A52] transition group"
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
                className="flex items-center space-x-2 pl-2 border-l border-[#DFD7C7] hover:text-[#B89A52] transition"
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#332C26] hover:text-[#B89A52] transition"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="border-t border-[#DFD7C7] bg-[#E9E1D3]/80 py-3 px-4 sm:px-8">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-[#6E6459]" />
              <input
                type="text"
                placeholder="Search bedspread sets, cushions, thread counts, or fabrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-none outline-none text-sm text-[#332C26] placeholder-[#6E6459] font-sans"
              />
              <button
                type="submit"
                className="text-xs uppercase tracking-widest font-semibold text-[#B89A52] hover:text-[#332C26] px-3 py-1 bg-[#F8F5EE] rounded-full border border-[#DFD7C7] transition"
              >
                Find
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-[#6E6459] hover:text-[#332C26]"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F8F5EE] border-b border-[#DFD7C7] px-6 py-6 space-y-5 animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-4 text-sm font-medium uppercase tracking-[0.2em] text-[#332C26]">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#B89A52] transition"
              >
                Complete Collection
              </Link>
              <Link
                href="/#bespoke"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#B89A52] transition"
              >
                Bespoke Atelier Orders
              </Link>
              <Link
                href="/#heritage"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#B89A52] transition"
              >
                Our Heritage & Founder
              </Link>
              <Link
                href="/#showroom"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#B89A52] transition"
              >
                Atelier Showroom & Map
              </Link>
            </nav>

            <div className="pt-4 border-t border-[#DFD7C7] space-y-3">
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 rounded-full bg-[#E9E1D3] text-[#332C26] text-xs uppercase tracking-widest font-semibold border border-[#DFD7C7]"
                >
                  My Account ({user.name.split(' ')[0]})
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center py-2.5 rounded-full bg-[#332C26] text-[#F8F5EE] text-xs uppercase tracking-widest font-semibold hover:bg-[#B89A52] transition"
                >
                  Sign In / Create Account
                </button>
              )}
              <p className="text-[11px] text-center text-[#6E6459]">
                Call Atelier: <a href="tel:8778824123" className="text-[#B89A52] underline">8778824123</a> (Mon–Fri, 8 AM–8 PM)
              </p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
