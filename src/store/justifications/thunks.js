import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
import { uploadJustificationDocument } from '../../firebase/storage';
import {
    startLoadingJustifications,
    setJustifications,
    addJustification,
    updateJustification,
    setError,
    deleteJustification
} from './justificationsSlice';

export const startLoadingJustificationsRecords = (userId = null, userProfile = null) => {
    return async (dispatch) => {
        try {
            dispatch(startLoadingJustifications());
            const justificationsRef = collection(FirebaseDB, 'justifications');
            let justificationsQuery;

            if (userProfile === 'personal') {
                justificationsQuery = query(justificationsRef, where('userId', '==', userId));
            } else if (userProfile === 'jefe') {
                // Obtener los IDs de los miembros del equipo
                const teamQuery = query(
                    collection(FirebaseDB, 'users'),
                    where('supervisorId', '==', userId)
                );
                const teamSnap = await getDocs(teamQuery);
                const teamUserIds = teamSnap.docs.map(doc => doc.id);
                
                justificationsQuery = query(
                    justificationsRef,
                    where('userId', 'in', [...teamUserIds, userId])
                );
            } else {
                justificationsQuery = justificationsRef;
            }

            const justificationsSnap = await getDocs(justificationsQuery);
            const justificationsData = justificationsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date ? new Date(doc.data().date).toISOString() : null,
                createdAt: doc.data().createdAt ? new Date(doc.data().createdAt).toISOString() : null
            }));

            dispatch(setJustifications(justificationsData));
        } catch (error) {
            console.error('Error al cargar justificaciones:', error);
            dispatch(setError('Error al cargar las justificaciones'));
        }
    };
};

export const startAddingJustification = (justificationData, file = null) => {
    return async (dispatch) => {
        try {
            dispatch(startLoadingJustifications());
            let documentUrl = null;
            if (file) {
                documentUrl = await uploadJustificationDocument(file);
            }

            const newJustification = {
                ...justificationData,
                documentUrl,
                createdAt: new Date().toISOString(),
                date: justificationData.date.toISOString(),
                status: 'pendiente'
            };

            const docRef = await addDoc(collection(FirebaseDB, 'justifications'), newJustification);
            
            // Actualizar el registro de asistencia relacionado
            if (justificationData.attendanceId) {
                const attendanceRef = doc(FirebaseDB, 'asistencias', justificationData.attendanceId);
                await updateDoc(attendanceRef, {
                    status: 'pending',
                    justification: newJustification.reason
                });
            }

            dispatch(addJustification({ id: docRef.id, ...newJustification }));
            dispatch(setJustifications([]));
            return { ok: true, id: docRef.id };
        } catch (error) {
            console.error('Error al agregar justificación:', error);
            dispatch(setError('Error al registrar la justificación'));
            return { ok: false };
        }
    };
};

export const startUpdatingJustification = (justificationId, updateData) => {
    return async (dispatch) => {
        try {
            dispatch(startLoadingJustifications());
            const justificationRef = doc(FirebaseDB, 'justifications', justificationId);
            const updatedData = {
                ...updateData,
                updatedAt: new Date().toISOString()
            };

            await updateDoc(justificationRef, updatedData);

            // Actualizar el registro de asistencia relacionado si existe
            if (updateData.attendanceId) {
                const attendanceRef = doc(FirebaseDB, 'asistencias', updateData.attendanceId);
                await updateDoc(attendanceRef, {
                    status: updateData.status,
                    justification: updateData.reason
                });
            }

            dispatch(updateJustification({ id: justificationId, ...updatedData }));
            dispatch(setJustifications([]));
            return { ok: true };
        } catch (error) {
            console.error('Error al actualizar justificación:', error);
            dispatch(setError('Error al actualizar la justificación'));
            return { ok: false };
        }
    };
};

export const startDeletingJustification = (justificationId) => {
    return async (dispatch) => {
        try {
            dispatch(startLoadingJustifications());
            const justificationRef = doc(FirebaseDB, 'justifications', justificationId);
            await deleteDoc(justificationRef);
            dispatch(deleteJustification(justificationId));
            dispatch(setJustifications([]));
            return { ok: true };
        } catch (error) {
            console.error('Error al eliminar justificación:', error);
            dispatch(setError('Error al eliminar la justificación'));
            return { ok: false };
        }
    };
};