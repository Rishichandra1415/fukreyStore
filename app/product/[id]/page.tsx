import Image from "next/image";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SizeSelector from "@/components/SizeSelector";
import { Product } from "@/components/ProductCard";
import { ArrowLeft, Share2, Heart } from "lucide-react";
import Link from "next/link";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Separate component for images to keep the main page cleaner
async function getProductData(id: string) {
    const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (productError || !product) {
        console.error("Error fetching product:", productError);
        return null;
    }

    const typedProduct = product as Product;

    const { data: inventory, error: inventoryError } = await supabase
        .from("inventory")
        .select("*")
        .eq("product_id", id);

    if (inventoryError) {
        console.error("Error fetching inventory:", inventoryError);
    } else if (inventory && inventory.length > 0) {
        console.log("Inventory Columns:", Object.keys(inventory[0]));
    }

    return {
        product: typedProduct,
        inventory: inventory || [],
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const data = await getProductData(id);

    if (!data) {
        notFound();
    }

    const { product, inventory } = data;

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20">
            {/* Header / Navigation Overlay */}
            <div className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight hover:text-red-600 transition-colors">
                        <ArrowLeft size={18} />
                        Back to Shop
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
                            <Share2 size={20} />
                        </button>
                        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
                            <Heart size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-8 md:pt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left Side: Product Image */}
                    <div className="space-y-4">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 shadow-2xl">
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        {/* Thumbnail strips could go here if multiple images existed */}
                    </div>

                    {/* Right Side: Product Details */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-red-600 mb-2">
                                Fukrey Original
                            </p>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black dark:text-white uppercase italic leading-none mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-4 mb-6">
                                <span className="text-3xl font-black text-black dark:text-white">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </span>
                                {product.discount_price && (
                                    <>
                                        <span className="text-xl text-zinc-400 line-through">
                                            ₹{product.discount_price.toLocaleString('en-IN')}
                                        </span>
                                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                            Save {Math.round(((product.discount_price - product.price) / product.discount_price) * 100)}%
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
                                {product.description || "Premium quality streetwear designed for the bold. Featuring high-grade fabric and a fit that makes a statement. Elevate your street style with Fukrey."}
                            </p>
                        </div>

                        {/* Size Selector and Action Buttons */}
                        <SizeSelector product={product} inventory={inventory} />

                        {/* Additional Info / Accordions */}
                        <div className="mt-12 space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-8">
                            <details className="group cursor-pointer">
                                <summary className="flex items-center justify-between font-bold text-sm uppercase tracking-wide list-none">
                                    Product Description
                                    <span className="transition-transform group-open:rotate-180">↓</span>
                                </summary>
                                <div className="mt-4 text-sm text-zinc-500 leading-relaxed">
                                    Standard fit for a relaxed, easy feel. Ribbed collar. 100% premium cotton. Machine wash cold. Imported.
                                </div>
                            </details>
                            <details className="group cursor-pointer">
                                <summary className="flex items-center justify-between font-bold text-sm uppercase tracking-wide list-none">
                                    Shipping & Returns
                                    <span className="transition-transform group-open:rotate-180">↓</span>
                                </summary>
                                <div className="mt-4 text-sm text-zinc-500 leading-relaxed">
                                    Shipping across India. Standard delivery: 3-5 working days. Express delivery: 1-2 working days available at checkout. 7-day hassle-free returns.
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
