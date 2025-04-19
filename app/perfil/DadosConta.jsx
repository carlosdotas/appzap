'use client';
import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

export default function ContasDoCliente() {
    const contas = [
        {
            descricao: 'Envio Silvânia → Goiânia',
            valor: 80.00,
            vencimento: '08/04/2025',
            status: 'Pendente'
        },
        {
            descricao: 'Coleta em Anápolis',
            valor: 45.00,
            vencimento: '02/04/2025',
            status: 'Pago'
        },
        {
            descricao: 'Entrega expressa',
            valor: 150.00,
            vencimento: '28/03/2025',
            status: 'Vencido'
        }
    ];

    const getChipColor = (status) => {
        switch (status) {
            case 'Pago': return 'success';
            case 'Pendente': return 'warning';
            case 'Vencido': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
                Contas do cliente
            </Typography>

            {contas.map((conta, idx) => (
                <Box
                    key={idx}
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        p: 2,
                        bgcolor: '#fff'
                    }}
                >
                    <Typography variant="body2"><strong>Descrição:</strong> {conta.descricao}</Typography>
                    <Typography variant="body2"><strong>Valor:</strong> R$ {conta.valor.toFixed(2)}</Typography>
                    <Typography variant="body2"><strong>Vencimento:</strong> {conta.vencimento}</Typography>
                    <Chip
                        label={conta.status}
                        color={getChipColor(conta.status)}
                        size="small"
                        sx={{ mt: 1 }}
                    />
                </Box>
            ))}

            
        </Box>
    );
}
