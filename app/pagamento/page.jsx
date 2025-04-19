'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Button, Box, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, InputAdornment, useMediaQuery,
  Fab, Card, CardContent, Stack, Paper, MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  ErrorOutline as ErrorIcon, ArrowBack as BackIcon, Save as SaveIcon,
  CheckCircle as ConfirmIcon
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';

import Cabecalho from './components/Cabecalho';
import CamposFormulario from './components/CamposFormulario';
import DialogAlerta from './components/DialogAlerta';

import { API_BASE_URL } from '@/lib/apiConfig';



const usuarios = [
  'Ana Souza',
  'Carlos Lima',
  'Fabiana Mendes',
  'João Silva',
  'Patrícia Torres'
];

export default function Pagamento() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [alerta, setAlerta] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [erro, setErro] = useState('');
  const [openErroModal, setOpenErroModal] = useState(false);
  const router = useRouter();


  const [dados, setDados] = useState({
    numeroPedido: '', nomeCliente: '', valorBase: 0, statusPagamento: '',
    formaPagamento: 'PIX', dataConta: '', dataPagamento: '', diasAtraso: 0, valorAcrescimo: 0
  });
  const [dadosConfirmacao, setDadosConfirmacao] = useState({
    responsavel: '', dataRecebimento: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const numeroPedido = params.get('pedido');
    const nomeCliente = params.get('cliente');
    const valorBase = parseFloat(params.get('total') || '0');
    if (!numeroPedido) return setAlerta(true);
    setDados((d) => ({ ...d, numeroPedido, nomeCliente: nomeCliente || '', valorBase }));
  }, []);

  const total = useMemo(
    () => (+dados.valorBase + +dados.valorAcrescimo).toFixed(2),
    [dados.valorBase, dados.valorAcrescimo]
  );

  const handleChange = (campo) => (e, v) => {
    if (campo === 'formaPagamento') {
      if (v !== null) setDados((prev) => ({ ...prev, [campo]: v }));
    } else {
      setDados((prev) => ({ ...prev, [campo]: e.target.value }));
    }
  };

  const handleSalvar = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pagamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message || 'Erro ao salvar pagamento.');
      }

      alert('Informações de pagamento salvas com sucesso!');
      // Exemplo opcional de redirecionamento com dados:
      // router.push(`/pagamento?pedido=${dados.numeroPedido}&cliente=${dados.nomeCliente}&total=${total}`);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setErro(err.message || 'Erro inesperado.');
      setOpenErroModal(true);
    }
  };


  const handleConfirmar = () => setConfirmacaoAberta(true);

  const handleFecharConfirmacao = () => setConfirmacaoAberta(false);

  return (
    <Box minHeight="100vh" bgcolor="#f2f2f2" pb={10}>

      <Cabecalho nomeCliente={dados.nomeCliente} />

      <Box p={2}>
        <Card>
          <CardContent>
            <CamposFormulario dados={dados} handleChange={handleChange} isMobile={isMobile} total={total} />
          </CardContent>
        </Card>
      </Box>

      <Box position="fixed" bottom={16} right={16} display="flex" flexDirection="column" gap={1}>
        <Fab color="success" onClick={handleConfirmar}>
          <ConfirmIcon />
        </Fab>
        <Fab color="primary" onClick={handleSalvar}>
          <SaveIcon />
        </Fab>
      </Box>

      <Dialog open={confirmacaoAberta} onClose={handleFecharConfirmacao} fullWidth>
        <DialogTitle>Confirmar Pagamento</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            select
            label="Responsável pelo recebimento"
            value={dadosConfirmacao.responsavel}
            onChange={(e) => setDadosConfirmacao({ ...dadosConfirmacao, responsavel: e.target.value })}
            fullWidth
          >
            {usuarios.map((user) => (
              <MenuItem key={user} value={user}>{user}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Data do Pagamento"
            type="date"
            value={dadosConfirmacao.dataRecebimento}
            onChange={(e) => setDadosConfirmacao({ ...dadosConfirmacao, dataRecebimento: e.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharConfirmacao}>Cancelar</Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              alert(`Pagamento confirmado por ${dadosConfirmacao.responsavel} em ${dadosConfirmacao.dataRecebimento}`);
              handleFecharConfirmacao();
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <DialogAlerta aberto={alerta} onClose={() => setAlerta(false)} />
      <Dialog open={openErroModal} onClose={() => setOpenErroModal(false)}>
        <DialogTitle>Erro ao Salvar</DialogTitle>
        <DialogContent>
          <Typography color="error">{erro}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErroModal(false)} variant="contained" color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
