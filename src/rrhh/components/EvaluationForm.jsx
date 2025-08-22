import { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Rating,
    TextField,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    Card,
    CardContent,
    Stepper,
    Step,
    StepLabel,
    StepContent
} from '@mui/material';

const competencyCategories = [
    {
        name: 'Competencias Técnicas',
        items: [
            { id: 'tech_1', name: 'Conocimiento técnico', description: 'Dominio de las herramientas y tecnologías requeridas para el puesto' },
            { id: 'tech_2', name: 'Resolución de problemas', description: 'Capacidad para identificar y resolver problemas de manera efectiva' },
            { id: 'tech_3', name: 'Calidad del trabajo', description: 'Precisión y excelencia en las tareas realizadas' }
        ]
    },
    {
        name: 'Habilidades Blandas',
        items: [
            { id: 'soft_1', name: 'Trabajo en equipo', description: 'Capacidad para colaborar y contribuir en equipos' },
            { id: 'soft_2', name: 'Comunicación', description: 'Efectividad en la comunicación oral y escrita' },
            { id: 'soft_3', name: 'Adaptabilidad', description: 'Flexibilidad para adaptarse a cambios y nuevas situaciones' }
        ]
    },
    {
        name: 'Objetivos y Metas',
        items: [
            { id: 'goal_1', name: 'Cumplimiento de objetivos', description: 'Logro de metas y objetivos establecidos' },
            { id: 'goal_2', name: 'Iniciativa', description: 'Proactividad y capacidad de tomar iniciativas' },
            { id: 'goal_3', name: 'Productividad', description: 'Eficiencia y efectividad en el trabajo' }
        ]
    }
];

const evaluationSteps = [
    {
        label: 'Información General',
        description: 'Información básica de la evaluación'
    },
    {
        label: 'Competencias',
        description: 'Evaluación de competencias técnicas y blandas'
    },
    {
        label: 'Objetivos',
        description: 'Evaluación de cumplimiento de objetivos'
    },
    {
        label: 'Retroalimentación',
        description: 'Comentarios y áreas de mejora'
    }
];

export const EvaluationForm = ({ evaluationType, evaluatedPerson, onSubmit }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        competencies: {},
        objectives: {},
        feedback: {
            strengths: '',
            improvements: '',
            comments: ''
        }
    });

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleCompetencyChange = (categoryId, itemId, value) => {
        setFormData(prev => ({
            ...prev,
            competencies: {
                ...prev.competencies,
                [itemId]: {
                    value,
                    categoryId
                }
            }
        }));
    };

    const handleFeedbackChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            feedback: {
                ...prev.feedback,
                [field]: event.target.value
            }
        }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const renderCompetencySection = (category) => (
        <Card key={category.name} sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {category.name}
                </Typography>
                <Grid container spacing={3}>
                    {category.items.map((item) => (
                        <Grid item xs={12} key={item.id}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {item.description}
                                </Typography>
                                <Rating
                                    name={item.id}
                                    value={formData.competencies[item.id]?.value || 0}
                                    onChange={(event, newValue) => {
                                        handleCompetencyChange(category.name, item.id, newValue);
                                    }}
                                    size="large"
                                />
                            </Box>
                            <Divider />
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Evaluación de {evaluatedPerson?.name || 'Empleado'}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Tipo de Evaluación: {evaluationType}°
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Por favor, complete cada sección de la evaluación de manera objetiva y constructiva.
                            Sus respuestas ayudarán al desarrollo profesional del evaluado.
                        </Typography>
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        {competencyCategories.slice(0, 2).map(renderCompetencySection)}
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        {renderCompetencySection(competencyCategories[2])}
                    </Box>
                );
            case 3:
                return (
                    <Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Fortalezas Destacadas"
                                    value={formData.feedback.strengths}
                                    onChange={handleFeedbackChange('strengths')}
                                    placeholder="Describa las principales fortalezas y logros del evaluado..."
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Áreas de Mejora"
                                    value={formData.feedback.improvements}
                                    onChange={handleFeedbackChange('improvements')}
                                    placeholder="Identifique áreas específicas que requieren desarrollo..."
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Comentarios Adicionales"
                                    value={formData.feedback.comments}
                                    onChange={handleFeedbackChange('comments')}
                                    placeholder="Agregue cualquier comentario o recomendación adicional..."
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {evaluationSteps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel>
                            <Typography variant="subtitle1">{step.label}</Typography>
                        </StepLabel>
                        <StepContent>
                            <Box sx={{ mb: 2 }}>
                                {renderStepContent(index)}
                                <Box sx={{ mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        onClick={index === evaluationSteps.length - 1 ? handleSubmit : handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {index === evaluationSteps.length - 1 ? 'Finalizar' : 'Continuar'}
                                    </Button>
                                    {index > 0 && (
                                        <Button
                                            onClick={handleBack}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            Atrás
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Paper>
    );
};