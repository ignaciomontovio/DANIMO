export const suicideRiskPrompt = 'Eres un modelo especializado en la detección de riesgo de suicidio en textos escritos por personas. ' +
    'Tu tarea es analizar el siguiente texto y determinar si muestra señales claras de ideación suicida, desesperanza extrema, intenciones autolesivas ' +
    'o cualquier otro factor de riesgo que indique una posible conducta suicida.Analiza cuidadosamente el contenido, tono y contexto emocional. ' +
    'Solo deberás indicar {"suicideRiskDetected": true} si el riesgo es evidente, significativo y preocupante. Si no hay señales claras de riesgo, ' +
    'deberás indicar {"suicideRiskDetected": false}.Responde exclusivamente con un JSON con esta estructura.';

export const crisisRiskDefaultResponse = 'Quiero contarte que, si bien estoy acá para acompañarte, no estoy capacitado/a para intervenir en situaciones de riesgo de suicidio, autolesiones o de hacer daño a otras personas.\n' +
    'Si estás pasando por un momento difícil, pensando en lastimarte o en lastimar a otros, es fundamental que busques ayuda inmediata y especializada. En Argentina, podés comunicarte gratis y de forma confidencial con:\n' +
    '📞 Línea 135 (Línea de Atención al Suicida) (CABA y Gran Buenos Aires)\n' +
    '📞 0800 345 1435 (Línea de Atención al Suicida) (desde cualquier punto del país)\n' +
    '📞 911 (emergencias inmediatas)\n' +
    '📞 107 (emergencias médicas)\n' +
    'También podés acercarte al hospital, centro de salud o comisaría más cercana.\n' +
    'No estás solo/a. Tu seguridad y la de los demás es prioritaria. Hay personas dispuestas a ayudarte de manera urgente y segura. 💚';

export const suicideRiskDefaultResponse = 'Quiero contarte que, si bien estoy acá para acompañarte, no estoy capacitado/a para intervenir en situaciones de riesgo de suicidio o autolesiones.\n' +
    'Si estás pasando por un momento difícil, te recomiendo que te contactes con profesionales que puedan ayudarte de forma inmediata y especializada. En Argentina, podés comunicarte gratis y de forma confidencial con:\n' +
    '📞 Línea 135 (desde CABA y Gran Buenos Aires)\n' +
    '📞 0800 345 1435 (desde cualquier punto del país)\n' +
    'Están disponibles las 24 horas, todos los días del año.\n' +
    'También podés acercarte al hospital o centro de salud más cercano, o llamar al 107 o 911 si es una emergencia.\n' +
    'No estás solo/a. Hay personas dispuestas a ayudarte. 💚'