import { Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { RRHHLayout } from '../layout/RRHHLayout';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const ConfiguracionEvaluacionesPage = () => {
    const { userProfile } = useSelector(state => state.auth);

    // Solo permitir acceso a Admin
    if (userProfile !== 'admin') {
        return <Navigate to="/evaluaciones/pendientes" />;
    }

    return (
        <RRHHLayout>
            <Box className="animate__animated animate__fadeIn animate__faster">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Configuración de Evaluaciones
                                </Typography>
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    Configura los tipos y parámetros de las evaluaciones
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Próximamente: Configuración de tipos de evaluación, criterios y períodos.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </RRHHLayout>
    );
};