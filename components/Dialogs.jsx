'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { ArrowBack, MoreVert, Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.background.default,
  }),
}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[800],
  }),
}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[900],
  }),
}));

export default function Dialogs({
  open = true,
  onClose,
  title = 'Título',
  description = '',
  leadingAvatar = null,
  avatar = null,
  actions = null,
  bottomActions = null,
  menuItems = [],
  subHeader = null,
  sideMenu = null,
  showBackButton = true,
  children,
}) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [menuVisible, setMenuVisible] = React.useState(true);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const menuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const toggleSideMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  
  React.useEffect(() => {
    if (open) {
      console.log('Dialog aberto');
    }
  }, [open]);

  React.useEffect(() => {
    const handleToggleDrawer = () => setDrawerOpen(true);
    window.addEventListener('toggleDrawerFromOutside', handleToggleDrawer);
    return () => window.removeEventListener('toggleDrawerFromOutside', handleToggleDrawer);
  }, []);

  
  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* AppBar */}
        <AppBar position="relative" color="inherit" elevation={1}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={1}>
              {showBackButton && (
                <IconButton edge="start" onClick={onClose} color="inherit">
                  <ArrowBack />
                </IconButton>
              )}
              {sideMenu && (
                <IconButton onClick={toggleSideMenu}>
                  {menuVisible ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              )}
              {leadingAvatar}
              <Box>
                <Typography variant="h6">{title}</Typography>
                {description && (
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              {actions}
              {avatar}
              {menuItems.length > 0 && (
                <>
                  <IconButton onClick={handleMenuOpen}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={menuOpen}
                    onClose={handleMenuClose}
                  >
                    {menuItems.map((item, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          handleMenuClose();
                          item.onClick?.();
                        }}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* SubHeader */}
        {subHeader && (
          <>{subHeader}</>
        )}

        {/* Conteúdo com menu lateral */}
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {sideMenu && menuVisible && (
            <Box
              sx={{
                width: 240,
                bgcolor: '#fff',
                borderRight: '1px solid #ddd',
                p: 2,
                overflowY: 'auto',
                transition: 'width 0.3s ease',
              }}
            >
              {sideMenu}
            </Box>
          )}

          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              bgcolor: '#f3f3f3',
              p: 2,
            }}
          >
            {typeof children === 'function' ? children({ onClose }) : children}
          </Box>
        </Box>

        {/* Bottom Actions fixo */}
        {bottomActions && (
          <>{bottomActions}</>
        )}
      </Box>
    </Dialog>
  );
}