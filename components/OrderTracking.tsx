"use client";

import { Check, MessageCircle } from "lucide-react";

interface OrderTrackingProps {
    orderStatus: string;
}

const stages = [
    "Order Placed",
    "Processing at Patna Hub",
    "In Transit",
    "Out for Delivery",
];

export default function OrderTracking({ orderStatus }: OrderTrackingProps) {
    // Map order status to current stage index
    const getStatusIndex = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending": return 0;
            case "paid": return 1;
            case "shipped": return 2;
            case "delivered": return 3;
            default: return 0;
        }
    };

    const currentIndex = getStatusIndex(orderStatus);

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-black tracking-tight uppercase italic mb-8 flex items-center gap-2 text-black dark:text-white">
                Live Tracking
            </h3>

            <div className="relative flex items-center justify-between mb-12">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-zinc-100 dark:bg-zinc-800 -z-0" />
                <div
                    className="absolute top-5 left-0 h-0.5 bg-red-600 transition-all duration-500 ease-in-out -z-0"
                    style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
                />

                {/* Stages */}
                {stages.map((stage, index) => {
                    const isActive = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={stage} className="relative z-10 flex flex-col items-center flex-1">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                                        ? "bg-red-600 text-white scale-110 shadow-lg shadow-red-600/20"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                                    }`}
                            >
                                {index < currentIndex ? (
                                    <Check size={20} strokeWidth={3} />
                                ) : (
                                    <span className="text-sm font-bold">{index + 1}</span>
                                )}
                            </div>
                            <div className="mt-4 text-center px-1">
                                <p className={`text-[10px] md:text-xs font-black uppercase tracking-widest leading-tight ${isActive ? "text-black dark:text-white" : "text-zinc-400"
                                    }`}>
                                    {stage}
                                </p>
                                {isCurrent && (
                                    <span className="inline-block mt-2 w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* WhatsApp Help Button */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
                <a
                    href="https://wa.me/918000000000" // Replace with actual Fukrey WhatsApp number
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-2xl font-bold text-sm tracking-tight transition-all hover:scale-[1.05] shadow-lg shadow-[#25D366]/20"
                >
                    <MessageCircle size={20} />
                    Need Help? Chat with Support
                </a>
            </div>
        </div>
    );
}
