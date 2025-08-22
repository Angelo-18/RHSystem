import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const EvaluacionesPage = () => {
    const { userProfile } = useSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir según el perfil del usuario
        switch(userProfile) {
            case 'recursos_humanos':
            case 'admin':
                navigate('/evaluaciones/asignar');
                break;
            case 'supervisor':
            case 'colaborador':
            default:
                navigate('/evaluaciones/pendientes');
                break;
        }
    }, [userProfile, navigate]);

    return null; // No renderizamos nada ya que redirigimos inmediatamente
};