import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, CartContextType, Product } from '@/types/product';

type CartAction =
  | { type: 'ADD_TO_CART'; product: Product; variantIndex: number; quantity: number }
  | { type: 'REMOVE_FROM_CART'; productId: string; variantIndex: number }
  | { type: 'UPDATE_QUANTITY'; productId: string; variantIndex: number; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] };

interface CartState {
  items: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.product.id && item.variantIndex === action.variantIndex
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.quantity;
        return { items: updatedItems };
      }

      return {
        items: [
          ...state.items,
          {
            productId: action.product.id,
            product: action.product,
            variantIndex: action.variantIndex,
            quantity: action.quantity,
          },
        ],
      };
    }

    case 'REMOVE_FROM_CART': {
      return {
        items: state.items.filter(
          item => !(item.productId === action.productId && item.variantIndex === action.variantIndex)
        ),
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          items: state.items.filter(
            item => !(item.productId === action.productId && item.variantIndex === action.variantIndex)
          ),
        };
      }

      return {
        items: state.items.map(item =>
          item.productId === action.productId && item.variantIndex === action.variantIndex
            ? { ...item, quantity: action.quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { items: [] };

    case 'LOAD_CART':
      return { items: action.items };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('walmart-cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', items });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('walmart-cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product: Product, variantIndex: number, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', product, variantIndex, quantity });
  };

  const removeFromCart = (productId: string, variantIndex: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId, variantIndex });
  };

  const updateQuantity = (productId: string, variantIndex: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, variantIndex, quantity });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const variant = item.product.variants[item.variantIndex];
      return total + (variant.price * item.quantity);
    }, 0);
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value: CartContextType = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}