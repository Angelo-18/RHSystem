import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Card, CardContent, Button, Grid, Chip } from '@mui/material';
import { RRHHLayout } from '../layout/RRHHLayout';
import { startLoadingPersonal, startUpdatingPersonalStatus } from '../../store/personal';

export const PersonalManagementPage = () => {
    const dispatch = useDispatch();
    const { personal = [] } = useSelector(state => state.personal);

    useEffect(() => {
        dispatch(startLoadingPersonal());
    }, []);

    const handleStatusChange = (uid, newStatus) => {
        dispatch(startUpdatingPersonalStatus(uid, newStatus));
    };

    return (
        <RRHHLayout>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Gestión de Personal
                </Typography>

                <Grid container spacing={3}>
                    {personal.map(person => (
                        <Grid item xs={12} md={6} lg={4} key={person.uid}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">
                                        {person.displayName}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom>
                                        {person.email}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Empresa:</strong> {person.empresa}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Área:</strong> {person.area}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        <strong>Estado:</strong> {' '}
                                        <Chip 
                                            label={person.activo ? 'Activo' : 'Pendiente'}
                                            color={person.activo ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </Typography>
                                    
                                    {!person.activo && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleStatusChange(person.uid, true)}
                                            sx={{ mt: 2 }}
                                        >
                                            Aprobar Usuario
                                        </Button>
                                    )}
                                    
                                    {person.activo && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleStatusChange(person.uid, false)}
                                            sx={{ mt: 2 }}
                                        >
                                            Desactivar Usuario
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </RRHHLayout>
    );
};