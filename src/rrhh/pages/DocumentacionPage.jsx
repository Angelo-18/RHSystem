import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const DocumentacionPage = () => {
  const navigate = useNavigate();
  const { profile } = useSelector(state => state.auth);

  useEffect(() => {
    // Redirigir según el perfil
    if (profile === 'recursos_humanos' || profile === 'admin') {
      navigate('/documentacion/generar');
    } else {
      navigate('/documentacion/personal');
    }
  }, [navigate, profile]);

  // Esta página solo redirige, no renderiza nada
  return null;
};