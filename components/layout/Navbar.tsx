"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, LogIn } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { supabase } from "@/lib/supabase";
import CartDrawer from "../cart/CartDrawer";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const totalItems = useCartStore((state) => state.getTotalItems());

    useEffect(() => {
        // Initial session check
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 dark:bg-zinc-950/80 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">

                        {/* Mobile Menu Toggle (Left) */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-all duration-200"
                                aria-label="Toggle Menu"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>

                        {/* Desktop Navigation (Left) - Hidden on Mobile */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">Shop</Link>
                            <Link href="/new" className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">New Arrivals</Link>
                        </div>

                        {/* Logo (Centered) */}
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <Link href="/" className="group">
                                <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-black dark:text-white uppercase italic">
                                    FUKREY<span className="text-red-600 group-hover:animate-pulse">.</span>
                                </h1>
                            </Link>
                        </div>

                        {/* Icons (Right) */}
                        <div className="flex items-center space-x-1 sm:space-x-3">
                            <button className="hidden sm:flex p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-all duration-200 group">
                                <Search size={22} className="group-hover:scale-110 transition-transform" />
                            </button>

                            {/* Dynamic Auth Button */}
                            {!loading && (
                                user ? (
                                    <Link href="/profile" className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-all duration-200 group">
                                        <User size={22} className="group-hover:scale-110 transition-transform" />
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.05] active:scale-[0.98] shadow-lg shadow-black/10 dark:shadow-white/5"
                                    >
                                        <LogIn size={16} />
                                        <span className="hidden md:inline">Login</span>
                                    </Link>
                                )
                            )}

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-all duration-200 group"
                            >
                                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                                {/* Notification Badge */}
                                {totalItems > 0 && (
                                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-950">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Search Overlay/Drawer */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-screen border-t border-gray-100 dark:border-zinc-800" : "max-h-0"}`}>
                    <div className="bg-white dark:bg-zinc-950 px-4 py-6 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm outline-none"
                            />
                        </div>
                        <div className="flex flex-col space-y-4 px-2">
                            <Link onClick={() => setIsMenuOpen(false)} href="/shop" className="text-lg font-semibold text-gray-900 dark:text-white">Shop All</Link>
                            <Link onClick={() => setIsMenuOpen(false)} href="/new" className="text-lg font-semibold text-gray-900 dark:text-white">New Arrivals</Link>
                            <Link onClick={() => setIsMenuOpen(false)} href="/collections" className="text-lg font-semibold text-gray-900 dark:text-white">Collections</Link>
                            <Link onClick={() => setIsMenuOpen(false)} href="/about" className="text-lg font-semibold text-gray-900 dark:text-white">About Us</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Navbar;
