import React, { useEffect, useRef, useState } from "react";

const ReturnSection = ({ timeout, onReturn, deviceType = "desktop" }) => {
  const timerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(Math.floor(timeout / 1000));

  useEffect(() => {
    // Configurar timer para actualizar la cuenta regresiva
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Configurar timer para retorno automático
    timerRef.current = setTimeout(onReturn, timeout);

    // Limpiar timers al desmontar
    return () => {
      clearInterval(countdownTimer);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeout, onReturn]);

  // Clases condicionales según el dispositivo
  const sectionClasses = `return-section ${deviceType}`;
  const buttonClasses = `return-button ${deviceType}`;

  return (
    <div className={sectionClasses}>
      <p className="return-message">
        Volviendo al inicio en {timeLeft} segundos...
      </p>
      <button className={buttonClasses} onClick={onReturn}>
        Volver al inicio
      </button>
    </div>
  );
};

export default ReturnSection;
