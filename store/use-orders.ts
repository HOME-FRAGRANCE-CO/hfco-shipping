import type { Order } from '@/types';
import { create } from 'zustand';

type State = {
  orders: Order[];
  totalCartons: number;
  requiredPallets: number;
};

type Actions = {
  setOrders: (orders: Order[]) => void;
  removeOrder: (orderNumber: string) => void;
  resetOrders: () => void;
};

const initialState: State = {
  orders: [],
  totalCartons: 0,
  requiredPallets: 0,
};

export const useOrders = create<State & Actions>((set) => ({
  ...initialState,
  setOrders: (orders) => {
    const counters = {
      Carton: 0,
      Pallet: 0,
    };

    orders.forEach((order) => {
      const type = order['Carton/Pallet'];
      const quantity = order.orderRows.reduce(
        (acc, row) => acc + row.Quantity,
        0,
      );

      if (type === 'Carton') {
        counters.Carton += quantity;
      } else if (type === 'Pallet') {
        counters.Pallet += quantity;
      }
    });

    const requiredPallets =
      Math.ceil(counters.Carton / 30) + counters.Pallet + 1;

    set({ orders, totalCartons: counters.Carton, requiredPallets });
  },
  removeOrder: (orderNumber) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.orderNumber !== orderNumber),
    })),
  resetOrders: () => set(initialState),
}));