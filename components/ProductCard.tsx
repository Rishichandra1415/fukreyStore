"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export interface Product {
    id?: string | number;
    name: string;
    description?: string;
    price: number;
    discount_price?: number;
    image_url: string;
}

interface ProductCardProps {
    product: Product;
}



const ProductCard = ({ product }: ProductCardProps) => {
    const { name, price, discount_price, image_url } = product;
    const hasDiscount = discount_price !== undefined && discount_price < price;
    const discountPercentage = hasDiscount
        ? Math.round(((price - (discount_price ?? 0)) / price) * 100)
        : 0;

    return (
        <Link href={`/product/${product.id}`} className="group relative flex flex-col bg-white dark:bg-zinc-950 transition-all duration-300">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                <Image
                    src={image_url}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Sale Badge */}
                {hasDiscount && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center rounded-lg bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                            Sale -{discountPercentage}%
                        </span>
                    </div>
                )}

                {/* Quick Add Button (Desktop: Hover, Mobile: Visible) */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto sm:block">
                    <button className="w-full flex items-center justify-center gap-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm py-3 px-4 rounded-xl text-sm font-bold shadow-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                        <ShoppingCart size={18} />
                        Quick Add
                    </button>
                </div>

                {/* Mobile-only Quick Add (Visible without hover) */}
                <div className="absolute top-3 right-3 sm:hidden">
                    <button className="p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-full shadow-lg">
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="mt-4 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">
                    Fukrey
                </p>
                <h3 className="text-sm font-bold text-black dark:text-white truncate">
                    {name}
                </h3>
                <div className="flex items-center gap-2">
                    {hasDiscount ? (
                        <>
                            <span className="text-sm font-bold text-red-600">
                                ₹{discount_price?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                                ₹{price.toLocaleString('en-IN')}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm font-bold text-black dark:text-white">
                            ₹{price.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );


};

export default ProductCard;
