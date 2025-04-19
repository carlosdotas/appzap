'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Chip,
  Box,
} from '@mui/material';
import {
  Delete,
  Straighten,
  Scale,
  Inventory2,
  AttachMoney,
  Notes,
} from '@mui/icons-material';

export default function VolumeCard({ item, index, onRemove }) {

  const renderChip = (icon, label, color = 'primary') => (
    <Chip
      avatar={
        <Box
          sx={{
            bgcolor: '#fff',
            width: 22,
            height: 22,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 1,
          }}
        >
          {React.cloneElement(icon, {
            sx: { color: `${color}.main`, fontSize: 16 },
          })}
        </Box>
      }
      label={label}
      size="small"
      sx={{
        bgcolor: `${color}.main`,
        color: '#fff',
        fontWeight: 500,
        borderRadius: '10px',
        px: 1,
        py: 0.25,
        fontSize: '0.70rem',
        letterSpacing: 0.3,
        minHeight: '28px',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 2,
          opacity: 0.95,
        },
      }}
    />
  );



  return (
    <Card
      variant="outlined"
      sx={{
        bgcolor: '#f9f9ff',
        borderRadius: 2,
        boxShadow: 2,
        borderColor: '#d0d0ff',
        transition: '0.2s',
        '&:hover': {
          boxShadow: 4,
          borderColor: 'primary.main',
        },
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="primary.dark"
            sx={{ fontSize: '1rem' }}
          >
            {item.tipo || 'Tipo não definido'}
          </Typography>
        }
        action={
          <Tooltip title="Remover volume">
            <IconButton
              size="small"
              onClick={() => onRemove(index)}
              sx={{ color: 'error.main' }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        sx={{
          pb: 0,
          '& .MuiCardHeader-action': {
            alignSelf: 'center',
          },
        }}
      />

      <CardContent sx={{ pt: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: '0.85rem' }}
        >
          {item.descricao || 'Sem descrição'}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ mt: 1 }}
        >
          {renderChip(<Inventory2 />, `${item.quant ?? '-'}`, 'info')}
          {renderChip(<Straighten />, `${item.tamanho ?? '-'}`, 'primary')}
          {renderChip(<Scale />, `${item.peso ?? '-'} kg`, 'success')}
          {renderChip(<AttachMoney />, `R$ ${item.valor ?? '-'}`, 'warning')}
        </Stack>

      </CardContent>

      {item.observacoes && (
        <CardActions
          sx={{
            px: 2,
            pb: 2,
            pt: 1,
            bgcolor: '#fef7e0',
            borderTop: '1px dashed #ffe082',
          }}
        >
          <Notes fontSize="small" sx={{ mr: 0.5, color: 'orange' }} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontStyle: 'italic', fontSize: '0.75rem' }}
          >
            {item.observacoes}
          </Typography>
        </CardActions>
      )}
    </Card>
  );
}
