'use client';

import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  inputRef = null,
  ...rest
}) {
  return (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      placeholder={placeholder}
      value={value}
      inputRef={inputRef}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={onClear}
              aria-label="Clear search"
            >
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        backgroundColor: '#fff',
        borderRadius: 1,
      }}
      {...rest}
    />
  );
}
