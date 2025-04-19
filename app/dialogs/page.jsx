'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box, Stack, IconButton, Tooltip, Avatar, Typography, Divider, TextField
} from '@mui/material';
import { Storefront, AttachMoney, Delete } from '@mui/icons-material';
import Dialogs from '@/components/Dialogs';

/* COMPONENTE: Campo resumo */
const ResumoBox = ({ label, value, bg, color, fontSize = '0.75rem' }) => (
  <TextField
    label={label}
    value={`R$ ${value.toFixed(2)}`}
    size="small"
    InputProps={{
      readOnly: true,
      sx: { bgcolor: bg, color: '#fff', fontWeight: 'bold', px: 2, borderRadius: 2, fontSize }
    }}
    InputLabelProps={{
      sx: { fontWeight: 'bold', color, px: 1, bgcolor: '#f5f5f5', borderRadius: 2 }
    }}
    fullWidth
  />
);

/* COMPONENTE: Lista de despesas e descontos */
const ListaDeItens = ({ itens, onDelete }) => (
  <Stack spacing={1} divider={<Divider flexItem />} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }}>
    {itens.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        Nenhuma entrada adicionada.
      </Typography>
    ) : (
      itens.map((item, idx) => (
        <Box key={idx} display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: item.tipo === 'Despesa' ? 'primary.main' : 'error.main' }}>
              {item.tipo === 'Despesa' ? '–' : '+'}
            </Avatar>
            <Box>
              <Typography variant="body2">{item.descricao}</Typography>
              <Typography variant="body2" fontWeight="bold" color={item.tipo === 'Despesa' ? 'primary.main' : 'error.main'}>
                R$ {(+item.valor).toFixed(2)}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" color="error" onClick={() => onDelete(item.index, item.tipo)}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ))
    )}
  </Stack>
);

/* COMPONENTE: Botão de confirmação de pagamento */
const BotaoPagamento = ({ status, onClick }) => (
  <Tooltip title={status === 'Pago' ? 'Cancelar pagamento' : 'Confirmar pagamento'}>
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        minWidth: 88
      }}
    >
      <Box
        sx={{
          bgcolor: status === 'Pago' ? '#757575' : '#4caf50',
          width: 88,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          boxShadow: 4,
          p: 1
        }}
      >
        <AttachMoney fontSize="medium" />
        <Typography variant="caption" fontWeight="bold">
          {status === 'Pago' ? 'Pago' : 'Pagar'}
        </Typography>
      </Box>
    </Box>
  </Tooltip>
);

/* COMPONENTE: Rodapé com totais + botão */
const RodapeResumo = ({ despesas, descontos, valorFinal, status, onClickPagamento }) => (
  <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: '#fff', borderTop: '1px solid #ccc', px: 2, py: 2 }}>
    <Stack direction="row" spacing={2} alignItems="stretch" justifyContent="space-between">
      <Box flex={1} display="flex" flexDirection="column" gap={1}>
        <Stack direction="row" spacing={1}>
          <ResumoBox label="Despesas" value={despesas} bg="#1976d2" color="#1976d2" />
          <ResumoBox label="Descontos" value={descontos} bg="#d32f2f" color="#d32f2f" />
        </Stack>
        <ResumoBox label="Total a Pagar" value={+valorFinal} bg="#388e3c" color="#388e3c" fontSize="1.1rem" />
      </Box>
      <BotaoPagamento status={status} onClick={onClickPagamento} />
    </Stack>
  </Box>
);

/* COMPONENTE PRINCIPAL */
export default function () {
  const [open, setOpen] = useState(true);

  const [form, setForm] = useState({
    despesas: [
      { descricao: 'Entrega Motoboy', valor: 25.0 },
      { descricao: 'Embalagem', valor: 5.0 }
    ],
    descontos: [{ descricao: 'Cupom de Desconto', valor: 10.0 }],
    formaPagamento: 'Pix',
    quemRecebeu: 'João',
    dataPagamento: new Date().toISOString().split('T')[0],
    statusPagamento: '',
    total: 0
  });

  const excluirItem = useCallback((index, tipo) => {
    setForm((prev) => {
      const chave = tipo === 'Despesa' ? 'despesas' : 'descontos';
      const novaLista = prev[chave].filter((_, i) => i !== index);
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

  const salvar = () => {
    console.log('Pagamento salvo:', form);
    setOpen(false);
  };

  return (
    <Dialogs
      open={open}
      onClose={() => setOpen(false)}
      title="Pagamento"
      description="Detalhes do pagamento"
      leadingAvatar={<Avatar src="/logo.jpg" />}
      showBackButton={false}
      actions={
        <Tooltip title="Salvar">
          <IconButton onClick={salvar}>
            <Storefront />
          </IconButton>
        </Tooltip>
      }
      bottomActions={
        <RodapeResumo
          despesas={totalDespesas}
          descontos={totalDescontos}
          valorFinal={valorPagar}
          status={form.statusPagamento}
          onClickPagamento={() => console.log('Abrir confirmação de pagamento')}
        />
      }
    >
      <ListaDeItens itens={listaCombinada} onDelete={excluirItem} />
    </Dialogs>
  );
}
