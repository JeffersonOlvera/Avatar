import { createNodeWithComponent } from "./components.js";

export const endpoints = {
  ADQUIRIR_SERVICIO: {
    ...createNodeWithComponent("notificationNumberInput"),
    send: true,
    next: createNodeWithComponent("finalMessage"),
    errorAudio: "/audio/ERROR_ADQUIRIR_SERVICIO.mp3", // Audio específico para este error
  },

  SERVICIO_CLIENTE: {
    question: "Por favor, digite el número de línea a consultar",
    ...createNodeWithComponent("phoneNumberInput"),
    next: {
      ...createNodeWithComponent("notificationNumberInput"),
      next: {
        key: "tipologia",
        value: "Movil Servicio al Cliente",
        send: true,
        ...createNodeWithComponent("finalMessage"),
        errorAudio: "/audio/ERROR_SERVICIO_CLIENTE.mp3", // Audio específico para este error
      },
    },
  },

  PHONE_NUMBER_COLLECTION: {
    question: "Ingrese su número de celular",
    audio: "/audio/MEGAN_ CELULAR.mp3",
    ...createNodeWithComponent("notificationNumberInput"),
    send: true,
    next: createNodeWithComponent("finalMessage"),
    errorAudio: "/audio/ERROR_PHONE_COLLECTION.mp3", // Audio específico para este error
  },
};
