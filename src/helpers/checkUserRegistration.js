import { doc, getDoc, setDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../firebase/config';

/**
 * Verifica si un usuario está registrado y activo en el sistema de RH
 * @param {string} uid - ID del usuario
 * @returns {Promise<{isRegistered: boolean, isActive: boolean, userData?: object}>}
 */
export const checkUserRegistration = async (uid) => {
    try {
        const userDocRef = doc(FirebaseDB, 'personal_registrado', uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
                isRegistered: true,
                isActive: userData.activo || false,
                userData
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
            isActive: false
        };
    }
};

/**
 * Crea una solicitud de registro para un nuevo usuario
 * @param {string} uid - ID del usuario
 * @param {string} email - Email del usuario
 * @param {string} displayName - Nombre del usuario
 * @param {string} empresa - Empresa seleccionada
 * @param {string} area - Área seleccionada
 * @returns {Promise<boolean>} - true si se creó exitosamente
 */
export const createRegistrationRequest = async (uid, email, displayName, empresa, area) => {
    try {
        const userDocRef = doc(FirebaseDB, 'personal_registrado', uid);
        
        const userData = {
            uid,
            email,
            displayName,
            empresa,
            area,
            activo: false,
            fechaSolicitud: new Date(),
            estado: 'pendiente' // pendiente, aprobado, rechazado
        };
        
        await setDoc(userDocRef, userData);
        return true;
    } catch (error) {
        console.error('Error creating registration request:', error);
        return false;
    }
};