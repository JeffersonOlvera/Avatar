// src/components/Flow/DocumentInput.jsx
import React, { useState, useEffect } from "react";
import useAudioStore from "../../store/TalkingStore";

const DOCUMENT_TYPES = [
  { value: "Cedula", label: "Cédula" },
  { value: "RUC", label: "RUC" },
  { value: "Pasaporte", label: "Pasaporte" },
];

// Objeto con las expresiones regulares y mensajes de error por tipo de documento
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

const DocumentInput = ({ flowConfig, onSubmit, loading, error, setError }) => {
  const [userInput, setUserInput] = useState("");
  const [documentType, setDocumentType] = useState("Cedula");
  const [validationError, setValidationError] = useState(null);
  const { isTalking } = useAudioStore();

  // Audio para el error de validación
  const ERROR_AUDIO = "/audio/MEGAN-CI-INVALID.mp3"; // Ajusta esta ruta según tu estructura

  // Resetear estados cuando cambia el flujo
  useEffect(() => {
    setUserInput("");
    setDocumentType("Cedula");
    setValidationError(null);
  }, [flowConfig]);

  // Manejar cambio en el input
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (validationError) setValidationError(null);
    if (error) setError(null);
  };

  // Manejar cambio en el selector de tipo de documento
  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
    if (validationError) setValidationError(null);
    if (error) setError(null);
  };

  // Validar el documento según su tipo
  const validateDocument = (input, type) => {
    if (!input.trim()) {
      setValidationError("Este campo es obligatorio");
      return false;
    }

    const validation = DOCUMENT_VALIDATIONS[type];
    if (validation) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(input)) {
        setValidationError(validation.errorMessage);
        return false;
      }
    }

    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    if (loading) return;

    const isValid = validateDocument(userInput, documentType);

    if (isValid) {
      onSubmit(userInput, { documentType });
      setUserInput("");
      setValidationError(null);
    }
  };

  // Manejar envío con Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="document-input-container">
      <div className="input-group">
        <select
          value={documentType}
          onChange={handleDocumentTypeChange}
          className="document-type-select"
          disabled={loading}
        >
          {DOCUMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <input
          type={flowConfig.input || "text"}
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={validationError ? "error-input" : ""}
          placeholder={
            flowConfig.placeholder || `Ingrese su ${documentType.toLowerCase()}`
          }
          disabled={loading}
        />

        <button
          className="input-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>

      {validationError && (
        <div className="validation-error">
          <p>{validationError}</p>
          {/* Reproducir audio de error si es necesario */}
          {!isTalking && <audio src={ERROR_AUDIO} autoPlay />}
        </div>
      )}
    </div>
  );
};

export default DocumentInput;
