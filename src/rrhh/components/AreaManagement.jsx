import { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
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
    MenuItem
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export const AreaManagement = () => {
    const [areas, setAreas] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);
    const [areaForm, setAreaForm] = useState({
        nombre: '',
        descripcion: '',
        codigo: ''
    });

    useEffect(() => {
        loadAreas();
    }, []);

    const loadAreas = async () => {
        try {
            const areasRef = collection(FirebaseDB, 'areas');
            const areasSnap = await getDocs(areasRef);
            const areasData = areasSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAreas(areasData);
        } catch (error) {
            console.error('Error al cargar áreas:', error);
        }
    };

    const handleAddClick = () => {
        setSelectedArea(null);
        setAreaForm({
            nombre: '',
            descripcion: '',
            codigo: ''
        });
        setOpenDialog(true);
    };

    const handleEditClick = (area) => {
        setSelectedArea(area);
        setAreaForm({
            nombre: area.nombre || '',
            descripcion: area.descripcion || '',
            codigo: area.codigo || ''
        });
        setOpenDialog(true);
    };

    const handleDeleteClick = async (area) => {
        if (window.confirm('¿Está seguro de eliminar esta área?')) {
            try {
                await deleteDoc(doc(FirebaseDB, 'areas', area.id));
                await loadAreas();
            } catch (error) {
                console.error('Error al eliminar área:', error);
            }
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedArea(null);
        setAreaForm({
            nombre: '',
            descripcion: '',
            codigo: ''
        });
    };

    const handleSaveArea = async () => {
        try {
            if (selectedArea) {
                // Actualizar área existente
                const areaRef = doc(FirebaseDB, 'areas', selectedArea.id);
                await updateDoc(areaRef, areaForm);
            } else {
                // Crear nueva área
                await addDoc(collection(FirebaseDB, 'areas'), {
                    ...areaForm,
                    fechaCreacion: new Date().toISOString()
                });
            }

            await loadAreas();
            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar área:', error);
        }
    };

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                    Gestión de Áreas
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                >
                    Nueva Área
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {areas.map((area) => (
                            <TableRow key={area.id}>
                                <TableCell>{area.codigo}</TableCell>
                                <TableCell>{area.nombre}</TableCell>
                                <TableCell>{area.descripcion}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(area)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(area)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selectedArea ? 'Editar Área' : 'Nueva Área'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Código"
                        fullWidth
                        value={areaForm.codigo}
                        onChange={(e) => setAreaForm({ ...areaForm, codigo: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={areaForm.nombre}
                        onChange={(e) => setAreaForm({ ...areaForm, nombre: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Descripción"
                        fullWidth
                        multiline
                        rows={4}
                        value={areaForm.descripcion}
                        onChange={(e) => setAreaForm({ ...areaForm, descripcion: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSaveArea} variant="contained" color="primary">
                        {selectedArea ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};