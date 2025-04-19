// DialogAcoes.js
'use client';
import React from 'react';
import { Stack, IconButton, Tooltip } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

export function DialogAcoes({ setDialogTipo }) {
  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title="Adicionar despesa">
        <IconButton
          onClick={() => setDialogTipo('Despesa')}
          sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          <Add />
        </IconButton>
      </Tooltip>
      <Tooltip title="Adicionar desconto">
        <IconButton
          onClick={() => setDialogTipo('Desconto')}
          sx={{ bgcolor: 'error.main', color: '#fff', '&:hover': { bgcolor: 'error.dark' } }}
        >
          <Remove />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
