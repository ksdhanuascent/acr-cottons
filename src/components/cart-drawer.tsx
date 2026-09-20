'use client';

import React from 'react';
import Image from 'next/image';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';

export function CartDrawer() {
  const {
    isCartOpen,
    setCartOpen,
    cart,
    itemCount,
    subtotal,
    shippingFee,
    grandTotal,
    isFreeShippingUnlocked,
    amountNeededForFreeShipping,
    updateQuantity,
    removeFromCart,
    user,
    setAuthModalOpen,
    setCheckoutModalOpen,
  } = useStore();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setCartOpen(false);
    if (!user) {
      setAuthModalOpen(true, 'checkout');
    } else {
      setCheckoutModalOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#332C26]/60 backdrop-blur-xs transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F5EE] border-l border-[#DFD7C7] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-[#DFD7C7] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#B89A52]" />
              <h2 className="font-serif text-lg font-medium text-[#332C26]">
                Your Selection ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 text-[#6E6459] hover:text-[#332C26] rounded-full hover:bg-[#E9E1D3] transition cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-[#E9E1D3]/80 px-6 py-3.5 border-b border-[#DFD7C7]">
            {isFreeShippingUnlocked ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <Sparkles className="w-4 h-4 text-[#B89A52]" />
                <span>Complimentary Delivery Unlocked (2+ Items)!</span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-[#332C26] font-medium mb-1.5">
                  Add <span className="font-bold text-[#B89A52]">1 more item</span> (or ₹{amountNeededForFreeShipping} more) for <span className="underline">Free Shipping</span>!
                </p>
                <div className="w-full h-1.5 bg-[#DFD7C7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B89A52] transition-all duration-300 rounded-full"
                    style={{
                      width: `${Math.min(100, (subtotal / 500) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E9E1D3] flex items-center justify-center mx-auto text-[#6E6459]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg text-[#332C26]">Your bag is empty</h3>
                <p className="text-xs text-[#6E6459] max-w-xs mx-auto">
                  Explore our luxury Erode cotton bedspread sets and boutique hotel bedding.
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="inline-block bg-[#332C26] text-[#F8F5EE] text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-full hover:bg-[#B89A52] transition shadow-md cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 bg-[#E9E1D3]/50 rounded-2xl border border-[#DFD7C7] relative group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#E9E1D3] flex-shrink-0 border border-[#DFD7C7]">
                    <Image
                      src={item.product.thumbnail || item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="font-serif text-sm font-medium text-[#332C26] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#6E6459] mt-0.5">
                        Size: <span className="font-medium text-[#332C26]">{item.selectedSize}</span>
                      </p>
                      <p className="text-xs font-serif font-medium text-[#332C26] mt-1">
                        ₹{item.product.price}.00
                      </p>
                    </div>

                    {/* Quantity Selector & Remove */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#DFD7C7] bg-[#F8F5EE] rounded-full overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-xs text-[#332C26] hover:bg-[#B89A52] hover:text-white transition cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-medium text-[#332C26]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-xs text-[#332C26] hover:bg-[#B89A52] hover:text-white transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#6E6459] hover:text-red-700 p-1 transition cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#DFD7C7] bg-[#F8F5EE] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#6E6459]">
                  <span>Subtotal</span>
                  <span className="font-serif font-medium text-[#332C26]">₹{subtotal}.00</span>
                </div>
                <div className="flex justify-between text-[#6E6459]">
                  <span>Delivery</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-800 font-semibold">FREE</span>
                    ) : (
                      `₹${shippingFee}.00`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#332C26] pt-2 border-t border-[#DFD7C7]">
                  <span>Total Due</span>
                  <span className="font-serif text-lg text-[#332C26]">₹{grandTotal}.00</span>
                </div>
              </div>

              {/* Checkout Trigger Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs uppercase tracking-widest font-semibold transition-all shadow-lg group cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#6E6459]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B89A52]" />
                <span>Cash on Delivery Verified • Free Return on Defect</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
