import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Button,
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
  TextField,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  fetchRiders,
  createRider,
  updateRider,
  deleteRider,
} from '../../store/slices/riderSlice';

const initialRiderState = {
  name: '',
  email: '',
  phone: '',
  vehicleNumber: '',
  vehicleType: '',
  status: 'available',
  password: '',
};

const Riders = () => {
  const dispatch = useDispatch();
  const { riders, loading, error } = useSelector((state) => state.riders);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRider, setCurrentRider] = useState(initialRiderState);

  useEffect(() => {
    dispatch(fetchRiders());
  }, [dispatch]);

  const handleOpen = (rider = null) => {
    if (rider) {
      setCurrentRider(rider);
      setIsEditing(true);
    } else {
      setCurrentRider(initialRiderState);
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentRider(initialRiderState);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentRider((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await dispatch(updateRider({ id: currentRider._id, riderData: currentRider }));
    } else {
      await dispatch(createRider(currentRider));
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rider?')) {
      await dispatch(deleteRider(id));
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

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1">
          Riders
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Rider
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {riders.map((rider) => (
              <TableRow key={rider._id}>
                <TableCell>{rider.name}</TableCell>
                <TableCell>{rider.email}</TableCell>
                <TableCell>{rider.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={rider.status.toUpperCase()}
                    color={getStatusColor(rider.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(rider.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(rider)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(rider._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Rider' : 'Add New Rider'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={currentRider.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={currentRider.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={currentRider.phone}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Vehicle Type"
              name="vehicleType"
              value={currentRider.vehicleType}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Vehicle Number"
              name="vehicleNumber"
              value={currentRider.vehicleNumber}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={currentRider.password}
              onChange={handleChange}
              margin="normal"
              required={!isEditing}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Riders; 