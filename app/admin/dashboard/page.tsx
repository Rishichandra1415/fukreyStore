"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    ShoppingBag,
    Package,
    Users,
    BarChart3,
    MoreVertical,
    CheckCircle2,
    Clock,
    Truck,
    AlertTriangle,
    Search,
    IndianRupee,
    X,
    TrendingUp
} from "lucide-react";
import InventoryManagement from "./InventoryManagement";

// Types
type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
}

interface Order {
    id: number;
    created_at: string;
    customer_name: string;
    phone: string;
    total_amount: number;
    status: OrderStatus;
    payment_method: string;
    items: OrderItem[];
    shipping_address: string;
    city: string;
    pincode: string;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Stats
    const [totalSales, setTotalSales] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [lowStockCount, setLowStockCount] = useState(3); // Mock value since we don't have full inventory schema yet

    // Modal State
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch Data
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setOrders(data);

                // Calculate Stats
                const sales = data.reduce((acc, order) => {
                    // Only count if not cancelled
                    if (order.status !== 'cancelled') {
                        return acc + (order.total_amount || 0);
                    }
                    return acc;
                }, 0);

                const pending = data.filter(order => order.status === 'pending').length;

                setTotalSales(sales);
                setPendingCount(pending);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            // We'll show empty state gracefully
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;

        setIsUpdating(true);
        try {
            // 1. Update Order Status
            const { error: orderError } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', selectedOrder.id);

            if (orderError) throw orderError;

            // 2. Mock Inventory Update if needed
            // If we had a full inventory table, we would deduct stock when order moves to 'paid' or 'shipped'
            // Example logic commented out for future implementation:
            /*
            if (newStatus === 'shipped' && selectedOrder.status !== 'shipped' && selectedOrder.status !== 'delivered') {
              for (const item of selectedOrder.items) {
                // Update products table by subtracting quantity
                await supabase.rpc('decrement_stock', { 
                  product_id: item.id, 
                  qty: item.quantity 
                });
              }
            }
            */

            // Optimistically update local state
            setOrders(orders.map(order =>
                order.id === selectedOrder.id ? { ...order, status: newStatus } : order
            ));

            // Re-calculate stats
            if (newStatus === 'pending' && selectedOrder.status !== 'pending') {
                setPendingCount(prev => prev + 1);
            } else if (newStatus !== 'pending' && selectedOrder.status === 'pending') {
                setPendingCount(prev => Math.max(0, prev - 1));
            }

            closeModal();

        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const openUpdateModal = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setIsUpdateModalOpen(true);
    };

