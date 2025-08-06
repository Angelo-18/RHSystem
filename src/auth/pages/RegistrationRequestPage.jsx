import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, FormControl, Grid, InputLabel, Link, MenuItem, Select, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { useForm } from '../../hooks';
import { createRegistrationRequest } from '../../helpers/checkUserRegistration';
import { updateRegistrationStatus } from '../../store/auth';
import { PendingApprovalPage } from './PendingApprovalPage';

const formData = {
    empresa: '',
    area: ''
};

const empresas = [
    'Empresa A',
    'Empresa B', 
    'Empresa C',
    'Corporativo'
];

const areas = [
    'Recursos Humanos',
    'Tecnología',
    'Ventas',
    'Marketing',
    'Operaciones',
    'Finanzas',
    'Administración'
];

export const RegistrationRequestPage = () => {

    const { status, uid, email, displayName, isRegistered, isActive } = useSelector( state => state.auth );
    const dispatch = useDispatch();
    
    // Debug: mostrar el estado actual
    console.log('RegistrationRequestPage - Estado actual:', { status, uid, email, displayName, isRegistered, isActive });
    
    const { empresa, area, onInputChange } = useForm( formData );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [submitError, setSubmitError] = useState('');

    // Si el usuario ya está registrado pero no activo, mostrar página de espera
    // Solo después de enviar la solicitud exitosamente
    if (isRegistered && !isActive && submitMessage) {
        return <PendingApprovalPage />;
    }

    const onSubmit = async( event ) => {
        event.preventDefault();
        
        if (!empresa || !area) {
            setSubmitError('Por favor selecciona empresa y área');
            return;
        }
        
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitMessage('');
        
        try {
            const success = await createRegistrationRequest(uid, email, displayName, empresa, area);
            
            if (success) {
                setSubmitMessage('Solicitud enviada exitosamente. Espera la aprobación del administrador.');
                // Actualizar el estado para indicar que ya se envió la solicitud
                dispatch(updateRegistrationStatus({ isRegistered: true, isActive: false }));
            } else {
                setSubmitError('Error al enviar la solicitud. Intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error en onSubmit:', error);
            setSubmitError('Error al enviar la solicitud. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout title="Solicitud de Acceso">
            <form onSubmit={ onSubmit } className="animate__animated animate__fadeIn animate__faster">
                <Grid container>
                    <Grid item xs={ 12 } sx={{ mt: 2 }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Bienvenido {displayName}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Para acceder al sistema de Recursos Humanos, necesitas completar tu registro:
                        </Typography>
                    </Grid>

                    <Grid item xs={ 12 } sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Empresa</InputLabel>
                            <Select
                                value={ empresa }
                                label="Empresa"
                                name="empresa"
                                onChange={ onInputChange }
                                disabled={ isSubmitting }
                            >
                                {empresas.map((emp) => (
                                    <MenuItem key={emp} value={emp}>{emp}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={ 12 } sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Área</InputLabel>
                            <Select
                                value={ area }
                                label="Área"
                                name="area"
                                onChange={ onInputChange }
                                disabled={ isSubmitting }
                            >
                                {areas.map((ar) => (
                                    <MenuItem key={ar} value={ar}>{ar}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
                        {submitError && (
                            <Grid item xs={ 12 }>
                                <Alert severity="error">{submitError}</Alert>
                            </Grid>
                        )}
                        
                        {submitMessage && (
                            <Grid item xs={ 12 }>
                                <Alert severity="success">{submitMessage}</Alert>
                            </Grid>
                        )}
                        
                        <Grid item xs={ 12 }>
                            <Button 
                                disabled={ isSubmitting || !!submitMessage }
                                type="submit" 
                                variant="contained" 
                                fullWidth
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                            </Button>
                        </Grid>
                    </Grid>

                </Grid>
            </form>
        </AuthLayout>
    )
}