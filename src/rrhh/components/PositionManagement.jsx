import { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
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
import { startLoading, setError, setPositions, addPosition, updatePosition, deletePosition } from '../../store/rrhh/rrhhSlice';
import { startLoadingCompanies, startLoadingAreas } from '../../store/rrhh/thunks';

export const PositionManagement = () => {
    const dispatch = useDispatch();
    const { positions, companies, areas, isLoading } = useSelector(state => state.rrhh);
    const [open, setOpen] = useState(false);
    const [positionForm, setPositionForm] = useState({
        id: '',
        codigo: '',
        nombre: '',
        descripcion: '',
        empresa: '',
        area: ''
    });

    useEffect(() => {
        loadPositions();
        dispatch(startLoadingCompanies());
        dispatch(startLoadingAreas());
    }, [dispatch]);

    const loadPositions = async () => {
        try {
            dispatch(startLoading());
            const positionsRef = collection(FirebaseDB, 'puestos');
            const positionsSnap = await getDocs(positionsRef);
            const positionsData = positionsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            dispatch(setPositions(positionsData));
        } catch (error) {
            console.error('Error al cargar puestos:', error);
            dispatch(setError('Error al cargar los puestos'));
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setPositionForm({
            id: '',
            codigo: '',
            nombre: '',
            descripcion: '',
            empresa: '',
            area: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPositionForm({
            ...positionForm,
            [name]: value
        });
    };

    const handleEdit = (position) => {
        setPositionForm(position);
        setOpen(true);
    };

    const handleSave = async () => {
        try {
            dispatch(startLoading());
            if (positionForm.id) {
                // Actualizar puesto existente
                const positionRef = doc(FirebaseDB, 'puestos', positionForm.id);
                await updateDoc(positionRef, {
                    codigo: positionForm.codigo,
                    nombre: positionForm.nombre,
                    descripcion: positionForm.descripcion,
                    empresa: positionForm.empresa,
                    area: positionForm.area
                });
                dispatch(updatePosition(positionForm));
            } else {
                // Crear nuevo puesto
                const newPositionRef = await addDoc(collection(FirebaseDB, 'puestos'), {
                    codigo: positionForm.codigo,
                    nombre: positionForm.nombre,
                    descripcion: positionForm.descripcion,
                    empresa: positionForm.empresa,
                    area: positionForm.area
                });
                dispatch(addPosition({ id: newPositionRef.id, ...positionForm }));
            }
            handleClose();
        } catch (error) {
            console.error('Error al guardar puesto:', error);
            dispatch(setError('Error al guardar el puesto'));
        }
    };

    const handleDelete = async (id) => {
        try {
            dispatch(startLoading());
            await deleteDoc(doc(FirebaseDB, 'puestos', id));
            dispatch(deletePosition(id));
        } catch (error) {
            console.error('Error al eliminar puesto:', error);
            dispatch(setError('Error al eliminar el puesto'));
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Gestión de Puestos</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                >
                    Nuevo Puesto
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Empresa</TableCell>
                            <TableCell>Área</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {positions.map((position) => (
                            <TableRow key={position.id}>
                                <TableCell>{position.codigo}</TableCell>
                                <TableCell>{position.nombre}</TableCell>
                                <TableCell>{position.descripcion}</TableCell>
                                <TableCell>{position.empresa}</TableCell>
                                <TableCell>{position.area}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(position)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(position.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{positionForm.id ? 'Editar Puesto' : 'Nuevo Puesto'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="codigo"
                        label="Código"
                        type="text"
                        fullWidth
                        value={positionForm.codigo}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="nombre"
                        label="Nombre"
                        type="text"
                        fullWidth
                        value={positionForm.nombre}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="descripcion"
                        label="Descripción"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={positionForm.descripcion}
                        onChange={handleInputChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Empresa</InputLabel>
                        <Select
                            name="empresa"
                            value={positionForm.empresa}
                            onChange={handleInputChange}
                            label="Empresa"
                        >
                            {companies.map((company) => (
                                <MenuItem key={company.id} value={company.nombre}>
                                    {company.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Área</InputLabel>
                        <Select
                            name="area"
                            value={positionForm.area}
                            onChange={handleInputChange}
                            label="Área"
                        >
                            {areas.filter(area => area.empresa === positionForm.empresa).map((area) => (
                                <MenuItem key={area.id} value={area.nombre}>
                                    {area.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};