'use client';

import React, { useState} from 'react';
import {
   Avatar
} from '@mui/material';
import Dialogs from '@/components/Dialogs';



export default function () {
  const [open, setOpen] = useState(true);

  return (
    <Dialogs
      open={open}
      onClose={() => setOpen(false)}
      title="Pagamento"
      description="Detalhes do pagamento"
      leadingAvatar={<Avatar src="/logo.jpg" />}
      showBackButton={true}

    >
      {/* Conteúdo */}
    </Dialogs>
  );
}
