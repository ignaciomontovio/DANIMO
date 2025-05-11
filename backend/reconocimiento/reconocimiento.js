const { spawn } = require('child_process');
const path = require('path');

// Ruta donde se encuentra el script python a ejecutar
const rutaScript = '../../reconocimiento_emociones/emocion_foto.py'

// Ruta a donde está la foto (ahora es fija, cambiar despues cuando tomemos la foto)
const rutaFoto = '../../reconocimiento_emociones/Cara2.jpg'

// Guardamos el script en una variable
const scriptPath = path.join(__dirname, rutaScript);

// Guardamos la foto en una variable
const imgPath = path.join(__dirname, rutaFoto);

// Este metodo ejecuta el script y le pasa la imagen como argumento
const python = spawn('python', [scriptPath, imgPath]);

// Capturar resultado
python.stdout.on('data', (data) => {
    console.log(data.toString().trim());
});

// Captura de la salida de error. Descomentar si se quiere ver
python.stderr.on('data', (data) => {
    //console.error(data.toString());
});

// Captura de fin de proceso
python.on('close', (code) => {
    //console.log(`Proceso finalizado con código ${code}`);
});
