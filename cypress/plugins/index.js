module.exports = (on, config) => {
  // Manejar excepciones no capturadas (JS errors)
  on("uncaught:exception", (err, runnable) => {
    // Ignorar errores específicos de tu app que sabes que son benignos
    if (
      err.message.includes("Cannot read properties of null") &&
      (err.message.includes("first_name") || err.message.includes("directions"))
    ) {
      console.warn("⚠️ Ignorando error de frontend esperado:", err.message);
      return false; // Evita que Cypress falle
    }
    // Para cualquier otro error, deja que Cypress lo reporte
    return true;
  });

  // Opcional: Si necesitas otras configuraciones de plugins aquí
  return config;
};
