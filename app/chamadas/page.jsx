'use client';

// ========== Imports ==========
import React, { useState, useEffect, useRef } from 'react';
import {
  Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Badge,
  Box, Fab, Dialog, DialogTitle, DialogContent, Button, ListItemButton,
  CircularProgress, Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AppBarSearchMenu from '@/components/AppBarSearchMenu';
import SearchInput from '@/components/SearchInput';

// ========== Constantes ==========
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://10.0.0.104/api/db';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://10.0.0.104:3001';

// ========== Helpers ==========
function toChatObject(raw) {
  const isGroup = raw.is_group === '1' || (raw.from || '').endsWith('@g.us');
  const chatKey = isGroup ? raw.from : raw.sender_id || raw.from;
  const ts = raw.timestamp ? new Date(raw.timestamp) : raw.t ? new Date(+raw.t * 1000) : new Date();

  return {
    chatKey,
    isGroup,
    ts,
    name: (isGroup ? raw.group_name : raw.notify_name) || raw.sender_pushname || raw.sender_name || raw.sender_short_name || chatKey,
    messagePreview: raw.message || raw.body || raw.caption || '',
    thumb: raw.sender_profile_thumb || raw.group_profile_pic || undefined,
    badge: raw.from_me === '0' || raw.from_me === false ? 1 : 0,
    raw
  };
}

// ========== Componente Principal ==========
export default function Chamadas() {
  const router = useRouter();
  const socketRef = useRef(null);

  const [busca, setBusca] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [cadastrados, setCadastrados] = useState(new Set());

  // ========== Funções ==========
  const upsertChat = (chat) => {
    setChats((prev) => {
      const map = new Map(prev.map((c) => [c.chatKey, c]));
      const existing = map.get(chat.chatKey);
      if (!existing || chat.ts > existing.ts) {
        const unread = existing ? existing.badge : 0;
        map.set(chat.chatKey, { ...chat, badge: unread + (chat.badge || 0) });
      }
      return Array.from(map.values()).sort((a, b) => b.ts - a.ts);
    });
  };

  const handleRaw = (raw) => {
    if (raw.from === 'status@broadcast') return;
    const chat = toChatObject(raw);
    if (chat.isGroup) return;
    upsertChat(chat);
  };

  // ========== Efeitos ==========
  useEffect(() => {
    fetch(`${API_BASE}/cliente_teste`)
      .then((r) => r.json())
      .then((data) => {
        const ids = new Set(data.map((c) => c.sender_id));
        setCadastrados(ids);
      })
      .catch((err) => console.error('Erro ao buscar clientes cadastrados:', err));
  }, []);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/chat`)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        data.forEach(handleRaw);
        setLoading(false);
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => (active = false);
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      path: '/socket.io'
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[SOCKET] conectado');
      socket.emit('join_dashboard');
    });

    socket.on('chat_message', (msg) => {
      if (!msg?.chatId || msg.from === 'status@broadcast') return;
      console.log('[SOCKET] chat_message:', msg);

      const chat = toChatObject(msg);
      if (chat.isGroup) return;

      const isIncoming = msg.from_me === '0' || msg.from_me === false;
      if (!isIncoming) return;

      setChats((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((c) => c.chatKey === chat.chatKey);

        if (index !== -1) {
          const current = updated[index];
          if (chat.ts > current.ts) {
            updated[index] = {
              ...chat,
              badge: current.badge + 1
            };
          }
        } else {
          updated.push(chat);
        }

        return updated.sort((a, b) => b.ts - a.ts);
      });
    });

    socket.on('ack', (ack) => {
      if (!ack?.id?.remote) return;
      setChats((prev) =>
        prev.map((c) =>
          c.chatKey === ack.id.remote ? { ...c, badge: 0 } : c
        )
      );
    });

    return () => {
      socket.emit('leave_dashboard');
      socket.disconnect();
    };
  }, []);

  // ========== Render ==========
  const filtrados = chats.filter((c) =>
    [c.name, c.messagePreview].some((f = '') => f.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <Box sx={{ mx: 'auto', bgcolor: '#fff', minHeight: '100vh', position: 'relative' }}>
      <AppBarSearchMenu
        title="Lista de Chamadas"
        onBack={() => window.history.back()}
        menuItems={[
          { label: 'Profile', icon: <PersonIcon />, onClick: () => alert('Profile') },
          { label: 'Settings', icon: <SettingsIcon />, onClick: () => alert('Settings') },
          { divider: true },
          { label: 'Logout', icon: <LogoutIcon />, onClick: () => alert('Logout') }
        ]}
        bottomContent={
          <SearchInput
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onClear={() => setBusca('')}
          />
        }
      />

      <Box sx={{ pt: busca ? '128px' : '64px' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        )}

        {!loading && !error && (
          <List>
            {filtrados.map((chat) => {
              const isCadastrado = cadastrados.has(chat.chatKey);
              return (
                <ListItem
                  key={chat.chatKey}
                  divider
                  disablePadding
                  sx={{ bgcolor: isCadastrado ? undefined : '#ffebee' }}
                >
                  <ListItemButton
                    onClick={() => {
                      const telefone = chat.chatKey.replace('@c.us', '');
                      const params = new URLSearchParams({
                        telefone,
                        nome: chat.name,
                        sender_id: chat.chatKey,
                        avatar: chat.thumb || ''
                      });
                      {/*router.push(`/perfil?${params.toString()}`);/</ListItem>*/}
                      router.push(`/chat?jid=${encodeURIComponent(chat.chatKey)}`);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelected(chat);
                      setOpenDialog(true);
                    }}
                  >
                    <ListItemAvatar>
                      <Badge badgeContent={chat.badge || null} color="success">
                        <Avatar src={chat.thumb} />
                      </Badge>
                    </ListItemAvatar>

                    {!isCadastrado && (
                      <ReportProblemIcon color="error" sx={{ mr: 1 }} />
                    )}

                    <ListItemText
                      primary={chat.name}
                      secondary={chat.messagePreview}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {chat.ts.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => alert('Add new conversation')}
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1300 }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Actions for: {selected?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>{selected?.messagePreview}</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button fullWidth variant="contained" onClick={() => {
              if (!selected) return;
              const telefone = selected.chatKey.replace('@c.us', '');
              const params = new URLSearchParams({
                telefone,
                nome: selected.name,
                sender_id: selected.chatKey,
                avatar: selected.thumb || ''
              });
              router.push(`/perfil?${params.toString()}`);
              setOpenDialog(false);
            }}>
              Open
            </Button>

            <Button fullWidth variant="contained" onClick={() => {
              alert('Archive');
              setOpenDialog(false);
            }}>
              Archive
            </Button>

            <Button fullWidth variant="contained" color="error" onClick={() => {
              alert('Delete');
              setOpenDialog(false);
            }}>
              Delete
            </Button>

            <Button fullWidth onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}