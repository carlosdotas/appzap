import { Box, Stack, Typography, TextField, Avatar, IconButton, Divider } from '@mui/material';
import { Delete } from '@mui/icons-material';

export const ListaDeItens = ({ itens, onDelete, onEdit }) => (
  <Stack spacing={1} divider={<Divider flexItem />} sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }}>
    {itens.length === 0 ? (
      <Typography variant="body2" color="text.secondary">
        Nenhuma entrada adicionada.
      </Typography>
    ) : (
      itens.map((item, idx) => (
        <Box key={idx} display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: item.tipo === 'Despesa' ? 'primary.main' : 'error.main' }}>
              {item.tipo === 'Despesa' ? '–' : '+'}
            </Avatar>
            <Box display="flex" gap={1} alignItems="center" flex={1}>
              <TextField
                fullWidth
                variant="standard"
                value={item.descricao}
                onChange={(e) => onEdit(item.index, item.tipo, 'descricao', e.target.value)}
              />
              <TextField
                type="number"
                variant="standard"
                value={item.valor}
                onChange={(e) => onEdit(item.index, item.tipo, 'valor', e.target.value)}
                sx={{ width: 100 }}
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Box>
          </Box>
          <IconButton size="small" color="error" onClick={() => onDelete(item.index, item.tipo)}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ))
    )}
  </Stack>
);