import { endpoints } from "../common/endpoints.js";
import { createNodeWithComponent } from "../common/components.js";

export const hogarFlow = {
  question: "Elija el motivo de su visita",
  audio: "/audio/MEGAN-MOTIVO.mp3",
  options: [
    {
      label: "Información / Adquirir un nuevo servicio",
      next: {
        audio: "/audio/MEGAN_ 1OP.mp3",
        question: "Por favor, seleccione una opción",
        options: [
          {
            label: "Servicio hogar",
            key: "tipologia",
            value: "Hogar Venta",
            next: endpoints.ADQUIRIR_SERVICIO,
          },
          {
            label: "Sericio Corporativo (PYMES)",
            key: "tipologia",
            value: "Cliente PYMES",
            next: endpoints.ADQUIRIR_SERVICIO,
          },
        ],
      },
    },
    {
      label: "Anulación de servicios",
      tipologia_diurna: "Autoservicio Renuncias Hogar",
      tipologia_nocturna: "Hogar Renuncias",
      next: endpoints.ADQUIRIR_SERVICIO,
    },
    {
      label: "Información / Pagos de facturas",
      next: {
        audio: "/audio/MEGAN_ 1OP.mp3",
        question: "Por favor, seleccione una opción",
        options: [
          {
            label: "Pago de factura",
            next: {
              audio: "/audio/MEGAN-CAJERO.mp3",
              question:
                "¿Desea pagar mediante el cajero por un costo adicional de $0.50 ctvs?",
              options: [
                {
                  label: "Si",
                  next: {
                    question:
                      "Por favor dirijase al autoservicio para realiza el pago. Recuerda que tambien puedes realizar dicho proceso mediante la app Mi Claro o mediante nuestra página web.",
                    end: true,
                  },
                },
                {
                  label: "No",
                  key: "tipologia",
                  value: "Express",
                  next: endpoints.ADQUIRIR_SERVICIO,
                },
              ],
            },
          },
          {
            label: "Cobros erróneos",
            key: "tipologia",
            value: "Hogar Servicio al Cliente",
            next: endpoints.ADQUIRIR_SERVICIO,
          },
          {
            label: "Detalle de factura",
            tipologia_diurna: "Autoservicio Transacciones Varias Hogar",
            tipologia_nocturna: "Hogar Servicio al Cliente",
            next: endpoints.ADQUIRIR_SERVICIO,
          },
        ],
      },
    },
    {
      label: "Servicio al cliente",
      next: {
        question: "Por favor, elije una opción",
        key: "tipologia",
        value: "Hogar Servicio al Cliente",
        options: [
          {
            label: "Información / Actualizacion plan de casa",
            next: endpoints.ADQUIRIR_SERVICIO,
          },
          {
            label: "Cambiar forma de pago",
            next: endpoints.ADQUIRIR_SERVICIO,
          },
          {
            label: "Translados/ Entrega de equipos",
            next: endpoints.ADQUIRIR_SERVICIO,
          },
          {
            label: "Mantenimientos",
            tipologia_diurna: "Hogar Servicio al Cliente",
            tipologia_nocturna: "Autoservicio Transacciones Varias Hogar",
            next: endpoints.ADQUIRIR_SERVICIO,
          },
          {
            label: "Negociaciones de deuda",
            tipologia_diurna: "Hogar Servicio al Cliente",
            tipologia_nocturna: "Autoservicio Transacciones Varias Hogar",
            next: endpoints.ADQUIRIR_SERVICIO,
          },
        ],
      },
    },
  ],
};
