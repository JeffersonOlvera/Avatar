import { useCallback } from "react";

const useInputValidation = (flowConfig, setError) => {
  // Validar entrada del usuario contra reglas definidas en el flujo
  const validateInput = useCallback(
    (input, metadata = {}) => {
      const { validation } = flowConfig || {};

      if (!validation) return true;

      // Validación de campo requerido
      if (validation.required && !input.trim()) {
        setError("Este campo es obligatorio");
        return false;
      }

      // Si es un input de documento, validar según el tipo seleccionado
      if (
        flowConfig.isDocumentInput &&
        metadata.documentType &&
        validation.patterns
      ) {
        const patternForType = validation.patterns[metadata.documentType];

        if (patternForType) {
          const regex = new RegExp(patternForType);
          if (!regex.test(input)) {
            setError(
              `Error: El formato de ${metadata.documentType} no es válido`
            );
            return false;
          }
        }
      }
      // Validación general de patrón
      else if (validation.pattern) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(input)) {
          setError("Error: El formato ingresado no es válido");
          return false;
        }
      }

      return true;
    },
    [flowConfig, setError]
  );

  return { validateInput };
};

export default useInputValidation;
