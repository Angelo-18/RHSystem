import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
import {
    startLoadingAttendance,
    setAttendanceRecords,
    addAttendanceRecord,
    updateAttendanceRecord,
    setError
} from './attendanceSlice';

export const startLoadingAttendanceRecords = (userId = null) => {
    return async (dispatch) => {
        try {
            dispatch(startLoadingAttendance());
            const attendanceRef = collection(FirebaseDB, 'asistencias');
            let attendanceQuery;

            if (userId) {
                attendanceQuery = query(attendanceRef, where('userId', '==', userId));
            } else {
                attendanceQuery = attendanceRef;
            }

            const attendanceSnap = await getDocs(attendanceQuery);
            const attendanceData = attendanceSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                start: new Date(doc.data().start),
                end: new Date(doc.data().end)
            }));

            dispatch(setAttendanceRecords(attendanceData));
        } catch (error) {
            console.error('Error al cargar registros de asistencia:', error);
            dispatch(setError('Error al cargar los registros de asistencia'));
        }
    };
};

export const startAddingAttendanceRecord = (recordData) => {
    return async (dispatch) => {
        try {
            const newRecord = {
                ...recordData,
                createdAt: new Date().toISOString(),
                status: 'registered'
            };

            const docRef = await addDoc(collection(FirebaseDB, 'asistencias'), newRecord);
            dispatch(addAttendanceRecord({ id: docRef.id, ...newRecord }));

            return { ok: true, id: docRef.id };
        } catch (error) {
            console.error('Error al agregar registro de asistencia:', error);
            dispatch(setError('Error al registrar la asistencia'));
            return { ok: false };
        }
    };
};

export const startUpdatingAttendanceRecord = (recordId, updateData) => {
    return async (dispatch) => {
        try {
            const recordRef = doc(FirebaseDB, 'asistencias', recordId);
            const updatedData = {
                ...updateData,
                updatedAt: new Date().toISOString()
            };

            await updateDoc(recordRef, updatedData);
            dispatch(updateAttendanceRecord({ id: recordId, ...updatedData }));

            return { ok: true };
        } catch (error) {
            console.error('Error al actualizar registro de asistencia:', error);
            dispatch(setError('Error al actualizar el registro'));
            return { ok: false };
        }
    };
};