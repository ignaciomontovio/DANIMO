import * as tf from '@tensorflow/tfjs-node';
import * as faceapi from 'face-api.js';
import canvas from 'canvas';
import path from 'path';
import { validatePhotoOnlyInput } from '../utils/validators.js';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = path.join(process.cwd(), 'models/face-api');

let modelsLoaded = false;
const loadModels = async () => {
  if (!modelsLoaded) {
    try {
      console.log('Cargando modelo ssdMobilenetv1 desde:', MODEL_PATH);
      await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
      console.log('Modelo ssdMobilenetv1 cargado correctamente');
      console.log('Cargando modelo faceExpressionNet desde:', MODEL_PATH);
      await faceapi.nets.faceExpressionNet.loadFromDisk(MODEL_PATH);
      console.log('Modelo faceExpressionNet cargado correctamente');
      modelsLoaded = true;
      console.log('✅ Modelos de face-api.js cargados');
    } catch (err) {
      console.error('❌ Error cargando los modelos de face-api.js:', err);
      throw err;
    }
  }
};

const predictEmotion = async (img) => {
  await loadModels();
  console.log('🟢 Modelos cargados, detectando rostro...');
  const detections = await faceapi.detectSingleFace(img).withFaceExpressions();
  if (!detections || !detections.expressions) {
    console.log('🔴 No se detectó rostro');
    return 'No se detectó rostro';
  }
  // Obtener la emoción con mayor probabilidad
  const expressions = detections.expressions;
  console.log('🟢 Expresiones detectadas:', expressions);
  const emotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
  return emotion;
};

export const detectEmotionFromPhoto = async (req, res) => {
  console.log('🟢 detectEmotionFromPhoto llamado');
  const { error } = validatePhotoOnlyInput(req.file);
  if (error) return res.status(400).json({ error });

  try {
    const img = await canvas.loadImage(req.file.buffer);
    console.log('🟢 Imagen cargada, llamando a predictEmotion');
    const emotion = await predictEmotion(img);
    console.log(`✅ Emoción detectada: ${emotion}`);
    return res.json({ emotion });
  } catch (err) {
    console.error('❌ Error al procesar la foto:', err);
    return res.status(500).json({ error: 'Error al procesar la foto' });
  }
};
