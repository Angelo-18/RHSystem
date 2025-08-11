import { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore/lite';
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
    Box
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export const CompanyManagement = () => {
    const [companies, setCompanies] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companyForm, setCompanyForm] = useState({
        nombre: '',
        ruc: '',
        direccion: '',
        telefono: '',
        email: '',
        areas: []
    });
    const [availableAreas, setAvailableAreas] = useState([]);

    useEffect(() => {
        loadCompanies();
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
            setAvailableAreas(areasData);
        } catch (error) {
            console.error('Error al cargar áreas:', error);
        }
    };

    const loadCompanies = async () => {
        try {
            const companiesRef = collection(FirebaseDB, 'empresas');
            const companiesSnap = await getDocs(companiesRef);
            const companiesData = companiesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCompanies(companiesData);
        } catch (error) {
            console.error('Error al cargar empresas:', error);
        }
    };

    const handleAddClick = () => {
        setSelectedCompany(null);
        setCompanyForm({
            nombre: '',
            ruc: '',
            direccion: '',
            telefono: '',
            email: '',
            areas: []
        });
        setOpenDialog(true);
    };

    const handleEditClick = (company) => {
        setSelectedCompany(company);
        setCompanyForm({
            nombre: company.nombre || '',
            ruc: company.ruc || '',
            direccion: company.direccion || '',
            telefono: company.telefono || '',
            email: company.email || '',
            areas: company.areas || []
        });
        setOpenDialog(true);
    };

    const handleDeleteClick = async (company) => {
        if (window.confirm('¿Está seguro de eliminar esta empresa?')) {
            try {
                await deleteDoc(doc(FirebaseDB, 'empresas', company.id));
                await loadCompanies();
            } catch (error) {
                console.error('Error al eliminar empresa:', error);
            }
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCompany(null);
        setCompanyForm({
            nombre: '',
            ruc: '',
            direccion: '',
            telefono: '',
            email: '',
            areas: []
        });
    };

    const handleSaveCompany = async () => {
        try {
            if (selectedCompany) {
                // Actualizar empresa existente
                const companyRef = doc(FirebaseDB, 'empresas', selectedCompany.id);
                await updateDoc(companyRef, companyForm);
            } else {
                // Crear nueva empresa
                await addDoc(collection(FirebaseDB, 'empresas'), {
                    ...companyForm,
                    fechaCreacion: new Date().toISOString()
                });
            }

            await loadCompanies();
            handleCloseDialog();
        } catch (error) {
            console.error('Error al guardar empresa:', error);
        }
    };

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                    Gestión de Empresas
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                >
                    Nueva Empresa
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>RUC</TableCell>
                            <TableCell>Dirección</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Áreas</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.map((company) => (
                            <TableRow key={company.id}>
                                <TableCell>{company.nombre}</TableCell>
                                <TableCell>{company.ruc}</TableCell>
                                <TableCell>{company.direccion}</TableCell>
                                <TableCell>{company.telefono}</TableCell>
                                <TableCell>{company.email}</TableCell>
                                <TableCell>
                                    {company.areas?.map(areaId => {
                                        const area = availableAreas.find(a => a.id === areaId);
                                        return area ? area.nombre + ', ' : '';
                                    }).join(' ').slice(0, -2)}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(company)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(company)}>
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
                    {selectedCompany ? 'Editar Empresa' : 'Nueva Empresa'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={companyForm.nombre}
                        onChange={(e) => setCompanyForm({ ...companyForm, nombre: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="RUC"
                        fullWidth
                        value={companyForm.ruc}
                        onChange={(e) => setCompanyForm({ ...companyForm, ruc: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Dirección"
                        fullWidth
                        value={companyForm.direccion}
                        onChange={(e) => setCompanyForm({ ...companyForm, direccion: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Teléfono"
                        fullWidth
                        value={companyForm.telefono}
                        onChange={(e) => setCompanyForm({ ...companyForm, telefono: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={companyForm.email}
                        onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                    />
                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        Áreas asignadas
                    </Typography>
                    {availableAreas.map((area) => (
                        <Button
                            key={area.id}
                            variant={companyForm.areas.includes(area.id) ? "contained" : "outlined"}
                            color="primary"
                            size="small"
                            sx={{ m: 0.5 }}
                            onClick={() => {
                                const newAreas = companyForm.areas.includes(area.id)
                                    ? companyForm.areas.filter(id => id !== area.id)
                                    : [...companyForm.areas, area.id];
                                setCompanyForm({ ...companyForm, areas: newAreas });
                            }}
                        >
                            {area.nombre}
                        </Button>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSaveCompany} variant="contained" color="primary">
                        {selectedCompany ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};