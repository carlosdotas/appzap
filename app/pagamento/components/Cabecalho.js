'use client';
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';

export default function Cabecalho({ nomeCliente }) {
  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Toolbar sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton edge="start" onClick={() => window.history.back()} color="inherit">
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h6">Finalização de Pagamento</Typography>
            <Typography variant="caption" color="text.secondary">
              Preencha as informações necessárias
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ pl: 6, mt: 0.5 }} color="text.secondary">
          {nomeCliente}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
