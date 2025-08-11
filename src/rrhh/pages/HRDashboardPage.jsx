import { Typography, Grid, Card, CardContent, Box, Chip, Button } from '@mui/material';
import { RRHHLayout } from '../layout/RRHHLayout';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const HRDashboardPage = () => {
    const { displayName, email } = useSelector(state => state.auth);
    const navigate = useNavigate();

    return (
        <RRHHLayout>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sistema de Recursos Humanos
                </Typography>
                
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Bienvenido, {displayName}
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    {/* Módulo de Personal */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    👥 Gestión de Personal
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Administra las solicitudes de registro y el personal activo del sistema.
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    onClick={() => navigate('/personal')}
                                >
                                    Ir a Personal
                                </Button>
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
                                    Gestiona las evaluaciones del personal.
                                </Typography>
                                <Chip label="Próximamente" color="primary" variant="outlined" />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Módulo de Documentos */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    📄 Documentos
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    Accede y gestiona documentos importantes del personal.
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
        </RRHHLayout>
    )
}