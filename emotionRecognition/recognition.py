import sys
import json
from deepface import DeepFace
from PIL import Image
import os

# Ocultar warnings de TensorFlow
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

def map_emotion(emotion):
    mapping = {
        "happy": "Alegria",
        "sad": "Tristeza",
        "fear": "Miedo",
        "angry": "Enojo",
        "surprise": "Ansiedad",
        "neutral": "Neutral", 
        "disgust": "Enojo",
        "disgusted": "Enojo",
    }
    return mapping.get(emotion.lower(), "Neutral")

if len(sys.argv) < 2:
    print(json.dumps({"error": "No se proporcionó ruta de imagen"}))
    sys.exit(0)  # 0 para que Node no interprete como error

img_path = sys.argv[1]

try:
    # Comprobar que la imagen se puede abrir
    with Image.open(img_path) as img:
        img.verify()

    # Analizar emoción
    result = DeepFace.analyze(img_path, actions=['emotion'], enforce_detection=False)
    dominant_emotion = result[0]['dominant_emotion']
    mapped_emotion = map_emotion(dominant_emotion)

    print(json.dumps({"emotion": mapped_emotion}))
    sys.exit(0)  # éxito

except Exception as e:
    print(json.dumps({"error": f"No se pudo procesar la imagen: {str(e)}"}))
    sys.exit(0)  # salida 0 para que Node pueda parsear JSON aunque haya error
