'use client';

import React, { useState } from 'react';
import {
  Typography,
  Box,
  Stack,
  Divider,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton,
  Avatar,
  ToggleButton, 
  ToggleButtonGroup
} from '@mui/material';
import { Delete } from '@mui/icons-material';

export default function DespesasSection({ form }) {
  
  const [despesas, setDespesas] = useState([
    { descricao: 'Transporte', valor: 40.0 },
    { descricao: 'Taxa de operação', valor: 5.99 },
  ]);

  const [descontos, setDescontos] = useState([
    { descricao: 'Desconto concedido', valor: 15.0 },
    { descricao: 'Bônus fidelidade', valor: 10.0 },
  ]);

  const [novoItem, setNovoItem] = useState({ tipo: 'Despesa', descricao: '', valor: '' });
  const [dialogOpen, setDialogOpen] = useState(false);

  const listaCombinada = [
    ...despesas.map((item, index) => ({ ...item, tipo: 'Despesa', index })),
    ...descontos.map((item, index) => ({ ...item, tipo: 'Desconto', index })),
  ];

  const handleSalvar = () => {
    const item = { descricao: novoItem.descricao, valor: parseFloat(novoItem.valor) || 0 };

    if (novoItem.tipo === 'Despesa') {
      setDespesas((prev) => [...prev, item]);
    } else {
      setDescontos((prev) => [...prev, item]);
    }

    setNovoItem({ tipo: 'Despesa', descricao: '', valor: '' });
    setDialogOpen(false);
  };

  const handleExcluir = (index, tipo) => {
    if (tipo === 'Despesa') {
      setDespesas((prev) => prev.filter((_, i) => i !== index));
    } else {
      setDescontos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2">Despesas e Descontos</Typography>
        <Button
          onClick={() => setDialogOpen(true)}
          size="small"
          sx={{
            minWidth: 36,
            padding: 0,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          +
        </Button>

      </Box>

      <Stack spacing={1} divider={<Divider flexItem />} sx={{ bgcolor: '#f9f9f9', borderRadius: 2, p: 2 }}>
        {listaCombinada.map((item, idx) => (
          <Box key={idx} display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: item.tipo === 'Despesa' ? 'error.main' : 'primary.main',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                {item.tipo === 'Despesa' ? '–' : '+'}
              </Avatar>

              <Box>
                <Typography variant="body2">{item.descricao}</Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color={item.tipo === 'Despesa' ? 'error.main' : 'primary.main'}
                >
                  R$ {parseFloat(item.valor).toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" color="error" onClick={() => handleExcluir(item.index, item.tipo)}>
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>

      {/* Dialog de Adição */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Adicionar Despesa ou Desconto</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ToggleButtonGroup
            value={novoItem.tipo}
            exclusive
            onChange={(e, val) => val && setNovoItem({ ...novoItem, tipo: val })}
            fullWidth
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                flex: 1,
                textTransform: 'none',
                fontWeight: 'bold',
              },
            }}
          >
            <ToggleButton value="Despesa" color="error">
              Despesa
            </ToggleButton>
            <ToggleButton value="Desconto" color="primary">
              Desconto
            </ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Descrição"
            size="small"
            value={novoItem.descricao}
            onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })}
            fullWidth
          />

          <TextField
            label="Valor"
            size="small"
            type="number"
            value={novoItem.valor}
            onChange={(e) => setNovoItem({ ...novoItem, valor: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSalvar}
            disabled={!novoItem.descricao || !novoItem.valor}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
