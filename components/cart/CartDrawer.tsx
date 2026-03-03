"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

    const subtotal = getTotalPrice();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-zinc-950 z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2">
                                <ShoppingBag size={20} className="text-red-600" />
                                <h2 className="text-lg font-black uppercase tracking-tight">Your Cart ({getTotalItems()})</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center text-3xl">
                                        🛒
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-zinc-900 dark:text-white">Your cart is empty</p>
                                        <p className="text-sm text-zinc-500">Looks like you haven't added anything yet.</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl text-sm"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                                        <div className="relative aspect-[3/4] w-24 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-sm font-bold line-clamp-1">{item.name}</h3>
                                                    <button
                                                        onClick={() => removeItem(item.id, item.size)}
                                                        className="text-zinc-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Size: {item.size}</p>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-3 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                        className="p-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                        className="p-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-md transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-black">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/30">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm font-medium text-zinc-500">
                                        <span>Subtotal</span>
                                        <span className="text-zinc-900 dark:text-white font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium text-zinc-500">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href="/checkout"
                                        onClick={onClose}
                                        className="w-full h-14 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-tight flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 dark:shadow-white/5"
                                    >
                                        Proceed to Checkout
                                    </Link>
                                </div>
                                <p className="text-[10px] text-center text-zinc-400 font-medium">
                                    Secure checkout powered by Razorpay. Free delivery on all orders.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
