'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User as UserIcon, MapPin, Package, Clock, LogOut, Trash2, Plus, Check, ShieldAlert, ArrowLeft, Printer } from 'lucide-react';
import { useStore } from '@/lib/store';

function ProfileContent() {
  const {
    user,
    orders,
    customOrders,
    updateProfile,
    addAddress,
    removeAddress,
    logout,
    deleteAccount,
    setAuthModalOpen,
  } = useStore();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // New address state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Erode');
  const [newState, setNewState] = useState('Tamil Nadu');
  const [newPincode, setNewPincode] = useState('638009');
  const [newPhone, setNewPhone] = useState(user?.phone || '8778824123');

  // Delete account confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#F8F5EE] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-[#E9E1D3]/50 p-8 rounded-3xl border border-[#DFD7C7]">
          <div className="w-16 h-16 rounded-full bg-[#B89A52] text-[#F8F5EE] flex items-center justify-center mx-auto shadow-md font-serif text-xl font-bold">
            ACR
          </div>
          <h2 className="font-serif text-2xl text-[#332C26]">Patron Sign In Required</h2>
          <p className="text-xs text-[#6E6459] leading-relaxed">
            Please sign in to view your profile, manage saved delivery addresses, and inspect your weaving order history.
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-3.5 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs uppercase tracking-widest font-semibold transition shadow-md cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, phone);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newPincode) return;
    addAddress({
      name,
      street: newStreet,
      city: newCity,
      state: newState,
      pincode: newPincode,
      phone: newPhone,
      isDefault: user.addresses.length === 0,
    });
    setIsAddingAddress(false);
    setNewStreet('');
  };

  return (
    <div className="bg-[#F8F5EE] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10">
        
        {/* Back Link & Title */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-[#DFD7C7]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#6E6459] hover:text-[#332C26] transition mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Atelier</span>
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#332C26] font-normal">
              Patron Profile Hub
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-full border border-[#DFD7C7] bg-[#E9E1D3] text-[#332C26] hover:bg-[#332C26] hover:text-[#F8F5EE] text-xs uppercase tracking-wider font-semibold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-full border border-red-200 bg-red-50 text-red-800 hover:bg-red-800 hover:text-white text-xs uppercase tracking-wider font-semibold transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 bg-[#332C26]/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#F8F5EE] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#DFD7C7] shadow-2xl text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-red-700 mx-auto" />
              <h3 className="font-serif text-2xl text-[#332C26]">Delete Patron Account?</h3>
              <p className="text-xs text-[#6E6459] leading-relaxed">
                This action is permanent. All your saved addresses, cart selections, bespoke requests, and order logs will be permanently deleted from this device.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-1/2 py-3 rounded-full border border-[#DFD7C7] text-xs uppercase tracking-wider font-semibold hover:bg-[#E9E1D3] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteAccount();
                    setShowDeleteConfirm(false);
                  }}
                  className="w-1/2 py-3 rounded-full bg-red-700 hover:bg-red-800 text-white text-xs uppercase tracking-wider font-semibold shadow-md cursor-pointer"
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile & Addresses */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Personal Details Form */}
            <div className="bg-[#E9E1D3]/50 rounded-3xl p-6 border border-[#DFD7C7] shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DFD7C7]">
                <h3 className="font-serif text-lg text-[#332C26] flex items-center gap-2 font-medium">
                  <UserIcon className="w-4 h-4 text-[#B89A52]" />
                  <span>Personal Details</span>
                </h3>
                {profileSaved && (
                  <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-[#332C26] outline-none focus:border-[#B89A52]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                    Email Address (Authenticated)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-[#E9E1D3]/80 border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-[#6E6459] outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                    Contact Phone (For COD & Delivery)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F8F5EE] border border-[#DFD7C7] rounded-xl px-3.5 py-2 text-[#332C26] outline-none focus:border-[#B89A52]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#332C26] text-[#F8F5EE] hover:bg-[#B89A52] text-xs uppercase tracking-wider font-semibold transition cursor-pointer shadow-sm"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>

            {/* Saved Delivery Addresses */}
            <div className="bg-[#E9E1D3]/50 rounded-3xl p-6 border border-[#DFD7C7] shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DFD7C7]">
                <h3 className="font-serif text-lg text-[#332C26] flex items-center gap-2 font-medium">
                  <MapPin className="w-4 h-4 text-[#B89A52]" />
                  <span>Saved Addresses ({user.addresses.length})</span>
                </h3>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="text-xs text-[#B89A52] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingAddress ? 'Cancel' : 'Add New'}</span>
                </button>
              </div>

              {/* Add New Address Form */}
              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="mb-4 p-4 bg-[#F8F5EE] rounded-2xl border border-[#DFD7C7] space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[#332C26] block mb-1">
                      Street Address & Landmark
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2, Sathya Moorthy Street, Surampatti Valasu"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl px-3 py-1.5 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl px-3 py-1.5 outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="Pincode"
                        value={newPincode}
                        onChange={(e) => setNewPincode(e.target.value)}
                        className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl px-3 py-1.5 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="State"
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl px-3 py-1.5 outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="w-full bg-[#E9E1D3]/50 border border-[#DFD7C7] rounded-xl px-3 py-1.5 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-[#B89A52] text-[#F8F5EE] text-xs uppercase font-semibold tracking-wider cursor-pointer"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {/* Address Cards */}
              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 bg-[#F8F5EE] rounded-2xl border border-[#DFD7C7] flex justify-between items-start text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#332C26]">{addr.name}</span>
                        {addr.isDefault && (
                          <span className="text-[9px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[#6E6459] leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-[11px] text-[#6E6459]">Phone: {addr.phone}</p>
                    </div>

                    <button
                      onClick={() => removeAddress(addr.id)}
                      className="text-[#6E6459] hover:text-red-700 p-1 transition cursor-pointer"
                      title="Remove Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Order History & Bespoke Requests */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Orders */}
            <div className="bg-[#E9E1D3]/50 rounded-3xl p-6 border border-[#DFD7C7] shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DFD7C7]">
                <h3 className="font-serif text-lg text-[#332C26] flex items-center gap-2 font-medium">
                  <Package className="w-4 h-4 text-[#B89A52]" />
                  <span>Weaving Orders ({orders.length})</span>
                </h3>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#6E6459] space-y-2">
                  <p>You have not placed any orders yet.</p>
                  <Link
                    href="/shop"
                    className="inline-block text-[#B89A52] underline font-semibold mt-1"
                  >
                    Explore Bedspread Sets
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 bg-[#F8F5EE] rounded-2xl border border-[#DFD7C7] space-y-3 text-xs"
                    >
                      <div className="flex justify-between items-start pb-2 border-b border-[#DFD7C7]/70">
                        <div>
                          <span className="font-mono font-bold text-sm text-[#332C26] block">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[10px] text-[#6E6459]">
                            {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-[#332C26]">
                            <span>
                              {item.quantity}× {item.product.name} ({item.selectedSize})
                            </span>
                            <span className="font-serif font-medium">
                              ₹{item.product.price * item.quantity}.00
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#DFD7C7]/70 flex justify-between items-center text-xs">
                        <span className="font-semibold text-[#332C26]">
                          Total (Cash on Delivery): ₹{ord.total}.00
                        </span>
                        <button
                          onClick={() => window.print()}
                          className="text-[11px] text-[#B89A52] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Orders / Bespoke Commissions */}
            <div className="bg-[#E9E1D3]/50 rounded-3xl p-6 border border-[#DFD7C7] shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#DFD7C7]">
                <h3 className="font-serif text-lg text-[#332C26] flex items-center gap-2 font-medium">
                  <Clock className="w-4 h-4 text-[#B89A52]" />
                  <span>Bespoke Loom Inquiries ({customOrders.length})</span>
                </h3>
              </div>

              {customOrders.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#6E6459] space-y-2">
                  <p>No custom commissions submitted yet.</p>
                  <a
                    href="#bespoke"
                    className="inline-block text-[#B89A52] underline font-semibold mt-1"
                  >
                    Submit Custom Bedding Request
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {customOrders.map((co) => (
                    <div
                      key={co.id}
                      className="p-4 bg-[#F8F5EE] rounded-2xl border border-[#DFD7C7] text-xs space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[#332C26]">{co.fabric}</span>
                        <span className="text-[9px] uppercase font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                          {co.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6E6459]">
                        Dimensions: {co.dimensions} • Quantity: {co.quantity} suite(s)
                      </p>
                      {co.notes && (
                        <p className="text-[11px] italic text-[#6E6459]">
                          “{co.notes}”
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function ProfilePage() {
  return <ProfileContent />;
}
