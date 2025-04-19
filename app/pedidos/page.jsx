'use client';

import React, { useEffect, useState } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Chip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  ListItemButton,
  CircularProgress,
} from '@mui/material';

import {
  DirectionsCar,
  ShoppingCart,
  LocalShipping,
  CheckCircle,
  Add as AddIcon,
  CalendarToday,
} from '@mui/icons-material';

import {
  LocalizationProvider,
  StaticDatePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import { useRouter } from 'next/navigation';     // ← navegação

// Components
import AppBarSearchMenu from '@/components/AppBarSearchMenu';
import SearchInput from '@/components/SearchInput';

export default function PedidosList() {
  const router = useRouter();                    // ← hook router

  const [busca, setBusca] = useState('');
  const [selected, setSelected] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- calendário ---------- */
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [openCalDialog, setOpenCalDialog] = useState(false);

  /* ---------- clique‑longo ---------- */
  const handleContextMenu = (e, pedido) => {
    e.preventDefault();
    setSelected(pedido);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelected(null);
  };

  /* ---------- busca pedidos ---------- */
  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          'https://zapencomendas.com.br/server/pedidos/list_pedidos/'
        );
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const dataFiltro = selectedDate.format('YYYY-MM-DD');

          const pedidosFiltrados = json.data
            .filter((p) => p.data === dataFiltro)
            .map((p) => ({
              id: p.id,                           // numérico para navegação
              idLabel: `#${p.id}`,               // string para exibir
              nome: p.cliente,
              empresa: p.local,
              cidade: p.cidade || p.locais_cidade || '',
              valor: `R$ ${parseFloat(p.valor).toFixed(2)}`,
              data: p.data,
              tipo: p.tipo_encomenda?.toLowerCase() === 'entrega'
                ? 'Entrega'
                : 'Coleta',
              aprovado: p.etapa?.toLowerCase() === 'aprovado',
              status: p.detalhes?.toLowerCase().includes('frágil')
                ? 'Frágil'
                : null,
              endereco: p.detalhes?.trim() || null,
            }));

          setPedidos(pedidosFiltrados);
        }
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [selectedDate]);

  /* ---------- filtro de busca ---------- */
  const pedidosFiltrados = pedidos.filter(
    (p) =>
      p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      p.empresa?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          mx: 'auto',
          bgcolor: '#f1fdf1',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        <AppBarSearchMenu
          title="Listagem de Pedidos"
          onBack={() => window.history.back()}
          bottomContent={
            <SearchInput
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onClear={() => setBusca('')}
            />
          }
        />

        {/* ---------- LISTA ---------- */}
        <Box sx={{ pt: busca ? '128px' : '64px', px: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {pedidosFiltrados.map((pedido) => (
                <ListItem
                  key={pedido.id}
                  disablePadding
                  sx={{
                    mb: 1,
                    borderLeft: `6px solid ${
                      pedido.valor === 'R$ 0.01' ? 'red' : 'green'
                    }`,
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: 1,
                  }}
                >
                  <ListItemButton
                    onClick={() => router.push(`/pedidos/${pedido.id}`)}   // ← navega
                    onContextMenu={(e) => handleContextMenu(e, pedido)}    // clique‑longo
                  >
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 1,
                      }}
                    >
                      {/* ESQUERDA */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {pedido.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {pedido.empresa}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pedido.cidade}
                        </Typography>

                        {pedido.endereco && (
                          <Typography
                            variant="caption"
                            sx={{
                              mt: 0.5,
                              display: 'inline-block',
                              bgcolor: '#d32f2f',
                              color: '#fff',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                            }}
                          >
                            {pedido.endereco}
                          </Typography>
                        )}

                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.5,
                            mt: 1,
                          }}
                        >
                          <Chip label="Carro" icon={<DirectionsCar />} size="small" />
                          <Chip
                            label={pedido.tipo}
                            icon={
                              pedido.tipo === 'Entrega' ? (
                                <LocalShipping />
                              ) : (
                                <ShoppingCart />
                              )
                            }
                            size="small"
                          />
                          {pedido.aprovado && (
                            <Chip
                              label="Aprovado"
                              icon={<CheckCircle />}
                              color="success"
                              size="small"
                            />
                          )}
                          {pedido.status === 'Frágil' && (
                            <Chip label="Frágil" color="error" size="small" />
                          )}
                        </Box>
                      </Box>

                      {/* DIREITA */}
                      <Box sx={{ minWidth: 100, textAlign: 'right' }}>
                        <Typography variant="h6" color="error">
                          {pedido.valor}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {pedido.data}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {pedido.idLabel}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* ---------- FAB CALENDÁRIO ---------- */}
        <Fab
          color="secondary"
          size="medium"
          aria-label="calendar"
          onClick={() => setOpenCalDialog(true)}
          sx={{
            position: 'fixed',
            bottom: 88,
            right: 16,
            zIndex: 1300,
          }}
        >
          <CalendarToday />
        </Fab>

        {/* ---------- FAB ADD ---------- */}
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => router.push('/pedidos/adicionar')}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1300,
          }}
        >
          <AddIcon />
        </Fab>

        {/* ---------- DIALOG AÇÕES ---------- */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Ações para: {selected?.nome}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {selected?.empresa}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push(`/pedidos/${selected?.id}`)}
              >
                Ver Detalhes
              </Button>
              <Button variant="contained" fullWidth onClick={() => alert('Marcar como entregue')}>
                Marcar como Entregue
              </Button>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => alert('Cancelar pedido')}
              >
                Cancelar
              </Button>
              <Button fullWidth onClick={handleCloseDialog}>
                Fechar
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* ---------- DIALOG CALENDÁRIO ---------- */}
        <Dialog open={openCalDialog} onClose={() => setOpenCalDialog(false)}>
          <DialogTitle>Escolha a data</DialogTitle>
          <StaticDatePicker
            displayStaticWrapperAs="mobile"
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
              setOpenCalDialog(false);
            }}
            disableFuture
            showDaysOutsideCurrentMonth
          />
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
