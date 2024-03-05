import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './styles.css';

export const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const menuItems = [
    { text: 'Server Users', path: '/server-users' },
    { text: 'Home', path: '/' },
    { text: 'Sign In', path: '/Connect-Discord' },
    { text: 'Profile', path: '/Profile' },
    { text: 'Create Store', path: '/create-store' },
    { text: 'Brand Dash', path: '/brand-dashboard' },
    { text: 'All Stores', path: '/all-stores' },
    { text: 'Cart', path: '/cart' },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'block' } }}
        >
          {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
          Your App Name
        </Typography>
        <List sx={{ display: { xs: 'none', sm: 'flex' } }}>
          {menuItems.map((item) => (
            <ListItem button key={item.text} component="a" href={item.path}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Toolbar>
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: '50%',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '50%',
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} onClick={handleDrawerToggle} component="a" href={item.path}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};
