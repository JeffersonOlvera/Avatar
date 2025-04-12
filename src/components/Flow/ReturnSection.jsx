import React, { useEffect, useRef } from "react";

const ReturnSection = ({ timeout, onReturn }) => {
  const timerRef = useRef(null);

  useEffect(() => {
    // Configurar timer para retorno automático
    timerRef.current = setTimeout(onReturn, timeout);

    // Limpiar timer al desmontar
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeout, onReturn]);

  return (
    <div className="return-section">
      <p className="return-message">
        Volviendo al inicio en {timeout / 1000} segundos...
      </p>
      <button className="return-button" onClick={onReturn}>
        Volver al inicio
      </button>
    </div>
  );
};

export default ReturnSection;
