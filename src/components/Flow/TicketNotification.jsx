import React, { useState, useEffect } from "react";

const TicketNotification = ({ ticketCode, onClose, timeout = 5000 }) => {
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(100);
  const [visible, setVisible] = useState(true);

  // Handle copying the ticket code
  const handleCopy = () => {
    navigator.clipboard.writeText(ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Timer effect to gradually reduce the time remaining
  useEffect(() => {
    if (timeRemaining <= 0) {
      // Start fade out animation when timer reaches 0
      setVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000); // Wait for fade animation to complete
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining((prev) => Math.max(0, prev - (100 * 50) / timeout));
    }, 50);

    return () => clearTimeout(timer);
  }, [timeRemaining, timeout, onClose]);

  // Logo de Claro (versión simplificada SVG)
  const ClaroLogo = () => (
    <svg
      viewBox="0 0 60 20"
      width="60"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#FFFFFF">
        <path d="M10,2c4.4,0,8,3.6,8,8s-3.6,8-8,8s-8-3.6-8-8S5.6,2,10,2 M10,0C4.5,0,0,4.5,0,10s4.5,10,10,10s10-4.5,10-10S15.5,0,10,0L10,0z" />
        <path d="M8,6v8l6-4L8,6z" />
        <path d="M25,5.5h3c1.4,0,2.5,1.1,2.5,2.5v4c0,1.4-1.1,2.5-2.5,2.5h-3c-1.4,0-2.5-1.1-2.5-2.5V8C22.5,6.6,23.6,5.5,25,5.5z" />
        <path d="M34,5.5h6c1.1,0,2,0.9,2,2V8h-2.5v-0.5h-3V12h3V11H37v2c0,1.1,0.9,2,2,2h1c1.1,0,2-0.9,2-2v-5.5c0-1.1-0.9-2-2-2h-6c-1.1,0-2,0.9-2,2V13c0,1.1,0.9,2,2,2h1v-2h-1V7.5C34,7.5,34,5.5,34,5.5z" />
        <path d="M46,7.5h3v7h2.5v-7h3v-2h-8.5V7.5z" />
        <path d="M57.5,5.5v9H60v-9H57.5z" />
      </g>
    </svg>
  );

  return (
    <div
      className={`ticket-notification-overlay transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative">
        {/* Main ticket container with classic ticket shape */}
        <div className="ticket-container">
          {/* Left side of ticket (larger part) */}
          <div className="ticket-main">
            <div className="ticket-main-content">
              {/* Left side content - success icon and message */}
              <div className="ticket-info">
                <div className="ticket-check-icon">
                  <div className="check-mark">✓</div>
                </div>
                <div>
                  <div className="ticket-title">¡Turno Generado!</div>
                  <div className="ticket-code">{ticketCode}</div>
                </div>
              </div>
            </div>

            {/* Time remaining progress bar */}
            <div className="ticket-progress-container">
              <div
                className="ticket-progress-bar"
                style={{ width: `${timeRemaining}%` }}
              ></div>
            </div>
          </div>

          {/* Right stub of ticket */}
          <div className="ticket-stub-container">
            {/* The stub with perforated edge */}
            <div className="ticket-stub">
              {/* Perforated line */}
              <div className="ticket-perforation">
                {[...Array(12)].map((_, i) => (
                  <div key={`perf-${i}`} className="perforation-dot"></div>
                ))}
              </div>

              {/* Stub content */}
              <div className="ticket-stub-content">
                {/* Logo de Claro */}
                <div className="ticket-logo">
                  <ClaroLogo />
                </div>

                <button onClick={handleCopy} className="ticket-copy-button">
                  {copied ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket shine effect */}
        <div className="ticket-shine-container">
          <div className="ticket-shine"></div>
        </div>
      </div>
    </div>
  );
};

export default TicketNotification;
