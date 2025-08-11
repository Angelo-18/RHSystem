import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import { startLogout } from '../../store/auth';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';

export const NavBar = ({ drawerWidth = 240 }) => {
    const dispatch = useDispatch();
    const { uid } = useSelector(state => state.auth);
    const [companyName, setCompanyName] = useState('RHSystem');

    useEffect(() => {
        const loadUserCompany = async () => {
            try {
                const userRef = await getDocs(collection(FirebaseDB, 'personal_registrado'));
                const userData = userRef.docs.find(doc => doc.id === uid)?.data();
                
                if (userData?.empresa) {
                    const companiesRef = await getDocs(collection(FirebaseDB, 'empresas'));
                    const companyData = companiesRef.docs.find(doc => doc.id === userData.empresa);
                    if (companyData) {
                        setCompanyName(companyData.data().nombre);
                    }
                }
            } catch (error) {
                console.error('Error al cargar la empresa:', error);
            }
        };

        loadUserCompany();
    }, [uid]);

    const onLogout = () => {
        dispatch(startLogout());
    }

    return (
        <AppBar 
            position='fixed'
            sx={{ 
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` }
            }}
        >
            <Toolbar>
                <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                    <Typography variant='h6' noWrap component='div'> {companyName} </Typography>

                    <IconButton 
                        color='inherit'
                        onClick={onLogout}
                    >
                        <LogoutOutlined />
                    </IconButton>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}
