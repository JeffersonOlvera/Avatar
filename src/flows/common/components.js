export const components = {
  phoneNumberInput: {
    input: "tel",
    key: "celular",
    validation: {
      required: true,
      pattern: "^[0-9]{10}$",
    },
  },

  idInput: {
    audio: "/audio/MEGAN-CI.mp3",
    key: "documento",
    input: "text",
    isDocumentInput: true,
    validation: {
      required: true,
      patterns: {
        cedula: "^[0-9]{10}$",
        ruc: "^[0-9]{13}$",
        pasaporte: "^[A-Z0-9]{6,12}$",
      },
    },
  },

  notificationNumberInput: {
    question:
      "Por favor digite el número para recibir la notificación de su turno",
    audio: "/audio/MEGAN-CELL.mp3",
    input: "tel",
    key: "notification_number",
    validation: {
      required: true,
      pattern: "^[0-9]{10}$",
    },
  },

  finalMessage: {
    question: "Gracias por utilizar los servicios de Claro",
    audio: "/audio/MEGAN-TURNO.mp3",
    end: true,
  },
};

// Función auxiliar para crear un nodo con un componente
export const createNodeWithComponent = (componentName, overrides = {}) => {
  return {
    ...components[componentName],
    ...overrides,
  };
};
