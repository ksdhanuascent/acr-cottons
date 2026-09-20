'use client';

import React, { useState } from 'react';
import { X, MapPin, CheckCircle2, ShieldCheck, Printer, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Address, Order } from '@/lib/types';

export function CheckoutModal() {
  const {
    isCheckoutModalOpen,
    setCheckoutModalOpen,
    user,
    cart,
    subtotal,
    shippingFee,
    grandTotal,
    placeOrder,
  } = useStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [newAddressMode, setNewAddressMode] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    name: user?.name || '',
    street: '',
    city: 'Erode',
    state: 'Tamil Nadu',
    pincode: '638009',
    phone: user?.phone || '',
    isDefault: false,
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutModalOpen) return null;

  // Active address
  const activeAddress =
    user?.addresses.find((a) => a.id === selectedAddressId) ||
    user?.addresses.find((a) => a.isDefault) ||
    user?.addresses[0];

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    let shippingAddr: Address;
    if (newAddressMode || !activeAddress) {
      if (!newAddress.street || !newAddress.pincode) {
        alert('Please fill out the delivery street and pincode.');
        return;
      }
      shippingAddr = {
        ...newAddress,
        id: `addr-${Date.now()}`,
      };
    } else {
      shippingAddr = activeAddress;
    }

    const order = placeOrder(shippingAddr, 'COD', orderNotes);
    setConfirmedOrder(order);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    setCheckoutModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#332C26]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div
        className="relative w-full max-w-3xl bg-[#F8F5EE] rounded-[2rem] shadow-2xl border border-[#DFD7C7] p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#6E6459] hover:text-[#332C26] hover:bg-[#E9E1D3] transition cursor-pointer"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedOrder ? (
          /* Order Confirmation View */
          <div className="text-center py-6 sm:py-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9 text-[#B89A52]" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#B89A52]">
                Order Confirmed
              </span>
              <h2 className="font-serif text-3xl text-[#332C26] mt-1 font-normal">
                Thank You, {confirmedOrder.userName}
              </h2>
              <p className="text-xs text-[#6E6459] mt-1">
                Your order <span className="font-mono font-bold text-[#332C26]">{confirmedOrder.orderNumber}</span> has been dispatched to our Erode weaving atelier.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-[#E9E1D3]/60 rounded-2xl p-6 text-left border border-[#DFD7C7] space-y-4 max-w-xl mx-auto text-xs">
              <div className="flex justify-between pb-3 border-b border-[#DFD7C7]">
                <span className="text-[#6E6459]">Delivery Address:</span>
                <span className="text-[#332C26] font-medium text-right">
                  {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city} - {confirmedOrder.shippingAddress.pincode}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-[#DFD7C7]">
                <span className="text-[#6E6459]">Payment Method:</span>
                <span className="text-[#332C26] font-semibold">
                  Cash on Delivery (Pay upon arrival)
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-[#DFD7C7]">
                <span className="text-[#6E6459]">Estimated Delivery:</span>
                <span className="text-emerald-800 font-semibold">
                  2 – 4 Business Days (Express Courier)
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#332C26] pt-1">
                <span>Total Amount to Pay:</span>
                <span className="font-serif text-base text-[#332C26]">₹{confirmedOrder.total}.00</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 py-3 px-6 rounded-full border border-[#332C26] text-[#332C26] hover:bg-[#E9E1D3] text-xs uppercase tracking-widest font-semibold transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice Summary</span>
              </button>
              <button
                onClick={handleClose}
                className="inline-flex items-center gap-2 py-3 px-8 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs uppercase tracking-widest font-semibold transition shadow-md cursor-pointer"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <div>
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#B89A52]">
                Patron Checkout
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#332C26] mt-0.5 font-normal">
                Finalize Delivery & Payment
              </h2>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-6">
              
              {/* Shipping Address Selection */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B89A52]" />
                    Delivery Destination
                  </label>
                  {user?.addresses && user.addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setNewAddressMode(!newAddressMode)}
                      className="text-[11px] text-[#B89A52] hover:underline font-medium cursor-pointer"
                    >
                      {newAddressMode ? 'Use Saved Address' : '+ Add Different Address'}
                    </button>
                  )}
                </div>

                {!newAddressMode && user?.addresses && user.addresses.length > 0 ? (
                  <div className="space-y-2">
                    {user.addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition cursor-pointer ${
                          (selectedAddressId ? selectedAddressId === addr.id : addr.isDefault)
                            ? 'border-[#B89A52] bg-[#E9E1D3]/80'
                            : 'border-[#DFD7C7] bg-[#F8F5EE] hover:border-[#332C26]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={
                            selectedAddressId
                              ? selectedAddressId === addr.id
                              : addr.isDefault
                          }
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-0.5 accent-[#B89A52]"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-[#332C26] block">
                            {addr.name} ({addr.phone})
                          </span>
                          <span className="text-[#6E6459] block mt-0.5">
                            {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  /* New Address Form */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#E9E1D3]/40 rounded-2xl border border-[#DFD7C7]">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="Street Address, Building, Landmark"
                        value={newAddress.street}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, street: e.target.value })
                        }
                        className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-xs text-[#332C26] outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-xs text-[#332C26] outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="Pincode (6 digits)"
                        value={newAddress.pincode}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, pincode: e.target.value })
                        }
                        className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-xs text-[#332C26] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-2.5">
                  Payment Method
                </label>
                <div className="space-y-2.5">
                  {/* Cash on Delivery (Active) */}
                  <label className="flex items-start gap-3 p-4 rounded-xl border border-[#B89A52] bg-[#E9E1D3]/80 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={true}
                      readOnly
                      className="mt-0.5 accent-[#B89A52]"
                    />
                    <div className="text-xs flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#332C26]">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Active & Verified
                        </span>
                      </div>
                      <p className="text-[#6E6459] mt-0.5">
                        Pay cash or scan UPI QR directly to the delivery personnel upon doorstep inspection.
                      </p>
                    </div>
                  </label>

                  {/* Razorpay (Under Setup / Coming Soon) */}
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-[#DFD7C7] bg-[#E9E1D3]/20 opacity-60">
                    <input type="radio" disabled className="mt-0.5" />
                    <div className="text-xs flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#6E6459]">
                          Online Card / NetBanking (Razorpay)
                        </span>
                        <span className="text-[10px] uppercase font-medium text-[#6E6459] bg-[#DFD7C7] px-2 py-0.5 rounded-full">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-[#6E6459] mt-0.5">
                        Online payment gateway will activate immediately once production merchant keys are connected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                  Atelier Notes or Packaging Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leave with security, or include housewarming gift tag"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-[#E9E1D3]/40 border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-xs text-[#332C26] outline-none"
                />
              </div>

              {/* Financial Breakdown & Confirmation Button */}
              <div className="pt-4 border-t border-[#DFD7C7] space-y-4">
                <div className="bg-[#E9E1D3]/60 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex justify-between text-[#6E6459]">
                    <span>Items ({cart.length})</span>
                    <span>₹{subtotal}.00</span>
                  </div>
                  <div className="flex justify-between text-[#6E6459]">
                    <span>Express Delivery</span>
                    <span className={shippingFee === 0 ? 'text-emerald-800 font-semibold' : ''}>
                      {shippingFee === 0 ? 'COMPLIMENTARY' : `₹${shippingFee}.00`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-[#332C26] pt-2 border-t border-[#DFD7C7]">
                    <span>Total Payable on Delivery:</span>
                    <span className="font-serif text-lg text-[#332C26]">₹{grandTotal}.00</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs uppercase tracking-widest font-semibold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Order (Pay on Delivery)</span>
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}
