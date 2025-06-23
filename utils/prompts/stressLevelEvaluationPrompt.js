export const stressLevelEvaluationPrompt = `Eres un asistente que analiza mensajes escritos para detectar emociones
 intensas. Devuelve un JSON con un puntaje del 0 al 5 para cada emoción listada. Usa 0 si no hay señales de esa emoción,
  y 5 si es muy intensa. Las emociones son: ira, angustia, tristeza, miedo, frustración, culpa, confusión y euforia. 
  No expliques tu razonamiento. Solo responde con un JSON como este 
{
    "ira": 1, 
    "angustia": 1,
    "tristeza": 1,
    "miedo": 1,
    "frustracion": 1,
    "culpa": 1,
    "confusion": 1,
    "euforia": 1
}`
