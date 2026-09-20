import { Hero } from '@/components/hero';
import { CollectionGrid } from '@/components/collection-grid';
import { BespokeSection } from '@/components/bespoke-section';
import { FounderSection } from '@/components/founder-section';
import { AtelierMap } from '@/components/atelier-map';
import { ReviewsSection } from '@/components/reviews-section';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Feather, Hotel } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section (Framed with design1.png per reference) */}
      <Hero />

      {/* 2. Brand Value Pillars Bar */}
      <section className="bg-[#E9E1D3] py-8 border-b border-[#DFD7C7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <Hotel className="w-5 h-5 text-[#B89A52] mx-auto" />
              <h3 className="font-serif text-sm font-semibold text-[#332C26]">Boutique Hotel Quality</h3>
              <p className="text-[11px] text-[#6E6459]">Serene comfort engineered for homes</p>
            </div>
            <div className="space-y-1">
              <Feather className="w-5 h-5 text-[#B89A52] mx-auto" />
              <h3 className="font-serif text-sm font-semibold text-[#332C26]">100% Combed Cotton</h3>
              <p className="text-[11px] text-[#6E6459]">Eliminated impurities & zero pilling</p>
            </div>
            <div className="space-y-1">
              <Sparkles className="w-5 h-5 text-[#B89A52] mx-auto" />
              <h3 className="font-serif text-sm font-semibold text-[#332C26]">Matching Pillow Suites</h3>
              <p className="text-[11px] text-[#6E6459]">Complete sets with matching shams</p>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-5 h-5 text-[#B89A52] mx-auto" />
              <h3 className="font-serif text-sm font-semibold text-[#332C26]">Cash on Delivery</h3>
              <p className="text-[11px] text-[#6E6459]">Doorstep payment across India</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Collection Grid */}
      <CollectionGrid limit={6} />

      {/* Banner linking to Full Shop */}
      <div className="bg-[#F8F5EE] py-6 text-center border-b border-[#DFD7C7]">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#332C26] hover:text-[#B89A52] transition underline underline-offset-8"
        >
          <span>View All 10 Bedspread & Pillow Masterworks in Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4. Bespoke Custom Orders Atelier */}
      <BespokeSection />

      {/* 5. Meet Our Founder & Erode Heritage */}
      <FounderSection />

      {/* 6. Atelier Showroom & Location Map */}
      <AtelierMap />

      {/* 7. Patron Reviews & Testimonials */}
      <ReviewsSection />
    </>
  );
}
