import React from "react";

const OptionsSection = ({
  options,
  onOptionSelect,
  loading,
  onBack,
  onHome,
  showNavButtons = true,
  apiResponse,
}) => {
  // Si hay respuesta de API con turno, no mostramos los botones de navegación
  // porque en esta pantalla usa el ReturnSection original
  const hasTurnoResponse =
    apiResponse && apiResponse.apiResponse && apiResponse.apiResponse.Turno;

  if (!options || options.length === 0) {
    // Si estamos en la pantalla de turno, no mostrar los botones de navegación
    if (hasTurnoResponse || !showNavButtons) {
      return null;
    }

    return (
      <div className="navigation-buttons">
        <button
          className="nav-button back-button"
          onClick={onBack}
          disabled={loading}
        >
          ← Atrás
        </button>
        <button
          className="nav-button home-button"
          onClick={onHome}
          disabled={loading}
        >
          🏠 Inicio
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="options">
        {options.map((option, index) => (
          <button
            key={index}
            className="glass-button"
            onClick={() => onOptionSelect(option)}
            disabled={loading}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Solo mostrar los botones de navegación si no estamos en la pantalla de turno */}
      {!hasTurnoResponse && showNavButtons && (
        <div className="navigation-buttons">
          <button
            className="nav-button back-button"
            onClick={onBack}
            disabled={loading}
          >
            ← Atrás
          </button>
          <button
            className="nav-button home-button"
            onClick={onHome}
            disabled={loading}
          >
            🏠 Inicio
          </button>
        </div>
      )}
    </>
  );
};

export default OptionsSection;
