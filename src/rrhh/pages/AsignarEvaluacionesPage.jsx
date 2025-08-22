import { Typography, Container, Box, Alert, Snackbar } from '@mui/material';
import { RRHHLayout } from '../layout/RRHHLayout';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AssignEvaluationForm } from '../components/AssignEvaluationForm';

export const AsignarEvaluacionesPage = () => {
    const { userProfile } = useSelector(state => state.auth);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    if (userProfile !== 'recursos_humanos' && userProfile !== 'admin') {
        return <Navigate to="/evaluaciones/pendientes" />;
    }

    const handleSubmit = async (formData) => {
        try {
            // TODO: Implementar la lógica para guardar la evaluación en Firebase
            console.log('Datos de la evaluación:', formData);
            
            setNotification({
                open: true,
                message: 'Evaluación asignada correctamente',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error al asignar la evaluación:', error);
            setNotification({
                open: true,
                message: 'Error al asignar la evaluación',
                severity: 'error'
            });
        }
    };

    const handleCloseNotification = () => {
        setNotification({
            ...notification,
            open: false
        });
    };

    return (
        <RRHHLayout>
            <Box className="animate__animated animate__fadeIn animate__faster">
                <Container maxWidth="lg">
                    <Box sx={{ py: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            Asignar Evaluaciones
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            Aquí podrás asignar nuevas evaluaciones al personal.
                        </Typography>

                        <AssignEvaluationForm onSubmit={handleSubmit} />

                        <Snackbar
                            open={notification.open}
                            autoHideDuration={6000}
                            onClose={handleCloseNotification}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        >
                            <Alert
                                onClose={handleCloseNotification}
                                severity={notification.severity}
                                sx={{ width: '100%' }}
                            >
                                {notification.message}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Container>
            </Box>
        </RRHHLayout>
    );
};