import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';

import { FirebaseAuth } from '../firebase/config';
import { login, logout } from '../store/auth';
import { startLoadingNotes } from '../store/journal';
import { checkUserRegistration } from '../helpers/checkUserRegistration';



export const useCheckAuth = () => {
  
    const { status } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    useEffect(() => {
        
        onAuthStateChanged( FirebaseAuth, async( user ) => {
            if ( !user ) return dispatch( logout() );

            const { uid, email, displayName, photoURL } = user;
            
            // Verificar si el usuario está registrado en el sistema de RH
            const { isRegistered, isActive } = await checkUserRegistration(uid);
            
            dispatch( login({ 
                uid, 
                email, 
                displayName, 
                photoURL,
                isRegistered,
                isActive
            }) );
            
            // Solo cargar notas si el usuario está activo
            if (isRegistered && isActive) {
                dispatch( startLoadingNotes() );
            }
        })
    }, [dispatch]);

    return status;
}
