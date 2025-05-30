import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await productsAPI.getAll();
    return response.data;
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const response = await productsAPI.getById(id);
    return response.data;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData) => {
    const response = await productsAPI.create(productData);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }) => {
    const response = await productsAPI.update(id, productData);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id) => {
    await productsAPI.delete(id);
    return id;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    loading: false,
    error: null,
    searchTerm: '',
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map(item =>
          item._id === action.payload._id ? action.payload : item
        );
        if (state.currentProduct?._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(p => p._id !== action.payload);
        if (state.currentProduct?._id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setProducts,
  setCurrentProduct,
  setLoading,
  setError,
  setSearchTerm,
} = productSlice.actions;

export default productSlice.reducer; 