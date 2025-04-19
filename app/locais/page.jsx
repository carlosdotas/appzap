'use client';

import React, { useState, Suspense } from 'react';
import {
  Box, Stack, IconButton, Tooltip, Avatar, TextField, Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, Button, Fab
} from '@mui/material';
import { Storefront, Delete, Add, Info } from '@mui/icons-material';
import Dialogs from '@/components/Dialogs';

const options = ["Rua das Flores", "Av. Brasil", "Praça Central", "Estrada Velha", "Rua Nova Esperança"];

const LocalInput = ({ item, index, locais, onChange, onOpenDialog, onRemove, onAdd }) => (
  <Box display="flex" alignItems="center" width="100%" gap={1}>
    <Box flex={1}>
      <Autocomplete
        freeSolo
        options={options}
        value={item.valor}
        onInputChange={(_, newValue) => {
          const shouldAdd = newValue && !locais[index].valor && index === locais.length - 1;
          onChange(index, newValue);
          if (shouldAdd) onAdd();
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Local ${String.fromCharCode(65 + index)}`}
            fullWidth
            sx={{ bgcolor: '#fff' }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <Box sx={{ pl: 1, display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: item.dados.nome && item.dados.telefone && item.dados.detalhes ? 'success.main' : 'transparent',
                      color: item.dados.nome && item.dados.telefone && item.dados.detalhes ? 'white' : 'inherit',
                      borderRadius: '50%',
                      width: 32,
                      height: 32
                    }}
                  >
                    <IconButton size="small" onClick={() => onOpenDialog(index)} sx={{ width: '100%', height: '100%' }}>
                      <Info fontSize="small" />
                    </IconButton>
                    {item.dados.nome && item.dados.telefone && item.dados.detalhes && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bgcolor: 'white',
                          color: 'success.main',
                          borderRadius: '50%',
                          width: 14,
                          height: 14,
                          fontSize: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold'
                        }}
                      >
                        ✓
                      </Box>
                    )}
                  </Box>
                  {params.InputProps.startAdornment}
                </Box>
              )
            }}
          />
        )}
      />
    </Box>
    <IconButton onClick={() => onRemove(index)} color="error">
      <Delete />
    </IconButton>
  </Box>
);

const FormDialog = ({ open, onClose, onSave, data, onChange }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Dados do Usuário</DialogTitle>
    <DialogContent>
      <Stack spacing={2} mt={1}>
        {['nome', 'telefone', 'detalhes'].map((field, i) => (
          <TextField
            key={i}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            value={data[field]}
            onChange={(e) => onChange(field, e.target.value)}
            fullWidth
            multiline={field === 'detalhes'}
            rows={field === 'detalhes' ? 3 : 1}
          />
        ))}
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit">Fechar</Button>
      <Button onClick={onSave} color="primary" variant="contained">Salvar</Button>
    </DialogActions>
  </Dialog>
);

export default function LocalDialogPage() {
  const [open, setOpen] = useState(true);
  const [formDialog, setFormDialog] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [locais, setLocais] = useState([{ valor: '', dados: { nome: '', telefone: '', detalhes: '' } }]);

  const updateCampo = (index, value) => {
    setLocais(prev => prev.map((item, i) => i === index ? { ...item, valor: value } : item));
  };

  const adicionarCampo = () => setLocais(prev => [...prev, { valor: '', dados: { nome: '', telefone: '', detalhes: '' } }]);

  const removerCampo = (index) => setLocais(prev => prev.filter((_, i) => i !== index));

  const abrirFormulario = (index) => {
    setCurrentIndex(index);
    setFormDialog(true);
  };

  const atualizarDados = () => setFormDialog(false);

  const handleFormChange = (field, value) => {
    setLocais(prev => {
      const novos = [...prev];
      novos[currentIndex].dados[field] = value;
      return novos;
    });
  };

  const salvar = async () => {
    try {
      const res = await fetch('/api/locais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locais })
      });

      const data = await res.json();
      if (data.success) {
        alert('Locais salvos com sucesso!');
        setOpen(false);
      } else {
        alert('Erro ao salvar: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao enviar:', error);
      alert('Erro inesperado ao salvar.');
    }
  };

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <>
        <Dialogs
          open={open}
          onClose={() => setOpen(false)}
          title="Locais"
          description="Detalhes dos locais"
          leadingAvatar={<Avatar src="/logo.jpg" />}
          showBackButton
          actions={
            <Tooltip title="Adicionar Localização">
              <IconButton onClick={adicionarCampo}><Add /></IconButton>
            </Tooltip>
          }
        >
          <Stack spacing={2}>
            {locais.map((item, index) => (
              <LocalInput
                key={index}
                item={item}
                index={index}
                locais={locais}
                onChange={updateCampo}
                onOpenDialog={abrirFormulario}
                onRemove={removerCampo}
                onAdd={adicionarCampo}
              />
            ))}
          </Stack>
          <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
            <Tooltip title="Salvar">
              <Fab color="primary" onClick={salvar}>
                <Storefront />
              </Fab>
            </Tooltip>
          </Box>
        </Dialogs>

        {currentIndex !== null && (
          <FormDialog
            open={formDialog}
            onClose={() => setFormDialog(false)}
            onSave={atualizarDados}
            data={locais[currentIndex].dados}
            onChange={handleFormChange}
          />
        )}
      </>
    </Suspense>
  );
}