

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FirebaseStorage } from '../firebase/config';

export const fileUpload = async( file ) => {
    if ( !file ) throw new Error('No tenemos ningúna archivo a subir');

    try {
        // Crear una referencia única para el archivo
        const fileName = `${Date.now()}-${file.name}`;
        const storageRef = ref(FirebaseStorage, `journal-images/${fileName}`);
        
        // Subir el archivo a Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);
        
        // Obtener la URL de descarga
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return downloadURL;

    } catch (error) {
        console.log(error);
        throw new Error( error.message );
    }

}