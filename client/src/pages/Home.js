import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  AddShoppingCart as AddToCartIcon,
} from '@mui/icons-material';
import { fetchProducts } from '../store/slices/productSlice';
import { addItemToCart } from '../store/slices/cartSlice';

const Home = () => {
  const dispatch = useDispatch();
  const {items: products, loading, error, searchTerm } = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setSelectedColor('');
    setSelectedSize('');
    setQuantity(1);
  };

  const handleConfirmAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select both color and size');
      return;
    }
    dispatch(addItemToCart({
      itemId: selectedProduct._id,
      quantity,
      color: selectedColor,
      size: selectedSize
    }));
    setSelectedProduct(null);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setSelectedColor('');
    setSelectedSize('');
    setQuantity(1);
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
      <Box sx={{ p: 3 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                <Link
                  to={`/product/${product._id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover', width: '100%', maxHeight: 200 }}
                  />
                </Link>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Link
                    to={`/product/${product._id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Typography gutterBottom variant="h6" component="h2">
                      {product.name}
                    </Typography>
                  </Link>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Rating value={product.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.numReviews})
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      ${product.price}
                    </Typography>
                    <IconButton
                      color="primary"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.stock}
                    >
                      <AddToCartIcon />
                    </IconButton>
                  </Box>
                  {!product.stock && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      Out of Stock
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={!!selectedProduct} onClose={handleCloseDialog}>
        <DialogTitle>Add to Cart</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedProduct.name}
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Color</InputLabel>
                <Select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  label="Color"
                >
                  {[...new Set(selectedProduct?.variations?.map(v => v.color))].map((color) => (
                    <MenuItem key={color} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Size</InputLabel>
                <Select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  label="Size"
                  disabled={!selectedColor}
                >
                  {[...new Set(selectedProduct?.variations
                    ?.filter((v) => v.color === selectedColor)
                    .map(v => v.size))].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1 }}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmAddToCart} variant="contained">
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home; 