import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { fetchOrderById } from '../store/slices/orderSlice';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, loading, error } = useSelector((state) => state.orders);

  console.log('OrderDetail - order state:', order);
  console.log('OrderDetail - loading state:', loading);
  console.log('OrderDetail - error state:', error);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

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

  if (!order) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 4 }}>
          Order not found
        </Alert>
      </Container>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Order #{order._id}
          </Typography>
          <Chip
            label={order.status.toUpperCase()}
            color={getStatusColor(order.status)}
          />
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <Typography variant="body1">
              {order.shippingAddress?.address}
            </Typography>
            <Typography variant="body1">
              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
            </Typography>
            <Typography variant="body1">{order.shippingAddress?.country}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
            <Typography variant="body1">
              Method: {order.paymentMethod?.toUpperCase()}
            </Typography>
            <Typography variant="body1">
              Status:{' '}
              <Chip
                label={order.isPaid ? 'PAID' : 'UNPAID'}
                color={order.isPaid ? 'success' : 'error'}
                size="small"
              />
            </Typography>
            {order.isPaid && (
              <Typography variant="body2" color="text.secondary">
                Paid on: {new Date(order.paidAt).toLocaleString()}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            {order.orderItems?.map((item) => (
              <Box
                key={item._id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  p: 2,
                  bgcolor: 'background.default',
                  borderRadius: 1,
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain',
                    marginRight: '16px',
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                </Box>
                <Typography variant="subtitle1">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Typography variant="body1">
                  Subtotal: ${order.total?.toFixed(2)}
                </Typography>
                <Typography variant="body1">Shipping: Free</Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  Total: ${order.total?.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default OrderDetail; 