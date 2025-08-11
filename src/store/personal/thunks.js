import { collection, doc, getDocs, updateDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
import { setLoading, setPersonalList, updatePersonalStatus, setError } from './personalSlice';

export const startLoadingPersonal = () => {
    return async (dispatch) => {
        try {
            dispatch(setLoading());
            const personalRef = collection(FirebaseDB, 'personal_registrado');
            const personalDocs = await getDocs(personalRef);
            
            const personal = [];
            personalDocs.forEach(doc => {
                personal.push({ id: doc.id, ...doc.data() });
            });
            
            dispatch(setPersonalList(personal));
        } catch (error) {
            console.error('Error loading personal:', error);
            dispatch(setError('Error al cargar la lista de personal'));
        }
    };
};

export const startUpdatingPersonalStatus = (uid, newStatus) => {
    return async (dispatch) => {
        try {
            const personalRef = doc(FirebaseDB, 'personal_registrado', uid);
            await updateDoc(personalRef, newStatus);
            
            dispatch(updatePersonalStatus({ uid, ...newStatus }));
            return true;
        } catch (error) {
            console.error('Error updating personal status:', error);
            dispatch(setError('Error al actualizar el estado del personal'));
            return false;
        }
    };
};