import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { fetchRiderOrders } from '../../store/slices/orderSlice';
import { ridersAPI } from '../../services/api';

const RiderDashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [status, setStatus] = useState(user?.status || 'offline');

  useEffect(() => {
    dispatch(fetchRiderOrders());
  }, [dispatch]);

  const handleStatusChange = async (newStatus) => {
    try {
      await ridersAPI.updateStatus({ status: newStatus });
      setStatus(newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'busy':
        return 'warning';
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const activeOrders = orders.filter((order) => order.status === 'shipped');
  const completedOrders = orders.filter(
    (order) => order.status === 'delivered' || order.status === 'undelivered'
  );

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Rider Dashboard
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Current Status
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={status === 'available' ? 'contained' : 'outlined'}
              color="success"
              onClick={() => handleStatusChange('available')}
            >
              Available
            </Button>
            <Button
              variant={status === 'busy' ? 'contained' : 'outlined'}
              color="warning"
              onClick={() => handleStatusChange('busy')}
            >
              Busy
            </Button>
            <Button
              variant={status === 'offline' ? 'contained' : 'outlined'}
              color="error"
              onClick={() => handleStatusChange('offline')}
            >
              Offline
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Active Deliveries ({activeOrders.length})
              </Typography>
              {activeOrders.map((order) => (
                <Box
                  key={order._id}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1">
                    Order #{order._id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.customerInfo.address}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Completed Deliveries ({completedOrders.length})
              </Typography>
              {completedOrders.map((order) => (
                <Box
                  key={order._id}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1">
                    Order #{order._id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {order.status}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default RiderDashboard; 