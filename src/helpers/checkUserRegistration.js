import { collection, doc, getDoc, setDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../firebase/config';

export const checkUserRegistration = async (uid) => {
    try {
        const docRef = doc(FirebaseDB, 'personal_registrado', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                isRegistered: true,
                isActive: data.activo || false,
                ...data
            };
        }

        return {
            isRegistered: false,
            isActive: false
        };
    } catch (error) {
        console.error('Error checking user registration:', error);
        return {
            isRegistered: false,
            isActive: false,
            error: error.message
        };
    }
};

export const createRegistrationRequest = async (uid, userData) => {
    try {
        const docRef = doc(FirebaseDB, 'personal_registrado', uid);
        await setDoc(docRef, {
            ...userData,
            estado: 'pendiente',
            activo: false,
            perfil: 'colaborador',
            fechaSolicitud: new Date().toISOString()
        });

        return {
            ok: true
        };
    } catch (error) {
        console.error('Error creating registration request:', error);
        return {
            ok: false,
            errorMessage: error.message
        };
    }
};