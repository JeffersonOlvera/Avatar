import React, { useState, useRef, useEffect } from "react";
import ConversationFlowHandler from "../../model/ConversationFlowHandler";
import ApiService from "../../services/ApiService";
import flowData from "../../flows";
import useInactivityTimer from "../../hooks/useInactivitiTimer";
import useFlowNavigation from "../../hooks/useFlowNavigation";
import AudioPlayer from "./AudioPlayer";
import InputSection from "./InputSection";
import OptionsSection from "./OptionsSection";
import ReturnSection from "./ReturnSection";
import "./Flow.scss";

// Componente para el modal de carga
const LoadingModal = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="loading-modal">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <h2>Cargando...</h2>
      </div>
    </div>
  );
};

// Componente para el mensaje de error
const ErrorMessage = ({ message, onReturn, timeout }) => {
  const [timeLeft, setTimeLeft] = useState(Math.floor(timeout / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onReturn();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onReturn, timeout]);

  return (
    <div className="error-message">
      <div className="error-icon">❌</div>
      <h3>{message}</h3>
      <p>Volviendo a la pantalla principal en {timeLeft} segundos...</p>
    </div>
  );
};

const API_ENDPOINT = import.meta.env.VITE_URL_ENQUEUE;
const API_KEY = import.meta.env.VITE_API_KEY;
const RESET_TIMEOUT = 10000;
const INACTIVITY_TIMEOUT = 60000;
const ERROR_TIMEOUT = 5000; // Tiempo antes de volver a la pantalla principal en caso de error

