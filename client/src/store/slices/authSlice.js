import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    const response = await authAPI.login(credentials);
    return response.data;
  }
);

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (credentials) => {
    const response = await authAPI.adminLogin(credentials);
    return response.data;
  }
);

export const riderLogin = createAsyncThunk(
  'auth/riderLogin',
  async (credentials) => {
    const response = await authAPI.riderLogin(credentials);
    return response.data;
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  role: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.removeItem('token');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = 'user';
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = 'admin';
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(riderLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(riderLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = 'rider';
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(riderLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer; 