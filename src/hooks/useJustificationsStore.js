import { useDispatch, useSelector } from 'react-redux';
import {
    startLoadingJustificationsRecords,
    startAddingJustification,
    startUpdatingJustification,
    startDeletingJustification
} from '../store/justifications/thunks';
import {
    setActiveJustification,
    clearActiveJustification
} from '../store/justifications/justificationsSlice';

export const useJustificationsStore = () => {
    const dispatch = useDispatch();
    const { justifications, activeJustification, isLoading, errorMessage } = useSelector(state => state.justifications);
    const { uid, userProfile } = useSelector(state => state.auth);

    const setActiveJustificationEvent = (justification) => {
        dispatch(setActiveJustification(justification));
    };

    const clearActiveJustificationEvent = () => {
        dispatch(clearActiveJustification());
    };

    const startLoadingJustifications = async () => {
        await dispatch(startLoadingJustificationsRecords(uid, userProfile));
    };

    const startSavingJustification = async (justificationData, file = null) => {
        try {
            if (justificationData.id) {
                // Actualizar justificación existente
                return await dispatch(startUpdatingJustification(justificationData.id, justificationData));
            } else {
                // Crear nueva justificación
                return await dispatch(startAddingJustification({
                    ...justificationData,
                    userId: uid
                }, file));
            }
        } catch (error) {
            console.error('Error al guardar la justificación:', error);
            return { ok: false };
        }
    };

    const handleDeleteJustification = async (justificationId) => {
        const result = await dispatch(startDeletingJustification(justificationId));
        return result;
    };

    return {
        // Propiedades
        isLoading,
        justifications,
        activeJustification,
        errorMessage,

        // Métodos
        startLoadingJustifications,
        startSavingJustification,
        setActiveJustificationEvent,
        clearActiveJustificationEvent,
        handleDeleteJustification
    };
};