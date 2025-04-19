'use client';

import React, { useState } from 'react';
import {
  Button,
  Avatar,
  Box,
  Typography,
  TextField
} from '@mui/material';

import Dialogs from '@/components/Dialogs';

export default function DialogExample() {
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState({
    nome: 'Fabiana Nascimento',
    email: 'fabiana@email.com',
    telefone: '(62) 99999-0000',
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleOpenDrawer = () => {
    console.log('[DialogExample] Disparando evento para abrir drawer');
    const drawerToggleEvent = new CustomEvent('toggleDrawerFromOutside');
    window.dispatchEvent(drawerToggleEvent);
  };

  const handleSave = () => {
    console.log('Dados salvos:', form);
    setOpen(false);
  };

  const [dialogProps, setDialogProps] = useState({
    open,
    onClose: () => setOpen(false),
    title: 'Painel',
    description: 'Escolha uma seção',
    avatar: <Avatar src="/fabiana.jpg" />,
    leadingAvatar: <Avatar src="/logo.jpg" />,
    showBackButton: false,
    actions: (
      <Button color="primary" onClick={() => console.log('Editar')}>
        Editar
      </Button>
    ),
    sideMenu: (
      <Box display="flex" flexDirection="column" gap={2}>
        <Button variant="outlined" fullWidth>Perfil</Button>
        <Button variant="outlined" fullWidth>Endereço</Button>
        <Button variant="outlined" fullWidth>Pedidos</Button>
      </Box>
    ),
    subHeader: (
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2">Informações adicionais</Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={handleOpenDrawer}
        >
          Abrir Drawer
        </Button>
      </Box>
    ),
    bottomActions: (
      <Box display="flex" justifyContent="flex-end" gap={2} width="100%">
        <Button onClick={() => setOpen(false)} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Salvar
        </Button>
      </Box>
    ),
    children: (
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Nome"
          fullWidth
          value={form.nome}
          onChange={handleChange('nome')}
        />
        <TextField
          label="Email"
          fullWidth
          value={form.email}
          onChange={handleChange('email')}
        />
        <TextField
          label="Telefone"
          fullWidth
          value={form.telefone}
          onChange={handleChange('telefone')}
        />
      </Box>
    )
  });

  return <Dialogs {...dialogProps} />;
}
