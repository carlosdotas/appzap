'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Storefront, Add } from '@mui/icons-material';

import FullScreenDialog from '@/components/FullScreenDialog';
import VolumeCard from './VolumeCard';
import VolumeFormDialog from './VolumeForm';

export default function DetalhesSection({ form, handleChange }) {
  const [volumes, setVolumes] = useState(() => form.volumes ?? []);
  const [hasVolumes, setHasVolumes] = useState(false);
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    setHasVolumes(volumes.length > 0);
  }, [volumes]);

  const handleAddVolume = () => {
    setOpenForm(true);
  };

  const handleVolumeSave = (novoVolume) => {
    const volumePadrao = {
      descricao: 'Não informado',
      tamanho: 'Pequeno',
      tipo: 'Produto',
      quant: 1,
      ...novoVolume,
    };

    const listaAtualizada = [...volumes, volumePadrao];
    setVolumes(listaAtualizada);
    setOpenForm(false);
  };

  const handleRemoveVolume = (index) => {
    const listaAtualizada = volumes.filter((_, i) => i !== index);
    setVolumes(listaAtualizada);
  };

  const handleSave = () => {
    handleChange('volumes', volumes);
    setOpen(false);
  };

  const totalVolumes = volumes.reduce((acc, v) => acc + (v.quant || 1), 0);
  const totalPeso = volumes.reduce((acc, v) => acc + ((v.peso || 0) * (v.quant || 1)), 0);
  const totalValor = volumes.reduce((acc, v) => acc + ((v.valor || 0) * (v.quant || 1)), 0).toFixed(2);


  return (
    <Box>
      {/* Botão principal */}
      <Tooltip title="Clique para editar os volumes">
        <IconButton
          onClick={() => setOpen(true)}
          color={hasVolumes ? 'success' : 'warning'}
          size="small"
          sx={{
            borderRadius: '1.5rem',
            backgroundColor: hasVolumes ? 'success.main' : 'warning.main',
            color: '#fff',
            px: 2,
            py: 0.5,
            fontSize: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          <Storefront fontSize="small" sx={{ mr: 1 }} />
          Detalhes do Envio
        </IconButton>
      </Tooltip>

      <FullScreenDialog
        title="Detalhes do Envio"
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        color="primary"
        hideFab="true"
        actions={
          <Tooltip title="Adicionar Volume">
            <IconButton edge="end" color="primary" onClick={handleAddVolume}>
              <Add />
            </IconButton>
          </Tooltip>
        }
      >
        <Stack spacing={1} mt={1} pb={8}>
          {volumes.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nenhum volume cadastrado.
            </Typography>
          ) : (
            volumes.map((volume, index) => (
              <VolumeCard
                key={`volume-${index}`}
                item={volume}
                index={index}
                onRemove={handleRemoveVolume}
              />
            ))
          )}
        </Stack>

        {/* Barra inferior com totais */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: '#fff',
            borderTop: '1px solid #ddd',
            px: 2,
            py: 1,
            zIndex: 1300,
            boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption">
              Volumes: <Typography component="span" fontWeight="bold">{totalVolumes}</Typography>
            </Typography>
            <Typography variant="caption">
              Peso: <Typography component="span" fontWeight="bold">{totalPeso} kg</Typography>
            </Typography>
            <Typography variant="caption">
              Valor: <Typography component="span" fontWeight="bold">R$ {totalValor}</Typography>
            </Typography>
          </Stack>

        </Box>
      </FullScreenDialog>


      {/* Formulário para adicionar novo volume */}
      <VolumeFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleVolumeSave}
      />
    </Box>
  );
}
