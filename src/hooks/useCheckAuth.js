import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseAuth } from '../firebase/config';
import { login, logout } from '../store/auth';
import { checkUserRegistration } from '../helpers/checkUserRegistration';

export const useCheckAuth = () => {
    const { status } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        onAuthStateChanged(FirebaseAuth, async(user) => {
            if (!user) return dispatch(logout());

            const { uid, email, displayName, photoURL } = user;
            const { isRegistered, isActive, perfil } = await checkUserRegistration(uid);

            let authStatus;
            if (isRegistered) {
                authStatus = isActive ? 'authenticated' : 'pending-approval';
            } else {
                authStatus = 'pending-registration';
            }

            dispatch(login({
                uid,
                email,
                displayName,
                photoURL,
                isRegistered,
                isActive,
                status: authStatus,
                userProfile: perfil || 'colaborador'
            }));
        });
    }, [dispatch]);

    return {
        status,
        userProfile: useSelector(state => state.auth.userProfile)
    };
}
