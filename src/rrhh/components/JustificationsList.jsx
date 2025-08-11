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
    Chip,
    IconButton,
    Typography,
    Link,
    Box
} from '@mui/material';
import { Download, Visibility } from '@mui/icons-material';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
import { getJustificationDocumentURL } from '../../firebase/storage';

export const JustificationsList = ({ userProfile, userId }) => {
    const [justifications, setJustifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJustifications();
    }, [userProfile, userId]);

    const loadJustifications = async () => {
        try {
            const justificationsRef = collection(FirebaseDB, 'justifications');
            let q;

            // Filtrar según el perfil del usuario
            switch (userProfile) {
                case 'personal':
                    q = query(justificationsRef, where('userId', '==', userId));
                    break;
                case 'jefe':
                    // TODO: Implementar filtro para ver solo las justificaciones del equipo
                    q = justificationsRef;
                    break;
                case 'rrhh':
                case 'admin':
                    q = justificationsRef;
                    break;
                default:
                    q = query(justificationsRef, where('userId', '==', userId));
            }

            const querySnapshot = await getDocs(q);
            const justificationsData = [];

            for (const doc of querySnapshot.docs) {
                justificationsData.push({
                    id: doc.id,
                    ...doc.data()
                });
            }

            setJustifications(justificationsData);
        } catch (error) {
            console.error('Error al cargar las justificaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (justificationId, newStatus) => {
        try {
            const justificationRef = doc(FirebaseDB, 'justifications', justificationId);
            await updateDoc(justificationRef, { status: newStatus });

            // Actualizar la lista
            setJustifications(prevJustifications =>
                prevJustifications.map(j =>
                    j.id === justificationId ? { ...j, status: newStatus } : j
                )
            );
        } catch (error) {
            console.error('Error al actualizar el estado:', error);
        }
    };

    const handleDownload = async (documentUrl) => {
        try {
            window.open(documentUrl, '_blank');
        } catch (error) {
            console.error('Error al descargar el documento:', error);
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            pendiente: { color: 'warning', label: 'Pendiente' },
            aprobado: { color: 'success', label: 'Aprobado' },
            rechazado: { color: 'error', label: 'Rechazado' }
        };

        const config = statusConfig[status] || statusConfig.pendiente;
        return <Chip label={config.label} color={config.color} size="small" />;
    };

    if (loading) {
        return <Typography>Cargando justificaciones...</Typography>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Motivo</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Documento</TableCell>
                        {(userProfile === 'rrhh' || userProfile === 'admin' || userProfile === 'jefe') && (
                            <TableCell>Acciones</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {justifications.map((justification) => (
                        <TableRow key={justification.id}>
                            <TableCell>
                                {new Date(justification.createdAt).toLocaleDateString()}
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
                            {(userProfile === 'rrhh' || userProfile === 'admin' || userProfile === 'jefe') && (
                                <TableCell>
                                    {justification.status === 'pendiente' && (
                                        <Box>
                                            <Button
                                                size="small"
                                                color="success"
                                                onClick={() => handleStatusChange(justification.id, 'aprobado')}
                                            >
                                                Aprobar
                                            </Button>
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => handleStatusChange(justification.id, 'rechazado')}
                                            >
                                                Rechazar
                                            </Button>
                                        </Box>
                                    )}
                                </TableCell>
                            )}
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
    );
};