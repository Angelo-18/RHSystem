import { Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { RRHHLayout } from '../layout/RRHHLayout';
import { useSelector } from 'react-redux';

export const DocumentacionPage = () => {
    const { userProfile } = useSelector(state => state.auth);

    const getProfileSpecificContent = () => {
        switch(userProfile) {
            case 'personal':
                return {
                    title: 'Mi Documentación',
                    description: 'Accede a tus boletas de pago, legajos y contratos'
                };
            case 'rrhh':
                return {
                    title: 'Gestión de Documentación',
                    description: 'Administra la documentación de todo el personal'
                };
            case 'jefe':
                return {
                    title: 'Mi Documentación',
                    description: 'Accede a tus documentos personales'
                };
            case 'admin':
                return {
                    title: 'Administración de Documentación',
                    description: 'Gestión completa del sistema de documentación'
                };
            default:
                return {
                    title: 'Documentación',
                    description: 'Sistema de gestión documental'
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
                                    Esta sección está en desarrollo. Próximamente podrás gestionar la documentación según tu perfil.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </RRHHLayout>
    );
};