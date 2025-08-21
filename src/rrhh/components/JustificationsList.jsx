import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    IconButton,
    Typography,
    Link,
    Box,
    CircularProgress
} from '@mui/material';
import { Download, Visibility, Edit, Delete } from '@mui/icons-material';
import { useJustificationsStore } from '../../hooks/useJustificationsStore';
import { AttendanceModal } from './AttendanceModal';

export const JustificationsList = () => {
    const { userProfile, uid } = useSelector(state => state.auth);
    console.log(userProfile);
    const { 
        justifications, 
        isLoading, 
        startLoadingJustifications, 
        setActiveJustificationEvent,
        handleDeleteJustification,
        activeJustification,
        clearActiveJustificationEvent
    } = useJustificationsStore();

  const canApproveJustifications = ['supervisor', 'recursos_humanos', 'admin'].includes(userProfile);
    const canEditDeleteJustification = (justification) => {
        return userProfile === 'colaborador' && justification.userId === uid;
    };

    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        startLoadingJustifications();
    }, []);

    const handleStatusChange = async (justificationId, newStatus) => {
        await startSavingJustification({
            id: justificationId,
            status: newStatus
        });
        await startLoadingJustifications();
    };

    const handleDownload = async (documentUrl) => {
        try {
            window.open(documentUrl, '_blank');
        } catch (error) {
            console.error('Error al descargar el documento:', error);
        }
    };

    const handleEdit = (justification) => {
        setActiveJustificationEvent(justification);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        clearActiveJustificationEvent();
        setOpenModal(false);
    };

    const handleDelete = async (justificationId) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta justificación?')) {
            const result = await handleDeleteJustification(justificationId);
            if (result.ok) {
                startLoadingJustifications();
            }
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Motivo</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Documento</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {justifications.map((justification) => (
                            <TableRow key={justification.id}>
                                <TableCell>
                                    {new Date(justification.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{justification.reason}</TableCell>
                                <TableCell>{getStatusChip(justification.status)}</TableCell>
                                <TableCell>
                                    {justification.documentUrl ? (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDownload(justification.documentUrl)}
                                        >
                                            <Download />
                                        </IconButton>
                                    ) : (
                                        'Sin documento'
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Box>
                                        {justification.status === 'pending' && canApproveJustifications && (
                                            <>
                                                <Button
                                                    size="small"
                                                    color="success"
                                                    onClick={() => handleStatusChange(justification.id, 'approved')}
                                                >
                                                    Aprobar
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleStatusChange(justification.id, 'rejected')}
                                                >
                                                    Rechazar
                                                </Button>
                                            </>
                                        )}
                                        {canEditDeleteJustification(justification) && (
                                            <>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleEdit(justification)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(justification.id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {justifications.length === 0 && (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No hay justificaciones para mostrar
                        </Typography>
                    </Box>
                )}
            </TableContainer>

            <AttendanceModal
                open={openModal}
                onClose={handleCloseModal}
                selectedEvent={activeJustification}
            />
        </>
    );
};

const getStatusChip = (status) => {
    const statusConfig = {
        pending: { color: 'warning', label: 'Pendiente' },
        approved: { color: 'success', label: 'Aprobado' },
        rejected: { color: 'error', label: 'Rechazado' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Chip label={config.label} color={config.color} size="small" />;
};