"use client";

import { useState } from "react";
import { MessageCircle, ShoppingCart, Zap } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { Product } from "./ProductCard";

interface InventoryItem {
    size: string;
    stock: number;
}

interface SizeSelectorProps {
    product: Product;
    inventory: InventoryItem[];
}

const ALL_SIZES = ["S", "M", "L", "XL"];

const SizeSelector = ({ product, inventory }: SizeSelectorProps) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const addItem = useCartStore((state) => state.addItem);

    const getStockForSize = (size: string) => {
        if (!inventory || inventory.length === 0) return 10;
        const item = inventory.find((i) => i.size === size) as any;
        return item ? (item.stock ?? item.quantity ?? 0) : 0;
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size first!");
            return;
        }

        addItem({
            id: product.id!,
            name: product.name,
            price: product.price,
            size: selectedSize,
            image: product.image_url,
        });

        // Optional: Show a success message or open cart drawer
        alert(`Added ${product.name} (Size: ${selectedSize}) to cart!`);
    };

    const handleWhatsAppOrder = () => {
        if (!selectedSize) {
            alert("Please select a size first!");
            return;
        }
        const message = `Hi Fukrey, I want to buy ${product.name} in size ${selectedSize}`;
        const encodedMessage = encodeURIComponent(message);
        // TODO: Replace with your actual WhatsApp business number
        window.open(`https://wa.me/91XXXXXXXXXX?text=${encodedMessage}`, "_blank");
    };

    return (
        <div className="space-y-8">
            {/* Size Selection */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Select Size
                    </h3>
                    <button className="text-xs font-bold text-red-600 hover:underline">
                        Size Guide
                    </button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {ALL_SIZES.map((size) => {
                        const stock = getStockForSize(size);
                        const isOutOfStock = stock <= 0;
                        const isSelected = selectedSize === size;

                        return (
                            <button
                                key={size}
                                onClick={() => !isOutOfStock && setSelectedSize(size)}
                                disabled={isOutOfStock}
                                className={`
                                    min-w-[60px] h-12 rounded-xl border-2 font-bold transition-all duration-200
                                    ${isOutOfStock
                                        ? "border-zinc-100 text-zinc-300 cursor-not-allowed bg-zinc-50 dark:border-zinc-800 dark:text-zinc-700 dark:bg-zinc-900"
                                        : isSelected
                                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black scale-105 shadow-lg"
                                            : "border-zinc-200 text-black hover:border-black dark:border-zinc-800 dark:text-white dark:hover:border-white"
                                    }
                                `}
                            >
                                {size}
                                {isOutOfStock && (
                                    <span className="block text-[8px] uppercase mt-0.5 opacity-60">Out</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <div className="flex gap-3">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 h-14 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-black dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <ShoppingCart size={20} />
                        Add to Cart
                    </button>
                    <button
                        onClick={handleAddToCart} // For now, Buy Now also just adds to cart
                        className="flex-1 h-14 bg-black hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-black/10 dark:shadow-white/5"
                    >
                        <Zap size={20} fill="currentColor" />
                        Buy Now
                    </button>
                </div>

                <button
                    onClick={handleWhatsAppOrder}
                    className="w-full h-14 bg-[#25D366] hover:bg-[#20bd5c] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-green-500/10"
                >
                    <MessageCircle size={20} fill="currentColor" />
                    WhatsApp Order
                </button>
            </div>

            {/* Product Benefits/Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-white">
                        🚚
                    </div>
                    <div>
                        <p className="text-xs font-bold">Fast Delivery</p>
                        <p className="text-[10px] text-zinc-500">2-4 Business Days</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-white">
                        🔄
                    </div>
                    <div>
                        <p className="text-xs font-bold">Easy Returns</p>
                        <p className="text-[10px] text-zinc-500">7 Day Policy</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeSelector;
