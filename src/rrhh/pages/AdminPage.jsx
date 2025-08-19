import { Typography, Grid, Card, CardContent, Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { UserManagement } from '../components/UserManagement';
import { CompanyManagement } from '../components/CompanyManagement';
import { AreaManagement } from '../components/AreaManagement';
import { ScheduleManagement } from '../components/ScheduleManagement';
import { RRHHLayout } from '../layout/RRHHLayout';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const AdminPage = () => {
    const { userProfile } = useSelector(state => state.auth);

    // Redirigir si no es administrador
    if (userProfile !== 'admin') {
        return <Navigate to="/" />;
    }

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <RRHHLayout>
            <Box 
                className="animate__animated animate__fadeIn animate__faster"
                sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2
                }}
            >
                <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Panel de Administración
                        </Typography>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                            <Tabs value={tabValue} onChange={handleTabChange}>
                                <Tab label="Gestión de Usuarios" />
                                <Tab label="Gestión de Empresas" />
                                <Tab label="Gestión de Áreas" />
                                <Tab label="Gestión de Horarios" />
                            </Tabs>
                        </Box>
                        
                        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                            {tabValue === 0 && (
                                <UserManagement />
                            )}
                            
                            {tabValue === 1 && (
                                <CompanyManagement />
                            )}
                            
                            {tabValue === 2 && (
                                <AreaManagement />
                            )}

                            {tabValue === 3 && (
                                <ScheduleManagement />
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </RRHHLayout>
    );
};