import { useState } from 'react';
import { useSelector } from 'react-redux';
import { CloudUpload } from '@mui/icons-material';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import { useAttendanceStore } from '../../hooks/useAttendanceStore';

export const AttendanceModal = ({ open, onClose, selectedEvent }) => {
    const { userProfile } = useSelector(state => state.auth);
    const { startSavingJustification, isLoading, error: storeError } = useAttendanceStore();

    const [justification, setJustification] = useState(selectedEvent?.justification || '');
    const [status, setStatus] = useState(selectedEvent?.status || 'pending');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('El archivo no debe superar los 5MB');
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSave = async () => {
        if (!selectedEvent) return;
        if (!justification.trim()) {
            setError('Por favor, ingrese un motivo para la justificación');
            return;
        }

        const justificationData = {
            justification: justification.trim(),
            status: userProfile === 'colaborador' ? 'pending' : status,
            updatedAt: new Date().toISOString(),
        };

        const result = await startSavingJustification(
            selectedEvent.id,
            justificationData,
            file
        );

        if (result.success) {
            handleClose();
        }
    };

    const handleClose = () => {
        setJustification('');
        setStatus('pending');
        setFile(null);
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                {userProfile === 'colaborador' ? 'Justificar Asistencia' : 'Gestionar Asistencia'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="body2" gutterBottom>
                        Fecha: {selectedEvent?.start?.toLocaleDateString()}
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Justificación"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={justification}
                        onChange={(e) => setJustification(e.target.value)}
                        disabled={userProfile !== 'colaborador' && selectedEvent?.status === 'approved'}
                    />
                    {userProfile === 'colaborador' && (
                        <Box sx={{ mt: 3 }}>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                style={{ display: 'none' }}
                                id="justification-document"
                                onChange={handleFileChange}
                                disabled={isLoading}
                            />
                            <label htmlFor="justification-document">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<CloudUpload />}
                                    disabled={isLoading}
                                >
                                    {file ? 'Cambiar documento' : 'Adjuntar documento'}
                                </Button>
                            </label>
                            {file && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Archivo seleccionado: {file.name}
                                </Typography>
                            )}
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                Formatos aceptados: PDF, DOC, DOCX, JPG, JPEG, PNG (máx. 5MB)
                            </Typography>
                        </Box>
                    )}
                    {(error || storeError) && (
                        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                            {error || storeError}
                        </Typography>
                    )}
                    {(userProfile === 'rrhh' || userProfile === 'admin' || userProfile === 'jefe') && (
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={status}
                                label="Estado"
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <MenuItem value="pending">Pendiente</MenuItem>
                                <MenuItem value="approved">Aprobado</MenuItem>
                                <MenuItem value="rejected">Rechazado</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isLoading}>Cancelar</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={isLoading}
                    startIcon={isLoading && <CircularProgress size={20} />}
                >
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};