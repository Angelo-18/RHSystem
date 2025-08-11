import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthRoutes } from '../auth/routes/AuthRoutes';
import { RRHHRoutes } from '../rrhh/routes/RRHHRoutes';
import { CheckingAuth } from '../ui/';
import { useCheckAuth } from '../hooks';
import { PendingApprovalPage, RegistrationRequestPage } from '../auth/pages';

export const AppRouter = () => {
  const { status, isRegistered, userProfile } = useCheckAuth();

  if (status === 'checking') {
    return <CheckingAuth />
  }

  return (
    <Routes>
      {/* Rutas para usuarios autenticados */}
      {status === 'authenticated' && (
        <Route path="/*" element={<RRHHRoutes />} />
      )}
      
      {/* Rutas para usuarios pendientes de aprobación */}
      {status === 'pending-approval' && (
        <>
          <Route path="/auth/pending-approval" element={<PendingApprovalPage />} />
          <Route path="/*" element={<Navigate to='/auth/pending-approval' />} />
        </>
      )}

      {/* Rutas para usuarios pendientes de registro */}
      {status === 'pending-registration' && (
        <>
          <Route path="/auth/registration-request" element={<RegistrationRequestPage />} />
          <Route path="/*" element={<Navigate to='/auth/registration-request' />} />
        </>
      )}

      {/* Rutas para usuarios no autenticados */}
      {status === 'not-authenticated' && (
        <>
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/*" element={<Navigate to='/auth/login' />} />
        </>
      )}
    </Routes>
  )
}
