import React from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { updateCartItem, removeFromCart } from '../store/slices/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);

  const handleQuantityChange = (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0 && newQuantity <= item.countInStock) {
      dispatch(updateCartItem({ ...item, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

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
          {items.map((item) => (
            <Card key={item._id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <img
                      src={item.image}
                      alt={item.name}
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
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ${item.price}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        size="small"
                        sx={{ width: '60px', mx: 1 }}
                        inputProps={{
                          readOnly: true,
                          style: { textAlign: 'center' },
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item, 1)}
                        disabled={item.quantity >= item.countInStock}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item)}
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
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 