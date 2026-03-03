"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    Package,
    Search,
    AlertTriangle,
    ArrowUp,
    ArrowDown,
    Edit2,
    Check,
    X,
    Filter
} from "lucide-react";
import Image from "next/image";

// Types based on the expected Supabase schema
interface InventoryItem {
    id: string;
    created_at: string;
    product_id: string; // References the main product
    size: string; // S, M, L, XL, etc.
    stock_count: number;
    product?: {
        name: string;
        category: string;
        image_url: string;
    };
}

export default function InventoryManagement() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Quick Edit State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<number>(0);
    const [isSaving, setIsSaving] = useState(false);

    // Mock data for initial render or if DB fails
    const mockInventory: InventoryItem[] = [
        {
            id: "inv-1",
            created_at: new Date().toISOString(),
            product_id: "prod-1",
            size: "M",
            stock_count: 12,
            product: {
                name: "Classic Black Tee",
                category: "T-Shirts",
                image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200"
            }
        },
        {
            id: "inv-2",
            created_at: new Date().toISOString(),
            product_id: "prod-1",
            size: "L",
            stock_count: 3,
            product: {
                name: "Classic Black Tee",
                category: "T-Shirts",
                image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200"
            }
        },
        {
            id: "inv-3",
            created_at: new Date().toISOString(),
            product_id: "prod-2",
            size: "S",
            stock_count: 45,
            product: {
                name: "Vintage Denim Jacket",
                category: "Outerwear",
                image_url: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=200"
            }
        },
        {
            id: "inv-4",
            created_at: new Date().toISOString(),
            product_id: "prod-3",
            size: "XL",
            stock_count: 0,
            product: {
                name: "Urban Cargo Pants",
                category: "Bottoms",
                image_url: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=200"
            }
        }
    ];

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setIsLoading(true);
        try {
            // In a real scenario, this would a join query if inventory is a separate table,
            // or just fetching products if it's all in one table.
            const { data, error } = await supabase
                .from('inventory')
                .select(`
          *,
          product:products (
            name,
            category,
            image_url
          )
        `);

            if (error) throw error;

            if (data && data.length > 0) {
                setInventory(data as unknown as InventoryItem[]);
            } else {
                // Fallback to mock data for demonstration purposes
                console.log("No data found in Supabase inventory table, using mock data.");
                setInventory(mockInventory);
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
            // Fallback on error
            setInventory(mockInventory);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickEdit = (item: InventoryItem) => {
        setEditingId(item.id);
        setEditValue(item.stock_count);
    };

    const saveQuickEdit = async (id: string) => {
        setIsSaving(true);
        try {
            // Optimistic update
            setInventory(inventory.map(item =>
                item.id === id ? { ...item, stock_count: editValue } : item
            ));

            // Real update (commented out to prevent errors if table doesn't exist)
            /*
            const { error } = await supabase
              .from('inventory')
              .update({ stock_count: editValue })
              .eq('id', id);
      
            if (error) throw error;
            */

            setEditingId(null);
        } catch (error) {
            console.error("Failed to update stock:", error);
            alert("Failed to update stock level.");
            // Revert optimism if failed
            fetchInventory();
        } finally {
            setIsSaving(false);
        }
    };

    const adjustStock = (amount: number) => {
        setEditValue(prev => Math.max(0, prev + amount));
    };

    // Derived State: Filtering
    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.product?.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || item.product?.category === categoryFilter;

        return matchesSearch && matchesCategory;
    });

    // Unique categories for the dropdown
    const categories = ["all", ...Array.from(new Set(inventory.map(i => i.product?.category).filter(Boolean)))];

    // Stats
    const totalItems = filteredInventory.length;
    const lowStockItems = filteredInventory.filter(i => i.stock_count < 5).length;
    const outOfStockItems = filteredInventory.filter(i => i.stock_count === 0).length;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">

            {/* Header & Stats Container */}
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Package className="h-6 w-6" /> Inventory Management
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Track and update stock levels across all variants.</p>
                </div>

                {/* Mini Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Total Variants</p>
                            <p className="text-2xl font-black mt-1">{totalItems}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg"><Package className="h-5 w-5 text-gray-600" /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm flex items-center justify-between ring-1 ring-red-500/10">
                        <div>
                            <p className="text-xs font-semibold text-red-500 uppercase">Low Stock (&lt; 5)</p>
                            <p className="text-2xl font-black text-red-600 mt-1">{lowStockItems}</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Out of Stock</p>
                            <p className="text-2xl font-black mt-1">{outOfStockItems}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg"><X className="h-5 w-5 text-gray-600" /></div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center z-10 relative">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black capitalize w-full sm:w-auto"
                    >
                        {categories.map(cat => (
                            <option key={cat as string} value={cat as string}>
                                {cat === 'all' ? 'All Categories' : cat as string}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Info</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Size</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Count</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredInventory.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No products found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredInventory.map((item) => {
                                    const isLowStock = item.stock_count < 5;
                                    const isOutOfStock = item.stock_count === 0;
                                    const isEditing = editingId === item.id;

                                    return (
                                        <tr
                                            key={item.id}
                                            className={`transition-colors ${isOutOfStock
                                                    ? 'bg-red-50/50 hover:bg-red-50'
                                                    : isLowStock
                                                        ? 'bg-yellow-50/30 hover:bg-yellow-50/50'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                                        {item.product?.image_url ? (
                                                            <Image
                                                                src={item.product.image_url}
                                                                alt={item.product.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <Package className="h-5 w-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{item.product?.name || 'Unknown Product'}</div>
                                                        <div className="text-xs text-gray-500 font-mono">ID: {item.product_id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {item.product?.category || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold rounded-lg min-w-[32px]">
                                                    {item.size}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {isEditing ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => adjustStock(-1)}
                                                            className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center hover:bg-gray-200 active:bg-gray-300"
                                                        >
                                                            <ArrowDown className="h-4 w-4" />
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(Math.max(0, parseInt(e.target.value) || 0))}
                                                            className="w-16 text-center border border-black rounded-md py-1 font-bold outline-none"
                                                            min="0"
                                                        />
                                                        <button
                                                            onClick={() => adjustStock(1)}
                                                            className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center hover:bg-gray-200 active:bg-gray-300"
                                                        >
                                                            <ArrowUp className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-end gap-2">
                                                        {isLowStock && (
                                                            <AlertTriangle className={`h-4 w-4 ${isOutOfStock ? 'text-red-500' : 'text-yellow-500'}`} />
                                                        )}
                                                        <span className={`text-base font-bold ${isOutOfStock
                                                                ? 'text-red-600'
                                                                : isLowStock
                                                                    ? 'text-yellow-600'
                                                                    : 'text-gray-900'
                                                            }`}>
                                                            {item.stock_count}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {isEditing ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                                                            disabled={isSaving}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => saveQuickEdit(item.id)}
                                                            className="p-1.5 text-white bg-black hover:bg-gray-800 rounded-md flex items-center"
                                                            disabled={isSaving}
                                                        >
                                                            {isSaving ? <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleQuickEdit(item)}
                                                        className="inline-flex items-center text-gray-400 hover:text-black hover:bg-gray-100 p-1.5 rounded-md transition-colors"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
