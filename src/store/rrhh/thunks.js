import { collection, getDocs, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
import {
    startLoading,
    setError,
    setCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    setAreas,
    addArea,
    updateArea,
    deleteArea,
    setPositions,
    addPosition,
    updatePosition,
    deletePosition
} from './rrhhSlice';

// Thunks para empresas
export const startLoadingCompanies = () => {
    return async (dispatch) => {
        try {
            dispatch(startLoading());
            const companiesRef = collection(FirebaseDB, 'empresas');
            const companiesSnap = await getDocs(companiesRef);
            const companiesData = companiesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            dispatch(setCompanies(companiesData));
        } catch (error) {
            console.error('Error al cargar empresas:', error);
            dispatch(setError('Error al cargar las empresas'));
        }
    };
};

export const startAddingCompany = (companyData) => {
    return async (dispatch) => {
        try {
            dispatch(startLoading());
            const newCompanyRef = await addDoc(collection(FirebaseDB, 'empresas'), companyData);
            dispatch(addCompany({ id: newCompanyRef.id, ...companyData }));
        } catch (error) {
            console.error('Error al añadir empresa:', error);
            dispatch(setError('Error al añadir la empresa'));
        }
    };
};

export const startUpdatingCompany = (companyId, companyData) => {
    return async (dispatch) => {
        try {
            dispatch(startLoading());
            const companyRef = doc(FirebaseDB, 'empresas', companyId);
            await setDoc(companyRef, companyData, { merge: true });
            dispatch(updateCompany({ id: companyId, ...companyData }));
        } catch (error) {
            console.error('Error al actualizar empresa:', error);
            dispatch(setError('Error al actualizar la empresa'));
        }
    };
};

export const startDeletingCompany = (companyId) => {
    return async (dispatch) => {
        try {
            dispatch(startLoading());
            await deleteDoc(doc(FirebaseDB, 'empresas', companyId));
            dispatch(deleteCompany(companyId));
        } catch (error) {
            console.error('Error al eliminar empresa:', error);
            dispatch(setError('Error al eliminar la empresa'));
        }
    };
};

// Thunks para áreas
export const startLoadingAreas = () => {
    return async (dispatch) => {
        try {
            dispatch(startLoading());
            const areasRef = collection(FirebaseDB, 'areas');
            const areasSnap = await getDocs(areasRef);
            const areasData = areasSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            dispatch(setAreas(areasData));
        } catch (error) {
            console.error('Error al cargar áreas:', error);
            dispatch(setError('Error al cargar las áreas'));
        }
    };
};

export const startAddingArea = (areaData) => {
    return async (dispatch) => {
        try {
            dispatch(startLoading());
            const newAreaRef = await addDoc(collection(FirebaseDB, 'areas'), areaData);
            dispatch(addArea({ id: newAreaRef.id, ...areaData }));
        } catch (error) {
            console.error('Error al añadir área:', error);
            dispatch(setError('Error al añadir el área'));
        }
    };
};

export const startUpdatingArea = (areaId, areaData) => {
    return async (dispatch) => {
        try {
            dispatch(startLoading());
            const areaRef = doc(FirebaseDB, 'areas', areaId);
            await setDoc(areaRef, areaData, { merge: true });
            dispatch(updateArea({ id: areaId, ...areaData }));
        } catch (error) {
            console.error('Error al actualizar área:', error);
            dispatch(setError('Error al actualizar el área'));
        }
    };
};

export const startDeletingArea = (areaId) => {
    return async (dispatch) => {
        try {
            dispatch(startLoading());
            await deleteDoc(doc(FirebaseDB, 'areas', areaId));
            dispatch(deleteArea(areaId));
        } catch (error) {
            console.error('Error al eliminar área:', error);
            dispatch(setError('Error al eliminar el área'));
        }
    };
};

// Thunks para puestos
export const startLoadingPositions = () => {
    return async (dispatch) => {
        try {
            dispatch(startLoading());
            const positionsRef = collection(FirebaseDB, 'puestos');
            const positionsSnap = await getDocs(positionsRef);
            const positionsData = positionsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            dispatch(setPositions(positionsData));
        } catch (error) {
            console.error('Error al cargar puestos:', error);
            dispatch(setError('Error al cargar los puestos'));
        }
    };
};

export const startAddingPosition = (positionData) => {
    return async (dispatch) => {
        try {
            dispatch(startLoading());
            const newPositionRef = await addDoc(collection(FirebaseDB, 'puestos'), positionData);
            dispatch(addPosition({ id: newPositionRef.id, ...positionData }));
        } catch (error) {
            console.error('Error al añadir puesto:', error);
            dispatch(setError('Error al añadir el puesto'));
        }
    };
};

export const startUpdatingPosition = (positionId, positionData) => {
    return async (dispatch) => {
        try {
            dispatch(startLoading());
            const positionRef = doc(FirebaseDB, 'puestos', positionId);
            await setDoc(positionRef, positionData, { merge: true });
            dispatch(updatePosition({ id: positionId, ...positionData }));
        } catch (error) {
            console.error('Error al actualizar puesto:', error);
            dispatch(setError('Error al actualizar el puesto'));
        }
    };
};

export const startDeletingPosition = (positionId) => {
    return async (dispatch) => {
        try {
            dispatch(startLoading());
            await deleteDoc(doc(FirebaseDB, 'puestos', positionId));
            dispatch(deletePosition(positionId));
        } catch (error) {
            console.error('Error al eliminar puesto:', error);
            dispatch(setError('Error al eliminar el puesto'));
        }
    };
};
