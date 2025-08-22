import { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Button,
    Grid,
    Typography,
    Chip,
    Paper,
    Autocomplete
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';

const evaluationTypes = [
    { id: '90', name: 'Evaluación 90°', description: 'Evaluación por el supervisor directo' },
    { id: '180', name: 'Evaluación 180°', description: 'Evaluación por el supervisor y autoevaluación' },
    { id: '360', name: 'Evaluación 360°', description: 'Evaluación integral (supervisor, pares, subordinados y autoevaluación)' }
];

export const AssignEvaluationForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        evaluationType: '',
        evaluatedEmployees: [],
        evaluators: [],
        startDate: null,
        endDate: null,
        objectives: ''
    });

    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [availableEvaluators, setAvailableEvaluators] = useState([]);

    // TODO: Cargar empleados y evaluadores desde Firebase
    useEffect(() => {
        // Simulación de datos
        setAvailableEmployees([
            { id: '1', name: 'Juan Pérez', position: 'Desarrollador' },
            { id: '2', name: 'María García', position: 'Diseñadora' },
            // Agregar más empleados
        ]);

        setAvailableEvaluators([
            { id: '3', name: 'Carlos López', position: 'Supervisor' },
            { id: '4', name: 'Ana Martínez', position: 'Gerente' },
            // Agregar más evaluadores
        ]);
    }, []);

    const handleChange = (field) => (event) => {
        setFormData({
            ...formData,
            [field]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData);
    };

    const getEvaluationTypeDescription = () => {
        const type = evaluationTypes.find(t => t.id === formData.evaluationType);
        return type ? type.description : '';
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Asignar Nueva Evaluación
                        </Typography>
                    </Grid>

                    {/* Tipo de Evaluación */}
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Tipo de Evaluación</InputLabel>
                            <Select
                                value={formData.evaluationType}
                                onChange={handleChange('evaluationType')}
                                label="Tipo de Evaluación"
                            >
                                {evaluationTypes.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {formData.evaluationType && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {getEvaluationTypeDescription()}
                            </Typography>
                        )}
                    </Grid>

                    {/* Personal a Evaluar */}
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            options={availableEmployees}
                            getOptionLabel={(option) => `${option.name} - ${option.position}`}
                            onChange={(event, newValue) => {
                                setFormData({
                                    ...formData,
                                    evaluatedEmployees: newValue
                                });
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Personal a Evaluar"
                                    placeholder="Seleccione el personal"
                                />
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={`${option.name} - ${option.position}`}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                        />
                    </Grid>

                    {/* Evaluadores */}
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            options={availableEvaluators}
                            getOptionLabel={(option) => `${option.name} - ${option.position}`}
                            onChange={(event, newValue) => {
                                setFormData({
                                    ...formData,
                                    evaluators: newValue
                                });
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Evaluadores"
                                    placeholder="Seleccione los evaluadores"
                                />
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={`${option.name} - ${option.position}`}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                        />
                    </Grid>

                    {/* Fechas */}
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Fecha de Inicio"
                                value={formData.startDate}
                                onChange={(newValue) => {
                                    setFormData({
                                        ...formData,
                                        startDate: newValue
                                    });
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Fecha de Fin"
                                value={formData.endDate}
                                onChange={(newValue) => {
                                    setFormData({
                                        ...formData,
                                        endDate: newValue
                                    });
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                    </Grid>

                    {/* Objetivos */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Objetivos de la Evaluación"
                            value={formData.objectives}
                            onChange={handleChange('objectives')}
                            placeholder="Describa los objetivos específicos de esta evaluación..."
                        />
                    </Grid>

                    {/* Botón de Envío */}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                        >
                            Asignar Evaluación
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};