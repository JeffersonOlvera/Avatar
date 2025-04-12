import React, { useState, useEffect, useRef } from "react";
import ConversationFlowHandler from "../../model/ConversationFlowHandler";
import ApiService from "../../services/ApiService";
import flowData from "../../flows";
import useAudioStore from "../../store/TalkingStore";
import "./Flow.scss";
import dotenv from "dotenv";

dotenv.config();

const API_ENDPOINT = import.meta.env.VITE_URL_CONSULTAR;
const RESET_TIMEOUT = 15000;
const INACTIVITY_TIMEOUT = 60000;

const ConversationFlow = ({ initialFlow, onReset }) => {
  const [currentFlow, setCurrentFlow] = useState(initialFlow || flowData);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [respuesta, setRespuesta] = useState(null);

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const apiService = useRef(new ApiService(API_ENDPOINT));

  // Crear flowHandler memoizado
  const flowHandlerRef = useRef(
    new ConversationFlowHandler(initialFlow || flowData, apiService.current)
  );

  // Acceder al store de audio
  const { setTalking, stopTalking } = useAudioStore();

  // Función para reiniciar el timer de inactividad
  const resetInactivityTimer = () => {
    // Limpiar el timer existente
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Establecer un nuevo timer
    inactivityTimerRef.current = setTimeout(() => {
      console.log(`Han pasado ${INACTIVITY_TIMEOUT / 1000} seg. Se reinicia`);
      returnToInitialFlow();
    }, INACTIVITY_TIMEOUT);
  };

  // Iniciar el timer de inactividad al montar el componente
  useEffect(() => {
    resetInactivityTimer();

    // Limpiar el timer al desmontar
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  // Registrar interacciones del usuario para reiniciar el timer de inactividad
  useEffect(() => {
    // Función para manejar cualquier interacción del usuario
    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    // Añadir event listeners para detectar interacción
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity);
    window.addEventListener("mousemove", handleUserActivity);

    // Limpiar event listeners al desmontar
    return () => {
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("mousemove", handleUserActivity);
    };
  }, []);

  // Registrar cambios en el flujo para el logging
  useEffect(() => {
    console.log("Current answers state:", flowHandlerRef.current.answers);

    // Reiniciar el timer de inactividad cuando el flujo cambia
    resetInactivityTimer();
  }, [currentFlow]);

  // Función para reproducir audio
  const playAudio = async (audioPath) => {
    if (!audioPath || !audioRef.current) return;

    try {
      // Resetear eventos del elemento de audio
      audioRef.current.onplay = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      // Actualizar fuente si es diferente
      if (audioRef.current.src !== audioPath) {
        audioRef.current.src = audioPath;
        audioRef.current.load();
      }

      // Configurar manejadores de eventos
      audioRef.current.onplay = () => {
        setTalking();
        console.log("Audio iniciado:", audioPath);
      };

      audioRef.current.onended = () => {
        stopTalking();
        console.log("Audio finalizado");
      };

      audioRef.current.onerror = (e) => {
        console.error("Error al reproducir audio:", e);
        stopTalking();
      };

      // Reproducir audio
      await audioRef.current.play();
    } catch (err) {
      console.error("Error al iniciar reproducción:", err);
      stopTalking();
    }
  };

  // Volver al flujo inicial
  const returnToInitialFlow = () => {
    // Limpiar timer de fin de flujo si existe
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Resetear estado de respuestas
    flowHandlerRef.current.answers = {};
    console.log("Answers reseteadas:", flowHandlerRef.current.answers);

    // Llamar a onReset o usar comportamiento por defecto
    if (onReset) {
      onReset();
    } else {
      setCurrentFlow(flowData);
      setUserInput("");
      setError(null);
    }

    // Reiniciar el timer de inactividad
    resetInactivityTimer();
  };

  // Configurar timer para nodos finales
  useEffect(() => {
    // Limpiar timer existente
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Configurar nuevo timer para nodos finales
    if (currentFlow?.end) {
      timerRef.current = setTimeout(returnToInitialFlow, RESET_TIMEOUT);
    }

    // Limpiar al desmontar
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentFlow]);

  // Reproducir audio cuando cambia el flujo
  useEffect(() => {
    if (currentFlow?.audio) {
      playAudio(currentFlow.audio);
    }
  }, [currentFlow]);

  // Navegar al siguiente flujo usando string de ruta o referencia directa
  const navigateToFlow = (nextFlowPath) => {
    if (!nextFlowPath) return;

    // Si nextFlow es una referencia string, resolverla desde flowData
    if (typeof nextFlowPath === "string") {
      const pathParts = nextFlowPath.split(".");
      let targetFlow = flowData;

      for (const part of pathParts) {
        if (targetFlow?.[part]) {
          targetFlow = targetFlow[part];
        } else {
          console.error(`Flujo "${nextFlowPath}" no encontrado`);
          targetFlow = {};
          break;
        }
      }

      setCurrentFlow(targetFlow);
    } else {
      // Objeto de flujo directo
      setCurrentFlow(nextFlowPath);
    }
  };

  // Guardar respuesta con clave y valor dados
  const saveAnswer = (key, value) => {
    if (!key || value === undefined) return;

    flowHandlerRef.current.answers[key] = value;
    // console.log(`Respuesta actualizada - ${key}:`, {
    //   ...flowHandlerRef.current.answers,
    // });
  };

  // Manejar selección de opción
  const handleOptionSelect = (option) => {
    // Reiniciar timer de inactividad
    resetInactivityTimer();

    // Guardar respuesta si se proporciona clave y valor
    if (option.key && option.value !== undefined) {
      saveAnswer(option.key, option.value);
    }

    // Reproducir audio de opción si está disponible
    if (option.audio) {
      playAudio(option.audio);
    }

    // Enviar a API si se solicita
    if (option.send) {
      sendToApi();
    }

    // Navegar al siguiente flujo o manejar estado final
    if (option.next) {
      navigateToFlow(option.next);
    } else if (option.end) {
      console.log("Flujo completado");
      console.log(
        "Estado final de respuestas:",
        flowHandlerRef.current.answers
      );
    }
  };

  // Manejar cambios de input
  const handleInputChange = (e) => {
    // Reiniciar timer de inactividad
    resetInactivityTimer();

    setUserInput(e.target.value);
    setError(null); // Limpiar errores al cambiar el input
  };

  // Validar entrada del usuario contra reglas
  const validateInput = () => {
    const { validation } = currentFlow;

    // Validación de campo requerido
    if (validation?.required && !userInput.trim()) {
      setError("Este campo es obligatorio");
      return false;
    }

    // Validación de patrón
    if (validation?.pattern) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(userInput)) {
        setError("Error: El formato ingresado no es válido");
        return false;
      }
    }

    return true;
  };

  // Manejar envío de input
  const handleInputSubmit = async () => {
    // Reiniciar timer de inactividad
    resetInactivityTimer();

    // Validar input
    if (!validateInput()) return;

    // Guardar respuesta con clave de flujo actual
    if (currentFlow.key) {
      saveAnswer(currentFlow.key, userInput);
    }

    // Manejar selección de tipología basada en hora
    if (currentFlow.tipologia_diurna && currentFlow.tipologia_nocturna) {
      const currentHour = new Date().getHours();
      const tipologia =
        currentHour >= 18
          ? currentFlow.tipologia_nocturna
          : currentFlow.tipologia_diurna;

      saveAnswer("tipologia", tipologia);
    }

    // Reproducir audio si está disponible
    if (currentFlow.audio) {
      playAudio(currentFlow.audio);
    }

    // Enviar a API si se solicita
    if (currentFlow.send) {
      sendToApi();
    }

    // Navegar al siguiente flujo o manejar final
    if (currentFlow.next) {
      navigateToFlow(currentFlow.next);
    } else if (currentFlow.end) {
      console.log("Flujo completado");
      console.log(
        "Estado final de respuestas:",
        flowHandlerRef.current.answers
      );
    }

    setUserInput("");
  };

  // Enviar datos a API
  const sendToApi = async () => {
    const requestData = {
      answers: { ...flowHandlerRef.current.answers },
    };

    //console.log("Datos enviados a la API:", requestData);

    try {
      setLoading(true);
      const response = await apiService.current.post(requestData);

      console.log("Respuesta de la API:", response);
      // Guarda la respuesta en el estado
      setRespuesta(response.Turno); // Asumiendo que la respuesta está en response.data
    } catch (err) {
      setError("Error al enviar los datos");
      console.error("Error de API:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="glass-card">
        <h3 className="question">{currentFlow?.question || "Cargando..."}</h3>

        {currentFlow?.input && (
          <div className="input-group">
            <input
              type={currentFlow.input}
              value={userInput}
              onChange={handleInputChange}
              className={error ? "error-input" : ""}
            />
            <button
              className="input-button"
              onClick={handleInputSubmit}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        )}

        <div className="options">
          {currentFlow?.options?.map((option, index) => (
            <button
              key={index}
              className="glass-button"
              onClick={() => handleOptionSelect(option)}
              disabled={loading}
            >
              {option.label}
            </button>
          ))}
        </div>

        {currentFlow?.end && (
          <div className="return-section">
            {loading && <p className="loading">Cargando...</p>}
            {error && <p className="error">{error}</p>}
            {respuesta && <p className="turno">Turno: {respuesta}</p>}

            <p className="return-message">
              Volviendo al inicio en {RESET_TIMEOUT / 1000} segundos...
            </p>
            <button className="return-button" onClick={returnToInitialFlow}>
              Volver al inicio
            </button>
          </div>
        )}

        {/* Elemento de audio invisible */}
        <audio ref={audioRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default ConversationFlow;
