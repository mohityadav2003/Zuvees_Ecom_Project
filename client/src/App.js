import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import RiderLayout from './layouts/RiderLayout';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminLogin from './pages/auth/AdminLogin';
import RiderLogin from './pages/auth/RiderLogin';
import OrderHistory from './pages/OrderHistory';
import UserProfile from './pages/UserProfile';
import OrderDetail from './pages/OrderDetail';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminRiders from './pages/admin/Riders';

// Rider Pages
import RiderDashboard from './pages/rider/Dashboard';
import RiderOrders from './pages/rider/Orders';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/rider/login" element={<RiderLogin />} />
          </Route>

          {/* Protected User Routes */}
          <Route
            element={
              isAuthenticated && role === 'user' ? (
                <MainLayout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            element={
              isAuthenticated && role === 'admin' ? (
                <AdminLayout />
              ) : (
                <Navigate to="/" replace />
              )
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/riders" element={<AdminRiders />} />
          </Route>

          {/* Protected Rider Routes */}
          <Route
            element={
              isAuthenticated && role === 'rider' ? (
                <RiderLayout />
              ) : (
                <Navigate to="/rider/login" replace />
              )
            }
          >
            <Route path="/rider/dashboard" element={<RiderDashboard />} />
            <Route path="/rider/orders" element={<RiderOrders />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
