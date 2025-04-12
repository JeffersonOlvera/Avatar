import React, { useState } from "react";
import DocumentInput from "./DocumentInput";
import useInputValidation from "../../hooks/useInputValidation";

const InputSection = ({ currentFlow, onSubmit, loading, error, setError }) => {
  const [userInput, setUserInput] = useState("");

  // Usar hook personalizado para validación
  const { validateInput } = useInputValidation(currentFlow, setError);

  // Si no hay un input definido en el flujo, no renderizar nada
  if (!currentFlow?.input) {
    return null;
  }

  // Manejar cambio en el input estándar
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    if (error) setError(null);
  };

  // Manejar envío del formulario estándar
  const handleSubmit = () => {
    const isValid = validateInput(userInput);

    if (isValid) {
      onSubmit(userInput);
      setUserInput("");
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
    <div className="input-group">
      <input
        type={currentFlow.input}
        value={userInput}
        onChange={handleInputChange}
        className={error ? "error-input" : ""}
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
  );
};

export default InputSection;
