import React, { useState, useEffect } from "react";
import useInputValidation from "../../hooks/useInputValidation";

const DOCUMENT_TYPES = [
  { value: "Cedula", label: "Cédula" },
  { value: "RUC", label: "RUC" },
  { value: "Pasaporte", label: "Pasaporte" },
];

const DocumentInput = ({
  flowConfig,
  onSubmit,
  loading,
  error,
  setError,
  deviceType = "desktop",
}) => {
  const [userInput, setUserInput] = useState("");
  const [documentType, setDocumentType] = useState("Cedula");

  // Usar hook personalizado para validación
  const { validateInput } = useInputValidation(flowConfig, setError);

  // Resetear estados cuando cambia el flujo
  useEffect(() => {
    setUserInput("");
    setDocumentType("Cedula");
  }, [flowConfig]);

  // Manejar cambio en el input
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (error) setError(null);
  };

  // Manejar cambio en el selector de tipo de documento
  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
    if (error) setError(null);
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    const isValid = validateInput(userInput, { documentType });

    if (isValid) {
      onSubmit(userInput, { documentType });
      setUserInput("");
    }
  };

  // Clases condicionales según el dispositivo
  const inputGroupClasses = `input-group ${deviceType}`;
  const selectClasses = `document-type-select ${deviceType}`;

  return (
    <div className={inputGroupClasses}>
      <select
        value={documentType}
        onChange={handleDocumentTypeChange}
        className={selectClasses}
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
        className={error ? "error-input" : ""}
        placeholder={
          flowConfig.placeholder || `Ingrese su ${documentType.toLowerCase()}`
        }
        disabled={loading}
      />

      <button
        className={`input-button ${deviceType}`}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </div>
  );
};

export default DocumentInput;
