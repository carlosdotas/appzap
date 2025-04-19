'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function LocaisDoCliente() {
    const locais = [
        { nome: 'Galpão Central - Goiânia', referencia: 'Atrás do Atacadão' },
        { nome: 'Posto JK - Silvânia', referencia: 'Em frente à praça' },
        { nome: 'Rodoviária de Anápolis', referencia: 'Bloco B - Plataforma 3' }
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">Locais frequentes</Typography>
            {locais.map((local, idx) => (
                <Box key={idx} sx={{ bgcolor: '#fff', borderRadius: 2, p: 2, border: '1px solid #ddd' }}>
                    <Typography variant="body1"><strong>{local.nome}</strong></Typography>
                    <Typography variant="body2" color="text.secondary">{local.referencia}</Typography>
                </Box>
            ))}
        </Box>
    );
}
