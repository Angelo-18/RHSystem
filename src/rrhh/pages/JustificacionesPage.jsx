import { Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { RRHHLayout } from '../layout/RRHHLayout';
import { useSelector } from 'react-redux';
import { JustificationsList } from '../components/JustificationsList';

export const JustificacionesPage = () => {
    const { userProfile } = useSelector(state => state.auth);

    const getProfileSpecificContent = () => {
        switch(userProfile) {
            case 'personal':
                return {
                    title: 'Mis Solicitudes de Justificación',
                    description: 'Gestiona tus solicitudes de justificación de asistencia'
                };
            case 'rrhh':
                return {
                    title: 'Gestión de Justificaciones',
                    description: 'Revisa y aprueba las solicitudes de justificación del personal'
                };
            case 'jefe':
                return {
                    title: 'Justificaciones del Equipo',
                    description: 'Revisa las solicitudes de justificación de tu equipo'
                };
            case 'admin':
                return {
                    title: 'Administración de Justificaciones',
                    description: 'Gestión completa de solicitudes de justificación'
                };
            default:
                return {
                    title: 'Justificaciones',
                    description: 'Sistema de justificaciones de asistencia'
                };
        }
    };

    const content = getProfileSpecificContent();

    const { uid } = useSelector(state => state.auth);

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
                                
                                <Box sx={{ mt: 3 }}>
                                    <JustificationsList userProfile={userProfile} userId={uid} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </RRHHLayout>
    );
};