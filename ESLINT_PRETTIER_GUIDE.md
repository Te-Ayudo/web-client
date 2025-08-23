# ESLint y Prettier - Configuración del Proyecto

Este proyecto está configurado con ESLint y Prettier para mantener la calidad y consistencia del código.

## 🛠️ Herramientas Configuradas

### ESLint
- **Propósito**: Identifica y reporta patrones problemáticos en el código JavaScript/React
- **Beneficios**: Previene errores comunes, mejora la calidad del código y mantiene consistencia

### Prettier
- **Propósito**: Formateador de código automático
- **Beneficios**: Formato consistente, ahorra tiempo en revisiones de código

## 📋 Scripts Disponibles

```bash
# Ejecutar linting y arreglar errores automáticamente
npm run lint

# Solo verificar errores sin arreglar
npm run lint:check

# Formatear código con Prettier
npm run format

# Verificar formato sin cambiar archivos
npm run format:check

# Ejecutar ambas verificaciones (ideal para CI/CD)
npm run code-quality
```

## ⚙️ Configuración Automática

### Pre-commit Hooks
El proyecto utiliza Husky y lint-staged para ejecutar automáticamente:
- ESLint con auto-fix
- Prettier para formatear código

Esto ocurre automáticamente antes de cada commit.

### VS Code
Si usas VS Code, instala las siguientes extensiones recomendadas:
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense

La configuración automática está en `.vscode/settings.json` y `.vscode/extensions.json`.

## 🔧 Configuración Manual

### ESLint
Configuración en `.eslintrc.json`:
- Reglas estrictas para React Hooks
- Importaciones ordenadas
- Accesibilidad (a11y) warnings
- Integración con Prettier

### Prettier
Configuración en `.prettierrc`:
- Semi-colons habilitados
- Comillas dobles
- Ancho máximo de línea: 120 caracteres
- Trailing commas en ES5

## 🚀 Uso en el Flujo de Trabajo

### Para Desarrolladores
1. **Antes de hacer commit**: Los hooks se ejecutan automáticamente
2. **Durante desarrollo**: Usa `npm run lint` para verificar errores
3. **Para formatear**: `npm run format` o guarda archivos en VS Code

### Para CI/CD
Usa `npm run code-quality` en tu pipeline para verificar calidad del código.

### Ignorar Archivos
- `.eslintignore`: Archivos que ESLint no debe analizar
- `.prettierignore`: Archivos que Prettier no debe formatear

## 📝 Reglas Importantes

### ESLint
- `no-console`: Warning (permite console.log en desarrollo)
- `no-unused-vars`: Warning (variables no utilizadas)
- `react-hooks/exhaustive-deps`: Warning (dependencias de hooks)
- `import/order`: Error (orden de importaciones)

### Prettier
- Formato automático al guardar archivos
- Integración con ESLint para evitar conflictos

## 🐛 Solución de Problemas

### Error: "ESLint configuration is invalid"
1. Verifica que todas las dependencias estén instaladas
2. Ejecuta `npm install` para instalar dependencias faltantes

### Error: "Prettier not found"
1. Instala la extensión de Prettier en VS Code
2. Verifica que Prettier esté en devDependencies

### Conflictos entre ESLint y Prettier
La configuración actual resuelve automáticamente los conflictos mediante `eslint-config-prettier`.

## 📊 Beneficios para la Empresa

### Calidad de Código
- ✅ Prevención de errores comunes
- ✅ Código más legible y mantenible
- ✅ Estándares consistentes en todo el equipo

### Productividad
- ✅ Menos tiempo en revisiones de código
- ✅ Formato automático
- ✅ Detección temprana de problemas

### Mantenimiento
- ✅ Código más fácil de mantener
- ✅ Menos bugs en producción
- ✅ Onboarding más rápido para nuevos desarrolladores
