import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FirebaseApp } from './config';

// Inicializar Firebase Storage
const storage = getStorage(FirebaseApp);

// Función para subir un documento de justificación
export const uploadJustificationDocument = async (file, userId, attendanceId) => {
    try {
        // Crear una referencia única para el archivo
        const fileExtension = file.name.split('.').pop();
        const fileName = `justifications/${userId}/${attendanceId}_${Date.now()}.${fileExtension}`;
        const storageRef = ref(storage, fileName);

        // Subir el archivo
        const snapshot = await uploadBytes(storageRef, file);

        // Obtener la URL de descarga
        const downloadURL = await getDownloadURL(snapshot.ref);

        return {
            success: true,
            url: downloadURL,
            path: fileName
        };
    } catch (error) {
        console.error('Error al subir el documento:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Función para obtener la URL de un documento
export const getJustificationDocumentURL = async (filePath) => {
    try {
        const fileRef = ref(storage, filePath);
        const url = await getDownloadURL(fileRef);
        return url;
    } catch (error) {
        console.error('Error al obtener la URL del documento:', error);
        throw error;
    }
};