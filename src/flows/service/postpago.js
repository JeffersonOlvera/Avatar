import { endpoints } from "../common/endpoints.js";
import { createNodeWithComponent } from "../common/components.js";

export const postpaidFlow = {
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
            label: "Oferta movil",
            key: "tipologia",
            value: "Movil Ventas",
            next: endpoints.ADQUIRIR_SERVICIO,
          },
          {
            label: "Oferta Empresarial (PYMES)",
            key: "tipologia",
            value: "Cliente PYMES",
            next: endpoints.ADQUIRIR_SERVICIO,
          },
        ],
      },
    },
    {
      label: "Anulación de servicios",
      next: {
        audio: "/audio/MEGAN_ANULAR.mp3",
        question: "Por favor, digita el número que desea anular",
        input: "tel",
        tipologia_diurna: "Movil Renuncias",
        tipologia_nocturna: "Renuncias",
        next: endpoints.ADQUIRIR_SERVICIO,
      },
    },
    {
      label: "Información / Pagos de facturas",
      next: {
        audio: "/audio/MEGAN_ 1OP.mp3",
        question: "Por favor, seleccione una opción",
        options: [
          {
            label: "Pago de factura",
            key: "tipologia",
            value: "Express",
            next: {
              question: "Por favor, digita el número de línea que desea pagar",
              ...createNodeWithComponent("phoneNumberInput"),
              next: {
                audio: "/audio/MEGAN-CAJERO.mp3",
                question:
                  "¿Desea pagar mediante el cajero por un costo adicional de $0.50 ctvs?",
                options: [
                  {
                    label: "Si",
                    next: {
                      audio: "/audio/MEGAN-APP.mp3",
                      question:
                        "Por favor dirijase al autoservicio para realiza el pago. Recuerda que tambien puedes realizar dicho proceso mediante la app Mi Claro o mediante nuestra página web.",
                      end: true,
                    },
                  },
                  {
                    label: "No",
                    next: endpoints.ADQUIRIR_SERVICIO,
                  },
                ],
              },
            },
          },
          {
            label: "Reclamos de facturación",
            next: {
              question: "Por favor, digita el número de linea a consultar",
              audio: "/audio/MEGAN-CONSULTAR.mp3",
              ...createNodeWithComponent("phoneNumberInput"),
              next: endpoints.ADQUIRIR_SERVICIO,
            },
          },
          {
            label: "Detalle de factura",
            next: {
              question: "Por favor, digita el número de linea a consultar",
              audio: "/audio/MEGAN-CONSULTAR.mp3",
              ...createNodeWithComponent("phoneNumberInput"),
              next: endpoints.ADQUIRIR_SERVICIO,
            },
          },
        ],
      },
    },
    {
      label: "Servicio al cliente",
      next: {
        question: "Por favor, seleccione una opción",
        audio: "/audio/MEGAN_ 1OP.mp3",
        options: [
          {
            label: "Cambio de plan",
            next: endpoints.SERVICIO_CLIENTE,
          },
          {
            label: "Cambiar forma de pago",
            next: endpoints.SERVICIO_CLIENTE,
          },
          {
            label: "Cambio de propietario / número",
            next: endpoints.SERVICIO_CLIENTE,
          },
          {
            label: "Paquetes y roaming",
            next: {
              question: "Por favor, digita el número de linea a consultar",
              audio: "/audio/MEGAN-CONSULTAR.mp3",
              ...createNodeWithComponent("phoneNumberInput"),
              next: {
                audio: "/audio/MEGAN_ 1OP.mp3",
                question: "Por favor, seleccione una opción",
                key: "tipologia",
                value: "Movil servicio al cliente",
                options: [
                  {
                    label: "Activar paquetes",
                    next: endpoints.ADQUIRIR_SERVICIO,
                  },
                  {
                    label: "Desactivar paquetes",
                    next: endpoints.ADQUIRIR_SERVICIO,
                  },
                  {
                    label: "Activación de roaming",
                    next: endpoints.ADQUIRIR_SERVICIO,
                  },
                ],
              },
            },
          },
          {
            label: "Reportar/ Reactivar una linea robada",
            next: {
              audio: "/audio/MEGAN-REPORT.mp3",
              question: "Por favor, digita el número de linea a reportar",
              ...createNodeWithComponent("phoneNumberInput"),
              next: endpoints.SERVICIO_CLIENTE,
            },
          },
          {
            label: "Negociaciones / Certificados deuda",
            next: {
              audio: "/audio/MEGAN_ 1OP.mp3",
              question: "Por favor, seleccione una opción",
              options: [
                {
                  label: "Negociación de deuda",
                  next: {
                    audio: "/audio/MEGAN-NEGOCIAR.mp3",
                    question: "Por favor digite el numero de linea a negociar",
                    //input: "tel",
                    //key: "celular",
                    ...createNodeWithComponent("phoneNumberInput"),
                    next: endpoints.SERVICIO_CLIENTE,
                  },
                },
                {
                  label: "Certificados de no deuda",
                  next: endpoints.SERVICIO_CLIENTE,
                },
              ],
            },
          },
          {
            label: "Cambio de ciclo de facturación",
            next: {
              audio: "/audio/MEGAN-MODIF.mp3",
              question: "Por favor, digita el número de linea a modificar",
              ...createNodeWithComponent("phoneNumberInput"),
              next: {
                question:
                  "Su turno se ha generado, por favor revise en la pantalla",
                end: true,
              },
            },
          },
          {
            label: "Reposición de chip",
            next: {
              question: "Por favor, seleccione un opción",
              options: [
                {
                  label: "Generar nuevo proceso",
                  next: {
                    audio: "/audio/MEGAN-CHIP R.mp3",
                    question:
                      "Por favor, digita el número de celular que esta asociado al chip que va a reponer",
                    ...createNodeWithComponent("phoneNumberInput"),
                    next: {
                      audio: "/audio/MEGAN_TITULAR.mp3",
                      question: "¿Es usted el titular de la linea?",
                      options: [
                        {
                          label: "No",
                          next: {
                            question:
                              "Por favor, dirijase al autoserivicio para realizar el proceso de reposición, en caso de no funcionar intentalo más tarde",
                            end: true,
                          },
                        },
                        {
                          label: "Si",
                          key: "tipologia",
                          value: "Movil servicio al cliente",
                          next: endpoints.ADQUIRIR_SERVICIO,
                        },
                      ],
                    },
                  },
                },
                {
                  label: "Problemas con reposición",
                  key: "tipologia",
                  value: "Movil servicio al cliente",
                  next: {
                    question:
                      "Por favor, digita el número de celular que esta asociado al chip que va a reponer",
                    ...createNodeWithComponent("phoneNumberInput"),
                    next: endpoints.ADQUIRIR_SERVICIO,
                  },
                },
                {
                  label: "Solicitud de ESIM",
                  key: "tipologia",
                  value: "Movil servicio al cliente",
                  next: {
                    question:
                      "Por favor, digita el número de línea con el que desea realizar el proceso",
                    ...createNodeWithComponent("phoneNumberInput"),
                    next: endpoints.ADQUIRIR_SERVICIO,
                  },
                },
                {
                  label: "¿No recibiste tu cambio?",
                  key: "tipologia",
                  value: "Movil servicio al cliente",
                  next: endpoints.ADQUIRIR_SERVICIO,
                },
              ],
            },
          },
        ],
      },
    },
  ],
};
