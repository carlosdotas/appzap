'use client';

import React, { useState, useMemo } from 'react';
import {
  Box, Stack, IconButton, Tooltip, Avatar, Typography, Divider, Button, TextField,
  Dialog, DialogContent, InputAdornment, ToggleButton, ToggleButtonGroup, MenuItem, Autocomplete
} from '@mui/material';
import {
  Storefront, AttachMoney, Delete, Add, Description, AttachMoneyOutlined, Close
} from '@mui/icons-material';
import FullScreenDialog from '@/components/FullScreenDialog';

const ResumoBox = ({ label, value, bg, color, fontSize = '0.75rem' }) => (
  <TextField
    label={label}
    value={`R$ ${value.toFixed(2)}`}
    size="small"
    InputProps={{ readOnly: true, sx: { bgcolor: bg, color: '#fff', fontWeight: 'bold', px: 2, borderRadius: 2, fontSize } }}
    InputLabelProps={{ sx: { fontWeight: 'bold', color, px: 1, bgcolor: '#f5f5f5', borderRadius: 2 } }}
    fullWidth
  />
);

const DialogNovaEntrada = ({ open, onClose, onSave, novoItem, setNovoItem }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid #ddd' }}>
      <Typography variant="subtitle1" fontWeight="bold" flex={1}>Nova entrada</Typography>
      <IconButton onClick={onClose}><Close /></IconButton>
    </Box>
    <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <ToggleButtonGroup
        value={novoItem.tipo}
        exclusive
        onChange={(e, val) => val && setNovoItem({ ...novoItem, tipo: val })}
        fullWidth
        sx={{ '& .MuiToggleButton-root': { flex: 1, fontWeight: 'bold', color: '#fff', backgroundColor: '#aaa', border: 'none' } }}
      >
        <ToggleButton value="Despesa" sx={{ '&.Mui-selected': { bgcolor: '#1976d2 !important' } }}>Despesa</ToggleButton>
        <ToggleButton value="Desconto" sx={{ '&.Mui-selected': { bgcolor: '#d32f2f !important' } }}>Desconto</ToggleButton>
      </ToggleButtonGroup>
      <TextField
        placeholder="Descrição"
        size="small"
        value={novoItem.descricao}
        onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })}
        fullWidth
        InputProps={{ startAdornment: <InputAdornment position="start"><Description fontSize="small" /></InputAdornment> }}
      />
      <TextField
        placeholder="Valor em R$"
        size="small"
        type="number"
        value={novoItem.valor}
        onChange={(e) => setNovoItem({ ...novoItem, valor: e.target.value })}
        fullWidth
        InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyOutlined fontSize="small" /></InputAdornment> }}
      />
    </DialogContent>
    <Box sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
      <Button onClick={onClose}>Cancelar</Button>
      <Button variant="contained" onClick={onSave} disabled={!novoItem.descricao || !novoItem.valor}>Salvar</Button>
    </Box>
  </Dialog>
);

