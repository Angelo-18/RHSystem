import { useDispatch, useSelector } from 'react-redux';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../firebase/config';
import { uploadJustificationDocument } from '../firebase/storage';
import {
    startLoadingAttendance,
    setAttendanceRecords,
    addAttendanceRecord,
    updateAttendanceRecord,
    setActiveRecord,
    clearActiveRecord,
    setError,
    clearError
} from '../store/attendance/attendanceSlice';

export const useAttendanceStore = () => {
    const dispatch = useDispatch();
    const { attendanceRecords, activeRecord, isLoading, errorMessage } = useSelector(state => state.attendance);
    const { uid, userProfile } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) => {
        if (!calendarEvent) {
            dispatch(clearActiveRecord());
            return;
        }
        const serializedEvent = {
            ...calendarEvent,
            start: calendarEvent.start.toISOString(),
            end: calendarEvent.end.toISOString()
        };
        dispatch(setActiveRecord(serializedEvent));
    };

    const loadAttendanceRecords = async () => {
        try {
            dispatch(startLoadingAttendance());
            let attendanceQuery;

            if (userProfile === 'colaborador') {
                attendanceQuery = query(
                    collection(FirebaseDB, 'asistencias'),
                    where('userId', '==', uid)
                );
            } else if (userProfile === 'jefe') {
                const teamQuery = query(
                    collection(FirebaseDB, 'users'),
                    where('supervisorId', '==', uid)
                );
                const teamSnap = await getDocs(teamQuery);
                const teamUserIds = teamSnap.docs.map(doc => doc.id);
                
                attendanceQuery = query(
                    collection(FirebaseDB, 'asistencias'),
                    where('userId', 'in', [...teamUserIds, uid])
                );
            } else {
                attendanceQuery = collection(FirebaseDB, 'asistencias');
            }

            const attendanceSnap = await getDocs(attendanceQuery);
            const validEvents = processAttendanceRecords(attendanceSnap);
            
            const serializedEvents = validEvents.map(event => ({
                ...event,
                start: event.start.toISOString(),
                end: event.end.toISOString()
            }));
            
            dispatch(setAttendanceRecords(serializedEvents));
        } catch (error) {
            console.error('Error al cargar registros:', error);
            dispatch(setError('Error al cargar los registros de asistencia'));
        }
    };

    const processAttendanceRecords = (attendanceSnap) => {
        const attendanceRecords = {};
        
        attendanceSnap.forEach(doc => {
            const record = doc.data();
            const recordDate = new Date(record.start);
            if (isNaN(recordDate.getTime())) return;
            
            const date = recordDate.toLocaleDateString();
            if (!attendanceRecords[date]) {
                attendanceRecords[date] = [];
            }
            attendanceRecords[date].push({
                ...record,
                id: doc.id,
                timestamp: recordDate,
                userName: record.userName || 'Usuario'
            });
        });

        return createCalendarEvents(attendanceRecords);
    };

    const createCalendarEvents = (attendanceRecords) => {
        const calendarEvents = [];
        
        Object.entries(attendanceRecords).forEach(([dateKey, records]) => {
            records.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

            let currentEvent = null;
            records.forEach((record) => {
                const recordTime = record.timestamp;
                
                if (record.type === 'entrada') {
                    currentEvent = {
                        id: record.id,
                        title: 'Jornada Laboral',
                        start: recordTime,
                        userId: record.userId,
                        status: record.status || 'registered',
                        justification: record.justification,
                        notes: record.notes
                    };
                } else if (record.type === 'salida' && currentEvent) {
                    currentEvent.end = recordTime;
                    calendarEvents.push({...currentEvent});
                    currentEvent = null;
                } else if (record.type === 'break_inicio' && currentEvent) {
                    currentEvent.end = recordTime;
                    calendarEvents.push({...currentEvent});
                    currentEvent = null;
                } else if (record.type === 'break_fin') {
                    currentEvent = {
                        id: record.id,
                        title: 'Jornada Laboral (después de break)',
                        start: recordTime,
                        userId: record.userId,
                        status: record.status || 'registered',
                        justification: record.justification,
                        notes: record.notes
                    };
                }
            });

            if (currentEvent) {
                const today = new Date().toLocaleDateString();
                if (dateKey === today) {
                    currentEvent.end = new Date();
                } else {
                    const endOfDay = new Date(records[0].timestamp);
                    endOfDay.setHours(23, 59, 59);
                    currentEvent.end = endOfDay;
                }
                calendarEvents.push({...currentEvent});
            }
        });

        return calendarEvents.filter(event => {
            return event.start && event.end &&
                   event.start instanceof Date && event.end instanceof Date &&
                   !isNaN(event.start.getTime()) && !isNaN(event.end.getTime());
        });
    };

    const startSavingJustification = async (eventId, justificationData, file = null) => {
        try {
            dispatch(startLoadingAttendance());
            
            if (file) {
                const uploadResult = await uploadJustificationDocument(file, uid, eventId);
                if (!uploadResult.success) {
                    throw new Error('Error al subir el documento');
                }
                justificationData.documentUrl = uploadResult.url;
                justificationData.documentPath = uploadResult.path;
            }

            const eventRef = doc(FirebaseDB, 'asistencias', eventId);
            await updateDoc(eventRef, justificationData);
            
            await loadAttendanceRecords();
            return { success: true };
        } catch (error) {
            console.error('Error al guardar justificación:', error);
            dispatch(setError('Error al guardar la justificación'));
            return { success: false, error: error.message };
        }
    };

    const startAddingAttendance = async (attendanceData) => {
        try {
            dispatch(startLoadingAttendance());
            const docRef = await addDoc(collection(FirebaseDB, 'asistencias'), attendanceData);
            const newEvent = {
                id: docRef.id,
                ...attendanceData,
                start: new Date(attendanceData.start).toISOString(),
                end: new Date(attendanceData.end).toISOString()
            };
            dispatch(addAttendanceRecord(newEvent));
            return { success: true, eventId: docRef.id };
        } catch (error) {
            console.error('Error al agregar asistencia:', error);
            dispatch(setError('Error al registrar la asistencia'));
            return { success: false, error: error.message };
        }
    };

    return {
        events: attendanceRecords.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end)
        })),
        activeEvent: activeRecord ? {
            ...activeRecord,
            start: new Date(activeRecord.start),
            end: new Date(activeRecord.end)
        } : null,
        isLoading,
        error: errorMessage,
        hasEventSelected: !!activeRecord,

        // Métodos
        setActiveEvent,
        loadAttendanceRecords,
        startSavingJustification,
        startAddingAttendance
    };
};