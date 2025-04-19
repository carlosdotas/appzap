'use client';

import React, { useState, useRef } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function AutoCompleteLocal({ form, handleChange, name }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const debounceRef = useRef(null);

  // Gera prefixo capitalizado: localEntrega => Entrega / localColeta => Coleta
  const prefix = name.replace(/^local/, '');
  const capitalized = prefix.charAt(0).toUpperCase() + prefix.slice(1);

  const atualizarFormulario = (local) => {
    setLocalSelecionado(local);
    handleChange(`local${capitalized}`, local.name || '');
    handleChange(`cidade${capitalized}`, local.cidade || '');
    handleChange(`setor${capitalized}`, local.setor || '');
    handleChange(`endereco${capitalized}`, local.endereco || '');
  };

  const buscarLocalPorLink = async (link) => {
    try {
      const response = await fetch('https://zapencomendas.com.br/server/locais/buscar_local_link/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link }),
      });

      const { data } = await response.json();

      if (data?.name) {
        atualizarFormulario(data);
        buscarLocaisPorNome(data.name);
      }
    } catch (error) {
      console.error('Erro ao buscar local por link:', error);
    }
  };

  const buscarLocaisPorNome = async (name) => {
    setLoading(true);
    try {
      const response = await fetch('https://zapencomendas.com.br/server/pedidos/list_locais/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const { data } = await response.json();
      setOptions(data || []);
    } catch (error) {
      console.error('Erro ao buscar locais por nome:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (event, value) => {
    handleChange(name, value);
    setLocalSelecionado(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value || value.length < 2) return;

    debounceRef.current = setTimeout(() => {
      value.startsWith('http')
        ? buscarLocalPorLink(value)
        : buscarLocaisPorNome(value);
    }, 500);
  };

  const aoSelecionarOpcao = (_, opcaoSelecionada) => {
    if (opcaoSelecionada) atualizarFormulario(opcaoSelecionada);
  };

  return (
    <Autocomplete
      freeSolo
      loading={loading}
      options={options}
      inputValue={form[name] || ''}
      onInputChange={onInputChange}
      onChange={aoSelecionarOpcao}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.name || ''
      }
      isOptionEqualToValue={(option, value) =>
        option.name === (typeof value === 'string' ? value : value.name)
      }
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            p: 1,
          }}
        >
          <LocationOnIcon fontSize="small" sx={{ mt: 0.5, color: 'text.secondary' }} />
          <Box>
            <Typography variant="body2" fontWeight="bold" noWrap>
              {option.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {option.setor} - {option.cidade}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`Local de ${capitalized}`}
          fullWidth
          size="small"
          FormHelperTextProps={{
            sx: {
              mt: 0,
              fontSize: '0.65rem',
              color: 'text.disabled',
              lineHeight: 1.2,
            },
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
