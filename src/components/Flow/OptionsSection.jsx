import React from "react";

const OptionsSection = ({ options, onOptionSelect, loading }) => {
  if (!options || options.length === 0) {
    return null;
  }

  return (
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
  );
};

export default OptionsSection;
