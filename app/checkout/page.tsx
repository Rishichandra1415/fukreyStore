"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/useCartStore";
import { ArrowLeft, CheckCircle2, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice, clearCart } = useCartStore();
    const subtotal = getTotalPrice();
    const gstAmount = subtotal * 0.12;
    const total = subtotal + gstAmount;

    const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("cod");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        pincode: "",
        city: "",
        state: "",
    });

    const handleConfirmOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        setIsSubmitting(true);

        try {
            // Attempt to insert order into Supabase
            // Note: This requires an 'orders' table to exist in Supabase with these columns.
            const { error } = await supabase.from('orders').insert([{
                customer_name: formData.name,
                phone: formData.phone,
                shipping_address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                items: JSON.parse(JSON.stringify(items)), // Ensure it's plain JSON
                subtotal: subtotal,
                gst_amount: gstAmount,
                total_amount: total,
                payment_method: paymentMethod,
                status: 'pending'
            }]);

            if (error) {
                console.error("Supabase Error detailing order insert failure:", error);
                alert("Failed to create order. Is the 'orders' table set up in Supabase?");
                setIsSubmitting(false);
                return;
            }

            clearCart();
            alert("Order placed successfully! Thank you for shopping with Fukrey.");
            router.push('/');

        } catch (error) {
            console.error("Order submission error:", error);
            alert("An error occurred while placing the order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRazorpayMock = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Razorpay Modal would open here. Converting to COD logic for testing.");
        handleConfirmOrder(e);
    }

    if (items.length === 0 && !isSubmitting) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-black uppercase tracking-tight">Checkout</h1>
                    <p className="text-zinc-500">Your cart is empty. Nothing to checkout.</p>
                    <Link href="/shop" className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold">
                        <ArrowLeft size={18} /> BACK TO SHOP
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20 pt-24 md:pt-32">
            <div className="container mx-auto px-4 max-w-6xl">

                <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-tight hover:text-red-600 transition-colors mb-8">
                    <ArrowLeft size={18} />
                    Back to Cart
                </Link>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Side - Form & Payment */}
                    <div className="flex-1 space-y-10">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight uppercase mb-6">Checkout</h1>
                            <form id="checkout-form" onSubmit={paymentMethod === 'cod' ? handleConfirmOrder : handleRazorpayMock} className="space-y-6">

                                {/* Shipping Details */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">Shipping Details</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
                                            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all" placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Phone Number</label>
                                            <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all" placeholder="+91 9876543210" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Address</label>
                                        <textarea required rows={3} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all resize-none" placeholder="123 Street Name, Apartment, Area" />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Pincode</label>
                                            <input required type="text" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all" placeholder="110001" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">City</label>
                                            <input required type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all" placeholder="New Delhi" />
                                        </div>
                                        <div className="space-y-2 col-span-2 md:col-span-1">
                                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">State</label>
                                            <input required type="text" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all" placeholder="Delhi" />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="space-y-4 pt-6">
                                    <h2 className="text-xl font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">Payment Method</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Razorpay Option */}
                                        <label className={`relative flex cursor-pointer rounded-2xl border p-4 focus:outline-none transition-all ${paymentMethod === 'razorpay' ? 'bg-zinc-50 dark:bg-zinc-900 border-black dark:border-white' : 'border-zinc-200 dark:border-zinc-800'}`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="razorpay"
                                                className="sr-only"
                                                checked={paymentMethod === 'razorpay'}
                                                onChange={() => setPaymentMethod('razorpay')}
                                            />
                                            <div className="flex w-full items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="text-sm">
                                                        <div className="font-bold flex items-center gap-2">
                                                            <CreditCard size={18} /> Online Payment
                                                        </div>
                                                        <div className="text-zinc-500 text-xs mt-1">Cards, UPI, NetBanking via Razorpay</div>
                                                    </div>
                                                </div>
                                                {paymentMethod === 'razorpay' && <CheckCircle2 className="h-5 w-5 text-black dark:text-white" />}
                                            </div>
                                        </label>

                                        {/* COD Option */}
                                        <label className={`relative flex cursor-pointer rounded-2xl border p-4 focus:outline-none transition-all ${paymentMethod === 'cod' ? 'bg-zinc-50 dark:bg-zinc-900 border-black dark:border-white' : 'border-zinc-200 dark:border-zinc-800'}`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="cod"
                                                className="sr-only"
                                                checked={paymentMethod === 'cod'}
                                                onChange={() => setPaymentMethod('cod')}
                                            />
                                            <div className="flex w-full items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="text-sm">
                                                        <div className="font-bold flex items-center gap-2">
                                                            <Banknote size={18} /> Cash on Delivery
                                                        </div>
                                                        <div className="text-zinc-500 text-xs mt-1">Pay when order arrives</div>
                                                    </div>
                                                </div>
                                                {paymentMethod === 'cod' && <CheckCircle2 className="h-5 w-5 text-black dark:text-white" />}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Order Summary Sidebar */}
                    <div className="lg:w-[400px]">
                        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 lg:sticky lg:top-32 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-black/5">
                            <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Order Summary</h2>

                            {/* Items List */}
                            <div className="space-y-4 mb-6 max-h-[30h] overflow-y-auto pr-2">
                                {items.map(item => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                        <div className="relative h-20 w-16 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 flex-shrink-0 border border-zinc-100 dark:border-zinc-800">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="text-sm font-bold line-clamp-1">{item.name}</h3>
                                            <p className="text-xs text-zinc-500 mb-1">Size: {item.size} • Qty: {item.quantity}</p>
                                            <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3 mb-6">
                                <div className="flex justify-between items-center text-sm text-zinc-600 dark:text-zinc-400">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-black dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-zinc-600 dark:text-zinc-400">
                                    <div className="flex items-center gap-1">
                                        <span>Estimated GST</span>
                                        <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-black dark:text-white font-bold">12%</span>
                                    </div>
                                    <span className="font-medium text-black dark:text-white">₹{gstAmount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-zinc-600 dark:text-zinc-400">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold uppercase tracking-wider text-[10px]">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800 pt-4 mb-8">
                                <span className="text-base font-bold uppercase tracking-widest text-zinc-500">Total</span>
                                <span className="text-2xl font-black">₹{total.toLocaleString('en-IN')}</span>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-tight rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    "Processing..."
                                ) : paymentMethod === 'razorpay' ? (
                                    "Pay Now"
                                ) : (
                                    "Confirm Order (COD)"
                                )}
                            </button>

                            <p className="text-center text-[10px] text-zinc-400 mt-4 uppercase tracking-widest font-medium">Secured by 256-bit encryption</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
