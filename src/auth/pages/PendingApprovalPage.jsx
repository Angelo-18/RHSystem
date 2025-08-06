import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Grid, Typography } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { startLogout } from '../../store/auth/thunks';

export const PendingApprovalPage = () => {

    const { displayName, email } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch( startLogout() );
    }

    return (
        <AuthLayout title="Solicitud Pendiente">
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
                                Tu solicitud de acceso al sistema de Recursos Humanos ha sido recibida exitosamente.
                            </Typography>
                            <Typography variant="body2">
                                <strong>Email:</strong> {email}
                            </Typography>
                        </Alert>
                    </Grid>

                    <Grid item xs={12}>
                        <Alert severity="warning">
                            <Typography variant="body1" gutterBottom>
                                <strong>Estado:</strong> Pendiente de aprobación
                            </Typography>
                            <Typography variant="body2">
                                Un administrador revisará tu solicitud y te notificará cuando tengas acceso al sistema.
                                Esto puede tomar entre 24-48 horas hábiles.
                            </Typography>
                        </Alert>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2, mb: 2 }}>
                            Si tienes alguna pregunta, contacta al departamento de Recursos Humanos.
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