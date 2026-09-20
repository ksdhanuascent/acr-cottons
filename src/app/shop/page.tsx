import { ShopHeader } from '@/components/shop-header';
import { CollectionGrid } from '@/components/collection-grid';

interface ShopPageProps {
  searchParams: Promise<{ q?: string; cat?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const initialCategory = (resolvedParams.cat as 'bedspread-sets' | 'curated-boxes' | 'cushions' | 'pillowcases') || 'all';

  return (
    <div className="bg-[#F8F5EE] min-h-screen">
      {/* Editorial Landing Stage Header with Campaign Poster */}
      <ShopHeader />

      {/* Grid */}
      <CollectionGrid
        initialCategory={initialCategory}
        searchQuery={resolvedParams.q}
        showFilters={true}
      />
    </div>
  );
}
