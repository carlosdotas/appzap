'use client';
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function HistoricoEncomendas() {
    const historico = [
        { id: 1, titulo: 'Entrega em Goiânia', data: '09/04/2025', status: 'Entregue' },
        { id: 2, titulo: 'Coleta em Anápolis', data: '06/04/2025', status: 'Pendente' },
        { id: 3, titulo: 'Envio para Silvânia', data: '01/04/2025', status: 'Cancelado' }
    ];

    return (
        <Box>
            {historico.map((item) => (
                <Box
                    key={item.id}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        bgcolor: '#fff',
                        border: '1px solid #eee'
                    }}
                >
                    <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                            {item.titulo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {item.data}
                        </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium" color={
                        item.status === 'Entregue'
                            ? 'green'
                            : item.status === 'Cancelado'
                                ? 'red'
                                : 'orange'
                    }>
                        {item.status}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}
