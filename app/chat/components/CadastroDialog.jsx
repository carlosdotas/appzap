'use client';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    Avatar,
    Typography,
    Divider,
    Tabs,
    Badge,
    Fab,
    InputAdornment ,
    Tab
} from '@mui/material';

import {
    Inventory2 as EncomendaIcon,
    Badge as DadosIcon,
    AccountBalanceWallet as ContaIcon,
    ArrowBack,
    Save,
    MoreVert,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Badge as BadgeIcon,
    CalendarToday as CalendarIcon,
    CreditCard as CPFIcon,
    ShortText as NicknameIcon    
} from '@mui/icons-material';

export default function CadastroDialog({ open, onClose, onSalvar }) {
    const [tipo, setTipo] = useState('fisico');
    const [tabIndex, setTabIndex] = useState(0);

    const [formData, setFormData] = useState({
        nome: '',
        nome_curto: '',
        sender_id: '',
        cpfCnpj: '',
        dataNascOuFantasia: '',
        local: '',
        telefone: '',
        avatar: ''
    });

    const inputBase = {
        
        fullWidth: true,
        size: 'small',
        sx: { bgcolor: '#fff'}        
    };

    return (
        <Dialog open={open} onClose={onClose} fullScreen scroll="paper">
            {/* Cabeçalho com avatar e nome */}
            {/* Cabeçalho com avatar à esquerda e nome à direita */}
            <Box sx={{ px: 3, pt: 3 }}>
                <Box sx={{ px: 2, pt: 2 }}>
                    {/* Linha superior com botão voltar e menu */}
                    <Fab
                        size="small"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            zIndex: 1,
                            bgcolor: 'transparent',
                            boxShadow: 'none',
                            color: 'inherit' // opcional: para herdar cor do texto/contexto
                        }}
                    >
                        <ArrowBack />
                    </Fab>

                    <Fab
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 1,
                            bgcolor: 'transparent',
                            boxShadow: 'none',
                            color: 'inherit'
                        }}
                    >
                        <MoreVert />
                    </Fab>


                    {/* Avatar centralizado acima dos textos */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Avatar
                            src={formData.avatar || '/avatar.jpg'}
                            alt="Foto do grupo"
                            sx={{ width: 64, height: 64 }}
                        />
                        <Typography variant="h6" fontWeight="bold" align="center">
                            {formData.nome_curto || 'Apoio ZAP encomendas'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                            Grupo · Membros: 7
                        </Typography>
                    </Box>
                </Box>

                <Tabs
                    value={tabIndex}
                    onChange={(e, newValue) => setTabIndex(newValue)}
                    variant="fullWidth"
                    centered
                >
                    <Tab
                        icon={
                            <Badge badgeContent={3} color="primary">
                                <EncomendaIcon />
                            </Badge>
                        }
                        label=""
                        iconPosition="start"

                    />
                    <Tab
                        icon={
                            <Badge variant="dot" color="warning">
                                <DadosIcon />
                            </Badge>
                        }
                        label=""
                        iconPosition="start"
                    />
                    <Tab
                        icon={
                            <Badge badgeContent={0} color="success" invisible>
                                <ContaIcon />
                            </Badge>
                        }
                        label=""
                        iconPosition="start"
                    />
                </Tabs>

            </Box>


            <Divider />

            {/* Conteúdo da aba selecionada */}
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', gap: 2, py: 3, bgcolor: '#f9f9f9' }}>
                {tabIndex === 0 && (
                    <Box>
                        {[
                            { id: 1, titulo: 'Entrega em Goiânia', data: '09/04/2025', status: 'Entregue' },
                            { id: 2, titulo: 'Coleta em Anápolis', data: '06/04/2025', status: 'Pendente' },
                            { id: 3, titulo: 'Envio para Silvânia', data: '01/04/2025', status: 'Cancelado' }
                        ].map((item) => (
                            <Box
                                key={item.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 1.5,
                                    mb: 1,
                                    borderRadius: 2,
                                    bgcolor: '#f9f9f9',
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
                )}


                {tabIndex === 1 && (
                    <>

                        <TextField
                            label="Nome completo"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            InputProps={{
                                ...inputBase,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <FormControl component="fieldset">
                            <FormLabel component="legend">Tipo</FormLabel>
                            <RadioGroup
                                row
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                            >
                                <FormControlLabel value="fisico" control={<Radio />} label="Físico" />
                                <FormControlLabel value="juridico" control={<Radio />} label="Jurídico" />
                            </RadioGroup>
                        </FormControl>

                        <TextField
                            label={tipo === 'fisico' ? 'CPF' : 'CNPJ'}
                            value={formData.cpfCnpj}
                            onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                            InputProps={{
                                ...inputBase,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CPFIcon />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            label={tipo === 'fisico' ? 'Data de nascimento' : 'Nome fantasia'}
                            value={formData.dataNascOuFantasia}
                            onChange={(e) => setFormData({ ...formData, dataNascOuFantasia: e.target.value })}
                            InputProps={{
                                ...inputBase,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {tipo === 'fisico' ? <CalendarIcon /> : <BadgeIcon />}
                                    </InputAdornment>
                                )
                            }}
                        />
                        
                    </>
                )}

                {tabIndex === 2 && (
                    <Box sx={{ pb: 15 }}>

                        <TextField
                            label="Chave Pix"
                            value={formData.pix || ''}
                            onChange={(e) => setFormData({ ...formData, pix: e.target.value })}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="Banco"
                            value={formData.banco || ''}
                            onChange={(e) => setFormData({ ...formData, banco: e.target.value })}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="Agência"
                            value={formData.agencia || ''}
                            onChange={(e) => setFormData({ ...formData, agencia: e.target.value })}
                            fullWidth
                            size="small"
                        />
                        <TextField
                            label="Conta"
                            value={formData.conta || ''}
                            onChange={(e) => setFormData({ ...formData, conta: e.target.value })}
                            fullWidth
                            size="small"
                        />
                    </Box>
                )}

                <Fab
                    color="primary"
                    size="medium"
                    onClick={() => onSalvar(formData)}
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        boxShadow: 'none'
                    }}
                >
                    <Save />
                </Fab>

            </DialogContent>
        </Dialog>
    );
}
