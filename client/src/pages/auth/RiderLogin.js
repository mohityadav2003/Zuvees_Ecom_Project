import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { riderLogin } from '../../store/slices/authSlice';

const RiderLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting rider login with:', formData);
      const result = await dispatch(riderLogin(formData)).unwrap();
      console.log('Rider login successful:', result);
      navigate('/rider/dashboard');
    } catch (err) {
      console.error('Rider login error:', err);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Rider Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        sx={{ mt: 3 }}
      >
        Login
      </Button>
    </Box>
  );
};

export default RiderLogin; 