import { createNodeWithComponent } from "../common/components.js";
import { endpoints } from "../common/endpoints.js";

export const newCustomerFlow = {
  question: "Digite su cédula o RUC",
  audio: "/audio/MEGAN-CI.mp3",
  ...createNodeWithComponent("idInput"),
  next: {
    question: "Elija el motivo de su visita",
    audio: "/audio/MEGAN-MOTIVO.mp3",
    options: [
      {
        label: "Información de servicios hogar",
        key: "tipologia",
        value: "Hogar Ventas",
        next: endpoints.PHONE_NUMBER_COLLECTION,
      },
      {
        label: "Información de planes móviles",
        key: "tipologia",
        value: "Movil Ventas",
        next: endpoints.PHONE_NUMBER_COLLECTION,
      },
      {
        label: "Información de equipos",
        key: "tipologia",
        value: "Movil Ventas",
        next: endpoints.PHONE_NUMBER_COLLECTION,
      },
      {
        label: "Información para empresas [Pymes]",
        key: "tipologia",
        value: "Cliente PYMES",
        next: endpoints.PHONE_NUMBER_COLLECTION,
      },
    ],
  },
};
