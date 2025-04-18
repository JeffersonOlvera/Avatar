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
import ConfirmationModal from "./ConfirmationModal";
import { Notification, TYPES } from "../Notification/Notification";
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
const NOTIFICATION_DURATION = 5000; // Duración de las notificaciones

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

  // Estado para almacenar el historial de navegación
  const [navigationHistory, setNavigationHistory] = useState([]);

  // Nuevo estado para el modal de confirmación
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingApiRequest, setPendingApiRequest] = useState(null);

  // Estado para almacenar la respuesta de la API y su visualización
  const [apiResponse, setApiResponse] = useState(null);

  // Nuevo estado para la notificación
  const [notification, setNotification] = useState(null);

  const [errorAudio, setErrorAudio] = useState("/audio/ERROR_MESSAGE.mp3"); // Audio por defecto para errores

  // Referencias
  const apiService = useRef(new ApiService(API_ENDPOINT, API_KEY));
  const flowHandlerRef = useRef(
    new ConversationFlowHandler(initialFlow || flowData, apiService.current)
  );

  // Hook personalizado para gestionar la navegación entre flujos
  const { navigateToFlow } = useFlowNavigation(flowData, setCurrentFlow);

  // Función para mostrar notificaciones
  const showNotification = (type, title, message, turnNumber = null) => {
    setNotification({
      type,
      title,
      message,
      turnNumber,
      duration: NOTIFICATION_DURATION,
    });
  };

  // Función para cerrar notificaciones
  const closeNotification = () => {
    setNotification(null);
  };

  // Efecto para realizar la navegación pendiente después de cargar
  useEffect(() => {
    if (!loading && pendingNavigation && !apiError) {
      // Guardar el flujo actual en el historial antes de navegar al siguiente
      setNavigationHistory((prev) => [...prev, currentFlow]);

      navigateToFlow(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [loading, pendingNavigation, navigateToFlow, apiError, currentFlow]);

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

      // Mostrar notificación de error
      showNotification(TYPES.ERROR, "Error", errorMsg);

      throw err;
    } finally {
      setLoading(false);
      setShowLoadingModal(false);
    }
  };

  // Función para abrir el modal de confirmación antes de enviar datos
  const showConfirmation = (successFlowId, errorCustomAudio) => {
    // Asegurarse de que tenemos los datos de celular más recientes
    const currentAnswers = flowHandlerRef.current.answers;

    // Unificar el campo de celular y notificación si uno de ellos está vacío
    if (currentAnswers.celular && !currentAnswers.notificacion_celular) {
      saveAnswer("notificacion_celular", currentAnswers.celular);
    } else if (currentAnswers.notificacion_celular && !currentAnswers.celular) {
      saveAnswer("celular", currentAnswers.notificacion_celular);
    }

    // Guardar los datos del envío pendiente
    setPendingApiRequest({
      successFlowId,
      errorCustomAudio,
    });

    // Mostrar el modal de confirmación
    setShowConfirmationModal(true);
  };

  // Función para manejar confirmación del modal
  const handleConfirmation = (confirmedData) => {
    // Actualizar datos con los valores editados
    if (confirmedData.notificacion_celular) {
      saveAnswer("notificacion_celular", confirmedData.notificacion_celular);
      saveAnswer("celular", confirmedData.notificacion_celular);
    }

    // Asegurarnos de que la cédula esté configurada correctamente
    if (!flowHandlerRef.current.answers.cedula && confirmedData.documentValue) {
      saveAnswer("cedula", confirmedData.documentValue);
    }

    console.log("Datos confirmados:", flowHandlerRef.current.answers);

    // Cerrar el modal
    setShowConfirmationModal(false);

    // Realizar la petición a la API con los datos actualizados
    if (pendingApiRequest) {
      sendToApi(
        pendingApiRequest.successFlowId,
        pendingApiRequest.errorCustomAudio
      );
      setPendingApiRequest(null);
    }
  };

  // Función para cancelar el envío
  const handleCancelConfirmation = () => {
    setShowConfirmationModal(false);
    setPendingApiRequest(null);
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

      // Mostrar notificación de éxito con el número de turno
      if (response.apiResponse && response.apiResponse.Turno) {
        const turnoCompleto = `${response.apiResponse.Turno.QCode}${response.apiResponse.Turno.QNumber}`;
        showNotification(
          TYPES.SUCCESS,
          "¡Turno generado con éxito!",
          "Su turno ha sido generado correctamente",
          turnoCompleto
        );

        // Al generar un turno exitosamente, cambiamos la pregunta del flujo actual para que coincida
        // con el mensaje de agradecimiento (por si acaso la tarjeta se muestra en algún momento)
        if (currentFlow) {
          currentFlow.question = "Gracias por utilizar los servicios de Claro";
        }
      } else {
        showNotification(
          TYPES.SUCCESS,
          "¡Operación exitosa!",
          "Su solicitud ha sido procesada correctamente"
        );
      }

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

      // Mostrar notificación de error
      showNotification(TYPES.ERROR, "Error", errorMsg);

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
    // Detener cualquier audio que se esté reproduciendo
    const audioElements = document.getElementsByTagName("audio");
    for (let i = 0; i < audioElements.length; i++) {
      audioElements[i].pause();
      audioElements[i].currentTime = 0;
    }

    flowHandlerRef.current.answers = {};
    setNavigationHistory([]); // Limpiar historial de navegación
    console.log("Answers reseteadas:", flowHandlerRef.current.answers);
    setApiError(false);
    setApiResponse(null); // Reiniciamos la respuesta de la API
    setNotification(null); // Limpiar notificaciones
    if (onReset) {
      onReset();
    } else {
      setCurrentFlow(flowData);
      setError(null);
    }
  };

  // Función para retroceder al flujo anterior
  const handleBackNavigation = () => {
    // Detener cualquier audio que se esté reproduciendo
    const audioElements = document.getElementsByTagName("audio");
    for (let i = 0; i < audioElements.length; i++) {
      audioElements[i].pause();
      audioElements[i].currentTime = 0;
    }

    if (navigationHistory.length > 0) {
      // Obtener el último flujo del historial
      const previousFlow = navigationHistory[navigationHistory.length - 1];

      // Actualizar el historial quitando el último flujo
      setNavigationHistory((prev) => prev.slice(0, -1));

      // Navegar al flujo anterior
      setCurrentFlow(previousFlow);

      console.log("Retrocediendo al flujo anterior:", previousFlow.question);
    } else {
      // Si no hay historial, volver al flujo inicial
      console.log("No hay flujos anteriores, volviendo al inicio");
      returnToInitialFlow();
    }
  };

  // Hook para gestionar el timer de inactividad
  useInactivityTimer(INACTIVITY_TIMEOUT, returnToInitialFlow);

  // Manejar opciones seleccionadas
  const handleOptionSelect = (option) => {
    if (option.key && option.value !== undefined) {
      saveAnswer(option.key, option.value);
    }

    // Guardar el flujo actual en el historial antes de navegar al siguiente
    if (option.next) {
      setNavigationHistory((prev) => [...prev, currentFlow]);
    }

    if (option.send) {
      // En lugar de enviar directamente, mostramos el modal de confirmación
      showConfirmation(option.next, option.errorAudio);
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

            // Mostrar notificación de servicios encontrados
            if (
              serviceResponse.Services &&
              serviceResponse.Services.length > 0
            ) {
              showNotification(
                TYPES.INFO,
                "Servicios encontrados",
                `Se encontraron ${serviceResponse.Services.length} servicios disponibles`
              );
            }

            // Si hay una función especial para manejar la respuesta
            if (typeof currentFlow.next === "function") {
              const nextFlow = await currentFlow.next(
                inputValue,
                flowHandlerRef.current.answers,
                serviceResponse
              );

              // Guardar el flujo actual en el historial antes de navegar al siguiente
              setNavigationHistory((prev) => [...prev, currentFlow]);

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

    // Guardar el flujo actual en el historial antes de navegar al siguiente
    if (currentFlow.next) {
      setNavigationHistory((prev) => [...prev, currentFlow]);
    }

    if (currentFlow.send) {
      // En lugar de enviar directamente, mostramos el modal de confirmación
      showConfirmation(currentFlow.next, currentFlow.errorAudio);
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

          // Mostrar notificación de error
          showNotification(TYPES.ERROR, "Error de navegación", error.message);
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

      {/* Componente de Notificación */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          turnNumber={notification.turnNumber}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCancelConfirmation}
        onConfirm={handleConfirmation}
        data={flowHandlerRef.current.answers}
        loading={loading}
      />
      {notification &&
      notification.type === TYPES.SUCCESS &&
      notification.turnNumber ? null : ( // No mostrar la tarjeta glass-card si hay una notificación de turno exitosa
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
                onBack={handleBackNavigation}
                onHome={returnToInitialFlow}
                showNavButtons={!currentFlow?.end}
                apiResponse={apiResponse}
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
      )}
    </div>
  );
};

export default ConversationFlow;
