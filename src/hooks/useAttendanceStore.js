import { useDispatch, useSelector } from 'react-redux';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore/lite';
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
    clearError,
    setCurrentDayRecords
} from '../store/attendance/attendanceSlice';

export const useAttendanceStore = () => {
    const dispatch = useDispatch();
    const { attendanceRecords, activeRecord, isLoading, errorMessage, currentDayRecords } = useSelector(state => state.attendance);
    const { uid, userProfile } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) => {
        dispatch(clearError());
        if (!calendarEvent) {
            dispatch(clearActiveRecord());
            return;
        }
        // Convert Date objects to ISO strings before dispatching
        const serializedEvent = {
            ...calendarEvent,
            start: calendarEvent.start instanceof Date ? calendarEvent.start.toISOString() : calendarEvent.start,
            end: calendarEvent.end instanceof Date ? calendarEvent.end.toISOString() : calendarEvent.end,
            startBreak: calendarEvent.startBreak instanceof Date ? calendarEvent.startBreak.toISOString() : calendarEvent.startBreak,
            endBreak: calendarEvent.endBreak instanceof Date ? calendarEvent.endBreak.toISOString() : calendarEvent.endBreak
        };
        dispatch(setActiveRecord(serializedEvent));
    };

    const loadAttendanceRecords = async () => {
        try {
            dispatch(startLoadingAttendance());
            let attendanceQuery;

            // Solo obtener las asistencias del usuario autenticado
            attendanceQuery = query(
                collection(FirebaseDB, 'asistencias'),
                where('userId', '==', uid)
            );
            const attendanceSnap = await getDocs(attendanceQuery);
            
            const validEvents = await processAttendanceRecords(attendanceSnap);
            
            // Filtrar registros del día actual
            const today = new Date().toISOString().split('T')[0];
            const currentDayRecords = validEvents.filter(event => {
                const eventDate = event.start instanceof Date ? event.start.toISOString().split('T')[0] : new Date(event.start).toISOString().split('T')[0];
                return eventDate === today;
            });
            
            dispatch(setAttendanceRecords(validEvents));
            dispatch(setCurrentDayRecords(currentDayRecords));
        } catch (error) {
            dispatch(setError('Error al cargar los registros de asistencia'));
        }
    };

    const processAttendanceRecords = async (attendanceSnap) => {
        const attendanceRecords = {};
        
        // Obtener el horario del usuario autenticado
        const userSchedules = {};
        
        // Obtener el documento directamente usando el uid como ID del documento
        const userDoc = await getDoc(doc(FirebaseDB, 'personal_registrado', uid));
        const userData = userDoc.exists() ? userDoc.data() : null;
        

        if (userData?.horario) {
            const scheduleDoc = await getDoc(doc(FirebaseDB, 'horarios', userData.horario));
            
            const scheduleData = scheduleDoc.exists() ? scheduleDoc.data() : null;
            
            if (scheduleData) {
                userSchedules[uid] = scheduleData;
            }
        }
        
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
                userName: record.userName || 'Usuario',
                userSchedule: userSchedules[record.userId]
            });
        });

        return createCalendarEvents(attendanceRecords);
    };

        const createCalendarEvents = (attendanceRecords) => {
            const timeToMinutes = (time) => {
                if (!time) return null;
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
        };

        const checkScheduleStatus = (record, schedule) => {
            if (!schedule) return { isWithinSchedule: false, isLate: false };

            const recordTime = new Date(record.timestamp);
            const dayOfWeek = recordTime.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const recordMinutes = recordTime.getHours() * 60 + recordTime.getMinutes();



            const entryTime = timeToMinutes(isWeekend ? schedule.horaEntradaFinSemana : schedule.horaEntrada);
            const exitTime = timeToMinutes(isWeekend ? schedule.horaSalidaFinSemana : schedule.horaSalida);
            const breakStartTime = timeToMinutes(isWeekend ? schedule.horaInicioDescansoFinSemana : schedule.horaInicioDescanso);
            const breakEndTime = timeToMinutes(isWeekend ? schedule.horaFinDescansoFinSemana : schedule.horaFinDescanso);
            const tolerance = schedule.tolerancia || 10;

            let isWithinSchedule = false;
            let isLate = false;

            switch (record.type) {
                case 'entrada':
                    if (entryTime !== null) {
                        const lateMinutes = recordMinutes - entryTime;
                        isWithinSchedule = lateMinutes <= tolerance;
                        isLate = lateMinutes > tolerance;
                    }
                    break;
                case 'salida':
                    if (exitTime !== null) {
                        // Para la salida, consideramos que está dentro del horario si es después de la hora de salida
                        const earlyMinutes = exitTime - recordMinutes;
                        isWithinSchedule = earlyMinutes <= tolerance;
                        isLate = earlyMinutes > tolerance;
                    }
                    break;
                case 'break_inicio':
                    if (breakStartTime !== null) {
                        const breakStartDiff = recordMinutes - breakStartTime;
                        isWithinSchedule = breakStartDiff >= -tolerance && breakStartDiff <= tolerance;
                        isLate = !isWithinSchedule;
                    }
                    break;
                case 'break_fin':
                    if (breakEndTime !== null) {
                        const breakEndDiff = recordMinutes - breakEndTime;
                        isWithinSchedule = breakEndDiff >= -tolerance && breakEndDiff <= tolerance;
                        isLate = !isWithinSchedule;
                    }
                    break;
            }

            return { isWithinSchedule, isLate };
        };

        const calendarEvents = [];
        
        Object.entries(attendanceRecords).forEach(([dateKey, records]) => {
            records.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

            records.forEach((record) => {
                const recordTime = new Date(record.timestamp);
                if (isNaN(recordTime.getTime())) return; // Skip invalid dates
                

                const scheduleStatus = checkScheduleStatus(record, record.userSchedule);
                
                switch (record.type) {
                    case 'entrada':
                    case 'break_inicio':
                    case 'break_fin':
                    case 'salida':
                        const endTime = record.end ? new Date(record.end) : new Date(recordTime.getTime() + 60 * 60 * 1000); // Usa end existente o añade una hora
                        const newEvent = {
                            id: record.id,
                            title: `Marcación: ${record.type}`,
                            start: recordTime.toISOString(),
                            end: endTime.toISOString(),
                            userId: record.userId,
                            status: scheduleStatus.isWithinSchedule ? 'registered' : 'pending',
                            justification: record.justification,
                            notes: !scheduleStatus.isWithinSchedule ? 
                                record.type === 'entrada' ? 'Marcación fuera del horario de entrada' :
                                record.type === 'break_inicio' ? 'Break iniciado fuera de horario' :
                                record.type === 'break_fin' ? 'Break finalizado fuera de horario' :
                                'Marcación fuera del horario de salida' : '',
                            startBreak: record.type === 'break_inicio' ? recordTime.toISOString() : null,
                            endBreak: record.type === 'break_fin' ? recordTime.toISOString() : null,
                            isWithinSchedule: scheduleStatus.isWithinSchedule,
                            isLate: !scheduleStatus.isWithinSchedule
                        };
                        calendarEvents.push(newEvent);
                        break;
                }
            });

            // Los eventos sin marcar salida ya no necesitan manejo especial
            // ya que cada tipo de marcación es un evento independiente
        });

        return calendarEvents;
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
            dispatch(setError('Error al guardar la justificación'));
            return { success: false, error: error.message };
        }
    };

    const startAddingAttendance = async (attendanceData) => {
        try {
            dispatch(startLoadingAttendance());

            // Obtener el horario del usuario
            const userDoc = await getDoc(doc(FirebaseDB, 'personal_registrado', attendanceData.userId));
            if (!userDoc.exists()) {
                throw new Error('Usuario no encontrado');
            }
            const userData = userDoc.data();
            if (!userData.horario) {
                throw new Error('Usuario no tiene un horario asignado');
            }

            // Obtener el horario asignado
            const scheduleDoc = await getDoc(doc(FirebaseDB, 'horarios', userData.horario));
            if (!scheduleDoc.exists()) {
                throw new Error('No se encontró el horario asignado');
            }
            const scheduleData = scheduleDoc.data();

            if (!scheduleData) {
                throw new Error('No se encontró el horario asignado');
            }

            // Validar el horario según el día de la semana
            const now = new Date();
            const dayOfWeek = now.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            // Obtener las horas del horario según sea día de semana o fin de semana
            const scheduleEntry = isWeekend ? scheduleData.horaEntradaFinSemana : scheduleData.horaEntrada;
            const scheduleExit = isWeekend ? scheduleData.horaSalidaFinSemana : scheduleData.horaSalida;
            const scheduleBreakStart = isWeekend ? scheduleData.horaInicioDescansoFinSemana : scheduleData.horaInicioDescanso;
            const scheduleBreakEnd = isWeekend ? scheduleData.horaFinDescansoFinSemana : scheduleData.horaFinDescanso;
            const tolerance = scheduleData.tolerancia || 10;

            // Convertir la hora actual a minutos desde medianoche para comparar
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            // Función para convertir hora en formato "HH:mm" a minutos
            const timeToMinutes = (time) => {
                if (!time) return null;
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };

            // Convertir horarios a minutos
            const entryTime = timeToMinutes(scheduleEntry);
            const exitTime = timeToMinutes(scheduleExit);
            const breakStartTime = timeToMinutes(scheduleBreakStart);
            const breakEndTime = timeToMinutes(scheduleBreakEnd);

            // Validar según el tipo de marcación
            let status = 'registered';
            let notes = '';

            switch (attendanceData.type) {
                case 'entrada':
                    if (entryTime !== null) {
                        const lateMinutes = currentMinutes - entryTime;
                        if (lateMinutes > tolerance) {
                            status = 'pending';
                            notes = `Tardanza de ${lateMinutes} minutos`;
                        }
                    }
                    break;

                case 'salida':
                    if (exitTime !== null) {
                        const earlyMinutes = exitTime - currentMinutes;
                        if (earlyMinutes > tolerance) {
                            status = 'pending';
                            notes = `Salida ${earlyMinutes} minutos antes de tiempo`;
                        }
                    }
                    break;

                case 'break_inicio':
                    if (breakStartTime !== null) {
                        const breakStartDiff = currentMinutes - breakStartTime;
                        if (breakStartDiff < -tolerance || breakStartDiff > tolerance) {
                            status = 'pending';
                            notes = breakStartDiff < 0 
                                ? `Break iniciado ${Math.abs(breakStartDiff)} minutos antes de tiempo`
                                : `Break iniciado ${breakStartDiff} minutos tarde`;
                        }
                    }
                    break;

                case 'break_fin':
                    if (breakEndTime !== null) {
                        const breakEndDiff = currentMinutes - breakEndTime;
                        if (breakEndDiff < -tolerance || breakEndDiff > tolerance) {
                            status = 'pending';
                            notes = breakEndDiff < 0 
                                ? `Break finalizado ${Math.abs(breakEndDiff)} minutos antes de tiempo`
                                : `Break finalizado ${breakEndDiff} minutos tarde`;
                        }
                    }
                    break;
            }

            const newRecord = {
                ...attendanceData,
                createdAt: new Date().toISOString(),
                status,
                notes
            };

            const docRef = await addDoc(collection(FirebaseDB, 'asistencias'), newRecord);
            const recordWithId = { id: docRef.id, ...newRecord };
            dispatch(addAttendanceRecord(recordWithId));

            return { success: true, id: docRef.id };
        } catch (error) {
            dispatch(setError('Error al registrar la asistencia: ' + error.message));
            return { success: false, error: error.message };
        }
    };

    return {
        events: attendanceRecords,
        activeEvent: activeRecord,
        isLoading,
        error: errorMessage,
        currentDayRecords,
        hasEventSelected: !!activeRecord,

        // Métodos
        setActiveEvent,
        loadAttendanceRecords,
        startSavingJustification,
        startAddingAttendance
    };
}
