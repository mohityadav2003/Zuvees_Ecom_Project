import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@mui/material';
import { createOrder } from '../store/slices/orderSlice';

const steps = ['Shipping', 'Payment', 'Review'];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setActiveStep(1);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setActiveStep(2);
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      orderItems: items,
      shippingAddress: shippingData,
      paymentMethod,
      totalPrice: total,
    };

    const result = await dispatch(createOrder(orderData));
    if (!result.error) {
      navigate(`/order/${result.payload._id}`);
    }
  };

  const renderShippingForm = () => (
    <Box component="form" onSubmit={handleShippingSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Address"
            value={shippingData.address}
            onChange={(e) =>
              setShippingData({ ...shippingData, address: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            value={shippingData.city}
            onChange={(e) =>
              setShippingData({ ...shippingData, city: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Postal Code"
            value={shippingData.postalCode}
            onChange={(e) =>
              setShippingData({ ...shippingData, postalCode: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Country"
            value={shippingData.country}
            onChange={(e) =>
              setShippingData({ ...shippingData, country: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Continue to Payment
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  const renderPaymentForm = () => (
    <Box component="form" onSubmit={handlePaymentSubmit}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Payment Method</FormLabel>
        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="credit_card"
            control={<Radio />}
            label="Credit Card"
          />
          <FormControlLabel
            value="paypal"
            control={<Radio />}
            label="PayPal"
          />
        </RadioGroup>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        sx={{ mt: 3 }}
      >
        Review Order
      </Button>
    </Box>
  );

  const renderReview = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Shipping Address:</Typography>
          <Typography variant="body2">
            {shippingData.address}, {shippingData.city}, {shippingData.postalCode},{' '}
            {shippingData.country}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Payment Method:</Typography>
          <Typography variant="body2">
            {paymentMethod === 'credit_card' ? 'Credit Card' : 'PayPal'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Order Items:</Typography>
          {items.map((item) => (
            <Box key={item._id} sx={{ display: 'flex', mb: 1 }}>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {item.name} x {item.quantity}
              </Typography>
              <Typography variant="body2">
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="primary">
              ${total.toFixed(2)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && renderShippingForm()}
        {activeStep === 1 && renderPaymentForm()}
        {activeStep === 2 && renderReview()}
      </Paper>
    </Container>
  );
};

export default Checkout; 