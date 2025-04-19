'use client';
import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Avatar,
    Box,
    Menu,
    MenuItem,
    Badge
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    MoreVert as MoreVertIcon,
    Add as AddIcon,
    ReportProblem as ReportProblemIcon
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';
import CadastroDialog from './CadastroDialog';

export default function TopoDoChat({ nome, avatar, phone, nome_curto, sender_id, onVoltar }) {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isCadastrado, setIsCadastrado] = useState(true);

    useEffect(() => {
        const verificarCadastro = async () => {
            try {
                const key = sender_id ? 'sender_id' : phone ? 'telefone' : null;
                const value = key === 'sender_id' ? sender_id : phone;

                if (!key || !value) return;

                const res = await fetch(`http://10.0.0.104/api/db/cliente_teste?${key}=${encodeURIComponent(value)}`);
                const json = await res.json();
                const cliente = Array.isArray(json) && json.length > 0 ? json[0] : null;
                setIsCadastrado(!!cliente?.id);
            } catch (e) {
                console.error('Erro ao verificar cadastro do cliente:', e);
                setIsCadastrado(false);
            }
        };

        verificarCadastro();
    }, [sender_id, phone]);

    const abrirMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const fecharMenu = () => {
        setAnchorEl(null);
    };

    const abrirDialog = () => {
        setOpenDialog(true);
    };

    const fecharDialog = () => setOpenDialog(false);

    const irParaPerfil = () => {
        const params = new URLSearchParams({
            nome: nome || '',
            avatar: avatar || '',
            sender_id: sender_id || '',
            telefone: phone || ''
        });
        router.push(`/perfil?${params.toString()}`);
    };

    const opcoesMenu = [
        { label: 'Ver Perfil', action: irParaPerfil },
        { label: 'Silenciar Notificações', action: () => alert('Silenciar') },
        { label: 'Apagar Conversa', action: () => alert('Apagar conversa') },
        { label: 'Denunciar', action: () => alert('Denunciar') },
    ];

    const salvar = () => {
        console.log('Dados salvos:', { nome, phone, sender_id });
        fecharDialog();
    };

    return (
        <>
            <AppBar
                position="fixed"
                color="inherit"
                elevation={1}
                sx={{ bgcolor: isCadastrado ? '#fff' : '#ffebee' }}
            >
                <Toolbar>
                    <IconButton onClick={onVoltar}><ArrowBackIcon /></IconButton>

                    <Badge
                        badgeContent={isCadastrado ? null : <ReportProblemIcon fontSize="small" color="error" />}
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Avatar
                            src={avatar}
                            sx={{ mx: 1, cursor: 'pointer' }}
                            onClick={irParaPerfil}
                        />
                    </Badge>

                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">{nome_curto}</Typography>
                        {nome && nome !== nome_curto && (
                          <Typography variant="body2" color="textSecondary">{nome}</Typography>
                        )}
                    </Box>

                    <IconButton onClick={abrirMenu}><MoreVertIcon /></IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={fecharMenu}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        {opcoesMenu.map((opcao, i) => (
                            <MenuItem
                                key={i}
                                onClick={() => {
                                    fecharMenu();
                                    opcao.action();
                                }}
                            >
                                {opcao.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Toolbar>
            </AppBar>

            <CadastroDialog
                open={openDialog}
                onClose={fecharDialog}
                onSalvar={salvar}
            />
        </>
    );
}