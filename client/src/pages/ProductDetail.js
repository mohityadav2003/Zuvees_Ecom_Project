import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Rating,
  TextField,
  Divider,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading, error } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product?.countInStock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    navigate('/cart');
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

  if (!product) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 4 }}>
          Product not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'contain',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.numReviews} reviews)
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Status:{' '}
                <Typography
                  component="span"
                  color={product.countInStock > 0 ? 'success.main' : 'error.main'}
                >
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </Typography>
              </Typography>
            </Box>
            {product.countInStock > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Quantity:
                </Typography>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{
                    min: 1,
                    max: product.countInStock,
                  }}
                  sx={{ width: '100px' }}
                />
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleAddToCart}
              disabled={!product.countInStock}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetail; 