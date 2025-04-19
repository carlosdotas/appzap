'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Tabs,
  Tab,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Fab,
  InputAdornment,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Settings,
  Description,
  CalendarMonth,
  Flag,
  LocalShipping,
  DirectionsCar,
  AccountCircle,
  Phone,
  Home,
  LocationCity,
  Business,
  MonetizationOn,
  Discount,
  Paid,
  EditNote,
  Save as SaveIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import AppBarSearchMenu from '@/components/AppBarSearchMenu';

export default function PedidoForm() {
  const theme   = useTheme();
  const params  = useParams();
  const search  = useSearchParams();
  const router  = useRouter();

  /* ---------- identifica rota ---------- */
  let idRaw = params?.id || search.get('id');
  if (idRaw === 'adicionar') idRaw = null;   // modo novo

  const [loading, setLoading] = useState(!!idRaw);
  const [saving , setSaving ] = useState(false);
  const [tab    , setTab    ] = useState(0);

  /* ---------- estado ---------- */
  const [form, setForm] = useState({
    data            : dayjs(),
    etapa           : 'Novo',
    tipoEncomenda   : 'coleta',
    tipoVeiculo     : 'moto',
    cliente         : '',
    telefone        : '',
    localColeta     : '',
    cidade          : '',
    setor           : '',
    valor           : '',
    desconto        : '',
    total           : '',
    statusPagamento : 'nao_pago',
    detalhes        : '',
  });

  const etapas = [
    'Novo',
    'Aprovado',
    'A caminho da coleta',
    'Aguardando carregamento',
    'No Depósito',
    'Em Trânsito',
    'A caminho da entrega',
    'Finalizado',
    'Cancelado',
  ];

  /* ---------- carrega se edição ---------- */
  useEffect(() => {
    if (!idRaw) return;

    const fetchPedido = async () => {
      try {
        const res  = await fetch('https://zapencomendas.com.br/server/pedidos/get', {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify({ id: Number(idRaw) }),
        });
        const json = await res.json();

        if (json.success && Array.isArray(json.data) && json.data.length) {
          const p = json.data[0];
          setForm({
            data           : dayjs(p.data || p.created_at),
            etapa          : p.etapa || 'Novo',
            tipoEncomenda  : p.tipo_encomenda || 'coleta',
            tipoVeiculo    : p.tipo_veiculo  || 'moto',
            cliente        : p.cliente       || '',
            telefone       : p.phone         || '',
            localColeta    : p.local         || '',
            cidade         : p.cidade || p.locais_cidade || '',
            setor          : p.setor         || '',
            valor          : p.valor         || '',
            desconto       : p.desconto      || '',
            total          : p.total         || '',
            statusPagamento: p.status_pagamento || 'nao_pago',
            detalhes       : p.detalhes      || '',
          });
        }
      } catch (err) {
        console.error('Erro ao buscar pedido:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPedido();
  }, [idRaw]);

  /* ---------- handlers ---------- */
  const handleChange = (field) => (e) =>
    setForm((prev) => ({
      ...prev,
      [field]: e?.$d ? e : e.target.value,
    }));

  const handleSave = async () => {
    /* monta payload em snake_case */
    const payload = {
      data            : form.data.format('YYYY-MM-DD'),
      etapa           : form.etapa.toLowerCase(),
      tipo_encomenda  : form.tipoEncomenda,
      tipo_veiculo    : form.tipoVeiculo,
      cliente         : form.cliente,
      phone           : form.telefone,
      local           : form.localColeta,
      cidade          : form.cidade,
      setor           : form.setor,
      valor           : form.valor,
      desconto        : form.desconto,
      total           : form.total,
      status_pagamento: form.statusPagamento,
      detalhes        : form.detalhes,
      clientes_id     : '',
      locais_id       : '',
      users_id        : '15',          // ajuste para o usuário logado
    };
    if (idRaw) payload.id = idRaw;     // não envia id se novo

    try {
      setSaving(true);
      const res  = await fetch('https://zapencomendas.com.br/server/pedidos/save/', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        alert('Pedido salvo com sucesso!');
        router.push('/pedidos');       // volta para lista
      } else {
        alert(`Erro: ${json.message || 'não foi possível salvar'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Falha na comunicação com o servidor.');
    } finally {
      setSaving(false);
    }
  };

  const inputBase = { fullWidth: true, size: 'small', sx: { bgcolor: '#fff' } };

  /* ---------- UI ---------- */
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ bgcolor: '#f1fdf1', minHeight: '100vh', pb: 10 }}>
        <AppBarSearchMenu
          title={idRaw ? `Editar Pedido #${idRaw}` : 'Novo Pedido'}
          onBack={() => window.history.back()}
          menuItems={[{ label: 'Configurações', icon: <Settings />, onClick: () => alert('Configurações') }]}
        />

        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ bgcolor: '#e7f5e7' }}>
          <Tab icon={<Person />} label="Formulário" />
          <Tab icon={<Settings />} label="Configurações" />
          <Tab icon={<Description />} label="Resumo" />
        </Tabs>

        <Box sx={{ pt: `calc(${theme.mixins.toolbar.minHeight}px + 48px)` }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : tab === 0 ? (
          <Stack spacing={1} sx={{ px: 2 }}>
            {/* Data + Etapa */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Data"
                type="date"
                value={form.data.format('YYYY-MM-DD')}
                onChange={(e) => handleChange('data')({ $d: dayjs(e.target.value) })}
                InputLabelProps={{ shrink: true }}
                InputProps={{ startAdornment: <CalendarMonth sx={{ mr: 1 }} /> }}
                {...inputBase}
                sx={{ flex: 1, ...inputBase.sx }}
              />
              <TextField
                label="Etapa"
                value={form.etapa}
                onChange={handleChange('etapa')}
                select
                InputProps={{ startAdornment: <Flag sx={{ mr: 1 }} /> }}
                {...inputBase}
                sx={{ flex: 1, ...inputBase.sx }}
              >
                {etapas.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Tipo Encomenda + Veículo */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Tipo de Encomenda"
                value={form.tipoEncomenda}
                onChange={handleChange('tipoEncomenda')}
                select
                InputProps={{ startAdornment: <LocalShipping sx={{ mr: 1 }} /> }}
                {...inputBase}
                sx={{ flex: 1, ...inputBase.sx }}
              >
                <MenuItem value="coleta">Coleta</MenuItem>
                <MenuItem value="entrega">Entrega</MenuItem>
              </TextField>
              <TextField
                label="Tipo de Veículo"
                value={form.tipoVeiculo}
                onChange={handleChange('tipoVeiculo')}
                select
                InputProps={{ startAdornment: <DirectionsCar sx={{ mr: 1 }} /> }}
                {...inputBase}
                sx={{ flex: 1, ...inputBase.sx }}
              >
                <MenuItem value="moto">Moto</MenuItem>
                <MenuItem value="carro">Carro</MenuItem>
                <MenuItem value="fiorino">Fiorino</MenuItem>
              </TextField>
            </Box>

            {/* Demais campos */}
            <TextField label="Cliente"        value={form.cliente}     onChange={handleChange('cliente')}     InputProps={{ startAdornment: <AccountCircle sx={{ mr: 1 }} /> }} {...inputBase} />
            <TextField label="Telefone"       value={form.telefone}    onChange={handleChange('telefone')}    InputProps={{ startAdornment: <Phone sx={{ mr: 1 }} /> }}          {...inputBase} />
            <TextField label="Local de Coleta" value={form.localColeta} onChange={handleChange('localColeta')} InputProps={{ startAdornment: <Home sx={{ mr: 1 }} /> }}           {...inputBase} />
            <TextField label="Cidade"         value={form.cidade}      onChange={handleChange('cidade')}      InputProps={{ startAdornment: <LocationCity sx={{ mr: 1 }} /> }}   {...inputBase} />
            <TextField label="Setor"          value={form.setor}       onChange={handleChange('setor')}       InputProps={{ startAdornment: <Business sx={{ mr: 1 }} /> }}       {...inputBase} />

            {[{ l: 'Valor', i: <MonetizationOn />, f: 'valor' }, { l: 'Desconto', i: <Discount />, f: 'desconto' }, { l: 'Total', i: <Paid />, f: 'total' }].map(({ l, i, f }) => (
              <TextField key={f} label={l} value={form[f]} onChange={handleChange(f)} InputProps={{ startAdornment: i, inputMode: 'decimal' }} {...inputBase} />
            ))}

            <TextField label="Status Pagamento" value={form.statusPagamento} onChange={handleChange('statusPagamento')} select {...inputBase}>
              <MenuItem value="nao_pago">Não Pago</MenuItem>
              <MenuItem value="pago">Pago</MenuItem>
              <MenuItem value="pendente">Pendente</MenuItem>
            </TextField>

            <TextField
              label="Detalhes"
              value={form.detalhes}
              onChange={handleChange('detalhes')}
              multiline
              rows={3}
              InputProps={{ startAdornment: <InputAdornment position="start"><EditNote /></InputAdornment> }}
              {...inputBase}
            />

            <Paper variant="outlined" sx={{ p: 2, fontSize: 14, bgcolor: '#f9fff9', borderStyle: 'dashed' }}>
              <Typography variant="body2"><strong>ℹ️</strong> Preencha todas as informações com atenção.</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}><strong>✅</strong> Verifique CPF e telefone antes de enviar o formulário.</Typography>
            </Paper>
          </Stack>
        ) : tab === 1 ? (
          <Box sx={{ p: 2 }}><Typography>Configurações (placeholder)</Typography></Box>
        ) : (
          <Box sx={{ p: 2 }}><Typography>Resumo (placeholder)</Typography></Box>
        )}

        <Fab
          color="primary"
          aria-label="save"
          onClick={handleSave}
          disabled={saving}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          {saving ? <CircularProgress size={24} /> : <SaveIcon />}
        </Fab>
      </Box>
    </LocalizationProvider>
  );
}
