import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Typography,
    Container,
    Box,
    Grid,
    Card,
    CardContent,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    IconButton,
    TextField,
    InputAdornment
} from '@mui/material';
import { Search, Person } from '@mui/icons-material';
import { RRHHLayout } from '../layout/RRHHLayout';
import { EvaluationResults } from '../components/EvaluationResults';

const mockEmployees = [
    {
        id: '1',
        name: 'Juan Pérez',
        position: 'Desarrollador Frontend',
        department: 'Tecnología',
        lastEvaluation: '2024-02-15'
    },
    {
        id: '2',
        name: 'María García',
        position: 'Diseñadora UX',
        department: 'Diseño',
        lastEvaluation: '2024-02-10'
    }
];

export const EvaluacionesResultadosPage = () => {
    const { userProfile } = useSelector(state => state.auth);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const getProfileSpecificContent = () => {
        switch(userProfile) {
            case 'colaborador':
                return {
                    title: 'Mis Resultados',
                    description: 'Visualiza los resultados de tus evaluaciones'
                };
            case 'recursos_humanos':
                return {
                    title: 'Resultados de Evaluaciones',
                    description: 'Gestiona los resultados de las evaluaciones'
                };
            case 'supervisor':
                return {
                    title: 'Resultados del Equipo',
                    description: 'Visualiza los resultados de tu equipo'
                };
            case 'admin':
                return {
                    title: 'Gestión de Resultados',
                    description: 'Administra los resultados de evaluaciones'
                };
            default:
                return {
                    title: 'Resultados',
                    description: 'Sistema de evaluaciones'
                };
        }
    };

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee);
    };

    const filteredEmployees = mockEmployees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const content = getProfileSpecificContent();

    return (
        <RRHHLayout>
            <Box className="animate__animated animate__fadeIn animate__faster">
                <Container maxWidth="lg">
                    <Box sx={{ py: 4 }}>
                        <Typography variant="h4" gutterBottom>
                            {content.title}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            {content.description}
                        </Typography>

                        <Grid container spacing={3}>
                            {['recursos_humanos', 'supervisor', 'admin'].includes(userProfile) && (
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                placeholder="Buscar personal..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                sx={{ mb: 2 }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Search />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <List>
                                                {filteredEmployees.map((employee) => (
                                                    <Box key={employee.id}>
                                                        <ListItem
                                                            button
                                                            selected={selectedEmployee?.id === employee.id}
                                                            onClick={() => handleEmployeeSelect(employee)}
                                                        >
                                                            <ListItemAvatar>
                                                                <Avatar>
                                                                    <Person />
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={employee.name}
                                                                secondary={
                                                                    <>
                                                                        {employee.position}
                                                                        <br />
                                                                        {employee.department}
                                                                    </>
                                                                }
                                                            />
                                                        </ListItem>
                                                        <Divider variant="inset" component="li" />
                                                    </Box>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}

                            <Grid item xs={12} md={userProfile === 'colaborador' ? 12 : 8}>
                                {(selectedEmployee || userProfile === 'colaborador') && (
                                    <EvaluationResults
                                        evaluatedPerson={userProfile === 'colaborador' ? null : selectedEmployee}
                                    />
                                )}
                                {!selectedEmployee && userProfile !== 'colaborador' && (
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" align="center">
                                                Selecciona un empleado para ver sus resultados
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>
        </RRHHLayout>
    );
};