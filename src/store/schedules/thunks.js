import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
import {
    startLoading,
    setSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    setError
} from './schedulesSlice';

export const startLoadingSchedules = () => {
    return async (dispatch) => {
        try {
            dispatch(startLoading());
            const schedulesRef = collection(FirebaseDB, 'horarios');
            const schedulesSnap = await getDocs(schedulesRef);
            const schedulesData = schedulesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            dispatch(setSchedules(schedulesData));
        } catch (error) {
            console.error('Error al cargar horarios:', error);
            dispatch(setError('Error al cargar los horarios'));
        }
    };
};

export const startAddingSchedule = (scheduleData) => {
    return async (dispatch) => {
        try {
            const newSchedule = {
                ...scheduleData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                // Estructura del horario entre semana
                horaEntrada: scheduleData.horaEntrada,
                horaSalida: scheduleData.horaSalida,
                tolerancia: scheduleData.tolerancia || 10,
                horaInicioDescanso: scheduleData.horaInicioDescanso || null,
                horaFinDescanso: scheduleData.horaFinDescanso || null,
                duracionDescanso: (scheduleData.horaInicioDescanso && scheduleData.horaFinDescanso) ? 60 : null,
                // Estructura del horario de fin de semana
                horaEntradaFinSemana: scheduleData.horaEntradaFinSemana,
                horaSalidaFinSemana: scheduleData.horaSalidaFinSemana,
                horaInicioDescansoFinSemana: scheduleData.horaInicioDescansoFinSemana || null,
                horaFinDescansoFinSemana: scheduleData.horaFinDescansoFinSemana || null,
                duracionDescansoFinSemana: (scheduleData.horaInicioDescansoFinSemana && scheduleData.horaFinDescansoFinSemana) ? 30 : null,
                // Configuración general
                diasLaborables: scheduleData.diasLaborables || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
                activo: true
            };

            const docRef = await addDoc(collection(FirebaseDB, 'horarios'), newSchedule);
            dispatch(addSchedule({ id: docRef.id, ...newSchedule }));

            return { ok: true, id: docRef.id };
        } catch (error) {
            console.error('Error al agregar horario:', error);
            dispatch(setError('Error al crear el horario'));
            return { ok: false };
        }
    };
};

export const startUpdatingSchedule = (scheduleId, updateData) => {
    return async (dispatch) => {
        try {
            const scheduleRef = doc(FirebaseDB, 'horarios', scheduleId);
            const updatedData = {
                ...updateData,
                updatedAt: new Date().toISOString(),
                // Asegurar que se incluyan las tolerancias y duraciones de descanso
                tolerancia: updateData.tolerancia || 10,
                duracionDescanso: (updateData.horaInicioDescanso && updateData.horaFinDescanso) ? 60 : null,
                duracionDescansoFinSemana: (updateData.horaInicioDescansoFinSemana && updateData.horaFinDescansoFinSemana) ? 30 : null
            };

            await updateDoc(scheduleRef, updatedData);
            dispatch(updateSchedule({ id: scheduleId, ...updatedData }));

            return { ok: true };
        } catch (error) {
            console.error('Error al actualizar horario:', error);
            dispatch(setError('Error al actualizar el horario'));
            return { ok: false };
        }
    };
};

export const startDeletingSchedule = (scheduleId) => {
    return async (dispatch) => {
        try {
            await deleteDoc(doc(FirebaseDB, 'horarios', scheduleId));
            dispatch(deleteSchedule(scheduleId));
            return { ok: true };
        } catch (error) {
            console.error('Error al eliminar horario:', error);
            dispatch(setError('Error al eliminar el horario'));
            return { ok: false };
        }
    };
};