const ConversationFlow = ({ initialFlow, onReset }) => {
  // Estados básicos del componente
  const [currentFlow, setCurrentFlow] = useState(initialFlow || flowData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [apiError, setApiError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Lo sentimos, ha ocurrido un error al procesar su solicitud."
  );

  // Estado para almacenar la respuesta de la API y su visualización
  const [apiResponse, setApiResponse] = useState(null);

  const [errorAudio, setErrorAudio] = useState("/audio/ERROR_MESSAGE.mp3"); // Audio por defecto para errores

  // Referencias
  const apiService = useRef(new ApiService(API_ENDPOINT, API_KEY));
  const flowHandlerRef = useRef(
    new ConversationFlowHandler(initialFlow || flowData, apiService.current)
  );

  // Hook personalizado para gestionar la navegación entre flujos
  const { navigateToFlow } = useFlowNavigation(flowData, setCurrentFlow);

  // Efecto para realizar la navegación pendiente después de cargar
  useEffect(() => {
    if (!loading && pendingNavigation && !apiError) {
      navigateToFlow(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [loading, pendingNavigation, navigateToFlow, apiError]);

  // Función para guardar respuestas
  const saveAnswer = (key, value) => {
    if (!key || value === undefined) return;
    flowHandlerRef.current.answers[key] = value;
    // console.log(`Respuesta actualizada - ${key}:`, {
    //   ...flowHandlerRef.current.answers,
    // });
  };

  // Preparar datos para la API
  const prepareApiData = () => {
    const answers = flowHandlerRef.current.answers;

    // Datos predeterminados para completar campos faltantes
    const defaultData = {
      nombre: answers.nombre || "Cliente sin nombre",
      cedula: answers.cedula || "00000000",
      tipologia: answers.tipologia || "No se asigno ninguna tipologia",
      celular: answers.celular || "0000000000",
      notificacion_celular: answers.notificacion_celular || "0000000000",
      turno: answers.turno || null,
      CustomerId: answers.CustomerId || null,
      serviceId: answers.serviceId || null,
    };

    // Combinar respuestas con datos predeterminados
    return {
      ...defaultData,
      ...answers,
    };
  };

  // Función para consultar servicios disponibles
  const checkServiceAvailables = async (documentValue, documentType) => {
    try {
      setLoading(true);
      setShowLoadingModal(true);

      console.log(
        `Consultando servicios disponibles para: ${documentType} ${documentValue}`
      );

      const response = await apiService.current.getServiceAvailables(
        documentValue,
        documentType
      );
      console.log("Respuesta de service-availables:", response);

      // Guardar datos importantes de la respuesta
      if (response.Cliente && response.Cliente.CustomerId) {
        saveAnswer("CustomerId", response.Cliente.CustomerId);
        saveAnswer(
          "nombre",
          `${response.Cliente.FirstName || ""} ${
            response.Cliente.LastName || ""
          }`
        );
      }

      if (response.Services) {
        saveAnswer("services", response.Services);
      }

      setApiError(false);
      return response;
    } catch (err) {
      console.error("Error al consultar servicios disponibles:", err);

      // Extraer mensaje de error si está disponible
      let errorMsg =
        "Lo sentimos, ha ocurrido un error al consultar sus servicios.";
      if (err.response && err.response.data && err.response.data.error) {
        errorMsg = err.response.data.error;
      }

      setApiError(true);
      setErrorMessage(errorMsg);
      throw err;
    } finally {
      setLoading(false);
      setShowLoadingModal(false);
    }
  };

  // Función para enviar datos a la API
  const sendToApi = async (successFlowId = null, errorCustomAudio = null) => {
    // Preparar datos completos para la API
    const requestData = prepareApiData();

    //console.log("Datos enviados a la API:", requestData);

    try {
      setLoading(true);
      setShowLoadingModal(true);

      const response = await apiService.current.post(requestData);
      console.log("Respuesta de la API:", response);

      // Guardar la respuesta en el estado para mostrarla en la interfaz
      setApiResponse(response);

      // Si la respuesta es exitosa y hay un flujo de éxito definido
      if (successFlowId) {
        setPendingNavigation(successFlowId);
      }

      setApiError(false);
    } catch (err) {
      console.error("Error de API:", err);

      // Extraer mensaje de error si está disponible
      let errorMsg =
        "Lo sentimos, ha ocurrido un error al procesar su solicitud.";
      if (err.response && err.response.data && err.response.data.error) {
        errorMsg = err.response.data.error;
      }

      // Configurar el estado de error
      setApiError(true);
      setErrorMessage(errorMsg);
      setApiResponse(null); // Limpiar respuesta en caso de error

      // Si se proporciona un audio personalizado para el error, lo usamos
      if (errorCustomAudio) {
        setErrorAudio(errorCustomAudio);
      }

      // Evitar la navegación pendiente
      setPendingNavigation(null);
    } finally {
      setLoading(false);
      setShowLoadingModal(false);
    }
  };

  // Función para retornar al flujo inicial
  const returnToInitialFlow = () => {
    flowHandlerRef.current.answers = {};
    console.log("Answers reseteadas:", flowHandlerRef.current.answers);
    setApiError(false);
    setApiResponse(null); // Reiniciamos la respuesta de la API
    if (onReset) {
      onReset();
    } else {
      setCurrentFlow(flowData);
      setError(null);
    }
  };

  // Hook para gestionar el timer de inactividad
  useInactivityTimer(INACTIVITY_TIMEOUT, returnToInitialFlow);

  // Manejar opciones seleccionadas
  const handleOptionSelect = (option) => {
    if (option.key && option.value !== undefined) {
      saveAnswer(option.key, option.value);
    }
    if (option.send) {
      sendToApi(option.next, option.errorAudio);
    } else if (option.next) {
      navigateToFlow(option.next);
    }
    if (option.end) {
      console.log("Flujo completado");
      console.log(
        "Estado final de respuestas:",
        flowHandlerRef.current.answers
      );
    }
  };

  // Manejar envío de inputs
  const handleInputSubmit = async (inputValue, metadata = {}) => {
    if (currentFlow.key) {
      if (currentFlow.isDocumentInput && metadata.documentType) {
        // Guardar en el formato estructurado para el flujo actual
        saveAnswer(currentFlow.key, {
          identificationType: metadata.documentType,
          documentValue: inputValue,
        });

        // Guardar también como propiedades independientes para facilitar acceso
        saveAnswer("identificationType", metadata.documentType);
        saveAnswer("documentValue", inputValue);

        const formattedValue = `identificationType: ${metadata.documentType} : Identificación: ${inputValue}`;
        saveAnswer(`${currentFlow.key}_formatted`, formattedValue);

        // Si es un documento, también lo guardamos en cedula para mantener compatibilidad
        saveAnswer("cedula", inputValue);

        // Si este nodo requiere verificar servicios disponibles
        if (currentFlow.checkServices) {
          try {
            const serviceResponse = await checkServiceAvailables(
              inputValue,
              metadata.documentType
            );

            // Si hay una función especial para manejar la respuesta
            if (typeof currentFlow.next === "function") {
              const nextFlow = await currentFlow.next(
                inputValue,
                flowHandlerRef.current.answers,
                serviceResponse
              );
              if (nextFlow) {
                navigateToFlow(nextFlow);
              }
              return; // Interrumpimos el flujo normal ya que se ha manejado en la función
            }
          } catch (err) {
            // El error ya se manejó en checkServiceAvailables
            return; // Interrumpimos el flujo si hubo error
          }
        }
      } else {
        saveAnswer(currentFlow.key, inputValue);
      }
    }

    if (currentFlow.tipologia_diurna && currentFlow.tipologia_nocturna) {
      const currentHour = new Date().getHours();
      const tipologia =
        currentHour >= 18
          ? currentFlow.tipologia_nocturna
          : currentFlow.tipologia_diurna;
      saveAnswer("tipologia", tipologia);
    }

    if (
      currentFlow.key === "celular" ||
      currentFlow.key === "notificacion_celular"
    ) {
      saveAnswer("celular", inputValue);
      saveAnswer("notificacion_celular", inputValue);
    }

    if (currentFlow.send) {
      sendToApi(currentFlow.next, currentFlow.errorAudio);
    } else if (currentFlow.next) {
      if (typeof currentFlow.next === "function") {
        try {
          // Si next es una función, pasamos el valor del input y las respuestas acumuladas
          const nextFlow = await currentFlow.next(
            inputValue,
            flowHandlerRef.current.answers
          );
          if (nextFlow) {
            navigateToFlow(nextFlow);
          }
        } catch (error) {
          setError("Error al procesar la navegación: " + error.message);
        }
      } else {
        navigateToFlow(currentFlow.next);
      }
    }

    if (currentFlow.end) {
      console.log("Flujo completado");
      console.log(
        "Estado final de respuestas:",
        flowHandlerRef.current.answers
      );
    }
  };

  return (
    <div className="container">
      <LoadingModal isVisible={showLoadingModal} />

      <div className="glass-card">
        {apiError ? (
          <>
            <ErrorMessage
              message={errorMessage}
              onReturn={returnToInitialFlow}
              timeout={ERROR_TIMEOUT}
            />
            <AudioPlayer audioPath={errorAudio} autoPlay={true} />
          </>
        ) : (
          <>
            <h3 className="question">
              {currentFlow?.question || "Cargando..."}
            </h3>
            {/* Mostrar la respuesta de la API si existe */}
            {apiResponse &&
              apiResponse.apiResponse &&
              apiResponse.apiResponse.Turno && (
                <div className="turno">
                  <strong className="turno-box">
                    Turno:{" "}
                    {`${apiResponse.apiResponse.Turno.QCode}${apiResponse.apiResponse.Turno.QNumber}`}
                  </strong>
                </div>
              )}

            <InputSection
              currentFlow={currentFlow}
              onSubmit={handleInputSubmit}
              loading={loading}
              error={error}
              setError={setError}
            />

            <OptionsSection
              options={currentFlow?.options || []}
              onOptionSelect={handleOptionSelect}
              loading={loading}
            />

            {currentFlow?.end && (
              <ReturnSection
                timeout={RESET_TIMEOUT}
                onReturn={returnToInitialFlow}
              />
            )}

            {loading && !showLoadingModal && (
              <p className="loading">Cargando...</p>
            )}
            {error && <p className="error">{error}</p>}

            <AudioPlayer audioPath={currentFlow?.audio} />
          </>
        )}
      </div>
    </div>
  );
};

export default ConversationFlow;
