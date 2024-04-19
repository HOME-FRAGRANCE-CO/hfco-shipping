import type { Order } from '@/types';
import { create } from 'zustand';

type OrdersState = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  resetOrders: () => void;
};

export const useOrders = create<OrdersState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  resetOrders: () => set({ orders: [] }),
}));
