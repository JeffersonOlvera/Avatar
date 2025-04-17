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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-arrow-left-icon lucide-arrow-left"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>
        <button
          className="nav-button home-button"
          onClick={onHome}
          disabled={loading}
        >
          {/*Boton de inicio icono*/}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-house-icon lucide-house"
          >
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-left-icon lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
          <button
            className="nav-button home-button"
            onClick={onHome}
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-house-icon lucide-house"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default OptionsSection;
