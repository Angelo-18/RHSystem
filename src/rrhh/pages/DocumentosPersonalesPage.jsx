import { Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { useSelector } from 'react-redux';

export const DocumentosPersonalesPage = () => {
  const { profile } = useSelector(state => state.auth);

  const getTitleByProfile = () => {
    switch (profile) {
      case 'colaborador':
        return 'Mis Documentos';
      case 'recursos_humanos':
        return 'Documentos Personales';
      case 'supervisor':
        return 'Documentos del Supervisor';
      case 'admin':
        return 'Documentos del Administrador';
      default:
        return 'Documentos Personales';
    }
  };

  const getDescriptionByProfile = () => {
    switch (profile) {
      case 'colaborador':
        return 'Visualiza y firma tus documentos personales como contratos y boletas de pago.';
      case 'recursos_humanos':
        return 'Accede a tus documentos personales para visualización y firma.';
      case 'supervisor':
        return 'Gestiona tus documentos personales y contratos asignados.';
      case 'admin':
        return 'Accede a tus documentos personales y administrativos.';
      default:
        return 'Visualiza y gestiona tus documentos personales.';
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {getTitleByProfile()}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {getDescriptionByProfile()}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contratos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visualiza y firma tus contratos laborales.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Boletas de Pago
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accede a tus boletas de pago mensuales.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};