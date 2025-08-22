import { Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const GenerarDocumentosPage = () => {
  const { profile } = useSelector(state => state.auth);

  // Redirigir si no es RRHH o Admin
  if (profile !== 'recursos_humanos' && profile !== 'admin') {
    return <Navigate to="/documentacion/personal" />;
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Generar Documentos
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Genera y envía documentos como contratos y boletas de pago a los trabajadores.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generar Contratos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Crea y gestiona contratos para el personal.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generar Boletas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Genera y envía boletas de pago mensuales.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};