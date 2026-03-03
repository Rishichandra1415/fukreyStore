import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    id: string | number;
    name: string;
    price: number;
    size: string;
    quantity: number;
    image: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string | number, size: string) => void;
    updateQuantity: (id: string | number, size: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (newItem) => {
                const { items } = get();
                const existingItem = items.find(
                    (item) => item.id === newItem.id && item.size === newItem.size
                );

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === newItem.id && item.size === newItem.size
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [...items, { ...newItem, quantity: 1 }],
                    });
                }
            },

            removeItem: (id, size) => {
                set({
                    items: get().items.filter(
                        (item) => !(item.id === id && item.size === size)
                    ),
                });
            },

            updateQuantity: (id, size, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id, size);
                    return;
                }

                set({
                    items: get().items.map((item) =>
                        item.id === id && item.size === size
                            ? { ...item, quantity }
                            : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'fukrey-cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
