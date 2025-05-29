import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  ShoppingCart as OrderIcon,
  People as UserIcon,
  LocalShipping as RiderIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { fetchOrders } from '../../store/slices/orderSlice';
import { fetchProducts } from '../../store/slices/productSlice';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    }}
  >
    <Box
      sx={{
        backgroundColor: `${color}.light`,
        borderRadius: '50%',
        p: 2,
        mr: 2,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders) || [];
  const {items : products, loading: productsLoading } = useSelector((state) => state.products) || [];

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  if (ordersLoading || productsLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const totalOrders = orders && orders.length;
  const totalProducts = products && products.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((order) => order.status === 'pending').length;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<OrderIcon sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<UserIcon sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            icon={<RiderIcon sx={{ color: 'warning.main' }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={<MoneyIcon sx={{ color: 'info.main' }} />}
            color="info"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            {orders.slice(0, 5).map((order) => (
              <Box
                key={order._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography variant="subtitle1">
                    Order #{order._id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1">
                    ${order.total.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={
                      order.status === 'delivered'
                        ? 'success.main'
                        : order.status === 'cancelled'
                        ? 'error.main'
                        : 'text.secondary'
                    }
                  >
                    {order.status.toUpperCase()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 