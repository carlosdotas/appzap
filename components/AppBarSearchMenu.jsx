'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Collapse
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';

export default function AppBarSearchMenu({
  title = 'Title',
  onBack,
  menuItems = null,
  
  bottomContent = null,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showSearch, setShowSearch] = useState(false);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" color="inherit" onClick={onBack} aria-label="back">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Box>

          <Box>
            {bottomContent && (
              <IconButton edge="end" color="inherit" onClick={() => setShowSearch(!showSearch)}>
                <SearchIcon />
              </IconButton>
            )}

            {menuItems && (
              <>
                <IconButton edge="end" color="inherit" onClick={handleOpenMenu}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  {menuItems.map((item, idx) =>
                    item.divider ? (
                      <Divider key={`divider-${idx}`} />
                    ) : (
                      <MenuItem
                        key={idx}
                        onClick={() => {
                          item.onClick?.();
                          handleCloseMenu();
                        }}
                      >
                        {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                        {item.label}
                      </MenuItem>
                    )
                  )}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>

        <Collapse in={showSearch} timeout="auto" unmountOnExit>
          <Box sx={{ px: 2, pb: 1 }}>{bottomContent}</Box>
        </Collapse>
      </Box>
    </AppBar>
  );
}
