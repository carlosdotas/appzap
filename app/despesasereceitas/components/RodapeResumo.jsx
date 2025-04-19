'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/apiConfig';

import {
  Box, Stack, Tooltip, Typography, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { AttachMoney } from '@mui/icons-material';

export const RodapeResumo = ({ despesas, descontos, valorFinal, status, pedido }) => {
  const desativado = +valorFinal <= 0;
  const router = useRouter();

  const [erro, setErro] = useState('');
  const [openErroModal, setOpenErroModal] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState('PIX');

  const opcoesPagamento = [
    { label: 'PIX', value: 'PIX' },
    { label: 'Dinheiro', value: 'Dinheiro' },
    { label: 'Cartão', value: 'Cartao' },
    { label: 'Crediário', value: 'Crediario' },
  ];

  const handlePagamentoClick = async () => {
    if (desativado) return;

    const payload = { despesas, descontos, valorFinal, status, pedido };

    try {
      const response = await fetch(`${API_BASE_URL}/despesasereceitas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message || 'Erro ao enviar pagamento');
      }

      const queryParams = new URLSearchParams({
        despesas: despesas.toString(),
        descontos: descontos.toString(),
        valorFinal: valorFinal.toString(),
        status,
        pedido: pedido.toString(),
      });

      router.push(`/despesasereceitas?${queryParams.toString()}`);
    } catch (err) {
      console.error('Erro no pagamento:', err);
      setErro(err.message || 'Erro inesperado ao processar pagamento.');
      setOpenErroModal(true);
    }
  };

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

  const BotaoPagamento = () => (
    <Tooltip
      title={
        desativado
          ? 'Total zerado. Nenhum valor a pagar.'
          : 'Ir para pagamento'
      }
    >
      <Box
        onClick={!desativado ? handlePagamentoClick : undefined}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: desativado ? 'default' : 'pointer',
          pointerEvents: desativado ? 'none' : 'auto',
          opacity: desativado ? 0.4 : 1
        }}
      >
        <Box
          sx={{
            bgcolor: '#4caf50',
            width: 86,
            height: 86,
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
            Pagamento
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );

  return (
    <>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: '#fff',
          borderTop: '1px solid #ccc',
          px: 2,
          py: 2,
          zIndex: 1300
        }}
      >
        {/* Linha dos botões de pagamento */}
        <Stack direction="row" spacing={2} justifyContent="space-between" mb={2}>
          {opcoesPagamento.map((opcao, idx) => (
            <Button
              key={opcao.value}
              variant={formaPagamento === opcao.value ? 'contained' : 'outlined'}
              color="primary"
              sx={{
                flex: 1,
                mr: idx < opcoesPagamento.length - 1 ? 1 : 0,
                fontSize: '0.7rem',
                py: 1,
                backgroundColor: formaPagamento === opcao.value ? undefined : '#f5f5f5',
                fontWeight: formaPagamento === opcao.value ? 'bold' : 'normal',
              }}
              onClick={() => setFormaPagamento(opcao.value)}
            >
              {opcao.label}
            </Button>
          ))}
        </Stack>
        <Stack direction="row" spacing={2} alignItems="stretch" justifyContent="space-between">
          <Box flex={1} display="flex" flexDirection="column" gap={1}>
            <Stack direction="row" spacing={1}>
              <ResumoBox label="Despesas" value={despesas} bg="#1976d2" color="#1976d2" />
              <ResumoBox label="Descontos" value={descontos} bg="#d32f2f" color="#d32f2f" />
            </Stack>
            <ResumoBox label="Total a Pagar" value={+valorFinal} bg="#388e3c" color="#388e3c" fontSize="1.1rem" />
          </Box>
          <Box height="100%" display="flex" alignItems="center">
            <BotaoPagamento />
          </Box>
        </Stack>
      </Box>

      {/* Modal de erro */}
      <Dialog open={openErroModal} onClose={() => setOpenErroModal(false)}>
        <DialogTitle>Erro no Pagamento</DialogTitle>
        <DialogContent>
          <Typography color="error">{erro}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErroModal(false)} color="primary" variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
