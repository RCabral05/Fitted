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
    { text: 'MyAdmin', path: '/MyAdmin' },
    { text: 'Releases', path: '/release-calendar'}
  ];

  return (
    <AppBar position="static" className="app-bar">
      <Toolbar className="toolbar">
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className="menu-button"
          sx={{ mr: 2 }}
        >
          {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" component="div" className="title">
          FULLY FITTED
        </Typography>
        <List className="desktop-menu">
          {menuItems.map((item) => (
            <ListItem button key={item.text} component="a" href={item.path} sx={{ padding: 0 }}>
              <ListItemText primary={item.text} className="desktop-menu-item" />
            </ListItem>
          ))}
        </List>
      </Toolbar>
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': { width: '50%', boxSizing: 'border-box' },
        }}
      >
        <List className="drawer-list">
          {menuItems.map((item) => (
            <ListItem button key={item.text} onClick={handleDrawerToggle} component="a" href={item.path} className="drawer-item">
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>

  );
};
