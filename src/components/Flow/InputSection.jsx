// src/components/Flow/InputSection.jsx
import React, { useState } from "react";
import DocumentInput from "./DocumentInput";
import useInputValidation from "../../hooks/useInputValidation";
import useAudioStore from "../../store/TalkingStore";

const InputSection = ({ currentFlow, onSubmit, loading, error, setError }) => {
  const [userInput, setUserInput] = useState("");
  const [validationError, setValidationError] = useState(null);
  const { isTalking } = useAudioStore();

  // Usar hook personalizado para validación
  const { validateInput } = useInputValidation(currentFlow, setValidationError);

  // Si no hay un input definido en el flujo, no renderizar nada
  if (!currentFlow?.input) {
    return null;
  }

  // Manejar cambio en el input estándar
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (validationError) setValidationError(null);
    if (error) setError(null);
  };

  // Manejar envío con Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  // Manejar envío del formulario estándar
  const handleSubmit = () => {
    if (loading) return;

    const isValid = validateInput(userInput);

    if (isValid) {
      onSubmit(userInput);
      setUserInput("");
      setValidationError(null);
    }
  };

  // Renderizado condicional basado en el tipo de entrada
  if (currentFlow.isDocumentInput) {
    return (
      <DocumentInput
        flowConfig={currentFlow}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        setError={setError}
      />
    );
  }

  // Input estándar para otros casos
  return (
    <div className="input-container">
      <div className="input-group">
        <input
          type={currentFlow.input}
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={validationError ? "error-input" : ""}
          placeholder={currentFlow.placeholder || ""}
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
          {!isTalking && currentFlow.errorAudio && (
            <audio src={currentFlow.errorAudio} autoPlay />
          )}
        </div>
      )}
    </div>
  );
};

export default InputSection;
