// ======= page.jsx (refatorado) =======
'use client';

import React, { useState } from 'react';
import {
  Box, Tabs, Tab, Fab, Divider, Avatar, Typography, Badge, Snackbar, Alert
} from '@mui/material';
import {
  Inventory2 as EncomendaIcon,
  Badge as DadosIcon,
  AccountBalanceWallet as ContaIcon,
  ArrowBack,
  Place,
  MoreVert
} from '@mui/icons-material';

import HistoricoEncomendas from './HistoricoEncomendas';
import DadosPessoaisForm from './DadosPessoaisForm';
import DadosConta from './DadosConta';
import LocaisDoCliente from './LocaisDoCliente';

export default function CadastroForm({ onClose }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [abasDesativadas, setAbasDesativadas] = useState(true);
  const [inicializado, setInicializado] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleTabChange = (_, newIndex) => setTabIndex(newIndex);
  const handleBack = () => window?.history?.back?.();

  const handleFormLoad = (data) => {
    setFormData(data);
    const isCadastrado = !!data?.id;
    setAbasDesativadas(!isCadastrado);

    if (isCadastrado && !inicializado) {
      setTabIndex(2); // direciona para pedidos apenas uma vez
      setInicializado(true);
    }
  };

  const abas = [
    {
      icon: <DadosIcon />, badge: 'dot',
      content: (
        <DadosPessoaisForm
          onFormLoad={handleFormLoad}
          setSnackbar={setSnackbar}
        />
      )
    },
    {
      icon: <ContaIcon />, badge: 0,
      content: <DadosConta formData={formData} setFormData={setFormData} />
    },
    {
      icon: <EncomendaIcon />, badge: 3,
      content: <HistoricoEncomendas />
    },
    {
      icon: <Place />, badge: 2,
      content: <LocaisDoCliente />
    }
  ];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2, pt: 2, position: 'relative', bgcolor: formData.id ? '#fff' : '#ffebee' }}>
        <Fab size="small" onClick={handleBack} sx={{ position: 'absolute', top: 16, left: 16, bgcolor: 'transparent', boxShadow: 'none' }}>
          <ArrowBack />
        </Fab>
        <Fab size="small" sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'transparent', boxShadow: 'none' }}>
          <MoreVert />
        </Fab>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Avatar src={formData.avatar || '/avatar.jpg'} sx={{ width: 64, height: 64 }} />
          <Typography variant="h6" fontWeight="bold">{formData.nome || 'Apoio ZAP encomendas'}</Typography>
          <Typography variant="body2" color="text.secondary">Cliente</Typography>
          {!formData.id && (
            <Typography variant="caption" color="error">
              Cliente ainda não cadastrado no sistema
            </Typography>
          )}
        </Box>
      </Box>

      <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" centered TabIndicatorProps={{ sx: { height: 3 } }}>
        {abas.map((aba, i) => (
          <Tab
            key={i}
            icon={
              <Badge
                badgeContent={aba.badge}
                color={typeof aba.badge === 'string' ? 'warning' : 'primary'}
                variant={typeof aba.badge === 'string' ? 'dot' : 'standard'}
              >
                {aba.icon}
              </Badge>
            }
            disabled={abasDesativadas && i !== 0}
            iconPosition="start"
            sx={{ minWidth: 0, px: 1.5, justifyContent: 'center', '& .MuiTab-iconWrapper': { mx: 'auto' } }}
          />
        ))}
      </Tabs>

      <Divider />

      <Box sx={{ px: 1, py: 2, flexGrow: 1, overflowY: 'auto', bgcolor: '#f2f2f2', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {abas[tabIndex].content}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}