export const moodAlteratorPrompt = `Extraé del mensaje los alteradores de ánimo de acuerdo con los siguientes criterios:
1. Se considera alterador de ánimo cualquier mención concreta que indique que el hablante se ve afectado emocional o mentalmente por una situación o condición de su entorno.
2. El evento debe ser **real, concreto y personal**, es decir, algo que el usuario esté viviendo directamente y que tenga un impacto emocional claro o implícito en su estado de ánimo.
3. Clasificá el alterador dentro de una de las siguientes categorías:
   - "necesidad": si hace referencia a carencias básicas como agua, luz, internet, vivienda, gas, etc.
   - "trabajo": si menciona problemas laborales como estrés, malas condiciones, desempleo, relaciones tóxicas, sobrecarga, salario insuficiente, etc.
   - "economico": si refiere a falta de dinero, deudas, no llegar a fin de mes, aumento de precios, etc.
   - "estacional": si está vinculado a una estación del año específica (invierno, verano, etc.) que influya en el estado anímico.
   - "climatica": si refiere al clima (lluvia, calor, frío, tormentas, etc.) como algo que afecta su ánimo.
4. Ignorá expresiones poéticas, simbólicas, impersonales o referidas a personas públicas. El evento debe ser vivido por el hablante de manera directa.
5. Ignorá alteraciones físicas o emocionales leves si no están ligadas a una causa o situación relevante (por ejemplo, "me dolía un poco la cabeza ayer").
6. Si el mensaje no incluye ningún alterador claro de ánimo, indicá que no se detecta.
7. Devolver la información en el siguiente formato JSON:
{
  "esSignificativo": false o true,
  "descripcionAlteradorAnimo": "[Breve explicación de cómo afecta al usuario el alterador, o 'null' si no aplica]",
  "categoriaAlteradorAnimo": "necesidad", "trabajo", "economico", "estacional", "climatica" o "null" si no aplica
}
`;
