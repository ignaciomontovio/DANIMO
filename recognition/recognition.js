const { spawn } = require('child_process');
const path = require('path');

// Función asincrónica que ejecuta el script Python
async function detectEmotion(imagePath) {
    return new Promise((resolve, reject) => {
        //ruta del script de python que usa deepface para determinar emocion
        const scriptPath = path.resolve(__dirname, '../emotionRecognition/recognition.py');

        //spawn permite la creación de un proceso hijo.
        // le mando el script y la ruta de la imagen como argumento
        const python = spawn('python', [scriptPath, imagePath]);

        let output = '';
        let errorOutput = '';

        //El encoding ya se maneja desde el script de python
        //python.stdout.setEncoding('utf8');
        //python.stderr.setEncoding('utf8');

        //a medida que me llega info la voy concatenando
        python.stdout.on('data', (data) => {
            output += data;
        });

        python.stderr.on('data', (data) => {
            errorOutput += data;
        });

        //terminó la ejecucion del script, muestro la salida o si hubo algun error
        python.on('close', (code) => {
            if (code === 0) {
                resolve(output.trim());
            } else {
                reject(new Error(`Código de salida ${code}. Error: ${errorOutput}`));
            }
        });
    });
}

// Llamar a la función. Esto lo vamos a tener que llevar al lugar donde la queramos usar
(async () => {
    //ruta de la imagen que va a usar el script. 
    //PARA DESPUES: ver como obtener la foto de la camara
    const imagePath = path.resolve(__dirname, '../emotionRecognition/Cara2.jpg');

    try {
        const emotion = await detectEmotion(imagePath);
        console.log(emotion);
    } catch (error) {
        console.error("Error al detectar emoción:", error.message);
    }
})();

// Exportar la función para poder usarla desde otro lado
//const { detectarEmocion } = require('./reconocimiento/reconocimiento'); 
module.exports = { detectEmotion };