import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Grid, Typography, CircularProgress } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { startLogout } from '../../store/auth/thunks';
import { checkUserRegistration } from '../../helpers/checkUserRegistration';

export const PendingApprovalPage = () => {
    const { displayName, email, uid } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [registrationData, setRegistrationData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegistrationStatus = async () => {
            try {
                const { userData } = await checkUserRegistration(uid);
                setRegistrationData(userData);
            } catch (error) {
                console.error('Error al obtener estado de registro:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrationStatus();
    }, [uid]);

    const onLogout = async () => {
        await dispatch(startLogout());
        navigate('/auth/login');
    }

    if (loading) {
        return (
            <AuthLayout title="Verificando Estado">
                <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '300px' }}>
                    <CircularProgress />
                </Grid>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Estado de Solicitud">
            <div className="animate__animated animate__fadeIn animate__faster">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" component="h1" gutterBottom align="center">
                            ¡Hola {displayName}!
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                Detalles de tu solicitud:
                            </Typography>
                            <Typography variant="body2">
                                <strong>Email:</strong> {email}
                            </Typography>
                            {registrationData && (
                                <>
                                    <Typography variant="body2">
                                        <strong>Empresa:</strong> {registrationData.empresa}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Área:</strong> {registrationData.area}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Fecha de Solicitud:</strong> {new Date(registrationData.fechaSolicitud).toLocaleDateString()}
                                    </Typography>
                                </>
                            )}
                        </Alert>
                    </Grid>

                    <Grid item xs={12}>
                        <Alert severity="warning">
                            <Typography variant="body1" gutterBottom>
                                <strong>Estado:</strong> {registrationData?.estado === 'pendiente' ? 'Pendiente de aprobación' : 'En revisión'}
                            </Typography>
                            <Typography variant="body2">
                                Un administrador está revisando tu solicitud y te notificará cuando tengas acceso al sistema.
                                Este proceso puede tomar entre 24-48 horas hábiles.
                            </Typography>
                        </Alert>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, mb: 2 }}>
                            Si tienes alguna pregunta o ha pasado más tiempo del estimado, por favor contacta al departamento de Recursos Humanos.
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Button 
                            onClick={onLogout}
                            variant="outlined" 
                            fullWidth
                            color="primary"
                        >
                            Cerrar Sesión
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </AuthLayout>
    )
}