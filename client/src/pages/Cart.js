import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Divider,
  TextField,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { fetchCart, updateItemQuantity, removeItemFromCart, clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated, token: authToken } = useSelector((state) => state.auth);

  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: '',
    },
    paymentMethod: 'Credit Card', // Default or collect this via form
  });

  useEffect(() => {
    if (isAuthenticated && authToken) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated, authToken]);

  const handleQuantityChange = (cartItem, change) => {
    const newQuantity = cartItem.quantity + change;
    dispatch(updateItemQuantity({
      itemId: cartItem.item._id,
      quantity: newQuantity,
      color: cartItem.color,
      size: cartItem.size,
    }));
  };

  const handleRemoveItem = (cartItem) => {
    dispatch(removeItemFromCart({
      itemId: cartItem.item._id,
      color: cartItem.color,
      size: cartItem.size,
    }));
  };

  const handleCheckout = () => {
    // Open the checkout dialog instead of confirming directly
    setOpenCheckoutDialog(true);
  };

  const handleCloseCheckoutDialog = () => {
    setOpenCheckoutDialog(false);
    // Optionally reset customer details here
    setCustomerDetails({
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: '',
      },
      paymentMethod: 'Credit Card',
    });
  };

  const handleCustomerDetailsChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handlePlaceOrder = async () => {
    // Validation (basic example, add more robust validation as needed)
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address.street || !customerDetails.address.city || !customerDetails.address.postalCode || !customerDetails.address.country) {
      alert('Please fill in all customer details.');
      return;
    }

    const orderItems = items.map(item => ({
      item: item.item._id,
      quantity: item.quantity,
      // Correcting naming mismatch for backend
      selectedColor: item.color,
      selectedSize: item.size,
      price: item.item.price,
    }));

    const orderData = {
      orderItems,
      customerInfo: customerDetails,
    };

    try {
      const resultAction = await dispatch(createOrder(orderData));

      if (createOrder.fulfilled.match(resultAction)) {
        alert('Order placed successfully!');
        dispatch(clearCart());
        navigate('/order-history'); // Or navigate to a specific order confirmation page
      } else {
         alert(`Failed to place order: ${resultAction.payload || resultAction.error.message}`);
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('An error occurred while placing your order.');
    } finally {
      handleCloseCheckoutDialog();
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

  if (items.length === 0) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Shopping Cart
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {items.map((cartItem) => (
            <Card key={cartItem.item._id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '150px',
                        objectFit: 'contain',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6" component="h2">
                      {cartItem.item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ${cartItem.item.price}
                    </Typography>
                    {cartItem.color && (
                      <Typography variant="body2" color="text.secondary">
                        Color: {cartItem.color}
                      </Typography>
                    )}
                    {cartItem.size && (
                      <Typography variant="body2" color="text.secondary">
                        Size: {cartItem.size}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(cartItem, -1)}
                        disabled={cartItem.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        value={cartItem.quantity}
                        size="small"
                        sx={{ width: '60px', mx: 1 }}
                        inputProps={{
                          readOnly: true,
                          style: { textAlign: 'center' },
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(cartItem, 1)}
                        disabled={cartItem.quantity >= cartItem.item.variations.find(v => v.color === cartItem.color && v.size === cartItem.size)?.stock}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(cartItem)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Subtotal:</Typography>
              <Typography>${total.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Shipping:</Typography>
              <Typography>Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                ${total.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Typography variant="h6" gutterBottom>
                Subtotal: ${total.toFixed(2)}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                >
                  Checkout
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Checkout Dialog */}
      <Dialog open={openCheckoutDialog} onClose={handleCloseCheckoutDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Enter Customer Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={customerDetails.name}
                onChange={handleCustomerDetailsChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={customerDetails.email}
                onChange={handleCustomerDetailsChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={customerDetails.phone}
                onChange={handleCustomerDetailsChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Shipping Address
              </Typography>
            </Grid>
            <Grid item xs={12}>
               <TextField
                 fullWidth
                 label="Street Address"
                 name="street"
                 value={customerDetails.address.street}
                 onChange={handleAddressChange}
                 required
               />
            </Grid>
            <Grid item xs={12} sm={6}>
               <TextField
                 fullWidth
                 label="City"
                 name="city"
                 value={customerDetails.address.city}
                 onChange={handleAddressChange}
                 required
               />
            </Grid>
            <Grid item xs={12} sm={6}>
               <TextField
                 fullWidth
                 label="Postal Code"
                 name="postalCode"
                 value={customerDetails.address.postalCode}
                 onChange={handleAddressChange}
                 required
               />
            </Grid>
            <Grid item xs={12}>
               <TextField
                 fullWidth
                 label="Country"
                 name="country"
                 value={customerDetails.address.country}
                 onChange={handleAddressChange}
                 required
               />
            </Grid>
            {/* You might want to add a field for payment method here */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheckoutDialog}>Cancel</Button>
          <Button onClick={handlePlaceOrder} variant="contained" color="primary">
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
      {/* End Checkout Dialog */}

    </Container>
  );
};

export default Cart; 