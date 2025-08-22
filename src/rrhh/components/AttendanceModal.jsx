import { useState, useEffect } from 'react';
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
    CircularProgress,
    Divider
} from '@mui/material';
import { useJustificationsStore } from '../../hooks/useJustificationsStore';

export const AttendanceModal = ({ open, onClose, selectedEvent }) => {
    const { userProfile } = useSelector(state => state.auth);
    const { startSavingJustification, isLoading, errorMessage } = useJustificationsStore();

    const [justification, setJustification] = useState(selectedEvent?.reason || '');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
                setError('El archivo es demasiado grande. El tamaño máximo es 5MB.');
                return;
            }
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Formato de archivo no válido. Por favor, seleccione un archivo PDF, DOC, DOCX, JPG o PNG.');
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSave = async () => {
        if (!justification.trim()) {
            setError('Por favor, ingrese una justificación');
            return;
        }
        
        const justificationData = {
            attendanceId: selectedEvent.id,
            reason: justification.trim(),
            status: 'pending',
            date: selectedEvent.start
        };

        const result = await startSavingJustification(justificationData, file);
        if (result.ok) {
            handleClose();
        }
    };

    const handleClose = () => {
        setJustification('');
        setFile(null);
        setError(null);
        onClose();
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Pendiente de revisión';
            case 'approved':
                return 'Aprobado';
            case 'rejected':
                return 'Rechazado';
            case 'registered':
                return 'Registrado';
            default:
                return 'Estado desconocido';
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                {userProfile === 'colaborador' ? 'Justificar Asistencia' : 'Gestionar Asistencia'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                        <strong>Fecha:</strong> {selectedEvent?.start ? new Date(selectedEvent.start).toLocaleDateString() : ''}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        <strong>Estado:</strong> {getStatusText(selectedEvent?.status)}
                    </Typography>
                    {selectedEvent?.notes && (
                        <Typography variant="body2" color="error" gutterBottom>
                            <strong>Notas del sistema:</strong> {selectedEvent.notes}
                        </Typography>
                    )}
                    <Divider sx={{ my: 2 }} />
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
                    {(error || errorMessage) && (
                        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                            {error || errorMessage}
                        </Typography>
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