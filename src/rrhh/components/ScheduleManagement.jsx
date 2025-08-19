import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Divider
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useScheduleStore } from '../../hooks/useScheduleStore';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ScheduleManagement = () => {
    const {
        schedules,
        loadSchedules,
        createSchedule,
        updateSchedule,
        deleteSchedule,
        errorMessage
    } = useScheduleStore();

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        horaEntrada: '',
        horaSalida: '',
        horaInicioDescanso: '',
        horaFinDescanso: '',
        diasLaborables: [],
        tolerancia: 10,
        horaEntradaFinSemana: '',
        horaSalidaFinSemana: '',
        horaInicioDescansoFinSemana: '',
        horaFinDescansoFinSemana: ''
    });

    useEffect(() => {
        loadSchedules();
    }, []);

    const handleOpen = (schedule = null) => {
        if (schedule) {
            setEditMode(true);
            setSelectedSchedule(schedule);
            setFormData({
                nombre: schedule.nombre,
                descripcion: schedule.descripcion,
                horaEntrada: schedule.horaEntrada,
                horaSalida: schedule.horaSalida,
                horaInicioDescanso: schedule.horaInicioDescanso,
                horaFinDescanso: schedule.horaFinDescanso,
                diasLaborables: schedule.diasLaborables,
                tolerancia: schedule.tolerancia || 10,
                horaEntradaFinSemana: schedule.horaEntradaFinSemana || '',
                horaSalidaFinSemana: schedule.horaSalidaFinSemana || '',
                horaInicioDescansoFinSemana: schedule.horaInicioDescansoFinSemana || '',
                horaFinDescansoFinSemana: schedule.horaFinDescansoFinSemana || ''
            });
        } else {
            setEditMode(false);
            setSelectedSchedule(null);
            setFormData({
                nombre: '',
                descripcion: '',
                horaEntrada: '',
                horaSalida: '',
                horaInicioDescanso: '',
                horaFinDescanso: '',
                diasLaborables: [],
                tolerancia: 10,
                horaEntradaFinSemana: '',
                horaSalidaFinSemana: '',
                horaInicioDescansoFinSemana: '',
                horaFinDescansoFinSemana: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setSelectedSchedule(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDiaChange = (dia) => {
        setFormData(prev => {
            const diasActuales = prev.diasLaborables;
            const nuevoDias = diasActuales.includes(dia)
                ? diasActuales.filter(d => d !== dia)
                : [...diasActuales, dia];
            return {
                ...prev,
                diasLaborables: nuevoDias
            };
        });
    };

    const handleSubmit = async () => {
        try {
            if (editMode) {
                await updateSchedule(selectedSchedule.id, formData);
            } else {
                await createSchedule(formData);
            }
            handleClose();
            loadSchedules(); // Recargar la lista
        } catch (error) {
            console.error('Error al guardar horario:', error);
        }
    };

    const handleDelete = async (scheduleId) => {
        if (window.confirm('¿Está seguro de eliminar este horario?')) {
            try {
                await deleteSchedule(scheduleId);
                loadSchedules(); // Recargar la lista
            } catch (error) {
                console.error('Error al eliminar horario:', error);
            }
        }
    };

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">
                    Gestión de Horarios
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Nuevo Horario
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Hora Entrada</TableCell>
                            <TableCell>Hora Salida</TableCell>
                            <TableCell>Descanso</TableCell>
                            <TableCell>Tolerancia</TableCell>
                            <TableCell>Horario Fin de Semana</TableCell>
                            <TableCell>Días Laborables</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {schedules.map((schedule) => (
                            <TableRow key={schedule.id}>
                                <TableCell>{schedule.nombre}</TableCell>
                                <TableCell>{schedule.descripcion}</TableCell>
                                <TableCell>{schedule.horaEntrada}</TableCell>
                                <TableCell>{schedule.horaSalida}</TableCell>
                                <TableCell>
                                    {schedule.horaInicioDescanso} - {schedule.horaFinDescanso}
                                </TableCell>
                                <TableCell>
                                    {schedule.tolerancia} min
                                </TableCell>
                                <TableCell>
                                    {schedule.horaEntradaFinSemana && schedule.horaSalidaFinSemana ? (
                                        <>
                                            Entrada: {schedule.horaEntradaFinSemana}<br />
                                            Salida: {schedule.horaSalidaFinSemana}
                                        </>
                                    ) : 'No definido'}
                                </TableCell>
                                <TableCell>
                                    {schedule.diasLaborables.map((dia) => (
                                        <Chip
                                            key={dia}
                                            label={dia}
                                            size="small"
                                            sx={{ m: 0.5 }}
                                        />
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpen(schedule)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(schedule.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editMode ? 'Editar Horario' : 'Nuevo Horario'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            name="nombre"
                            label="Nombre del Horario"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <TextField
                            name="descripcion"
                            label="Descripción"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={2}
                        />
                        
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Horario entre Semana
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="horaEntrada"
                                label="Hora de Entrada"
                                type="time"
                                value={formData.horaEntrada}
                                onChange={handleInputChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                name="horaSalida"
                                label="Hora de Salida"
                                type="time"
                                value={formData.horaSalida}
                                onChange={handleInputChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="horaInicioDescanso"
                                label="Inicio de Descanso"
                                type="time"
                                value={formData.horaInicioDescanso}
                                onChange={handleInputChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                name="horaFinDescanso"
                                label="Fin de Descanso"
                                type="time"
                                value={formData.horaFinDescanso}
                                onChange={handleInputChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>

                        <TextField
                            name="tolerancia"
                            label="Tolerancia (minutos)"
                            type="number"
                            value={formData.tolerancia}
                            onChange={handleInputChange}
                            fullWidth
                            InputProps={{ inputProps: { min: 0, max: 60 } }}
                            helperText="Esta tolerancia se aplicará a todos los horarios"
                        />

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6">
                            Horario de Fin de Semana
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="horaEntradaFinSemana"
                                label="Hora de Entrada (Fin de Semana)"
                                type="time"
                                value={formData.horaEntradaFinSemana}
                                onChange={handleInputChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                name="horaSalidaFinSemana"
                                label="Hora de Salida (Fin de Semana)"
                                type="time"
                                value={formData.horaSalidaFinSemana}
                                onChange={handleInputChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="horaInicioDescansoFinSemana"
                                label="Inicio de Descanso (Fin de Semana)"
                                type="time"
                                value={formData.horaInicioDescansoFinSemana}
                                onChange={handleInputChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                name="horaFinDescansoFinSemana"
                                label="Fin de Descanso (Fin de Semana)"
                                type="time"
                                value={formData.horaFinDescansoFinSemana}
                                onChange={handleInputChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <FormControl component="fieldset">
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Días Laborables
                            </Typography>
                            <FormGroup row>
                                {diasSemana.map((dia) => (
                                    <FormControlLabel
                                        key={dia}
                                        control={
                                            <Checkbox
                                                checked={formData.diasLaborables.includes(dia)}
                                                onChange={() => handleDiaChange(dia)}
                                            />
                                        }
                                        label={dia}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editMode ? 'Guardar Cambios' : 'Crear Horario'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};