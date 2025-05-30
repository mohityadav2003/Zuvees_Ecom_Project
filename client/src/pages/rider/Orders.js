import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { fetchRiderOrders, updateDeliveryStatus } from '../../store/slices/orderSlice';

const RiderOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchRiderOrders());
  }, [dispatch]);

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async (status) => {
    if (selectedOrder) {
      await dispatch(updateDeliveryStatus({
        orderId: selectedOrder._id,
        status
      }));
      handleCloseDialog();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'undelivered':
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

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        My Orders
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>{order.customerInfo.name}</TableCell>
                <TableCell>{`${order.customerInfo.address?.street}, ${order.customerInfo.address?.city}, ${order.customerInfo.address?.country}`}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status.toUpperCase()}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {order.status === 'shipped' && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenDialog(order)}
                    >
                      Update Status
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Update Delivery Status</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Order #{selectedOrder?._id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Customer: {selectedOrder?.customerInfo.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Address: {`${selectedOrder?.customerInfo.address?.street}, ${selectedOrder?.customerInfo.address?.city}, ${selectedOrder?.customerInfo.address?.country}`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => handleStatusUpdate('delivered')}
            color="success"
            variant="contained"
          >
            Mark as Delivered
          </Button>
          <Button
            onClick={() => handleStatusUpdate('undelivered')}
            color="error"
            variant="contained"
          >
            Mark as Undelivered
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RiderOrders; 