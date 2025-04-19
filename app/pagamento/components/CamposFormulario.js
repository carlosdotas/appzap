'use client';
import React from 'react';
import {
  TextField, Box, Stack, Paper, Button, InputAdornment
} from '@mui/material';

const formasPagamento = ['PIX', 'Dinheiro', 'Cartão', 'Crediário'];

export default function CamposFormulario({ dados, handleChange, isMobile, total }) {
  return (
    <Stack spacing={2}>
      <Box width="100%" mb={2} display="flex" gap={1}>
        {formasPagamento.map((tipo) => (
          <Button
            key={tipo}
            variant={dados.formaPagamento === tipo ? 'contained' : 'outlined'}
            color={dados.formaPagamento === tipo ? 'primary' : 'inherit'}
            onClick={() => handleChange('formaPagamento')(null, tipo)}
            fullWidth
            sx={{ textTransform: 'none' }}
          >
            {tipo}
          </Button>
        ))}
      </Box>

      <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
        <TextField
          size="small"
          label="Nome do Cliente"
          value={dados.nomeCliente}
          sx={{ bgcolor: '#fff', flex: 3 }}
        />
        <TextField
          size="small"
          label="Número do pedido"
          value={dados.numeroPedido}
          InputProps={{ readOnly: true }}
          sx={{ bgcolor: '#fff', flex: 1 }}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          size="small"
          label="Data da conta"
          type="date"
          value={dados.dataConta}
          onChange={handleChange('dataConta')}
          InputLabelProps={{ shrink: true }}
          sx={{ bgcolor: '#fff', flex: 1 }}
        />
        <TextField
          size="small"
          label="Data de vencimento"
          type="date"
          value={dados.dataPagamento}
          onChange={handleChange('dataPagamento')}
          InputLabelProps={{ shrink: true }}
          sx={{ bgcolor: '#fff', flex: 1 }}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          size="small"
          label="Dias de atraso"
          type="number"
          value={dados.diasAtraso}
          onChange={handleChange('diasAtraso')}
          sx={{ bgcolor: '#fff', flex: 1 }}
        />
        <TextField
          size="small"
          label="Acréscimo"
          type="number"
          value={dados.valorAcrescimo}
          onChange={handleChange('valorAcrescimo')}
          InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
          sx={{ bgcolor: '#fff', flex: 1 }}
        />
      </Stack>

      <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
        <TextField
          size="small"
          label="Descrição da Encomenda"
          value={dados.descricao}
          onChange={handleChange('descricao')}
          sx={{ bgcolor: '#fff', flex: 3 }}
        />
      </Stack>

      <TextField
        size="small"
        label="Detalhes adicionais"
        value={dados.detalhes}
        onChange={handleChange('detalhes')}
        fullWidth
        multiline
        minRows={3}
        sx={{ bgcolor: '#fff' }}
      />

      <Paper elevation={2} sx={{ p: 2, textAlign: 'center', fontWeight: 'bold', bgcolor: '#fafafa' }}>
        Total a Pagar: R$ {total}
      </Paper>
    </Stack>
  );
}