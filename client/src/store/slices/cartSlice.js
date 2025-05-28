import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }) => {
    const response = await cartAPI.updateItem(itemId, quantity);
    return response.data;
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
    setCart: (state, action) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
    addToCart: (state, action) => {
      const { item, quantity, color, size } = action.payload;
      const existingItem = state.items.find(
        i => i.item._id === item._id && 
             i.selectedColor === color && 
             i.selectedSize === size
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          item,
          quantity,
          selectedColor: color,
          selectedSize: size
        });
      }
      state.total = state.items.reduce(
        (total, item) => total + (item.item.price * item.quantity),
        0
      );
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity, color, size } = action.payload;
      const item = state.items.find(
        i => i.item._id === itemId && 
             i.selectedColor === color && 
             i.selectedSize === size
      );

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            i => !(i.item._id === itemId && 
                  i.selectedColor === color && 
                  i.selectedSize === size)
          );
        } else {
          item.quantity = quantity;
        }
        state.total = state.items.reduce(
          (total, item) => total + (item.item.price * item.quantity),
          0
        );
      }
    },
    removeFromCart: (state, action) => {
      const { itemId, color, size } = action.payload;
      state.items = state.items.filter(
        i => !(i.item._id === itemId && 
               i.selectedColor === color && 
               i.selectedSize === size)
      );
      state.total = state.items.reduce(
        (total, item) => total + (item.item.price * item.quantity),
        0
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
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
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.item._id === action.payload.item._id);
        if (index !== -1) {
          state.items[index] = {
            item: action.payload.item,
            quantity: action.payload.quantity,
            selectedColor: action.payload.selectedColor,
            selectedSize: action.payload.selectedSize
          };
        }
        state.total = state.items.reduce(
          (total, item) => total + (item.item.price * item.quantity),
          0
        );
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer; 