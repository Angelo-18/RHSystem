import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert
} from '@mui/material';
import { RRHHLayout } from '../layout/RRHHLayout';
import { startAddingAttendanceRecord } from '../../store/attendance/thunks';

export const MarkAttendancePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { uid } = useSelector(state => state.auth);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formValues, setFormValues] = useState({
        type: 'entrada',
        notes: ''
    });

    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const now = new Date();
        const recordData = {
            userId: uid,
            type: formValues.type,
            notes: formValues.notes,
            start: now.toISOString(),
            end: now.toISOString(),
            title: `Marcación: ${formValues.type}`,
            startBreak: formValues.type === 'break_inicio' ? now.toISOString() : null,
            endBreak: formValues.type === 'break_fin' ? now.toISOString() : null
        };

        const response = await dispatch(startAddingAttendanceRecord(recordData));
        const { ok } = response || { ok: false };
        console.log(ok);

        if (ok) {
            setSuccess(true);
            setTimeout(() => {
                navigate('/asistencias');
            }, 2000);
        } else {
            setError('Error al registrar la asistencia. Por favor, intente nuevamente.');
        }
    };

    return (
        <RRHHLayout>
            <Box className="animate__animated animate__fadeIn animate__faster">
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={8} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Marcar Asistencia
                                </Typography>

                                {error && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        Asistencia registrada correctamente. Redirigiendo...
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Tipo de Marcación</InputLabel>
                                        <Select
                                            name="type"
                                            value={formValues.type}
                                            onChange={handleInputChange}
                                            label="Tipo de Marcación"
                                            required
                                        >
                                            <MenuItem value="entrada">Entrada</MenuItem>
                                            <MenuItem value="salida">Salida</MenuItem>
                                            <MenuItem value="break_inicio">Inicio de Break</MenuItem>
                                            <MenuItem value="break_fin">Fin de Break</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Notas (opcional)"
                                        name="notes"
                                        value={formValues.notes}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={3}
                                    />

                                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            disabled={success}
                                        >
                                            Marcar Asistencia
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                            onClick={() => navigate('/asistencias')}
                                            disabled={success}
                                        >
                                            Cancelar
                                        </Button>
                                    </Box>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </RRHHLayout>
    );
};