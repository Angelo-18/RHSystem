import { Box, Divider, Drawer, Grid, Toolbar, Typography, Avatar, IconButton } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
import { SideBarMenu } from './';

export const SideBar = ({ drawerWidth = 240, onDrawerChange }) => {
    const { displayName, photoURL } = useSelector(state => state.auth);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDrawerOpenClose = () => {
        setIsOpen(!isOpen);
        onDrawerChange?.(!isOpen);
    };


    const drawer = (
        <>
            <Toolbar sx={{ flexDirection: 'column', gap: 2, py: 2 }}>
                <Avatar
                    src={photoURL}
                    alt={displayName}
                    sx={{
                        width: isOpen ? 64 : 40,
                        height: isOpen ? 64 : 40,
                        transition: 'all 0.3s ease-in-out'
                    }}
                />
                {isOpen && (
                    <Typography 
                        variant='h6' 
                        noWrap 
                        component='div' 
                        align='center'
                        sx={{
                            width: '100%',
                            fontSize: '1rem',
                            px: 1,
                            wordBreak: 'break-word'
                        }}
                    >
                        {displayName}
                    </Typography>
                )}
            </Toolbar>
            <Divider />
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={handleDrawerOpenClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </Box>
            <SideBarMenu />
        </>
    );

    return (
        <Box
            component='nav'
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' }, position: 'fixed', top: 10, left: 10, zIndex: 1100 }}
            >
                <MenuIcon />
            </IconButton>
            {/* Drawer móvil */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Mejor rendimiento en dispositivos móviles
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            {/* Drawer permanente */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { 
                        position: 'fixed',
                        boxSizing: 'border-box', 
                        width: isOpen ? drawerWidth : 60,
                        transition: 'width 0.3s ease-in-out',
                        overflowX: 'hidden',
                        height: '100%',
                        zIndex: 1100
                    },
                }}
                open={isOpen}
            >
                {drawer}
            </Drawer>
        </Box>
    );
};
