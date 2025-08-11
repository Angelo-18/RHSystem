import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, where, deleteDoc } from 'firebase/firestore/lite';
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
    FormControl,
    Select,
    MenuItem,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editForm, setEditForm] = useState({
        displayName: '',
        perfil: '',
        activo: false,
        empresa: '',
        area: '',
        puesto: ''
    });
    const [companies, setCompanies] = useState([]);
    const [areas, setAreas] = useState([]);
    const [availableAreas, setAvailableAreas] = useState([]);

    useEffect(() => {
        loadUsers();
        loadCompanies();
        loadAreas();
    }, []);

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

    useEffect(() => {
        if (editForm.empresa) {
            const selectedCompany = companies.find(c => c.id === editForm.empresa);
            if (selectedCompany) {
                setAreas(availableAreas.filter(area => selectedCompany.areas.includes(area.id)));
            }
        } else {
            setAreas([]);
        }
    }, [editForm.empresa, companies, availableAreas]);

    const loadUsers = async () => {
        try {
            const usersRef = collection(FirebaseDB, 'personal_registrado');
            const usersSnap = await getDocs(usersRef);
            const usersData = usersSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditForm({
            displayName: user.displayName || '',
            perfil: user.perfil || 'colaborador',
            activo: user.activo || false,
            empresa: user.empresa || '',
            area: user.area || '',
            puesto: user.puesto || ''
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
        setEditForm({
            displayName: '',
            perfil: '',
            activo: false,
            empresa: '',
            area: '',
            puesto: ''
        });
    };

    const handleSaveChanges = async () => {
        if (!selectedUser) return;

        try {
            const userRef = doc(FirebaseDB, 'personal_registrado', selectedUser.id);
            await updateDoc(userRef, {
                displayName: editForm.displayName,
                perfil: editForm.perfil,
                activo: editForm.activo,
                empresa: editForm.empresa,
                area: editForm.area,
                puesto: editForm.puesto
            });

            await loadUsers(); // Recargar la lista de usuarios
            handleCloseDialog();
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
        }
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedUser(null);
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        try {
            const userRef = doc(FirebaseDB, 'personal_registrado', selectedUser.id);
            await deleteDoc(userRef);
            await loadUsers(); // Recargar la lista de usuarios
            handleCloseDeleteDialog();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Gestión de Usuarios
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Perfil</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Empresa</TableCell>
                            <TableCell>Área</TableCell>
                            <TableCell>Puesto</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.displayName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.perfil}</TableCell>
                                <TableCell>{user.activo ? 'Activo' : 'Inactivo'}</TableCell>
                                <TableCell>
                                    {companies.find(c => c.id === user.empresa)?.nombre || '-'}
                                </TableCell>
                                <TableCell>
                                    {availableAreas.find(a => a.id === user.area)?.nombre || '-'}
                                </TableCell>
                                <TableCell>{user.puesto || '-'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditClick(user)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(user)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Editar Usuario</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        type="text"
                        fullWidth
                        value={editForm.displayName}
                        onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <Select
                            value={editForm.perfil}
                            onChange={(e) => setEditForm({ ...editForm, perfil: e.target.value })}
                        >
                            <MenuItem value="colaborador">Colaborador</MenuItem>
                            <MenuItem value="recursos_humanos">Recursos Humanos</MenuItem>
                            <MenuItem value="supervisor">Supervisor</MenuItem>
                            <MenuItem value="admin">Administrador</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <Select
                            value={editForm.activo}
                            onChange={(e) => setEditForm({ ...editForm, activo: e.target.value })}
                        >
                            <MenuItem value={true}>Activo</MenuItem>
                            <MenuItem value={false}>Inactivo</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <Select
                            value={editForm.empresa}
                            onChange={(e) => setEditForm({ ...editForm, empresa: e.target.value, area: '' })}
                            displayEmpty
                        >
                            <MenuItem value="">Seleccione una empresa</MenuItem>
                            {companies.map((company) => (
                                <MenuItem key={company.id} value={company.id}>
                                    {company.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <Select
                            value={editForm.area}
                            onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                            displayEmpty
                            disabled={!editForm.empresa}
                        >
                            <MenuItem value="">Seleccione un área</MenuItem>
                            {areas.map((area) => (
                                <MenuItem key={area.id} value={area.id}>
                                    {area.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Puesto"
                        fullWidth
                        value={editForm.puesto}
                        onChange={(e) => setEditForm({ ...editForm, puesto: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSaveChanges} variant="contained" color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Eliminar Usuario</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro que desea eliminar al usuario {selectedUser?.displayName}?
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
                    <Button onClick={handleDeleteUser} variant="contained" color="error">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};