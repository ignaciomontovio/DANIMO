import cv2
from deepface import DeepFace
import os
import sys
import io

#Tuve que agregar esto porque sino las tildes salen mal
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Cosas que tuve que ejecutar para que funcione (lo dejo tambien en el readme por las dudas)
# pip install opencv-python
# pip install deepface
# pip install tf-keras

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '3'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

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
    return mapping.get(emotion, "neutral")

# Recibir ruta de imagen
if len(sys.argv) < 2:
    print("ERROR: Ruta de imagen no especificada.")
    sys.exit(1)

img_path = sys.argv[1]
img = cv2.imread(img_path)

if img is None:
    print("ERROR: No se pudo cargar la imagen.")
    sys.exit(1)

result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
dominant_emotion = result[0]['dominant_emotion']
mapped_emotion = map_emotion(dominant_emotion)

print(f"Emocion detectada: {mapped_emotion}")
