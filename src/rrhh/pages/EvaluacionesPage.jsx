import { Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { RRHHLayout } from '../layout/RRHHLayout';
import { useSelector } from 'react-redux';

export const EvaluacionesPage = () => {
    const { userProfile } = useSelector(state => state.auth);

    const getProfileSpecificContent = () => {
        switch(userProfile) {
            case 'personal':
                return {
                    title: 'Mis Evaluaciones',
                    description: 'Ver evaluaciones realizadas y programadas'
                };
            case 'rrhh':
                return {
                    title: 'Gestión de Evaluaciones',
                    description: 'Administra y programa evaluaciones del personal'
                };
            case 'jefe':
                return {
                    title: 'Evaluaciones del Equipo',
                    description: 'Gestiona las evaluaciones del personal a tu cargo'
                };
            case 'admin':
                return {
                    title: 'Administración de Evaluaciones',
                    description: 'Gestión completa del sistema de evaluaciones'
                };
            default:
                return {
                    title: 'Evaluaciones',
                    description: 'Sistema de evaluaciones'
                };
        }
    };

    const content = getProfileSpecificContent();

    return (
        <RRHHLayout>
            <Box className="animate__animated animate__fadeIn animate__faster">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    {content.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    {content.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Esta sección está en desarrollo. Próximamente podrás gestionar las evaluaciones según tu perfil.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </RRHHLayout>
    );
};