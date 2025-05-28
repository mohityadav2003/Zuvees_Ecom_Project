import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ridersAPI } from '../../services/api';

export const fetchRiders = createAsyncThunk(
  'riders/fetchRiders',
  async () => {
    const response = await ridersAPI.getAll();
    return response.data;
  }
);

export const createRider = createAsyncThunk(
  'riders/createRider',
  async (riderData) => {
    const response = await ridersAPI.create(riderData);
    return response.data;
  }
);

export const updateRider = createAsyncThunk(
  'riders/updateRider',
  async ({ id, riderData }) => {
    const response = await ridersAPI.update(id, riderData);
    return response.data;
  }
);

export const deleteRider = createAsyncThunk(
  'riders/deleteRider',
  async (id) => {
    await ridersAPI.delete(id);
    return id;
  }
);

const riderSlice = createSlice({
  name: 'riders',
  initialState: {
    riders: [],
    currentRider: null,
    loading: false,
    error: null,
  },
  reducers: {
    setRiders: (state, action) => {
      state.riders = action.payload;
    },
    setCurrentRider: (state, action) => {
      state.currentRider = action.payload;
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
      .addCase(fetchRiders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRiders.fulfilled, (state, action) => {
        state.loading = false;
        state.riders = action.payload;
      })
      .addCase(fetchRiders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createRider.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRider.fulfilled, (state, action) => {
        state.loading = false;
        state.riders.push(action.payload);
      })
      .addCase(createRider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateRider.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRider.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.riders.findIndex(rider => rider._id === action.payload._id);
        if (index !== -1) {
          state.riders[index] = action.payload;
        }
      })
      .addCase(updateRider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteRider.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRider.fulfilled, (state, action) => {
        state.loading = false;
        state.riders = state.riders.filter(rider => rider._id !== action.payload);
      })
      .addCase(deleteRider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setRiders,
  setCurrentRider,
  setLoading,
  setError,
} = riderSlice.actions;

export default riderSlice.reducer; 