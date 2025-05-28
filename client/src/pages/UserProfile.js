import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                {user.role}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/orders')}
            >
              View Order History
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfile; 