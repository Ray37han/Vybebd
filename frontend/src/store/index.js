import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      
      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        // Defensive checks
        if (!item || !item.product || !item.product._id) {
          return state;
        }
        
        // Ensure quantity is valid
        const validQuantity = Math.max(1, parseInt(item.quantity) || 1);
        
        // Generate unique ID if not present
        const itemWithId = {
          ...item,
          quantity: validQuantity,
          _id: item._id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        // For customized items, always add as new item (don't merge)
        if (item.customization) {
          return { items: [...state.items, itemWithId] };
        }
        
        const existing = state.items.find(
          (i) =>
            i.product?._id === item.product._id &&
            i.size === item.size &&
            (i.tier || 'Standard') === (item.tier || 'Standard') &&
            (i.frame || 'No Frame') === (item.frame || 'No Frame') &&
            !i.customization
        );
        
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.product?._id === item.product._id &&
              i.size === item.size &&
              (i.tier || 'Standard') === (item.tier || 'Standard') &&
              (i.frame || 'No Frame') === (item.frame || 'No Frame') &&
              !i.customization
                ? { ...i, quantity: i.quantity + validQuantity }
                : i
            ),
          };
        }
        
        return { items: [...state.items, itemWithId] };
      }),
      
      updateQuantity: (itemId, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item._id === itemId ? { ...item, quantity } : item
        ),
      })),
      
      removeItem: (itemId) => set((state) => ({
        items: state.items.filter((item) => item._id !== itemId),
      })),
      
      clearCart: () => set({ items: [] }),
      
      setItems: (items) => set({ items }),
      
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          // Wobbler / single-SKU products have no sizes[] — fall back to basePrice
          const hasSizes = item?.product?.sizes && Array.isArray(item.product.sizes) && item.product.sizes.length > 0;
          if (!hasSizes) {
            const price = item?.product?.basePrice || 0;
            const quantity = Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1;
            return total + price * quantity;
          }
          const tier = item.tier || 'Standard';
          const sizes = item.product.sizes;
          const sizePrice =
            sizes.find((s) => s.name === item.size && (s.tier || 'Standard') === tier)?.price ||
            sizes.find((s) => s.name === item.size && !s.tier)?.price ||
            item.product.basePrice ||
            0;
          const quantity = Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1;
          return total + sizePrice * quantity;
        }, 0);
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => {
          const quantity = Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 1;
          return count + quantity;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
