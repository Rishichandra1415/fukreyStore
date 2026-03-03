"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
    User,
    Package,
    MapPin,
    LogOut,
    ChevronRight,
    Plus,
    Edit2,
    Trash2,
    Clock,
    CheckCircle2,
    Truck,
    AlertCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
}

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: string;
    items: OrderItem[];
}

interface Address {
    id: string;
    type: string;
    address_line: string;
    city: string;
    state: string;
    pincode: string;
    is_default: boolean;
}

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [activeTab, setActiveTab] = useState<"orders" | "addresses">("orders");

    useEffect(() => {
        async function getInitialData() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            setUser(user);

            // Fetch profile
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profileData) setProfile(profileData);
            else {
                // Fallback profile if table doesn't exist or record is missing
                setProfile({
                    id: user.id,
                    full_name: user.user_metadata?.full_name || "Fukrey User",
                    avatar_url: user.user_metadata?.avatar_url || null,
                    email: user.email || null,
                });
            }

            // Fetch orders (assuming user_id column exists)
            const { data: orderData } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (orderData) setOrders(orderData);

            // Fetch addresses (assuming addresses table exists)
            const { data: addressData } = await supabase
                .from("addresses")
                .select("*")
                .eq("user_id", user.id);

            if (addressData) setAddresses(addressData);
            else {
                // Mock data for demo if table doesn't exist
                setAddresses([
                    {
                        id: "1",
                        type: "Home",
                        address_line: "123 Street Name, Apartment, Area",
                        city: "Patna",
                        state: "Bihar",
                        pincode: "800001",
                        is_default: true,
                    }
                ]);
            }

            setLoading(false);
        }

        getInitialData();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "paid": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "shipped": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
            case "delivered": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending": return <Clock size={14} className="mr-1" />;
            case "shipped": return <Truck size={14} className="mr-1" />;
            case "delivered": return <CheckCircle2 size={14} className="mr-1" />;
            default: return <AlertCircle size={14} className="mr-1" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-zinc-200 border-t-black dark:border-zinc-800 dark:border-t-white rounded-full animate-spin"></div>
                    <p className="text-zinc-500 font-medium animate-pulse">Loading Profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 pt-24 md:pt-32">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Profile Header */}
                <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 md:p-10 border border-zinc-100 dark:border-zinc-800 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                        <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-lg">
                            {profile?.avatar_url ? (
                                <Image src={profile.avatar_url} alt={profile.full_name || ""} fill className="object-cover" />
                            ) : (
                                <User className="h-full w-full p-4 md:p-6 text-zinc-400" />
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-black dark:text-white uppercase italic">
                                {profile?.full_name}
                            </h1>
                            <p className="text-zinc-500 dark:text-gray-400 font-medium">{profile?.email}</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                                <button className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-bold text-sm tracking-tight transition-all hover:scale-[1.02]">
                                    <Edit2 size={16} /> Edit Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 border-2 border-zinc-200 dark:border-zinc-800 text-black dark:text-white px-5 py-2.5 rounded-xl font-bold text-sm tracking-tight transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-100 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "orders"
                            ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                            : "text-zinc-400 hover:text-zinc-600"
                            }`}
                    >
                        My Orders
                    </button>
                    <button
                        onClick={() => setActiveTab("addresses")}
                        className={`px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "addresses"
                            ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                            : "text-zinc-400 hover:text-zinc-600"
                            }`}
                    >
                        Saved Addresses
                    </button>
                </div>

                {/* Content Section */}
                <div className="space-y-6">
                    {activeTab === "orders" ? (
                        <div className="space-y-4">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <div key={order.id} className="bg-white dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 md:p-6 transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="relative h-24 w-20 md:h-28 md:w-24 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 shrink-0">
                                                {order.items[0]?.image ? (
                                                    <Image src={order.items[0].image} alt={order.items[0].name} fill className="object-cover" />
                                                ) : (
                                                    <Package className="h-full w-full p-6 text-zinc-300" />
                                                )}
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Order #{order.id.slice(0, 8)}</p>
                                                        <h3 className="text-lg font-black tracking-tight">{order.items[0]?.name || "Fukrey Order"} {order.items.length > 1 && `+ ${order.items.length - 1} more`}</h3>
                                                    </div>
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-4 md:mt-0">
                                                    <p className="text-sm font-medium text-zinc-500">{new Date(order.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    <div className="flex items-center gap-4">
                                                        <p className="text-lg font-black tracking-tight italic">₹{order.total_amount.toLocaleString("en-IN")}</p>
                                                        <Link href={`/order-success/${order.id}`} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                                                            <ChevronRight size={18} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center bg-white dark:bg-zinc-900/30 rounded-3xl border border-zinc-100 dark:border-zinc-800 border-dashed">
                                    <Package className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
                                    <p className="text-zinc-500 font-bold uppercase tracking-widest">No orders found</p>
                                    <Link href="/shop" className="text-red-600 font-bold text-sm mt-4 inline-block hover:underline underline-offset-4 tracking-tighter uppercase italic">Start Shopping &rarr;</Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map((address) => (
                                <div key={address.id} className="bg-white dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 md:p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={18} className="text-red-600" />
                                            <h4 className="font-black tracking-tight uppercase uppercase">{address.type} Address</h4>
                                            {address.is_default && (
                                                <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-black uppercase text-zinc-500">Default</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-all"><Edit2 size={16} /></button>
                                            <button className="p-1.5 text-zinc-400 hover:text-red-600 transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    <p className="text-sm font-medium text-zinc-600 dark:text-gray-400 leading-relaxed">
                                        {address.address_line}<br />
                                        {address.city}, {address.state}<br />
                                        {address.pincode}
                                    </p>
                                </div>
                            ))}

                            <button className="h-full min-h-[160px] flex flex-col items-center justify-center gap-2 bg-transparent border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all">
                                <Plus size={24} />
                                <span className="font-bold text-sm uppercase tracking-widest">Add New Address</span>
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
