import * as tf from '@tensorflow/tfjs'; // solo tfjs puro
import * as mobilenet from '@tensorflow-models/mobilenet';
import canvas from 'canvas';
import { validatePhotoOnlyInput } from '../utils/validators.js';

const { Canvas, Image } = canvas;

const loadImageFromBuffer = async (buffer) => canvas.loadImage(buffer);

let mobilenetModel;
const loadModel = async () => {
  if (!mobilenetModel) {
    mobilenetModel = await mobilenet.load();
    console.log('✅ Modelo MobileNet cargado');
  }
};

const predictEmotion = async (img) => {
  await loadModel();
  const tensor = tf.browser.fromPixels(img);
  const resized = tf.image.resizeBilinear(tensor, [224, 224]);
  const expanded = resized.expandDims(0);
  const normalized = expanded.div(255);
  const predictions = await mobilenetModel.classify(normalized);
  return predictions[0]?.className || 'Desconocida';
};

export const detectEmotionFromPhoto = async (req, res) => {
  const { error } = validatePhotoOnlyInput(req.file);
  if (error) return res.status(400).json({ error });

  try {
    const img = await loadImageFromBuffer(req.file.buffer);
    const emotion = await predictEmotion(img);
    console.log(`✅ Emoción detectada: ${emotion}`);
    return res.json({ emotion });
  } catch (err) {
    console.error('❌ Error al procesar la foto:', err);
    return res.status(500).json({ error: 'Error al procesar la foto' });
  }
};
