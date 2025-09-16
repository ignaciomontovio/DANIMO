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
    sys.exit(0)  # 0 para que Node no lo tome como fallo del proceso

img_path = sys.argv[1]

try:
    # Comprobar que la imagen se puede abrir
    with Image.open(img_path) as img:
        img.verify()

    # Analizar emoción
    result = DeepFace.analyze(img_path, actions=['emotion'], enforce_detection=False)

    dominant_emotion = result[0]['dominant_emotion'].lower()
    emotions_scores = result[0]['emotion']

    if dominant_emotion == "neutral":
        # Ordenar emociones por score descendente
        sorted_emotions = sorted(emotions_scores.items(), key=lambda x: x[1], reverse=True)
        # Buscar la primera emoción distinta de neutral
        next_emotion = next((emo for emo, score in sorted_emotions if emo.lower() != "neutral"), "neutral")
        mapped_emotion = map_emotion(next_emotion)
    else:
        mapped_emotion = map_emotion(dominant_emotion)

    print(json.dumps({"emotion": mapped_emotion}))
    sys.exit(0)  # éxito

except Exception as e:
    print(json.dumps({"error": f"No se pudo procesar la imagen: {str(e)}"}))
    sys.exit(0)  # salida 0 para que Node pueda parsear JSON aunque haya error
