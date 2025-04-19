'use client';

import React from 'react';
import {
  Paper,
  Avatar,
  Typography,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

/**
 * Cartão de navegação do menu principal.
 * @param {Object} props
 * @param {JSX.Element} props.icon - Ícone do item.
 * @param {string} props.title - Título do item.
 * @param {string} props.subtitle - Subtítulo descritivo.
 * @param {function} props.onClick - Ação ao clicar no item.
 */
export default function MenuCard({ icon, title, subtitle, onClick }) {
    
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 8,
        px: 2,
        py: 1.5,
        mb: 2,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
      }}
      onClick={onClick}
    >
      <ListItem disablePadding>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: 'white' }}>{icon}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={<Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>}
          secondary={subtitle}
        />
      </ListItem>
    </Paper>
  );
}
