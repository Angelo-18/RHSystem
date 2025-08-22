import { Navigate, Route, Routes } from 'react-router-dom';
import { RRHHLayout } from '../layout/RRHHLayout';

import { RRHHPage } from '../pages/RRHHPage';
import { PersonalPage } from '../pages/PersonalPage';
import { AsistenciaPage } from '../pages/AsistenciaPage';
import { JustificacionesPage } from '../pages/JustificacionesPage';
import { DocumentacionPage } from '../pages/DocumentacionPage';
import { DocumentosPersonalesPage } from '../pages/DocumentosPersonalesPage';
import { GenerarDocumentosPage } from '../pages/GenerarDocumentosPage';
import { GestionDocumentosPage } from '../pages/GestionDocumentosPage';
import { AdminDocumentosPage } from '../pages/AdminDocumentosPage';
import { EvaluacionesPage } from '../pages/EvaluacionesPage';
import { EvaluacionesPendientesPage } from '../pages/EvaluacionesPendientesPage';
import { EvaluacionesResultadosPage } from '../pages/EvaluacionesResultadosPage';
import { AsignarEvaluacionesPage } from '../pages/AsignarEvaluacionesPage';
import { ConfiguracionEvaluacionesPage } from '../pages/ConfiguracionEvaluacionesPage';

export const RRHHRoutes = () => {
  return (
    <Routes>
      <Route element={<RRHHLayout />}>
        <Route path="/" element={<RRHHPage />} />
        <Route path="personal" element={<PersonalPage />} />
        <Route path="asistencia" element={<AsistenciaPage />} />
        <Route path="justificaciones" element={<JustificacionesPage />} />
        
        {/* Rutas de Documentación */}
        <Route path="documentacion" element={<DocumentacionPage />} />
        <Route path="documentacion/personal" element={<DocumentosPersonalesPage />} />
        <Route path="documentacion/generar" element={<GenerarDocumentosPage />} />
        <Route path="documentacion/gestion" element={<GestionDocumentosPage />} />
        <Route path="documentacion/admin" element={<AdminDocumentosPage />} />
        
        {/* Rutas de Evaluaciones */}
        <Route path="evaluaciones" element={<EvaluacionesPage />} />
        <Route path="evaluaciones/pendientes" element={<EvaluacionesPendientesPage />} />
        <Route path="evaluaciones/resultados" element={<EvaluacionesResultadosPage />} />
        <Route path="evaluaciones/asignar" element={<AsignarEvaluacionesPage />} />
        <Route path="evaluaciones/config" element={<ConfiguracionEvaluacionesPage />} />
      </Route>

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};
