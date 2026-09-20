import { CollectionGrid } from '@/components/collection-grid';
import { Sparkles, Shield } from 'lucide-react';

interface ShopPageProps {
  searchParams: Promise<{ q?: string; cat?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const initialCategory = (resolvedParams.cat as 'bedspread-sets' | 'curated-boxes' | 'cushions' | 'pillowcases') || 'all';

  return (
    <div className="bg-[#F8F5EE] min-h-screen">
      {/* Header Banner */}
      <section className="py-12 sm:py-16 bg-[#E9E1D3]/60 border-b border-[#DFD7C7] text-center px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#B89A52] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Erode Weaving Catalog</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#332C26] font-normal">
            The Bedding Collection
          </h1>

          <p className="text-xs sm:text-sm text-[#6E6459] max-w-xl mx-auto font-light leading-relaxed">
            Browse our 10 signature bedspread sets (each featuring a luxury bedspread with 2 matching pillow covers), curated subscription gift boxes, and hand-embroidered accent cushions.
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-2 text-xs text-[#332C26]">
            <span className="flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-[#B89A52]" />
              100% Combed Pure Cotton
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-[#B89A52]" />
              Complimentary Shipping on 2+ Items
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-[#B89A52]" />
              Cash on Delivery (COD) Available
            </span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <CollectionGrid
        initialCategory={initialCategory}
        searchQuery={resolvedParams.q}
        showFilters={true}
      />
    </div>
  );
}
