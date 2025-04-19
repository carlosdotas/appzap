// DialogSelecao.js
'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, Checkbox, Button, Typography,
  IconButton, Box, TextField, InputAdornment, MenuItem
} from '@mui/material';
import { Add, Star, StarBorder, Search } from '@mui/icons-material';

export function DialogDespesasDescontos({
  dialogTipo,
  opcoesDespesas,
  opcoesDescontos,
  selecionados,
  toggleSelecionado,
  confirmarAdicao,
  setDialogTipo
}) {
  const [opcoesExtras, setOpcoesExtras] = useState([]);
  const [busca, setBusca] = useState('');
  const opcoesOriginais = dialogTipo === 'Despesa' ? opcoesDespesas : opcoesDescontos;
  const todasOpcoes = [...opcoesOriginais, ...opcoesExtras];

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formItem, setFormItem] = useState({ descricao: '', valor: '', tipo: dialogTipo });
  const [editIndex, setEditIndex] = useState(null);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const salvos = localStorage.getItem(`favoritos-${dialogTipo}`);
    if (salvos) setFavoritos(JSON.parse(salvos));

    const extrasSalvos = localStorage.getItem(`extras-${dialogTipo}`);
    if (extrasSalvos) setOpcoesExtras(JSON.parse(extrasSalvos));
  }, [dialogTipo]);

  const salvarFavoritos = (novos) => {
    setFavoritos(novos);
    localStorage.setItem(`favoritos-${dialogTipo}`, JSON.stringify(novos));
  };

  const salvarExtras = (novos) => {
    setOpcoesExtras(novos);
    localStorage.setItem(`extras-${dialogTipo}`, JSON.stringify(novos));
  };

  const toggleFavorito = (descricao) => {
    const atualizados = favoritos.includes(descricao)
      ? favoritos.filter(f => f !== descricao)
      : [...favoritos, descricao];
    salvarFavoritos(atualizados);
  };

  const normalizarTexto = (texto) =>
    texto.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ç/g, 'c').replace(/Ç/g, 'C').toLowerCase();

  const opcoesFiltradas = [...todasOpcoes].filter(item =>
    normalizarTexto(item.descricao).includes(normalizarTexto(busca))
  ).sort((a, b) => {
    const aFav = favoritos.includes(a.descricao);
    const bFav = favoritos.includes(b.descricao);
    return aFav === bFav ? 0 : aFav ? -1 : 1;
  });

  const handleOpenForm = (item = { descricao: '', valor: '', tipo: dialogTipo }, index = null) => {
    setFormItem(item);
    setEditIndex(index);
    setFormDialogOpen(true);
  };

  const handleFormChange = (field) => (e) => {
    setFormItem((prev) => ({
      ...prev,
      [field]: field === 'valor' ? parseFloat(e.target.value) || 0 : e.target.value
    }));
  };

  const handleFormSubmit = () => {
    if (!formItem.descricao || !formItem.valor) return;

    if (editIndex !== null) {
      toggleSelecionado(opcoesFiltradas[editIndex]);
      toggleSelecionado(formItem);
    } else {
      salvarExtras([...opcoesExtras, formItem]);
      toggleSelecionado(formItem);
    }

    setFormDialogOpen(false);
    setFormItem({ descricao: '', valor: '', tipo: dialogTipo });
    setEditIndex(null);
  };

  const handleRightClick = (e, item, index) => {
    e.preventDefault();
    handleOpenForm(item, index);
  };

  return (
    <>
      <Dialog open={!!dialogTipo} onClose={() => setDialogTipo(null)} fullWidth maxWidth="xs">
        <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
          <DialogTitle sx={{ fontSize: '1rem', p: 0 }}>
            Selecionar {dialogTipo === 'Despesa' ? 'Despesas' : 'Descontos'}
          </DialogTitle>
          <IconButton size="small" onClick={() => handleOpenForm()}>
            <Add fontSize="small" />
          </IconButton>
        </Box>

        <Box px={2} pt={1}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Buscar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              )
            }}
          />
        </Box>

        <DialogContent dividers sx={{ px: 1 }}>
          <List disablePadding>
            {opcoesFiltradas.map((item, idx) => {
              const selecionado = !!selecionados.find(i => i.descricao === item.descricao);
              const favorito = favoritos.includes(item.descricao);
              return (
                <ListItem
                  key={idx}
                  button
                  onClick={() => toggleSelecionado(item)}
                  onContextMenu={(e) => handleRightClick(e, item, idx)}
                  sx={{
                    borderRadius: 1,
                    px: 1,
                    py: 0.5,
                    bgcolor: selecionado ? 'action.selected' : 'transparent',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  secondaryAction={
                    <IconButton edge="end" size="small" onClick={() => toggleFavorito(item.descricao)}>
                      {favorito ? <Star fontSize="small" color="warning" /> : <StarBorder fontSize="small" />}
                    </IconButton>
                  }
                >
                  <Checkbox checked={selecionado} size="small" sx={{ mr: 1 }} />
                  <ListItemText
                    primary={
                      <Typography fontWeight={500} fontSize="0.9rem">
                        {item.descricao}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" fontSize="0.75rem" color="text.secondary">
                        R$ {item.valor.toFixed(2)}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 1 }}>
          <Button onClick={() => setDialogTipo(null)} size="small">Cancelar</Button>
          <Button
            variant="contained"
            onClick={confirmarAdicao}
            disabled={selecionados.length === 0}
            size="small"
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontSize: '1rem' }}>{editIndex !== null ? 'Editar' : 'Adicionar'} Item</DialogTitle>
        <DialogContent sx={{ px: 2, pt: 1 }}>
          <TextField
            fullWidth
            label="Tipo"
            select
            value={formItem.tipo}
            onChange={handleFormChange('tipo')}
            size="small"
            sx={{ mb: 2 }}
          >
            <MenuItem value="Despesa">Despesa</MenuItem>
            <MenuItem value="Desconto">Desconto</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Descrição"
            variant="outlined"
            value={formItem.descricao}
            onChange={handleFormChange('descricao')}
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Valor"
            type="number"
            variant="outlined"
            value={formItem.valor}
            onChange={handleFormChange('valor')}
            size="small"
            inputProps={{ step: '0.01' }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1 }}>
          <Button onClick={() => setFormDialogOpen(false)} size="small">Cancelar</Button>
          <Button variant="contained" onClick={handleFormSubmit} size="small">
            {editIndex !== null ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}