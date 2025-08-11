import { loginWithEmailPassword, registerUserWithEmailPassword, singInWithGoogle, logoutFirebase } from '../../firebase/providers';
import { clearRrhhState } from '../rrhh';
import { checkingCredentials, logout, login } from './';
import { checkUserRegistration, createRegistrationRequest } from '../../helpers/checkUserRegistration';

export const startGoogleSignIn = () => {
    return async( dispatch ) => {

        dispatch( checkingCredentials() );
        
        const result = await singInWithGoogle();
        if ( !result.ok ) return dispatch( logout( result ) );

        // Verificar el estado de registro después del login con Google
        const { isRegistered, isActive, perfil } = await checkUserRegistration(result.uid);
        
        dispatch(login({
            ...result,
            isRegistered,
            isActive,
            status: isRegistered ? (isActive ? 'authenticated' : 'pending-approval') : 'pending-registration',
            userProfile: perfil || 'colaborador'
        }));
    }
}

export const startCreatingUserWithEmailPassword = ({ email, password, displayName }) => {
    return async( dispatch ) => {

        dispatch( checkingCredentials() );

        const result = await registerUserWithEmailPassword({ email, password, displayName });
        
        if ( !result.ok ) return dispatch( logout( result ) );

        // Crear solicitud de registro después del registro exitoso
        const registrationResult = await createRegistrationRequest(result.uid, {
            email,
            displayName,
            registrationType: 'email'
        });

        if (!registrationResult.ok) {
            return dispatch(logout({
                ok: false,
                errorMessage: 'Error al crear la solicitud de registro'
            }));
        }

        dispatch(login({
            ...result,
            isRegistered: false,
            isActive: false,
            status: 'pending-registration'
        }));
    }
}

export const startLoginWithEmailPassword = ({ email, password }) => {
    return async( dispatch ) => {
        dispatch( checkingCredentials() );

        const result = await loginWithEmailPassword({ email, password });
        console.log(result);

        if ( !result.ok ) return dispatch( logout( result ) );
        
        // Verificar el estado de registro después del login
        const { isRegistered, isActive, perfil } = await checkUserRegistration(result.uid);
        
        dispatch(login({
            ...result,
            isRegistered,
            isActive,
            status: isRegistered ? (isActive ? 'authenticated' : 'pending-approval') : 'pending-registration'
        }));
    }
}

export const startLogout = () => {
    return async( dispatch ) => {
        await logoutFirebase();
        dispatch( clearRrhhState() );
        dispatch( logout() );
    }
}

