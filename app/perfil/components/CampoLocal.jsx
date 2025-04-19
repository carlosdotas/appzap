'use client';
import React from 'react';
import {
    TextField,
    Autocomplete,
    InputAdornment
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';

const locais = [
    'Goiânia',
    'Anápolis',
    'Silvânia',
    'Leopoldo de Bulhões',
    'Gameleira',
    'Bela Vista',
    'Senador Canedo'
];

export default function CampoLocal({ value, onChange, inputStyle = {} }) {
    return (
        <Autocomplete
            options={locais}
            value={value}
            onChange={(e, newValue) => onChange(newValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Local"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocationOn />
                            </InputAdornment>
                        )
                    }}
                    {...inputStyle}
                />
            )}
        />
    );
}
