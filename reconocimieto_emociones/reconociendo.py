import cv2
from deepface import DeepFace
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '3'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # 0 = mostrar todo, 1 = ocultar INFO, 2 = también WARNING, 3 = también ERROR

# Mapeo de emociones de DeepFace a las 8 emociones deseadas
def map_emotion(emotion):
    mapping = {
        "happy": "alegría",
        "sad": "tristeza",
        "fear": "miedo",
        "angry": "ira",
        "surprise": "sorpresa",
        "neutral": "neutral", 
        "disgust": "aversión",
        "disgusted": "aversión",
    }
    return mapping.get(emotion, "neutral")  # Si no encuentra, asigna "neutral" como por defecto

# Cargar imagen
img_path = "cara2.jpg" 
img = cv2.imread(img_path)

# Analizar emoción
result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)

# Extraer emoción dominante
dominant_emotion = result[0]['dominant_emotion']
mapped_emotion = map_emotion(dominant_emotion)

print("RESULTADO COMPLETO: ")
print(result)

print(f"Emoción detectada: {mapped_emotion} (original: {dominant_emotion})")
