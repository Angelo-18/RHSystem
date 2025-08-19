import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
import {
    startLoadingAttendance,
    setAttendanceRecords,
    addAttendanceRecord,
    updateAttendanceRecord,
    setError,
    setCurrentDayRecords
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
                ...doc.data()
            }));

            // Filtrar registros del día actual
            const today = new Date().toISOString().split('T')[0];
            const currentDayRecords = attendanceData.filter(record => {
                const recordDate = new Date(record.start).toISOString().split('T')[0];
                return recordDate === today;
            });

            dispatch(setAttendanceRecords(attendanceData));
            dispatch(setCurrentDayRecords(currentDayRecords));
        } catch (error) {
            console.error('Error al cargar registros de asistencia:', error);
            dispatch(setError('Error al cargar los registros de asistencia'));
        }
    };
};

export const startAddingAttendanceRecord = (recordData) => {
    return async (dispatch) => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            // Buscar registros del día actual para el usuario
            const attendanceRef = collection(FirebaseDB, 'asistencias');
            const todayQuery = query(
                attendanceRef,
                where('userId', '==', recordData.userId)
            );

            const todaySnap = await getDocs(todayQuery);
            // Filtrar los registros del día actual en memoria
            const todayStart = today.getTime();
            const tomorrowStart = tomorrow.getTime();
            const todayRecords = todaySnap.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter(record => {
                    const recordTime = new Date(record.start).getTime();
                    return recordTime >= todayStart && recordTime < tomorrowStart;
                });
            console.log(todayRecords);
            // Validar secuencia de marcaciones
            const hasEntrada = todayRecords.some(r => r.start);
            const hasBreakInicio = todayRecords.some(r => r.startBreak);
            const hasBreakFin = todayRecords.some(r => r.endBreak);
            const hasSalida = todayRecords.some(r => r.end);
            console.log(hasEntrada, hasBreakInicio, hasBreakFin, hasSalida);
            // Validar según el tipo de marcación
            switch (recordData.type) {
                case 'entrada':
                    if (hasEntrada) {
                        dispatch(setError('Ya existe una marcación de entrada para hoy'));
                        return { ok: false, error: 'Ya existe una marcación de entrada para hoy' };
                    }
                    if (hasSalida) {
                        dispatch(setError('No puede marcar entrada después de haber marcado salida'));
                        return { ok: false, error: 'No puede marcar entrada después de haber marcado salida' };
                    }
                    break;
                case 'break_inicio':
                    if (!hasEntrada) {
                        dispatch(setError('Debe marcar entrada antes de iniciar el break'));
                        return { ok: false, error: 'Debe marcar entrada antes de iniciar el break' };
                    }
                    if (hasBreakInicio && !hasBreakFin) {
                        dispatch(setError('Ya tiene un break iniciado sin finalizar'));
                        return { ok: false, error: 'Ya tiene un break iniciado sin finalizar' };
                    }
                    if (hasSalida) {
                        dispatch(setError('No puede iniciar break después de marcar salida'));
                        return { ok: false, error: 'No puede iniciar break después de marcar salida' };
                    }
                    break;
                case 'break_fin':
                    if (!hasBreakInicio || hasBreakFin) {
                        dispatch(setError('No hay un break iniciado para finalizar'));
                        return { ok: false, error: 'No hay un break iniciado para finalizar' };
                    }
                    if (hasSalida) {
                        dispatch(setError('No puede finalizar break después de marcar salida'));
                        return { ok: false, error: 'No puede finalizar break después de marcar salida' };
                    }
                    break;
                case 'salida':
                    if (!hasEntrada) {
                        dispatch(setError('Debe marcar entrada antes de marcar salida'));
                        return { ok: false, error: 'Debe marcar entrada antes de marcar salida' };
                    }
                    if (hasBreakInicio && !hasBreakFin) {
                        dispatch(setError('Debe finalizar el break antes de marcar salida'));
                        return { ok: false, error: 'Debe finalizar el break antes de marcar salida' };
                    }
                    break;
                default:
                    dispatch(setError('Tipo de marcación no válido'));
                    return { ok: false, error: 'Tipo de marcación no válido' };
            }

            const now = new Date();
            let updateData = {};
            const existingRecord = todayRecords[0];
            
            // Si no hay registro para hoy, crear uno nuevo
            if (todayRecords.length === 0) {
                if (recordData.type !== 'entrada') {
                    dispatch(setError('Debe marcar entrada primero'));
                    return { ok: false, error: 'Debe marcar entrada primero' };
                }
                
                const newRecord = {
                    userId: recordData.userId,
                    createdAt: now.toISOString(),
                    start: now.toISOString(),
                    end: null,
                    status: 'registered',
                    estado: true,
                    notes: recordData.notes || '',
                    startBreak: null,
                    endBreak: null,
                    type: 'entrada'
                };
                
                const docRef = await addDoc(collection(FirebaseDB, 'asistencias'), newRecord);
                dispatch(addAttendanceRecord({ id: docRef.id, ...newRecord }));
                return { ok: true, id: existingRecord ? existingRecord.id : docRef.id };
            }
            
            // Actualizar registro existente
            // const existingRecord = todayRecords[0];
            switch (recordData.type) {
                case 'break_inicio':
                    updateData = { startBreak: now.toISOString(), type: 'break_inicio' };
                    break;
                case 'break_fin':
                    updateData = { endBreak: now.toISOString(), type: 'break_fin' };
                    break;
                case 'salida':
                    updateData = { end: now.toISOString(), type: 'salida' };
                    break;
            }
            
            const recordRef = doc(FirebaseDB, 'asistencias', existingRecord.id);
            await updateDoc(recordRef, updateData);
            dispatch(updateAttendanceRecord({ id: existingRecord.id, ...existingRecord, ...updateData }));
            
            return { ok: true, id: existingRecord.id };
            
        } catch (error) {
            console.error('Error al agregar registro de asistencia:', error);
            dispatch(setError('Error al registrar la asistencia'));
            return { ok: false };
        }
    };
};

// export const startUpdatingAttendanceRecord = (recordId, updateData) => {
//     return async (dispatch) => {
//         try {
//             const recordRef = doc(FirebaseDB, 'asistencias', recordId);
//             const updatedData = {
//                 ...updateData,
//                 updatedAt: new Date().toISOString()
//             };

//             await updateDoc(recordRef, updatedData);
//             dispatch(updateAttendanceRecord({ id: recordId, ...updatedData }));

//             return { ok: true };
//         } catch (error) {
//             console.error('Error al actualizar registro de asistencia:', error);
//             dispatch(setError('Error al actualizar el registro'));
//             return { ok: false };
//         }
//     };
// };