"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

export interface CartItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    subtotal: number;
    inStock: boolean;
    codAvailable: boolean;
}

interface CartContextType {
    items: CartItem[];
    total: number;
    count: number;
    loading: boolean;
    adding: string | null; // productId currently being added
    refresh: () => Promise<void>;
    addToCart: (productId: string, quantity?: number) => Promise<boolean>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
    items: [],
    total: 0,
    count: 0,
    loading: true,
    adding: null,
    refresh: async () => { },
    addToCart: async () => false,
    updateQuantity: async () => { },
    removeItem: async () => { },
    clearCart: () => { },
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState<string | null>(null);

    const count = items.reduce((s, i) => s + i.quantity, 0);

    const refresh = useCallback(async () => {
        try {
            const res = await fetch("/api/cart");
            if (!res.ok) {
                setItems([]);
                setTotal(0);
                return;
            }
            const data = await res.json();
            setItems(data.items || []);
            setTotal(data.total || 0);
        } catch {
            setItems([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, []);

    const addToCart = useCallback(
        async (productId: string, quantity = 1): Promise<boolean> => {
            setAdding(productId);
            try {
                const res = await fetch("/api/cart/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId, quantity }),
                });
                if (!res.ok) {
                    const data = await res.json();
                    if (res.status === 401) {
                        // User not logged in — redirect
                        window.location.href = "/user/login";
                        return false;
                    }
                    console.error("Add to cart error:", data.error);
                    return false;
                }
                await refresh();
                return true;
            } catch {
                return false;
            } finally {
                setAdding(null);
            }
        },
        [refresh]
    );

    const updateQuantity = useCallback(
        async (productId: string, quantity: number) => {
            try {
                await fetch("/api/cart/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId, quantity }),
                });
                await refresh();
            } catch {
                console.error("Update cart error");
            }
        },
        [refresh]
    );

    const removeItem = useCallback(
        async (productId: string) => {
            await updateQuantity(productId, 0);
        },
        [updateQuantity]
    );

    const clearCart = useCallback(() => {
        setItems([]);
        setTotal(0);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <CartContext.Provider
            value={{
                items,
                total,
                count,
                loading,
                adding,
                refresh,
                addToCart,
                updateQuantity,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
