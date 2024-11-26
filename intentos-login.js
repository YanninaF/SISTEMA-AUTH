const intentosFallidos = {}; // Almacena los intentos de login
const MAX_INTENTOS = 5;    // Número máximo de intentos fallidos
const TIEMPO_BLOQUEO = 15 * 60 * 1000; // Tiempo de bloqueo (15 minutos)

// Función para verificar el estado de los intentos
function verificarIntentosInicioSesion(email) {
  const ahora = Date.now();
  const intentos = intentosFallidos[email];

  // Si no hay intentos fallidos, permitir el acceso
  if (!intentos) {
    return { bloqueado: false };
  }

  // Si el usuario está bloqueado, verificar si el tiempo de bloqueo ha pasado
  if (intentos.cuenta >= MAX_INTENTOS) {
    if (ahora - intentos.ultimoIntento < TIEMPO_BLOQUEO) {
      return { bloqueado: true, tiempoRestante: TIEMPO_BLOQUEO - (ahora - intentos.ultimoIntento) };
    }
    
    // Restablecer contador de intentos después del tiempo de bloqueo
    intentosFallidos[email] = { cuenta: 0, ultimoIntento: ahora };
  }

  return { bloqueado: false };
}

// Función para incrementar los intentos fallidos
function incrementarIntentoFallido(email) {
  const intentos = intentosFallidos[email] || { cuenta: 0, ultimoIntento: Date.now() };
  intentos.cuenta += 1;
  intentos.ultimoIntento = Date.now();
  intentosFallidos[email] = intentos;
}

// Función para restablecer los intentos después de un inicio de sesión exitoso
function restablecerIntentos(email) {
  intentosFallidos[email] = { cuenta: 0, ultimoIntento: Date.now() };
}

export { verificarIntentosInicioSesion, incrementarIntentoFallido, restablecerIntentos };
