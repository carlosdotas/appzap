'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { ListaDeItens } from './components/ListaDeItens';
import { RodapeResumo } from './components/RodapeResumo';
import { DialogAcoes } from './components/DialogAcoes';
import { DialogDespesasDescontos } from './components/DialogDespesasDescontos';

export default function DespesasEReceitas() {
  const [dialogTipo, setDialogTipo] = useState(null);
  const [selecionados, setSelecionados] = useState([]);
  const [subtitulo, setSubtitulo] = useState('');
  const [alertaAberto, setAlertaAberto] = useState(false);

  const opcoesDespesas = [
    { descricao: 'Coleta 10', valor: 10 },
    { descricao: 'Entrega 5', valor: 5 },
    // ... demais opções
  ];

  const opcoesDescontos = [
    { descricao: 'Desconto fidelidade', valor: 20 },
    { descricao: 'Cupom FRETE10', valor: 10 },
    { descricao: 'Desconto parceria', valor: 5 }
  ];

  const [form, setForm] = useState({
    despesas: [],
    descontos: [],
    cliente: '',
    pedido: '',
    dataPagamento: new Date().toISOString().split('T')[0],
    statusPagamento: '',
    total: 0
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pedido = params.get('pedido');
    const despesasParam = params.get('despesas');
    const receitasParam = params.get('receitas');
    const cliente = params.get('cliente');

    try {
      const despesas = despesasParam ? JSON.parse(despesasParam) : [];
      const descontos = receitasParam ? JSON.parse(receitasParam) : [];

      setForm((prev) => ({
        ...prev,
        pedido: pedido || '',
        cliente: cliente || '',
        despesas: Array.isArray(despesas) ? despesas : [],
        descontos: Array.isArray(descontos) ? descontos : []
      }));

      if (!pedido) {
        setAlertaAberto(true);
      } else {
        setSubtitulo(`Pedido #${pedido}${cliente ? ` - ${cliente}` : ''}`);
      }
    } catch (e) {
      console.error('Erro ao carregar dados da URL:', e);
    }
  }, []);

  const excluirItem = useCallback((index, tipo) => {
    setForm((prev) => {
      const chave = tipo === 'Despesa' ? 'despesas' : 'descontos';
      const novaLista = prev[chave].filter((_, i) => i !== index);
      return { ...prev, [chave]: novaLista };
    });
  }, []);

  const adicionarItemComDados = (tipo, item) => {
    setForm((prev) => ({
      ...prev,
      [tipo === 'Despesa' ? 'despesas' : 'descontos']: [
        ...prev[tipo === 'Despesa' ? 'despesas' : 'descontos'],
        item
      ]
    }));
  };

  const editarItem = useCallback((index, tipo, campo, valor) => {
    setForm((prev) => {
      const chave = tipo === 'Despesa' ? 'despesas' : 'descontos';
      const novaLista = [...prev[chave]];
      novaLista[index] = { ...novaLista[index], [campo]: campo === 'valor' ? +valor : valor };
      return { ...prev, [chave]: novaLista };
    });
  }, []);

  const totalDespesas = useMemo(() => form.despesas.reduce((sum, { valor }) => sum + +valor, 0), [form.despesas]);
  const totalDescontos = useMemo(() => form.descontos.reduce((sum, { valor }) => sum + +valor, 0), [form.descontos]);
  const valorPagar = useMemo(() => (form.total + totalDespesas - totalDescontos).toFixed(2), [form.total, totalDespesas, totalDescontos]);

  const listaCombinada = useMemo(() => [
    ...form.despesas.map((i, idx) => ({ ...i, tipo: 'Despesa', index: idx })),
    ...form.descontos.map((i, idx) => ({ ...i, tipo: 'Desconto', index: idx }))
  ], [form.despesas, form.descontos]);

  const toggleSelecionado = (item) => {
    const exists = selecionados.find((i) => i.descricao === item.descricao);
    if (exists) {
      setSelecionados(selecionados.filter((i) => i.descricao !== item.descricao));
    } else {
      setSelecionados([...selecionados, item]);
    }
  };

  const confirmarAdicao = () => {
    selecionados.forEach((item) => adicionarItemComDados(dialogTipo, item));
    setSelecionados([]);
    setDialogTipo(null);
  };

  return (
    <Box bgcolor="#f9f9f9" minHeight="100vh">
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Box display="flex" alignItems="center">
              <IconButton edge="start" onClick={() => window.history.back()}>
                <ArrowBackIcon />
              </IconButton>
              <Box>
                <Typography variant="h6">Pagamento</Typography>
                <Typography variant="caption" color="text.secondary">
                  {subtitulo}
                </Typography>
              </Box>
            </Box>
          </Box>
          <DialogAcoes setDialogTipo={setDialogTipo} />
        </Toolbar>
      </AppBar>

      <Box p={2}>
        <ListaDeItens itens={listaCombinada} onDelete={excluirItem} onEdit={editarItem} />
      </Box>

      <Box position="fixed" bottom={0} left={0} width="100%">
        <RodapeResumo
          pedido={form.pedido}
          despesas={totalDespesas}
          descontos={totalDescontos}
          valorFinal={valorPagar}
          status={form.statusPagamento}
          onClickPagamento={() => console.log('Abrir confirmação de pagamento')}
        />
      </Box>

      <DialogDespesasDescontos
        dialogTipo={dialogTipo}
        opcoesDespesas={opcoesDespesas}
        opcoesDescontos={opcoesDescontos}
        selecionados={selecionados}
        toggleSelecionado={toggleSelecionado}
        confirmarAdicao={confirmarAdicao}
        setDialogTipo={setDialogTipo}
      />

      <Dialog open={alertaAberto} onClose={() => { }} disableEscapeKeyDown disableBackdropClick>
        <DialogTitle>
          <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
            <Typography variant="h6" align="center">Número do pedido ausente</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography align="center">
            Para continuar, é necessário informar o número do pedido na URL.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant="contained" color="error" onClick={() => window.history.back()}>
            Voltar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
