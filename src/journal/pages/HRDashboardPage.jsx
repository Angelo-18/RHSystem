import { Typography, Grid, Card, CardContent, Box, Chip } from '@mui/material';
import { JournalLayout } from '../layout/JournalLayout';
import { useSelector } from 'react-redux';

export const HRDashboardPage = () => {

    const { displayName, email } = useSelector( state => state.auth );

    return (
        <JournalLayout>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sistema de Recursos Humanos
                </Typography>
                
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Bienvenido, {displayName}
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {/* Módulo de Asistencias */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    📅 Registro de Asistencias
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Gestiona tu historial de asistencias, justifica faltas y tardanzas.
                                </Typography>
                                <Chip label="Próximamente" color="primary" variant="outlined" />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Módulo de Documentación */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    📄 Documentación
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Accede a tus boletas de pago, información de vacaciones y contratos.
                                </Typography>
                                <Chip label="Próximamente" color="primary" variant="outlined" />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Módulo de Evaluaciones */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    📊 Evaluaciones
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Realiza evaluaciones 90°, 180° y 360°. Ve tus resultados y progreso.
                                </Typography>
                                <Chip label="Próximamente" color="primary" variant="outlined" />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Información del Usuario */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    👤 Información del Usuario
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Nombre:</strong> {displayName}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Email:</strong> {email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                    Este sistema está en desarrollo. Las funcionalidades se irán habilitando progresivamente.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </JournalLayout>
    )
}