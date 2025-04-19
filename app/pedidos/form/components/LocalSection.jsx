'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  AppBar,
  Toolbar,
  Fab,
} from '@mui/material';
import {
  Storefront,
  InfoOutlined,
  ArrowBack,
  Save,
} from '@mui/icons-material';
import AutoCompleteLocal from './AutoCompleteLocal';

export default function LocalSection({
  form,
  handleChange,
  tipo = 'Coleta',
  campo = 'Coleta',
  icone = <Storefront fontSize="small" />,
  cor = 'primary',
  isCadastrado = false,
}) {
  const [open, setOpen] = useState(false);
  const [localForm, setLocalForm] = useState({});

  const isEmpty = !form[`local${campo}`];
  const endereco = localForm[`endereco${campo}`];

  const handleOpen = () => {
    // Inicializa o localForm com os valores atuais do form
    setLocalForm({
      [`local${campo}`]: form[`local${campo}`] || '',
      [`endereco${campo}`]: form[`endereco${campo}`] || '',
      [`responsavel${campo}`]: form[`responsavel${campo}`] || '',
      [`telefone${campo}`]: form[`telefone${campo}`] || '',
      [`obs${campo}`]: form[`obs${campo}`] || '',
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    // Atualiza os campos no form principal
    Object.keys(localForm).forEach((key) => {
      handleChange(key, localForm[key]);
    });
    handleClose();
  };

  const handleLocalChange = (key, value) => {
    setLocalForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderTextField = (label, name, multiline = false, minRows = 1) => (
    <TextField
      label={label}
      fullWidth
      size="small"
      multiline={multiline}
      minRows={minRows}
      value={localForm[name] || ''}
      onChange={(e) => handleLocalChange(name, e.target.value)}
      sx={{ bgcolor: '#fff' }}
    />
  );

  const renderGroup = (title, fields) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>{title}</Typography>
      <Stack spacing={2}>{fields}</Stack>
    </Box>
  );

  return (
    <Box>
      <Tooltip title={isEmpty ? `${tipo} não definida` : form[`local${campo}`]} arrow>
        <Button
          variant="contained"
          color={isEmpty ? 'warning' : 'success'}
          fullWidth
          size="small"
          onClick={handleOpen}
          startIcon={isEmpty ? <InfoOutlined fontSize="small" /> : icone}
          sx={{
            borderRadius: '1.5rem',
            textTransform: 'none',
            py: 0.5,
            fontWeight: 'bold',
            minHeight: 34,
            height: 34,
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="caption"
            noWrap
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
              fontSize: '0.72rem',
              lineHeight: 1.1,
            }}
          >
            {isEmpty ? `${tipo} não definida` : form[`local${campo}`]}
          </Typography>
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullScreen>
        <AppBar position="fixed" color="inherit" elevation={1}>
          <Toolbar>
            <IconButton edge="start" onClick={handleClose} color="inherit">
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2 }}>
              Informações da {tipo}
            </Typography>
          </Toolbar>
        </AppBar>

        <DialogContent sx={{ pt: 8, pb: 10, bgcolor: '#f3f3f3' }}>
          <Stack spacing={3}>
            {renderGroup('Local', [
              <AutoCompleteLocal
                key="autocomplete"
                form={localForm}
                handleChange={handleLocalChange}
                name={`local${campo}`}
              />,
              localForm[`endereco${campo}`] && (
                <Box key="enderecoBox" bgcolor="#f5f5f5" p={1} borderRadius={1}>
                  <Typography variant="caption" color="text.secondary">
                    {localForm[`endereco${campo}`]}
                  </Typography>
                </Box>
              )
            ])}

            {renderGroup('Responsável', [
              renderTextField(`Responsável pela ${tipo}`, `responsavel${campo}`),
              renderTextField('Telefone', `telefone${campo}`),
            ])}

            {renderGroup('Observações', [
              renderTextField('Observação', `obs${campo}`, true, 3),
            ])}
          </Stack>
        </DialogContent>

        <Fab
          color={cor}
          onClick={handleSave}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1301,
          }}
        >
          <Save />
        </Fab>
      </Dialog>
    </Box>
  );
}
