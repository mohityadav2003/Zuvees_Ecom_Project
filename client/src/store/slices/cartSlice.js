import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';

// These thunks will interact with the backend API to persist cart changes
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async ({ itemId, quantity, color, size }, { dispatch, rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart({ itemId, quantity, color, size });
      // Assuming the backend response returns the updated cart
      dispatch(setCart(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ itemId, quantity, color, size }, { dispatch, rejectWithValue }) => {
    try {
      const response = await cartAPI.updateQuantity({ itemId, quantity, color, size });
       // Assuming the backend response returns the updated cart
      dispatch(setCart(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async ({ itemId, color, size }, { dispatch, rejectWithValue }) => {
    try {
      const response = await cartAPI.removeFromCart({ itemId, color, size });
      // Assuming the backend response returns the updated cart
      dispatch(setCart(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // This reducer is now mainly used to update the state from backend responses
    setCart: (state, action) => {
      state.items = action.payload.items || []; // Ensure it's an array
      state.total = action.payload.total || 0; // Ensure it's a number
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    // Direct state manipulation reducers are removed as changes go through thunks
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = []; // Clear cart on error
        state.total = 0;
      })
      // Handle adding item to cart (state update happens via setCart dispatch in thunk)
      .addCase(addItemToCart.pending, (state) => { state.loading = true; })
      .addCase(addItemToCart.fulfilled, (state) => { state.loading = false; })
      .addCase(addItemToCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Handle updating item quantity (state update happens via setCart dispatch in thunk)
      .addCase(updateItemQuantity.pending, (state) => { state.loading = true; })
      .addCase(updateItemQuantity.fulfilled, (state) => { state.loading = false; })
      .addCase(updateItemQuantity.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Handle removing item from cart (state update happens via setCart dispatch in thunk)
      .addCase(removeItemFromCart.pending, (state) => { state.loading = true; })
      .addCase(removeItemFromCart.fulfilled, (state) => { state.loading = false; })
      .addCase(removeItemFromCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const {
  setCart,
  clearCart,
  // Direct state manipulation reducers are removed
  // addToCart,
  // updateQuantity,
  // removeFromCart,
  // setLoading,
  // setError,
} = cartSlice.actions;

export default cartSlice.reducer; 