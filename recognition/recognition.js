import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function detectEmotion(imageData) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.resolve(__dirname, '../emotionRecognition/recognition.py');

        const tmpPath = path.join(os.tmpdir(), `temp_image_${Date.now()}.jpg`);

        // Detectar si es base64
        if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
            const base64Data = imageData.split(',')[1];
            fs.writeFileSync(tmpPath, Buffer.from(base64Data, 'base64'));
        } else {
            fs.writeFileSync(tmpPath, imageData);
        }

        const python = spawn('python', [scriptPath, tmpPath]);

        let output = '';
        let errorOutput = '';

        python.stdout.on('data', (data) => output += data);
        python.stderr.on('data', (data) => errorOutput += data);

        python.on('close', (code) => {
            fs.unlinkSync(tmpPath);

            try {
                const result = JSON.parse(output.trim());
                if (result.error) reject(new Error(`Python error: ${result.error}`));
                else resolve(result.emotion);
            } catch (err) {
                reject(new Error(`No se pudo parsear la salida de Python. stdout: ${output}, stderr: ${errorOutput}`));
            }
        });
    });
}
