import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
} from '@mui/material';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            component={Link}
            to="/"
            variant="h4"
            sx={{
              mb: 4,
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 'bold',
            }}
          >
            E-Commerce
          </Typography>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout; 