import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/catalog';
import { ProductClientView } from './product-client-view';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id || p.slug === id);

  if (!product) {
    notFound();
  }

  return <ProductClientView product={product} />;
}
