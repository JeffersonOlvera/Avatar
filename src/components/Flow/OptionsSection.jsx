import React from "react";

const OptionsSection = ({
  options,
  onOptionSelect,
  loading,
  deviceType = "desktop",
}) => {
  if (!options || options.length === 0) {
    return null;
  }

  // Clases condicionales según el dispositivo
  const optionsClasses = `options ${deviceType}`;

  // Determinar clases para botones basado en la cantidad y el dispositivo
  const getButtonClasses = () => {
    let classes = "glass-button";

    // Añadir clase según dispositivo
    if (deviceType) {
      classes += ` ${deviceType}`;
    }

    // Añadir clase según la cantidad de botones
    if (options.length === 1) {
      classes += " single";
    } else if (options.length === 2) {
      classes += " dual";
    } else if (options.length >= 5) {
      classes += " many";
    }

    return classes;
  };

  return (
    <div className={optionsClasses}>
      {options.map((option, index) => (
        <button
          key={index}
          className={getButtonClasses()}
          onClick={() => onOptionSelect(option)}
          disabled={loading}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default OptionsSection;
