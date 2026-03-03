import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import ProductCard, { Product } from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

async function getProducts(): Promise<Product[]> {
  const { data, error, status, statusText } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) {
      console.error("Supabase Error Details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        status,
        statusText
      });
    }
    return [];
  }

  console.log(`Fetched ${data.length} products from Supabase. Status: ${status}`);

  return data as Product[];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden py-16 md:py-32">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 ring-1 ring-inset ring-red-600/10">
              <Star className="mr-1 h-3.5 w-3.5 fill-current" />
              <span>New Drop: Spring Collection 2026</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-black dark:text-white uppercase italic">
              Unleash the <span className="text-red-600">Fukrey</span> in You.
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium">
              Premium streetwear for the bold, the unconventional, and the ones who dare to stand out. Crafted with grit, designed for the streets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/shop"
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-black px-8 text-base font-bold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-xl shadow-black/10 dark:shadow-white/5"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/new"
                className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-zinc-200 bg-transparent px-8 text-base font-bold text-black transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
              >
                View Lookbook
              </Link>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-0 pointer-events-none opacity-10 dark:opacity-20">
          <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-red-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-zinc-400 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight uppercase">New Arrivals</h2>
              <p className="text-gray-500 dark:text-gray-400">Fresh drops directly from the street.</p>
            </div>
            <Link href="/shop" className="group flex items-center font-bold text-sm uppercase tracking-wider hover:text-red-600 transition-colors">
              Explore All <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id || product.name} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <p className="text-zinc-400 font-medium">No products found in the database.</p>
              <Link href="/admin" className="text-red-600 text-sm font-bold mt-2 inline-block">Add products in Supabase &rarr;</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
