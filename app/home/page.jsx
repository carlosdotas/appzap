'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Fab,
  Avatar,
} from '@mui/material';
import { useRouter } from 'next/navigation';

// Ícones
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Componente separado
import MenuCard from './components/MenuCard';

/**
 * Componente principal do menu da aplicação.
 */
export default function MenuPrincipal() {
  const router = useRouter();

  // Itens do menu com suas respectivas rotas
  const cards = [
    {
      icon: <PersonIcon fontSize="large" color="success" />,
      title: 'Chamadas',
      subtitle: 'Gerencie os clientes do sistemas',
      onClick: () => router.push('/chamadas'),
    },
    {
      icon: <ShoppingCartIcon fontSize="large" color="success" />,
      title: 'Pedidos',
      subtitle: 'Ver e gerenciar pedidos',
      onClick: () => router.push('/pedidos'),
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#d4f4b4',
        backgroundImage: 'url(/bg-pattern.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top',
        position: 'relative',
        px: 2,
        pt: 8,
      }}
    >
      {/* AppBar com logo e ícone de perfil */}
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src="/logo.png" alt="logo" sx={{ width: 32, height: 32 }} />
            <Typography variant="h6">ZAP Encomendas</Typography>
          </Box>
          <IconButton>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Conteúdo principal com os cards */}
      <Box sx={{ mt: 2 }}>
        {cards.map((card, index) => (
          <MenuCard
            key={index}
            icon={card.icon}
            title={card.title}
            subtitle={card.subtitle}
            onClick={card.onClick}
          />
        ))}
      </Box>

      {/* Botão flutuante para nova ação */}
      <Fab
        color="success"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => alert('Nova ação')}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
