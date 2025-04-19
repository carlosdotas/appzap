'use client';

import React from 'react';
import { Box, Button } from '@mui/material';
import {
  Payments,
  AttachMoney,
  CreditCard,
  AccountBalance,
} from '@mui/icons-material';

const formasPagamentoOpcoes = [
  { label: 'Pix', icon: <Payments />, color: 'primary' },
  { label: 'Dinheiro', icon: <AttachMoney />, color: 'success' },
  { label: 'Cartão', icon: <CreditCard />, color: 'secondary' },
  { label: 'Crediário', icon: <AccountBalance />, color: 'warning' },
];

export default function FormaPagamentoButtons({ value, onChange }) {
  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {formasPagamentoOpcoes.map(({ label, icon, color }) => (
        <Box key={label} flex="1 1 45%">
          <Button
            variant={(value || 'Pix') === label ? 'contained' : 'outlined'}
            color={color}
            size="large"
            onClick={() => onChange(label)}
            startIcon={icon}
            sx={{
              width: '100%',
              borderRadius: 4,
              fontWeight: 'bold',
              textTransform: 'none',
              justifyContent: 'flex-start',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Button>
        </Box>
      ))}
    </Box>
  );
}
