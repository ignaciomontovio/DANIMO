export const importantDatePrompt = `Extraé del mensaje las fechas significativas de acuerdo con los siguientes criterios:
1. Se consideran momentos significativos únicamente aquellas menciones que impliquen una carga emocional relevante y 
estén asociadas a un evento **real, concreto y personal vivido por el hablante**. No deben incluirse eventos simbólicos, 
metafóricos, históricos, impersonales ni relacionados con personas públicas o ajenas al hablante
2. Si el mensaje incluye una fecha explícita, debe registrarse tal como aparece (en formato ISO AAAA-MM-DD).
3. Si el mensaje usa referencias temporales relativas como “hoy”, “ayer”, “hace tres días” o “la semana pasada”, convertilas 
a fechas absolutas (en formato ISO AAAA-MM-DD).
4. **Ignorá expresiones poéticas, simbólicas, irónicas, históricas o impersonales**, como por ejemplo:
   - “hoy murió el arte”
   - “ayer se acabó la esperanza”
   - “el lunes desapareció la magia”
   - "el 11 de septiembre murió mucha gente"
   - "ayer murió Maradona y me puse muy mal"
   Estas frases no deben ser consideradas fechas significativas ni eventos personales.
5. Devolver la información en el siguiente formato:
{
  "esSignificativo": false o true,
  "fechaImportante": "['null' o una fecha en formato ISO: AAAA-MM-DD si el mensaje incluye una fecha clave]",
  "descripcionFechaImportante": "[Breve explicación de por qué esa fecha es significativa, o 'null' si no aplica]",
  "categoriaFechaImportante": 'fallecimiento', 'mudanza', 'salud', 'nacimiento', 'aborto', 'necesidades primarias', 'trabajo', 'educación', 'clima' o 'ninguna' en caso de que no haya fecha importante
}`

export const importantDatePromptFiltrado = `Extraé del mensaje las fechas significativas de acuerdo con los siguientes criterios:
1. Se consideran momentos significativos únicamente aquellas menciones que impliquen una carga emocional relevante y 
estén asociadas a un evento **real, concreto y personal vivido por el hablante**. No deben incluirse eventos simbólicos, 
metafóricos, históricos, impersonales ni relacionados con personas públicas o ajenas al hablante
2. Si el mensaje incluye una fecha explícita, debe registrarse tal como aparece (en formato ISO AAAA-MM-DD).
3. Si el mensaje usa referencias temporales relativas como “hoy”, “ayer”, “hace tres días” o “la semana pasada”, convertilas 
a fechas absolutas (en formato ISO AAAA-MM-DD).
4. **Ignorá expresiones poéticas, simbólicas, irónicas, históricas o impersonales**, como por ejemplo:
   - “hoy murió el arte”
   - “ayer se acabó la esperanza”
   - “el lunes desapareció la magia”
   - "el 11 de septiembre murió mucha gente"
   - "ayer murió Maradona y me puse muy mal"
   Estas frases no deben ser consideradas fechas significativas ni eventos personales.
5. **No consideres eventos físicos o emocionales leves, pasajeros o comunes como fechas significativas**. Por ejemplo:
  - "hoy me duele la cabeza"
  - "ayer tuve un poco de fiebre"
  - "esta semana estuve cansado"
  - "me sentí algo mal el martes"
  Este tipo de frases no deben ser tomadas como eventos importantes, a menos que indiquen una situación grave, crónica o con alto impacto emocional.
6. No consideres eventos positivos como fechas importantes. Solo se deben considerar si afectan al usuario de forma negativa. 
7. Devolver la información en el siguiente formato:
{
  "esSignificativo": false o true,
  "fechaImportante": "['null' o una fecha en formato ISO: AAAA-MM-DD si el mensaje incluye una fecha clave]",
  "descripcionFechaImportante": "[Breve explicación de por qué esa fecha es significativa, o 'null' si no aplica]",
  "categoriaFechaImportante": 'fallecimiento', 'mudanza', 'salud', 'nacimiento', 'aborto', 'necesidades primarias', 'trabajo', 'educación', 'clima' o 'ninguna' en caso de que no haya fecha importante
}`