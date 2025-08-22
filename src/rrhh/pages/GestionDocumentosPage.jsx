import { Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const GestionDocumentosPage = () => {
  const { profile } = useSelector(state => state.auth);

  // Redirigir si no es RRHH o Admin
  if (profile !== 'recursos_humanos' && profile !== 'admin') {
    return <Navigate to="/documentacion/personal" />;
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Documentación
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Administra y da seguimiento a toda la documentación del personal.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Documentos Pendientes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Documentos que requieren firma o revisión.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Archivo Digital
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Repositorio de documentos procesados.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reportes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Informes y estadísticas de documentación.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};