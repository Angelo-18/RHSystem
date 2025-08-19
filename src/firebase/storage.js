import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FirebaseStorage } from './config';

export const uploadJustificationDocument = async (file) => {
    try {
        const fileRef = ref(FirebaseStorage, `justifications/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error al subir el documento:', error);
        throw new Error('Error al subir el documento de justificación');
    }
};

export const getJustificationDocumentURL = async (path) => {
    try {
        const fileRef = ref(FirebaseStorage, path);
        return await getDownloadURL(fileRef);
    } catch (error) {
        console.error('Error al obtener la URL del documento:', error);
        throw new Error('Error al obtener la URL del documento');
    }
};