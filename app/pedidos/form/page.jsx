'use client';

import React, { useState } from 'react';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import { Storefront, LocalShipping } from '@mui/icons-material';

import LocalSection from './components/LocalSection';
import DetalhesSection from './components/DetalhesSection';

import Pagamento from './modulos/Pagamento';
import Dialogs from '@/components/Dialogs';

export default function CadastroEncomendaForm() {

  const [showDialog, setShowDialog] = React.useState(false);

  const [form, setForm] = useState({
    tipo: '',
    naCentral: false,
    localColeta: '',
    responsavelColeta: '',
    telefoneColeta: '',
    obsColeta: '',
    enderecoColeta: '',
    cidadeColeta: '',
    setorColeta: '',

    localEntrega: '',
    responsavelEntrega: '',
    telefoneEntrega: '',
    obsEntrega: '',
    enderecoEntrega: '',
    cidadeEntrega: '',
    setorEntrega: '',

    tipoVeiculo: '',
    tamanho: '',
    fragil: false,
    urgente: false,
    quantidade: '',
    descricao: '',
    observacoes: '',

    formaPagamento: '',
    despesas: '',
    descontos: '',
    valorDespesas: '',
    valorDescontos: '',
    total: '',
    statusPagamento: '',
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (




    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      
      <Typography variant="h6">Cadastro de Encomenda</Typography>

      <LocalSection
        form={form}
        handleChange={handleChange}
        tipo="Coleta"
        campo="Coleta"
        icone={<Storefront fontSize="small" />}
        cor="primary"
      />

      <LocalSection
        form={form}
        handleChange={handleChange}
        tipo="Entrega"
        campo="Entrega"
        icone={<LocalShipping fontSize="small" />}
        cor="success"
      />

      <DetalhesSection form={form} handleChange={handleChange} />

      <Tooltip title="Editar pagamento">
        <IconButton
          onClick={() => setShowDialog(true)}
          sx={{
            borderRadius: '1.5rem',
            bgcolor: form.total ? 'success.main' : 'warning.main',
            color: '#fff',
            px: 2,
            py: 0.5,
          }}
        >
          <Storefront fontSize="small" /> Pagamento
        </IconButton>
      </Tooltip>

      {showDialog && (
        <Pagamento open={true} onClose={() => setShowDialog(false)} form={form} handleChange={handleChange} />
      )}
    </Box>
  );
}
