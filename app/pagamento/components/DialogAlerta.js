'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button
} from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

export default function DialogAlerta({ aberto, onClose }) {
  return (
    <Dialog open={aberto} onClose={onClose} disableEscapeKeyDown disableBackdropClick>
      <DialogTitle>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <ErrorIcon color="error" sx={{ fontSize: 60 }} />
          <Typography variant="h6" align="center">Número do pedido ausente</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography align="center">
          Para continuar, é necessário informar o número do pedido na URL.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button variant="contained" color="error" onClick={onClose}>
          Voltar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
