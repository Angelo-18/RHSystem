import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, FormControl, Grid, InputLabel, Link, MenuItem, Select, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { useForm } from '../../hooks';
import { createRegistrationRequest } from '../../helpers/checkUserRegistration';
import { updateRegistrationStatus } from '../../store/auth';
import { useNavigate } from 'react-router-dom';

const formData = {
    empresa: '',
    area: ''
};

export const RegistrationRequestPage = () => {
    const { status, uid, email, displayName } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { empresa, area, onInputChange } = useForm(formData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [companies, setCompanies] = useState([]);
    const [availableAreas, setAvailableAreas] = useState([]);

    useEffect(() => {
        loadCompanies();
    }, []);

    useEffect(() => {
        if (empresa) {
            loadAreasForCompany(empresa);
        } else {
            setAvailableAreas([]);
        }
    }, [empresa]);

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
            setSubmitError('Error al cargar las empresas. Por favor, recarga la página.');
        }
    };

    const loadAreasForCompany = async (companyId) => {
        try {
            const selectedCompany = companies.find(c => c.id === companyId);
            if (selectedCompany && selectedCompany.areas) {
                const areasRef = collection(FirebaseDB, 'areas');
                const areasSnap = await getDocs(areasRef);
                const areasData = areasSnap.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    .filter(area => selectedCompany.areas.includes(area.id));
                setAvailableAreas(areasData);
            }
        } catch (error) {
            console.error('Error al cargar áreas:', error);
            setSubmitError('Error al cargar las áreas. Por favor, intenta nuevamente.');
        }
    };

    const onSubmit = async(event) => {
        event.preventDefault();
        
        if (!empresa || !area) {
            setSubmitError('Por favor selecciona empresa y área');
            return;
        }
        
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitMessage('');
        
        try {
            const selectedCompany = companies.find(c => c.id === empresa);
            const selectedArea = availableAreas.find(a => a.id === area);

            const result = await createRegistrationRequest(uid, {
                email,
                displayName,
                empresa: {
                    id: empresa,
                    nombre: selectedCompany?.nombre || ''
                },
                area: {
                    id: area,
                    nombre: selectedArea?.nombre || ''
                }
            });
            
            if (result.ok) {
                setSubmitMessage('Solicitud enviada exitosamente. Espera la aprobación del administrador.');
                // Actualizar el estado para indicar que ya se envió la solicitud
                dispatch(updateRegistrationStatus({ 
                    isRegistered: true, 
                    isActive: false,
                    pendingRegistration: false
                }));
                // Redirigir a la página de espera después de un breve momento
                setTimeout(() => {
                    navigate('/auth/pending-approval');
                }, 2000);
            } else {
                setSubmitError(result.errorMessage || 'Error al enviar la solicitud. Intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error en onSubmit:', error);
            setSubmitError('Error al enviar la solicitud. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout title="Solicitud de Acceso">
            <form onSubmit={onSubmit} className="animate__animated animate__fadeIn animate__faster">
                <Grid container>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Bienvenido {displayName}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Para acceder al sistema de Recursos Humanos, necesitas completar tu registro:
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Empresa</InputLabel>
                            <Select
                                value={empresa}
                                label="Empresa"
                                name="empresa"
                                onChange={onInputChange}
                                disabled={isSubmitting}
                            >
                                {companies.map((company) => (
                                    <MenuItem key={company.id} value={company.id}>{company.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Área</InputLabel>
                            <Select
                                value={area}
                                label="Área"
                                name="area"
                                onChange={onInputChange}
                                disabled={isSubmitting}
                            >
                                {availableAreas.map((area) => (
                                    <MenuItem key={area.id} value={area.id}>{area.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                        {submitError && (
                            <Grid item xs={12}>
                                <Alert severity="error">{submitError}</Alert>
                            </Grid>
                        )}
                        
                        {submitMessage && (
                            <Grid item xs={12}>
                                <Alert severity="success">{submitMessage}</Alert>
                            </Grid>
                        )}
                        
                        <Grid item xs={12}>
                            <Button 
                                disabled={isSubmitting}
                                type="submit" 
                                variant="contained" 
                                fullWidth
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    )
}