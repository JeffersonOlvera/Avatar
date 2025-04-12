import { useEffect, useRef } from "react";

const useInactivityTimer = (timeout, callback) => {
  const timerRef = useRef(null);

  // Función para reiniciar el timer
  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      console.log(`Han pasado ${timeout / 1000} seg. Se reinicia`);
      callback();
    }, timeout);
  };

  useEffect(() => {
    // Iniciar el timer al montar el componente
    resetTimer();

    // Registrar eventos de actividad del usuario
    const handleUserActivity = resetTimer;

    // Añadir event listeners
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);
    window.addEventListener("mousemove", handleUserActivity);

    // Limpiar al desmontar
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
    };
  }, [timeout, callback]);

  return { resetTimer };
};

export default useInactivityTimer;
