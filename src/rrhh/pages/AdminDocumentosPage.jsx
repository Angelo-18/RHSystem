import { Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const AdminDocumentosPage = () => {
  const { profile } = useSelector(state => state.auth);

  // Redirigir si no es Admin
  if (profile !== 'admin') {
    return <Navigate to="/documentacion/personal" />;
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Administración de Documentación
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Configura y administra el sistema de documentación.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Plantillas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestiona las plantillas de documentos.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Permisos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configura los niveles de acceso.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuración
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ajustes generales del sistema.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};