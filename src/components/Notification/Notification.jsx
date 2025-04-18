// En src/components/Notification/Notification.jsx
// Modificar el componente Notification para que el mensaje de agradecimiento se muestre correctamente

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";
import "./Notification.scss";

// Tipos de notificación
const TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
};

const getIcon = (type) => {
  switch (type) {
    case TYPES.SUCCESS:
      return <CheckCircle className="notification-icon" />;
    case TYPES.ERROR:
      return <XCircle className="notification-icon" />;
    case TYPES.INFO:
      return <Info className="notification-icon" />;
    default:
      return <CheckCircle className="notification-icon" />;
  }
};

const Notification = ({
  type = TYPES.SUCCESS,
  title,
  message,
  turnNumber,
  duration = 5000,
  onClose,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setVisible(false);
          if (onClose) setTimeout(onClose, 300);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onClose, duration]);

  if (!visible) return null;

  const percentLeft = (timeLeft / duration) * 100;

  // Dividir el mensaje en caso de tener el texto de agradecimiento
  const hasThankYouMessage =
    message && message.includes("Gracias por utilizar los servicios de Claro");
  const mainMessage = hasThankYouMessage
    ? message.split("Gracias por utilizar los servicios de Claro")[0].trim()
    : message;
  const thankYouMessage = hasThankYouMessage
    ? "Gracias por utilizar los servicios de Claro"
    : "";

  return (
    <div className={`notification notification--${type}`}>
      {/* Header */}
      <div className="notification__header">
        <div className="notification__icon-wrapper">{getIcon(type)}</div>
        <div className="notification__content">
          <h3 className="notification__title">
            {title || "¡Su turno se ha generado exitosamente!"}
          </h3>
          <p className="notification__message">{mainMessage}</p>
          {hasThankYouMessage && (
            <p className="notification__thanks">{thankYouMessage}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="notification__footer">
        {turnNumber && (
          <div className="notification__turn">Su turno es: {turnNumber}</div>
        )}

        <div className="notification__progress-container">
          <div
            className="notification__progress-bar"
            style={{ width: `${percentLeft}%` }}
          />
        </div>

        <div className="notification__timer">{Math.ceil(timeLeft / 1000)}s</div>
      </div>
    </div>
  );
};

export { Notification, TYPES };
