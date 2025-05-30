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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchOrders, updateOrderStatusAsync } from '../../store/slices/orderSlice';
import { fetchRiders } from '../../store/slices/riderSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { riders, loading: ridersLoading, error: ridersError } = useSelector((state) => state.riders);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedOrderForAssignment, setSelectedOrderForAssignment] = useState(null);
  const [selectedRiderId, setSelectedRiderId] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchRiders());
  }, [dispatch]);

  const handleOpen = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
    setStatus('');
  };

  const handleStatusChange = async () => {
    if (selectedOrder && status !== selectedOrder.status) {
      try {
        await dispatch(updateOrderStatusAsync({ orderId: selectedOrder._id, status })).unwrap();
        dispatch(fetchOrders());
        handleClose();
      } catch (err) {
        console.error('Failed to update order status:', err);
        handleClose();
      }
    }
  };

  const handleOpenAssignDialog = (order) => {
    setSelectedOrderForAssignment(order);
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedOrderForAssignment(null);
    setSelectedRiderId('');
  };

  const handleRiderSelectChange = (event) => {
    setSelectedRiderId(event.target.value);
  };

  const handleAssignRider = async () => {
    if (selectedOrderForAssignment && selectedRiderId) {
      await dispatch(updateOrderStatusAsync({
        orderId: selectedOrderForAssignment._id,
        status: 'shipped',
        riderId: selectedRiderId
      })).unwrap();
      handleCloseAssignDialog();
    }
  };

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

  if (loading || ridersLoading) {
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

  if (error || ridersError) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || ridersError}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Orders
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Rider</TableCell>
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
                <TableCell>{order.user?.name}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status.toUpperCase()}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{order.rider ? order.rider.name : 'N/A'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(order)}
                  >
                    <EditIcon />
                  </IconButton>
                  {order.status !== 'delivered' && order.status !== 'cancelled' && !order.rider && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenAssignDialog(order)}
                      disabled={riders.length === 0}
                    >
                      Assign Rider
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleStatusChange}
            variant="contained"
            color="primary"
            disabled={status === selectedOrder?.status}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={assignDialogOpen} onClose={handleCloseAssignDialog}>
        <DialogTitle>Assign Rider to Order #{selectedOrderForAssignment?._id}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="rider-select-label">Select Rider</InputLabel>
            <Select
              labelId="rider-select-label"
              value={selectedRiderId}
              label="Select Rider"
              onChange={handleRiderSelectChange}
            >
              {riders.map((rider) => (
                <MenuItem key={rider._id} value={rider._id}>
                  {rider.name} ({rider.status})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button onClick={handleAssignRider} variant="contained" disabled={!selectedRiderId}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Orders; 