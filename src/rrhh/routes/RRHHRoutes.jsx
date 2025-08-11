import { Navigate, Route, Routes } from "react-router-dom"
import { HRDashboardPage } from "../pages/HRDashboardPage"
import { PersonalManagementPage } from "../pages/PersonalManagementPage"
import { AsistenciasPage } from "../pages/AsistenciasPage"
import { MarkAttendancePage } from "../pages/MarkAttendancePage"
import { JustificacionesPage } from "../pages/JustificacionesPage"
import { EvaluacionesPage } from "../pages/EvaluacionesPage"
import { DocumentacionPage } from "../pages/DocumentacionPage"
import { AdminPage } from "../pages/AdminPage"

export const RRHHRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={ <HRDashboardPage /> } />
        <Route path="/personal" element={ <PersonalManagementPage /> } />
        <Route path="/asistencias" element={ <AsistenciasPage /> } />
        <Route path="/marcar-asistencia" element={ <MarkAttendancePage /> } />
        <Route path="/justificaciones" element={ <JustificacionesPage /> } />
        <Route path="/evaluaciones" element={ <EvaluacionesPage /> } />
        <Route path="/documentacion" element={ <DocumentacionPage /> } />
        <Route path="/admin" element={ <AdminPage /> } />
        <Route path="/*" element={ <Navigate to="/" /> } />
    </Routes>
  )
}
