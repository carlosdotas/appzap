'use client';
import React from 'react';
import { IconButton, TextField, Box } from '@mui/material';
import {
  EmojiEmotions as EmojiEmotionsIcon,
  LocalShipping as AttachFileIcon,
  CameraAlt as CameraAltIcon,
  Mic as MicIcon,
  Send as SendIcon
} from '@mui/icons-material';

export default function CampoDeTexto({ mensagem, setMensagem, onEnviar }) {
  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, px: 2, py: 1, bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', gap: 1 }}>
      {[AttachFileIcon, CameraAltIcon].map((Icon, i) => (
        <IconButton key={i}><Icon /></IconButton>
      ))}
      <TextField
        placeholder="Mensagem"
        variant="outlined"
        size="small"
        fullWidth
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onEnviar()}
        sx={{ backgroundColor: '#fff', borderRadius: 5 }}
      />
      <IconButton color="primary" onClick={onEnviar}>
        {mensagem.trim() ? <SendIcon /> : <MicIcon />}
      </IconButton>
    </Box>
  );
}
