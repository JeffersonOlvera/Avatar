import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ConversationFlow from "../Flow/index";
import flowData from "../../flows";
import "./StartButton.scss";

const StartButton = () => {
  const [conversationStarted, setConversationStarted] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [deviceType, setDeviceType] = useState("desktop"); // desktop, tablet, mobile

  // Detectar tipo de dispositivo basado en el ancho de ventana
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setDeviceType("mobile");
      } else if (width <= 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    // Ejecutar una vez al cargar y luego en cada cambio de tamaño
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleStartConversation = () => {
    setShowPolicyModal(true);
  };

  const handleAcceptPolicy = () => {
    setShowPolicyModal(false);
    setConversationStarted(true);
  };

  const handleRejectPolicy = () => {
    setShowPolicyModal(false);
    setConversationStarted(true);
  };

  // Clases condicionales basadas en el tipo de dispositivo
  const getButtonClasses = () => {
    let classes = "start-conversation-button";
    if (deviceType === "mobile") classes += " mobile";
    if (deviceType === "tablet") classes += " tablet";
    if (deviceType === "desktop") classes += " desktop";
    return classes;
  };

  return (
    <>
      <div className="start-wrapper">
        {!conversationStarted ? (
          <div className="start-button-container">
            <button
              className={getButtonClasses()}
              onClick={handleStartConversation}
            >
              Iniciar conversación
            </button>
          </div>
        ) : (
          <ConversationFlow
            initialFlow={flowData}
            onReset={() => setConversationStarted(false)}
            deviceType={deviceType}
          />
        )}
      </div>

      {showPolicyModal &&
        ReactDOM.createPortal(
          <div className={`policy-modal-overlay ${deviceType}`}>
            <div className={`policy-modal-content ${deviceType}`}>
              <h2>Políticas de Uso de Datos</h2>
              <div className="policy-text">
                <p>
                  Bienvenido a nuestro servicio. Antes de comenzar, te pedimos
                  que leas atentamente nuestras Políticas de Uso de Datos y
                  Términos de Servicio. Al hacer clic en "Aceptar", declaras
                  haber leído, comprendido y aceptado estos términos.
                </p>
                <p>
                  <strong>1. Uso de Datos Personales:</strong> Al utilizar este
                  servicio, aceptas que recopilemos, almacenemos y procesemos
                  tus datos personales de acuerdo con nuestra política de
                  privacidad. Esto incluye, pero no se limita a, tu nombre,
                  dirección de correo electrónico, información de contacto,
                  preferencias de usuario y cualquier dato que ingreses durante
                  el uso de la plataforma.
                </p>
                <p>
                  <strong>2. Finalidad del Tratamiento:</strong> Tus datos serán
                  utilizados para mejorar la experiencia del usuario,
                  personalizar la interacción con el sistema, realizar análisis
                  estadísticos y, en algunos casos, enviarte comunicaciones
                  relacionadas con el servicio. No venderemos ni compartiremos
                  tu información con terceros sin tu consentimiento explícito,
                  salvo cuando la ley lo requiera.
                </p>
                <p>
                  <strong>3. Seguridad:</strong> Aplicamos medidas de seguridad
                  técnicas y organizativas adecuadas para proteger tus datos
                  contra pérdida, manipulación, acceso no autorizado o
                  divulgación. Sin embargo, ninguna transmisión de datos por
                  internet es completamente segura, por lo que no podemos
                  garantizar una seguridad absoluta.
                </p>
                <p>
                  <strong>4. Responsabilidades del Usuario:</strong> Te
                  comprometes a hacer un uso adecuado del servicio, respetando
                  los derechos de los demás usuarios y de la empresa. Está
                  prohibido el uso del sistema para fines ilegales, ofensivos,
                  discriminatorios o que puedan vulnerar la integridad de otros.
                </p>
                <p>
                  <strong>5. Cambios en la Política:</strong> Nos reservamos el
                  derecho de modificar esta política en cualquier momento. Te
                  notificaremos cualquier cambio sustancial a través del sistema
                  o por otros medios apropiados. El uso continuado del servicio
                  después de los cambios implica la aceptación de los mismos.
                </p>
                <p>
                  <strong>6. Conservación de Datos:</strong> Conservaremos tus
                  datos personales durante el tiempo que sea necesario para
                  cumplir con las finalidades mencionadas o mientras exista una
                  relación activa con el servicio. Posteriormente, serán
                  eliminados o anonimizados.
                </p>
                <p>
                  <strong>7. Derechos del Usuario:</strong> Puedes ejercer tus
                  derechos de acceso, rectificación, cancelación y oposición
                  (ARCO) en cualquier momento, enviándonos una solicitud por los
                  canales dispuestos para tal fin.
                </p>
                <p>
                  Al continuar, confirmas que has leído esta política, que
                  comprendes sus implicaciones y que aceptas el uso de tus datos
                  conforme a lo indicado.
                </p>
              </div>

              <div className={`policy-buttons ${deviceType}`}>
                <button className="reject-btn" onClick={handleRejectPolicy}>
                  Rechazar
                </button>
                <button className="accept-btn" onClick={handleAcceptPolicy}>
                  Aceptar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default StartButton;
