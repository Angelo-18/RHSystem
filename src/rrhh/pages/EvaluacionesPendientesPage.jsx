import { useState } from 'react';
import { Typography, Grid, Card, CardContent, Box, Container, CardActions, Button, Chip, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { RRHHLayout } from '../layout/RRHHLayout';
import { useSelector } from 'react-redux';
import { EvaluationForm } from '../components/EvaluationForm';

const mockPendingEvaluations = [
    {
        id: '1',
        evaluationType: '90',
        evaluatedPerson: {
            id: '101',
            name: 'Juan Pérez',
            position: 'Desarrollador Frontend'
        },
        dueDate: '2024-03-15',
        status: 'pending'
    },
    {
        id: '2',
        evaluationType: '180',
        evaluatedPerson: {
            id: '102',
            name: 'María García',
            position: 'Diseñadora UX'
        },
        dueDate: '2024-03-20',
        status: 'pending'
    }
];

export const EvaluacionesPendientesPage = () => {
    const { userProfile } = useSelector(state => state.auth);
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const getProfileSpecificContent = () => {
        switch(userProfile) {
            case 'colaborador':
                return {
                    title: 'Mis Evaluaciones Pendientes',
                    description: 'Realiza tus evaluaciones asignadas'
                };
            case 'recursos_humanos':
                return {
                    title: 'Evaluaciones Pendientes',
                    description: 'Realiza y gestiona las evaluaciones pendientes'
                };
            case 'supervisor':
                return {
                    title: 'Evaluaciones de Equipo Pendientes',
                    description: 'Realiza las evaluaciones pendientes de tu equipo'
                };
            case 'admin':
                return {
                    title: 'Gestión de Evaluaciones Pendientes',
                    description: 'Administra todas las evaluaciones pendientes'
                };
            default:
                return {
                    title: 'Evaluaciones Pendientes',
                    description: 'Sistema de evaluaciones'
                };
        }
    };

    const handleStartEvaluation = (evaluation) => {
        setSelectedEvaluation(evaluation);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSubmitEvaluation = async (formData) => {
        try {
            console.log('Evaluación completada:', {
                evaluationId: selectedEvaluation.id,
                formData
            });
            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar la evaluación:', error);
        }
    };

    const content = getProfileSpecificContent();

    return (
        <RRHHLayout>
            <Box className="animate__animated animate__fadeIn animate__faster">
                <Container maxWidth="lg">
                    <Box sx={{ py: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            {content.title}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            {content.description}
                        </Typography>

                        <Grid container spacing={3}>
                            {mockPendingEvaluations.map((evaluation) => (
                                <Grid item xs={12} md={6} key={evaluation.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {evaluation.evaluatedPerson.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {evaluation.evaluatedPerson.position}
                                            </Typography>
                                            <Box sx={{ mt: 2, mb: 2 }}>
                                                <Chip 
                                                    label={`Evaluación ${evaluation.evaluationType}°`}
                                                    color="primary"
                                                    sx={{ mr: 1 }}
                                                />
                                                <Chip 
                                                    label={`Vence: ${evaluation.dueDate}`}
                                                    color="warning"
                                                />
                                            </Box>
                                        </CardContent>
                                        <CardActions>
                                            <Button 
                                                variant="contained" 
                                                onClick={() => handleStartEvaluation(evaluation)}
                                                fullWidth
                                            >
                                                Realizar Evaluación
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Dialog
                            open={openDialog}
                            onClose={handleCloseDialog}
                            maxWidth="md"
                            fullWidth
                        >
                            <DialogTitle>
                                Realizar Evaluación
                            </DialogTitle>
                            <DialogContent>
                                {selectedEvaluation && (
                                    <EvaluationForm
                                        evaluationType={selectedEvaluation.evaluationType}
                                        evaluatedPerson={selectedEvaluation.evaluatedPerson}
                                        onSubmit={handleSubmitEvaluation}
                                    />
                                )}
                            </DialogContent>
                        </Dialog>
                    </Box>
                </Container>
            </Box>
        </RRHHLayout>
    );
};