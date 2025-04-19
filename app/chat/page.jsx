'use client';

import React, { useState, useEffect, useLayoutEffect, useRef, Suspense } from 'react';
import {
  Box,
  List
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';
import TopoDoChat from './components/TopoDoChat';
import CampoDeTexto from './components/CampoDeTexto';
import Mensagem from './components/Mensagem';
import { getContatoInfo, scrollParaFim, enviarMensagem } from './components/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://10.0.0.104/api/db';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://10.0.0.104:3001';

function ChatPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jid = searchParams.get('jid');

  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const fimDaListaRef = useRef(null);
  const socketRef = useRef(null);

  const { nome, avatar, phone, nome_curto, sender_id } = getContatoInfo(mensagens);

  useEffect(() => {
    if (!jid) router.push('/');
  }, [jid, router]);

  useEffect(() => {
    if (!jid) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join_chat', { chatId: jid });
    });

    socketRef.current.on('chat_message', (msg) => {
      if (msg.chatId === jid) {
        setMensagens((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current?.emit('leave_chat', { chatId: jid });
      socketRef.current?.disconnect();
    };
  }, [jid]);

  useEffect(() => {
    if (!jid) return;
    fetch(`${API_BASE}/chat?chatId=${encodeURIComponent(jid)}`)
      .then((res) => res.json())
      .then((data) => setMensagens(data.filter((m) => m.chatId === jid)))
      .catch(console.error);
  }, [jid]);

  useLayoutEffect(() => {
    scrollParaFim(fimDaListaRef);
  }, [mensagens]);

  const handleEnviar = () => {
    enviarMensagem({ jid, mensagem, setMensagens, setMensagem, socketUrl: SOCKET_URL });
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#e5ddd5' }}>
      <TopoDoChat nome={nome} avatar={avatar} phone={phone} nome_curto={nome_curto} sender_id={sender_id} onVoltar={() => router.back()} />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 8, px: 2, pb: 10 }}>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {mensagens.map((msg, idx) => <Mensagem key={idx} msg={msg} />)}
          <div ref={fimDaListaRef} />
        </List>
      </Box>

      <CampoDeTexto mensagem={mensagem} setMensagem={setMensagem} onEnviar={handleEnviar} />
    </Box>
  );
}

export default function ChatPageWrapper() {
  return (
    <Suspense fallback={<div>Carregando chat...</div>}>
      <ChatPageClient />
    </Suspense>
  );
}