export default function Pagamento({ open, onClose, form, handleChange }) {
  
  const [dialogOpenInternal, setDialogOpenInternal] = useState(false);
  const [dialogPagamentoOpen, setDialogPagamentoOpen] = useState(false);

  const despesas = form.despesas || [];
  const descontos = form.descontos || [];
  const novoItem = form.novoItem || { tipo: 'Despesa', descricao: '', valor: '' };
  const forma = form.formaPagamento || 'Pix';
  const quemRecebeu = form.quemRecebeu || '';
  const dataPagamento = form.dataPagamento || new Date().toISOString().split('T')[0];
  const sugestoesRecebedor = ['João', 'Maria', 'Carlos', 'Ana', 'Pedro'];

  const total = +form.total || 0;
  const totalDespesas = useMemo(() => despesas.reduce((sum, { valor }) => sum + +valor, 0), [despesas]);
  const totalDescontos = useMemo(() => descontos.reduce((sum, { valor }) => sum + +valor, 0), [descontos]);
  const valorPagar = useMemo(() => (total + totalDespesas - totalDescontos).toFixed(2), [total, totalDespesas, totalDescontos]);

  const listaCombinada = useMemo(() => ([
    ...despesas.map((i, idx) => ({ ...i, tipo: 'Despesa', index: idx })),
    ...descontos.map((i, idx) => ({ ...i, tipo: 'Desconto', index: idx }))
  ]), [despesas, descontos]);

  const setNovoItem = (item) => handleChange('novoItem', item);

  const salvarItem = () => {
    const novaEntrada = { descricao: novoItem.descricao, valor: +novoItem.valor };
    const chave = novoItem.tipo === 'Despesa' ? 'despesas' : 'descontos';
    handleChange(chave, [...form[chave], novaEntrada]);
    handleChange('novoItem', { tipo: 'Despesa', descricao: '', valor: '' });
    setDialogOpenInternal(false);
  };

  const excluirItem = (index, tipo) => {
    const chave = tipo === 'Despesa' ? 'despesas' : 'descontos';
    handleChange(chave, form[chave].filter((_, i) => i !== index));
  };

  const renderItemLista = () => (
    <Stack spacing={1} divider={<Divider flexItem />} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }}>
      {listaCombinada.map((item, idx) => (
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
          <IconButton size="small" color="error" onClick={() => excluirItem(item.index, item.tipo)}><Delete fontSize="small" /></IconButton>
        </Box>
      ))}
    </Stack>
  );

  const renderDialogPagamento = () => (
    <Dialog open={open} onClose={() => setDialogPagamentoOpen(false)} fullWidth maxWidth="sm">
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 2 }}>
        <Typography variant="h6" flex={1}>Confirmar Pagamento</Typography>
        <IconButton onClick={() => setDialogPagamentoOpen(false)}><Close /></IconButton>
      </Box>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField select label="Forma de pagamento" value={forma} onChange={(e) => handleChange('formaPagamento', e.target.value)} fullWidth>
          {['Pix', 'Dinheiro', 'Cartão', 'Transferência', 'Outro'].map(opcao => <MenuItem key={opcao} value={opcao}>{opcao}</MenuItem>)}
        </TextField>
        <Autocomplete options={sugestoesRecebedor} value={quemRecebeu} onChange={(e, val) => handleChange('quemRecebeu', val)} renderInput={(params) => <TextField {...params} label="Recebido por" fullWidth />} freeSolo />
        <TextField label="Data do pagamento" type="date" value={dataPagamento} onChange={(e) => handleChange('dataPagamento', e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={() => setDialogPagamentoOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={() => setDialogPagamentoOpen(false)}>Enviar</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const renderRodape = () => (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: '#fff', borderTop: '1px solid #ccc', px: 2, py: 2 }}>
      <Stack direction="row" spacing={2} alignItems="stretch" justifyContent="space-between">
        <Box flex={1} display="flex" flexDirection="column" gap={1}>
          <Stack direction="row" spacing={1}>
            <ResumoBox label="Despesas" value={totalDespesas} bg="#1976d2" color="#1976d2" />
            <ResumoBox label="Descontos" value={totalDescontos} bg="#d32f2f" color="#d32f2f" />
          </Stack>
          <ResumoBox label="Total a Pagar" value={+valorPagar} bg="#388e3c" color="#388e3c" fontSize="1.1rem" />
        </Box>
        <Tooltip title={form.statusPagamento === 'Pago' ? 'Cancelar pagamento' : 'Confirmar pagamento'}>
          <Box onClick={() => setDialogPagamentoOpen(true)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minWidth: 88 }}>
            <Box sx={{ bgcolor: form.statusPagamento === 'Pago' ? '#757575' : '#4caf50', width: 88, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', boxShadow: 4, p: 1 }}>
              <AttachMoney fontSize="medium" />
              <Typography variant="caption" fontWeight="bold">{form.statusPagamento === 'Pago' ? 'Pago' : 'Pagar'}</Typography>
            </Box>
          </Box>
        </Tooltip>
      </Stack>
    </Box>
  );

  return (
    <Box>
      {renderDialogPagamento()}

      <FullScreenDialog
        title="Pagamento"
        open={open}
        onClose={() => (false)}
        onSave={() => (false)}
        hideFab
        actions={
          <Tooltip title="Adicionar">
            <IconButton onClick={onClose(true)}>
              <Add />
            </IconButton>
          </Tooltip>
        }>
        {renderItemLista()}
        <DialogNovaEntrada open={dialogOpenInternal} onClose={() => setDialogOpenInternal(false)} onSave={salvarItem} novoItem={novoItem} setNovoItem={setNovoItem} />
        {renderRodape()}
      </FullScreenDialog>
    </Box>
  );
}
