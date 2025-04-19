'use client';
import React from 'react';
import { Paper, Typography, IconButton, Box } from '@mui/material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';

const btnGhost = {
  flex: 1,
  padding: '8px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#e0e0e0',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const btnPrimary = {
  flex: 1,
  padding: '8px',
  borderRadius: '8px',
  backgroundColor: '#25d366',
  color: 'white',
  textAlign: 'center',
  fontWeight: 'bold',
  textDecoration: 'none'
};

function renderMessageContent(msg) {
  const isLocation = msg.meta_data && JSON.parse(msg.meta_data)?.type === 'location';
  const isMapLink = typeof msg.message === 'string' && msg.message.includes('https://maps.app.goo.gl/');

  if (isLocation) {
    const { lat, lng, description } = JSON.parse(msg.meta_data);
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box component="img" src={`https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=300x150&markers=${lat},${lng},red`} alt="Mapa" sx={{ borderRadius: 2, width: '100%' }} />
        {description && <Typography variant="body2">{description}</Typography>}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <button style={btnGhost}>Adicionar Local</button>
          <a style={btnPrimary} href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noopener noreferrer">Ver no Maps</a>
        </Box>
      </Box>
    );
  }

  if (isMapLink) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <img src="/map-preview.jpg" alt="Mapa" style={{ borderRadius: 8, width: '100%' }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <button style={btnGhost}>Adicionar Local</button>
          <a style={btnPrimary} href={msg.message} target="_blank" rel="noopener noreferrer">Ver no Maps</a>
        </Box>
      </Box>
    );
  }

  if (msg.contentType?.includes('audio')) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
        <IconButton
          onClick={() => {
            const audio = document.getElementById(`audio-${msg.message_id}`);
            if (audio.paused) audio.play(); else audio.pause();
          }}
          sx={{ bgcolor: '#25d366', color: '#fff' }}
        >
          <PlayArrowIcon />
        </IconButton>
        <audio id={`audio-${msg.message_id}`} style={{ display: 'none' }} onEnded={(e) => (e.target.currentTime = 0)}>
          {/* <source src={msg.media_url} type={msg.contentType?.split(';')[0]} /> */}
          <source src={msg.media_url?.replace('localhost', '10.0.0.104')} type={msg.contentType?.split(';')[0]} />

          Seu navegador não suporta áudio.
        </audio>
      </Box>
    );
  }

  if (msg.media_url) {
    return (
      <>
        <img src={msg.media_url} alt={msg.media_filename || 'Mídia'} style={{ maxWidth: '100%', borderRadius: 8 }} />
        {msg.caption && <Typography variant="body2" sx={{ mt: 0.5 }}>{msg.caption}</Typography>}
      </>
    );
  }

  return <Typography variant="body2">{msg.message}</Typography>;
}

export default function Mensagem({ msg }) {
  const isMe = msg.from_me === '1' || msg.from_me === true;
  return (
    <Box sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
      <Paper sx={{
        p: 1.5,
        borderRadius: 2,
        maxWidth: '75%',
        bgcolor: isMe ? '#dcf8c6' : 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMe ? 'flex-end' : 'flex-start'
      }}>
        {renderMessageContent(msg)}
        <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </Paper>
    </Box>
  );
}
