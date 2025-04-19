'use client';

import React, { useEffect, useState } from 'react';
import {
  TextField,
  Box,
  Stack,
  Typography,
  MenuItem,
} from '@mui/material';
import FullScreenDialog from '@/components/FullScreenDialog';

const tipos = ['Produto', 'Documento', 'Pacote', 'Caixa', 'Envelope', 'Palete', 'Animal', 'Carga Fechada Fiorino'];
const tamanhos = ['Pequeno', 'Médio', 'Grande', 'Extra Grande'];

const dimensoesPadrao = {
  'Pequeno': { altura: 40, largura: 40, comprimento: 40, peso: 20 },
  'Médio': { altura: 60, largura: 60, comprimento: 60, peso: 50 },
  'Grande': { altura: 170, largura: 170, comprimento: 170, peso: 150 },
  'Carga Fechada Fiorino': { altura: 170, largura: 170, comprimento: 170, peso: 600 },
  'Extra Grande': { altura: 120, largura: 120, comprimento: 120, peso: 300 },
  'DEFAULT': { altura: 25, largura: 60, comprimento: 170, peso: 200 },
};

export default function VolumeFormDialog({ open, onClose, onSave, defaultVolume = null }) {
  const [volume, setVolume] = useState({
    tipo: '',
    descricao: '',
    tamanho: '',
    altura: '',
    largura: '',
    comprimento: '',
    peso: '',
    quant: '',
    observacoes: '',
  });

  useEffect(() => {
    if (defaultVolume) {
      setVolume(defaultVolume);
    } else {
      setVolume({
        descricao: 'Não informado',
        tamanho: 'Pequeno',
        tipo: 'Produto',
        quant: 1,
        observacoes: '',
        ...dimensoesPadrao['Pequeno'],
      });
    }
  }, [defaultVolume]);

  const handleChange = (field, value) => {
    if (field === 'tamanho') {
      const dims = dimensoesPadrao[value] || dimensoesPadrao.DEFAULT;
      setVolume((prev) => ({
        ...prev,
        tamanho: value,
        altura: dims.altura,
        largura: dims.largura,
        comprimento: dims.comprimento,
        peso: dims.peso,
      }));
    } else if (field === 'tipo' && value === 'Carga Fechada Fiorino') {
      const dims = dimensoesPadrao['Carga Fechada Fiorino'];
      setVolume((prev) => ({
        ...prev,
        tipo: value,
        altura: dims.altura,
        largura: dims.largura,
        comprimento: dims.comprimento,
        peso: dims.peso,
      }));
    } else {
      setVolume((prev) => ({
        ...prev,
        [field]: ['peso', 'quant', 'altura', 'largura', 'comprimento'].includes(field)
          ? parseFloat(value || 0)
          : value,
      }));
    }
  };

  const handleSubmit = () => {
    if (!volume.tipo || !volume.descricao || !volume.quant) {
      alert('Preencha os campos obrigatórios: Tipo, Descrição e Quantidade.');
      return;
    }

    const finalVolume = {
      ...volume,
      peso: volume.peso || dimensoesPadrao.DEFAULT.peso,
    };

    onSave(finalVolume);
    onClose();
  };

  const renderTextField = (label, field, options = {}) => (
    <TextField
      label={label}
      placeholder={options.placeholder || ''}
      fullWidth
      select={options.select || false}
      size="small"
      multiline={options.multiline || false}
      minRows={options.minRows || undefined}
      type={options.type || 'text'}
      value={volume[field] ?? ''}
      onChange={(e) => handleChange(field, e.target.value)}
      sx={{ bgcolor: 'white' }}
    >
      {options.select &&
        (options.items || []).map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
    </TextField>
  );


  
  return (
    <FullScreenDialog
      open={open}
      onClose={onClose}
      onSave={handleSubmit}
      title={defaultVolume ? 'Editar Volume' : 'Adicionar Volume'}
    >
      <Box mt={2}>
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            Informações do Volume
          </Typography>

          {renderTextField('Descrição*', 'descricao', { placeholder: 'Ex: Roupas, Eletrônicos' })}

          <Stack direction="row" spacing={2}>
            <Box flex={1}>
              {renderTextField('Tamanho', 'tamanho', {
                select: true,
                items: tamanhos,
                placeholder: 'Escolha o tamanho',
              })}
            </Box>
            <Box flex={1}>
              {renderTextField('Tipo*', 'tipo', {
                select: true,
                items: tipos,
                placeholder: 'Escolha o tipo',
              })}
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Box flex={1}>
              {renderTextField('Altura (cm) MAX', 'altura', { type: 'number' })}
            </Box>
            <Box flex={1}>
              {renderTextField('Largura (cm) MAX', 'largura', { type: 'number' })}
            </Box>
            <Box flex={1}>
              {renderTextField('Comprimento (cm) MAX', 'comprimento', { type: 'number' })}
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Box flex={1}>
              {renderTextField('Peso (kg) MAX', 'peso', {
                type: 'number',
                placeholder: 'Ex: 1.5',
              })}
            </Box>
            <Box flex={1}>
              {renderTextField('Quantidade*', 'quant', {
                type: 'number',
                placeholder: 'Ex: 1',
              })}
            </Box>
          </Stack>

          {renderTextField('Observações', 'observacoes', {
            multiline: true,
            placeholder: 'Fragilidade, instruções especiais etc.',
            minRows: 4,
          })}
        </Stack>
      </Box>
    </FullScreenDialog>
  );
}
