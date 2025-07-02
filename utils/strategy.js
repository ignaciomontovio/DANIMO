// utils/strategy.js

/**
 * Ejecuta la primera estrategia cuya condición principal y secundaria (lazy) se cumplan.
 * Cada estrategia es un objeto con las propiedades:
 *   - condition: función que retorna booleano (sincrónica)
 *   - lazyCondition: función async (opcional, retorna booleano)
 *   - action: función async que retorna el resultado
 *
 * @param {Array} strategies - Lista de estrategias
 * @returns {Promise<any>} - El resultado de la acción ejecutada, o undefined si ninguna aplica
 */
async function runStrategies(strategies) {
  for (const strategy of strategies) {
    // Evalúa la condición principal (sincrónica)
    if (strategy.condition()) {
      // Si hay lazyCondition, evalúa solo si la principal es true
      if (strategy.lazyCondition) {
        const lazyResult = await strategy.lazyCondition();
        if (lazyResult) {
          return await strategy.action();
        }
      } else {
        return await strategy.action();
      }
      break;
    }
  }
}

module.exports = { runStrategies };
