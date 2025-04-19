'use client';

import React from 'react';
import {
  Box,
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

export default function Dialogs({
  onClose,
  title = 'Título',
  children,
  actions = null,
  Fabs = null,
}) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    if (onClose) onClose();
    setOpen(false); // fecha internamente
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen>
      {/* AppBar superior */}
      <AppBar position="fixed" color="inherit" elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <IconButton edge="start" onClick={handleClose} color="inherit">
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2 }}>
              {title}
            </Typography>
          </Box>

          {actions && (
            <Box ml="auto" display="flex" alignItems="center">
              {actions}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Conteúdo principal */}
      <Box sx={{ pt: 7, pb: 10, bgcolor: '#f3f3f3', height: '100%' }}>
        {typeof children === 'function' ? children({ handleClose }) : children}
      </Box>

      {/* Barra inferior fixa */}
      {Fabs && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            p: 2,
            bgcolor: '#fff',
            borderTop: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          {Fabs}
        </Paper>
      )}
    </Dialog>
  );
}