    const closeModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedOrder(null);
    };

    const getStatusBadge = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
            case 'paid':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"><IndianRupee className="w-3 h-3 mr-1" /> Paid</span>;
            case 'shipped':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"><Truck className="w-3 h-3 mr-1" /> Shipped</span>;
            case 'delivered':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Delivered</span>;
            case 'cancelled':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"><X className="w-3 h-3 mr-1" /> Cancelled</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
        }
    };

    const navItems = [
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0">
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-gray-200">
                        <h1 className="text-xl font-black tracking-tight uppercase">Fukrey Admin</h1>
                    </div>
                    <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-black text-white'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage your store's recent activity and performance.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black w-full sm:w-64"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Sales */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Sales (₹)</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalSales.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                                    <IndianRupee className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <span className="text-green-600 font-medium flex items-center"><TrendingUp className="h-4 w-4 mr-1" /> 12%</span>
                                <span className="text-gray-500 ml-2">from last month</span>
                            </div>
                        </div>

                        {/* Pending Orders */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{pendingCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <span className="text-gray-500">Needs your attention</span>
                            </div>
                        </div>

                        {/* Low Stock Alerts */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{lowStockCount}</p>
                                </div>
                                <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-red-600 font-medium">
                                Inventory requires restocking
                            </div>
                        </div>
                    </div>

                    {/* Main Orders Table */}
                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID & Date</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Items / Value</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                                                        <span className="ml-3 font-medium">Loading orders...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                    <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                                    <p className="text-lg font-medium text-gray-900">No orders found</p>
                                                    <p className="mt-1">When customers place orders, they will appear here.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-gray-900">#{order.id}</div>
                                                        <div className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                                                        <div className="text-sm text-gray-500">{order.city}, {order.pincode}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-gray-900">₹{(order.total_amount || 0).toLocaleString('en-IN')}</div>
                                                        <div className="text-xs text-gray-500">{order.items?.length || 0} items ({order.payment_method?.toUpperCase()})</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(order.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium mt-2">
                                                        <button
                                                            onClick={() => openUpdateModal(order)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                                        >
                                                            Update
                                                        </button>
                                                        <button className="ml-2 text-gray-400 hover:text-gray-900">
                                                            <MoreVertical className="h-5 w-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Placeholders for other tabs */}
                    {activeTab === 'inventory' ? (
                        <InventoryManagement />
                    ) : activeTab !== 'orders' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Package className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{navItems.find(i => i.id === activeTab)?.label} Module</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">This section is currently under construction. Check back soon for updates.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Update Order Modal */}
            {isUpdateModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Backdrop */}
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal Panel */}
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4" id="modal-title">
                                            Update Order #{selectedOrder.id}
                                        </h3>

                                        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{selectedOrder.customer_name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{selectedOrder.shipping_address}, {selectedOrder.city} - {selectedOrder.pincode}</p>
                                            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Value:</span>
                                                <span className="font-bold text-gray-900">₹{(selectedOrder.total_amount || 0).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-sm font-bold text-gray-700">Order Status</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <StatusOption
                                                    value="pending"
                                                    current={newStatus}
                                                    onClick={() => setNewStatus('pending')}
                                                    icon={Clock}
                                                    colorClass="text-yellow-700 bg-yellow-50 border-yellow-200"
                                                />
                                                <StatusOption
                                                    value="paid"
                                                    current={newStatus}
                                                    onClick={() => setNewStatus('paid')}
                                                    icon={IndianRupee}
                                                    colorClass="text-blue-700 bg-blue-50 border-blue-200"
                                                />
                                                <StatusOption
                                                    value="shipped"
                                                    current={newStatus}
                                                    onClick={() => setNewStatus('shipped')}
                                                    icon={Truck}
                                                    colorClass="text-purple-700 bg-purple-50 border-purple-200"
                                                />
                                                <StatusOption
                                                    value="delivered"
                                                    current={newStatus}
                                                    onClick={() => setNewStatus('delivered')}
                                                    icon={CheckCircle2}
                                                    colorClass="text-green-700 bg-green-50 border-green-200"
                                                />
                                            </div>

                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex gap-3 items-start border border-blue-100">
                                                <Package className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                                <div className="text-xs text-blue-800">
                                                    <span className="font-bold block mb-1">Inventory Notice</span>
                                                    Updating status to <b>Shipped</b> or <b>Delivered</b> will automatically deduct items from your primary warehouse inventory.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                                <button
                                    type="button"
                                    disabled={isUpdating || newStatus === selectedOrder.status}
                                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-colors"
                                    onClick={handleUpdateStatus}
                                >
                                    {isUpdating ? 'Updating...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusOption({ value, current, onClick, icon: Icon, colorClass }: any) {
    const isSelected = value === current;
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-between p-3 rounded-lg border-2 text-left transition-all ${isSelected
                ? `border-black ring-1 ring-black ${colorClass}`
                : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
        >
            <div className="flex items-center">
                <Icon className={`h-4 w-4 mr-2 ${isSelected ? '' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium capitalize ${isSelected ? '' : 'text-gray-700'}`}>
                    {value}
                </span>
            </div>
            {isSelected && <CheckCircle2 className="h-4 w-4" />}
        </button>
    );
}


