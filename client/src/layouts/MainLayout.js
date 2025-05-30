import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  TextField,
} from '@mui/material';
import { ShoppingCart, Person, Search as SearchIcon } from '@mui/icons-material';
import { clearAuth } from '../store/slices/authSlice';
import { setSearchTerm } from '../store/slices/productSlice';

const MainLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { searchTerm } = useSelector((state) => state.products);

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Zuvees
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              mx: 2,
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              size="small"
              sx={{
                width: '350px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '25px',
                  paddingLeft: '10px',
                  border: '1px solid',
                  borderColor: '#ccc',
                  backgroundColor: 'white',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ccc',
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Box>

          {isAuthenticated ? (
            <>
              <IconButton
                color="inherit"
                onClick={() => navigate('/cart')}
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={items.length} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <IconButton
                color="inherit"
                onClick={() => navigate('/profile')}
                sx={{ mr: 2 }}
              >
                <Person />
              </IconButton>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4, mt: 8 }}>
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
        <Typography variant="body1" align="center">
            Have a Nice Shopping
          </Typography>
          <Typography variant="body1" align="center">
            © 2025 Zuvees. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout; 