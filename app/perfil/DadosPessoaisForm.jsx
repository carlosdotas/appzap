'use client';

import React, { useState, useEffect } from 'react';
import {
  TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Fab, Box,
  InputAdornment, Autocomplete
} from '@mui/material';
import {
  Save, Person, Badge, CalendarToday, LocationCity, Phone
} from '@mui/icons-material';
import CampoLocal from './components/CampoLocal';

const cidades = [
  'Goiânia', 'Anápolis', 'Caldas Novas', 'Itumbiara', 'Rio Verde',
  'Catalão', 'Formosa', 'Luziânia', 'Águas Lindas de Goiás', 'Valparaíso de Goiás'
];

export default function DadosPessoaisForm({ onFormLoad, setSnackbar }) {
  const [formData, setFormData] = useState({});
  const [tipo, setTipo] = useState('fisico');
  const [salvando, setSalvando] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputBase = { fullWidth: true, size: 'small', sx: { bgcolor: '#fff' } };

  useEffect(() => {
    const fetchCliente = async () => {
      const params = new URLSearchParams(window.location.search);
      const keys = ['id', 'sender_id', 'telefone'];
      const key = keys.find(k => params.get(k));
      const value = params.get(key);
      const fallbackData = Object.fromEntries(params.entries());

      if (!key || !value) {
        setFormData({
          ...fallbackData,
          nomeContato: fallbackData.nome || '',
          nomeCompleto: ''
        });
        setLoading(false);
        onFormLoad?.(fallbackData);
        return;
      }

      try {
        const res = await fetch(`http://10.0.0.104/api/db/cliente_teste?${key}=${encodeURIComponent(value)}`);
        const json = await res.json();
        const cliente = Array.isArray(json) && json.length > 0 ? json[0] : fallbackData;
        setFormData({
          ...cliente,
          nomeContato: fallbackData.nome || '',
          nomeCompleto: cliente?.nomeCompleto || cliente?.nome || ''
        });
        onFormLoad?.(cliente);
      } catch (err) {
        console.error('Erro ao buscar cliente:', err);
        setFormData({
          ...fallbackData,
          nomeContato: fallbackData.nome || '',
          nomeCompleto: ''
        });
        onFormLoad?.(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, []);

  useEffect(() => {
    if (formData?.tipo === 'fisico' || formData?.tipo === 'juridico') {
      setTipo(formData.tipo);
    }
  }, [formData?.tipo]);

  const onSubmit = async () => {
    setSalvando(true);
    const isEditando = !!formData.id;
    const url = isEditando
      ? `http://10.0.0.104/api/db/cliente_teste/${formData.id}`
      : 'http://10.0.0.104/api/db/cliente_teste';
    const method = isEditando ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          nome: formData.nomeCompleto // para compatibilidade com o backend
        })
      });

      if (!response.ok) throw new Error(`Erro ao ${isEditando ? 'atualizar' : 'salvar'}: ${response.statusText}`);

      const result = await response.json();

      if (result?.last_insert_id && !isEditando) {
        const resGet = await fetch(`http://10.0.0.104/api/db/cliente_teste?id=${result.last_insert_id}`);
        const clienteAtualizado = await resGet.json();
        if (Array.isArray(clienteAtualizado) && clienteAtualizado.length > 0) {
          setFormData(clienteAtualizado[0]);
          onFormLoad?.(clienteAtualizado[0]);
        }
      } else {
        onFormLoad?.(formData);
      }

      setSnackbar?.({ open: true, message: `Cliente ${isEditando ? 'atualizado' : 'salvo'} com sucesso!`, severity: 'success' });
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      setSnackbar?.({ open: true, message: `Erro ao ${isEditando ? 'atualizar' : 'salvar'} cliente. Verifique o console.`, severity: 'error' });
    } finally {
      setSalvando(false);
    }
  };

  if (loading) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 8 }}>
      <TextField
        label="Nome do contato"
        value={formData?.nomeContato || ''}
        InputProps={{
          readOnly: true,
          startAdornment: <InputAdornment position="start"><Person /></InputAdornment>
        }}
        {...inputBase}
      />

      <TextField
        label="Nome completo"
        value={formData?.nomeCompleto || ''}
        onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
        InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
        {...inputBase}
      />

      <TextField
        label="Telefone"
        value={formData?.telefone || ''}
        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
        InputProps={{ startAdornment: <InputAdornment position="start"><Phone /></InputAdornment> }}
        {...inputBase}
      />

      <CampoLocal
        value={formData?.local || ''}
        onChange={(newValue) => setFormData({ ...formData, local: newValue })}
        inputStyle={inputBase}
      />

      <Autocomplete
        options={cidades}
        value={formData?.cidade || ''}
        onChange={(e, newValue) => setFormData({ ...formData, cidade: newValue })}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Cidade"
            InputProps={{
              ...params.InputProps,
              startAdornment: <InputAdornment position="start"><LocationCity /></InputAdornment>
            }}
            {...inputBase}
          />
        )}
      />

      <FormControl component="fieldset">
        <FormLabel component="legend">Tipo</FormLabel>
        <RadioGroup
          row
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setFormData({ ...formData, tipo: e.target.value });
          }}
        >
          <FormControlLabel value="fisico" control={<Radio />} label="Físico" />
          <FormControlLabel value="juridico" control={<Radio />} label="Jurídico" />
        </RadioGroup>
      </FormControl>

      <TextField
        label={tipo === 'fisico' ? 'CPF' : 'CNPJ'}
        value={formData?.cpfCnpj || ''}
        onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
        InputProps={{ startAdornment: <InputAdornment position="start"><Badge /></InputAdornment> }}
        {...inputBase}
      />

      {tipo === 'fisico' && (
        <TextField
          label="Data de nascimento"
          type="date"
          value={formData?.dataNascimento || ''}
          onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
          InputLabelProps={{ shrink: true }}
          InputProps={{ startAdornment: <InputAdornment position="start"><CalendarToday /></InputAdornment> }}
          {...inputBase}
        />
      )}

      <Fab
        color="primary"
        size="medium"
        onClick={onSubmit}
        disabled={salvando}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Save />
      </Fab>
    </Box>
  );
}