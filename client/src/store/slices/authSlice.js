import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

// Restore auth state from localStorage token
const token = localStorage.getItem('token');
let user = null;
let role = null;
let isAuthenticated = false;

if (token) {
  try {
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    user = { id: payload.id, role: payload.role, email: payload.email };
    role = payload.role;
    isAuthenticated = true;
  } catch (e) {
    // Invalid token, ignore
    user = null;
    role = null;
    isAuthenticated = false;
  }
}

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
    console.log('adminLogin thunk called with:', credentials);
    const response = await authAPI.adminLogin(credentials);
    console.log('adminLogin response:', response.data);
    return {
      token: response.data.token,
      user: response.data.user,
      role: response.data.user.role
    };
  }
);

export const riderLogin = createAsyncThunk(
  'auth/riderLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Making rider login API call with:', credentials);
      const response = await authAPI.riderLogin(credentials);
      console.log('Rider login API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Rider login API error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const initialState = {
  user,
  token,
  isAuthenticated,
  role,
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
    clearAuth: (state) => {
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
        console.log('Login fulfilled:', action.payload);
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
        console.log('Admin login pending...');
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        console.log('Admin login rejected:', action.error);
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
        console.error('Rider login rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  clearAuth,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer; 