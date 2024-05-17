import type { Order } from '@/types/order';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
  orders: Order[];
  totalCartons: number;
  requiredPallets: number;
};

type Actions = {
  setOrders: (orders: Order[]) => void;
  setAuthorityToLeave: (orderNumber: string, authorityToLeave: boolean) => void;
  setDeliveryNotes: (orderNumber: string, deliveryNotes: string) => void;
  setConsignmentLink: (
    orderNumber: string,
    consignmentLink: string | null,
  ) => void;
  removeOrder: (orderNumber: string) => void;
  resetOrders: () => void;
};

const initialState: State = {
  orders: [],
  totalCartons: 0,
  requiredPallets: 0,
};

export const useOrders = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setOrders: (orders) => {
        const counters = {
          Carton: 0,
          Pallet: 0,
        };

        orders.forEach((order) => {
          counters.Carton += order.orderRows.reduce((acc, row) => {
            return row.packageType === 'Carton' ? acc + row.Quantity : acc;
          }, 0);

          counters.Pallet += order.orderRows.reduce((acc, row) => {
            return row.packageType === 'Pallet' ? acc + row.Quantity : acc;
          }, 0);
        });

        const requiredPallets =
          Math.ceil(counters.Carton / 30) + counters.Pallet + 1;

        set({ orders, totalCartons: counters.Carton, requiredPallets });
      },
      setDeliveryNotes: (orderNumber, deliveryNotes) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.orderNumber === orderNumber
              ? { ...order, deliveryNotes }
              : order,
          ),
        })),
      setAuthorityToLeave: (orderNumber, authorityToLeave) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.orderNumber === orderNumber
              ? { ...order, authorityToLeave }
              : order,
          ),
        })),
      setConsignmentLink: (orderNumber, consignmentLink) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.orderNumber === orderNumber
              ? { ...order, consignmentLink }
              : order,
          ),
        })),
      removeOrder: (orderNumber) =>
        set((state) => ({
          orders: state.orders.filter(
            (order) => order.orderNumber !== orderNumber,
          ),
        })),
      resetOrders: () => set(initialState),
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
