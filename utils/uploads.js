// utils/upload.js
import multer from 'multer';

//Borrar este archivo si el campo vuelve atras

const storage = multer.memoryStorage(); // guarda en memoria (puedes cambiarlo por disco si preferís)
const file_size = 1; // 1MB por ejemplo

export const upload = multer({
    storage,
    limits: { fileSize: file_size * 1024 * 1024 }, 
});
