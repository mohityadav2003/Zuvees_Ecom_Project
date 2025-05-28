import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI } from '../../services/api';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    const response = await ordersAPI.getAll();
    return response.data;
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async () => {
    const response = await ordersAPI.getUserOrders();
    return response.data;
  }
);

export const fetchRiderOrders = createAsyncThunk(
  'orders/fetchRiderOrders',
  async () => {
    const response = await ordersAPI.getRiderOrders();
    return response.data;
  }
);

export const updateDeliveryStatus = createAsyncThunk(
  'orders/updateDeliveryStatus',
  async ({ orderId, status }) => {
    const response = await ordersAPI.updateStatus(orderId, status);
    return response.data;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order._id === orderId);
      if (order) {
        order.status = status;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRiderOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRiderOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchRiderOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateDeliveryStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateDeliveryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setOrders,
  setCurrentOrder,
  addOrder,
  updateOrderStatus,
  setLoading,
  setError,
} = orderSlice.actions;

export default orderSlice.reducer; 