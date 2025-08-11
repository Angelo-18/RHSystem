import { Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';
import { AttendanceCalendar } from '../components/AttendanceCalendar';
import { RRHHLayout } from '../layout/RRHHLayout';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const AsistenciasPage = () => {
    const { userProfile } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const getProfileSpecificContent = () => {
        switch(userProfile) {
            case 'personal':
                return {
                    title: 'Mis Asistencias',
                    description: 'Gestiona tus asistencias y justificaciones'
                };
            case 'rrhh':
                return {
                    title: 'Gestión de Asistencias',
                    description: 'Administra las asistencias y justificaciones del personal'
                };
            case 'jefe':
                return {
                    title: 'Asistencias del Equipo',
                    description: 'Gestiona las asistencias del personal a tu cargo'
                };
            case 'admin':
                return {
                    title: 'Administración de Asistencias',
                    description: 'Gestión completa del sistema de asistencias'
                };
            default:
                return {
                    title: 'Asistencias',
                    description: 'Sistema de control de asistencias'
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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/marcar-asistencia')}
                                    sx={{ mb: 2 }}
                                >
                                    Marcar Asistencia
                                </Button>
                                <Box sx={{ mt: 3 }}>
                                    <AttendanceCalendar />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </RRHHLayout>
    );
};