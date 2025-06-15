export const importantDatePrompt = `Extraé del mensaje las fechas significativas de acuerdo con los siguientes criterios:
1. Se consideran momentos significativos aquellas menciones que impliquen una carga emocional relevante
2. Si el mensaje incluye una fecha explícita, debe registrarse tal como aparece (en formato ISO AAAA-MM-DD)
3. Si el mensaje usa referencias temporales relativas como “hoy”, “ayer”, “hace tres días” o “la semana pasada”, convertilas a fechas absolutas
4. Devolver la información en el siguiente formato:
{
"fechaImportante": "[null o una fecha en formato ISO: AAAA-MM-DD si el mensaje incluye una fecha clave]", 
"descripcionFechaImportante": "[Breve explicación de por qué esa fecha es significativa, o null si no aplica]", 
"categoriaFechaImportante": ['fallecimiento', 'mudanza', 'salud', 'nacimiento/aborto', 'necesidades básicas', 'trabajo/educación', 'clima']
}`