// src/hooks/useInputValidation.js
import { useCallback } from "react";

// Constantes de validación
const DOCUMENT_VALIDATIONS = {
  Cedula: {
    pattern: "^[0-9]{10}$",
    errorMessage: "La cédula debe contener exactamente 10 dígitos numéricos.",
  },
  RUC: {
    pattern: "^[0-9]{13}$",
    errorMessage: "El RUC debe contener exactamente 13 dígitos numéricos.",
  },
  Pasaporte: {
    pattern: "^[A-Za-z0-9]{6,12}$",
    errorMessage:
      "El pasaporte debe contener entre 6 y 12 caracteres alfanuméricos.",
  },
};

const PHONE_VALIDATION = {
  pattern: "^[0-9]{10}$",
  errorMessage: "El número debe contener exactamente 10 dígitos.",
};

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
      if (flowConfig.isDocumentInput && metadata.documentType) {
        const documentType = metadata.documentType;

        if (DOCUMENT_VALIDATIONS[documentType]) {
          const regex = new RegExp(DOCUMENT_VALIDATIONS[documentType].pattern);
          if (!regex.test(input)) {
            setError(DOCUMENT_VALIDATIONS[documentType].errorMessage);
            return false;
          }
        }
      }
      // Validación para números de teléfono
      else if (
        flowConfig.key === "celular" ||
        flowConfig.key === "notification_number"
      ) {
        const regex = new RegExp(PHONE_VALIDATION.pattern);
        if (!regex.test(input)) {
          setError(PHONE_VALIDATION.errorMessage);
          return false;
        }
      }
      // Validación general de patrón
      else if (validation.pattern) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(input)) {
          setError("El formato ingresado no es válido");
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
