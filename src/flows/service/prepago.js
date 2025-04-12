import { endpoints } from "../common/endpoints.js";
import { createNodeWithComponent } from "../common/components.js";

export const prepagoFlow = {
  question: "Elija el motivo de su visita",
  audio: "/audio/MEGAN-MOTIVO.mp3",
  options: [
    {
      label: "Cambio de número",
      key: "Tipologia",
      value: "Móvil Servicio Al Cliente",
      next: {
        question: "Por favor, digita el número de linea que desea cambiar",
        audio: "/audio/MEGAN-NUM CAM.mp3",
        ...createNodeWithComponent("phoneNumberInput"),
        next: endpoints.ADQUIRIR_SERVICIO,
      },
    },
    {
      label: "Cambio de propietario",
      key: "Tipologia",
      value: "Móvil Servicio Al Cliente",
      next: {
        question: "Por favor, digita el número de linea que desea cambiar",
        audio: "/audio/MEGAN-NUM CAM.mp3",
        ...createNodeWithComponent("phoneNumberInput"),
        next: endpoints.ADQUIRIR_SERVICIO,
      },
    },
    {
      label: "Reportar una linea robada",
      next: {
        question: "Por favor, digita el número de linea a reportar",
        audio: "/audio/MEGAN-REPORT.mp3",
        ...createNodeWithComponent("phoneNumberInput"),
        tipologia_diurna: "Autoservicio Transacciones Varias Movil",
        tipologia_nocturna: "Móvil Servicio Al Cliente",
        next: endpoints.ADQUIRIR_SERVICIO,
      },
    },
    {
      label: "Recargas",
      next: {
        question: "Por favor, digita el número de linea a recargar",
        audio: "/audio/MEGAN-RECARGAR.mp3",
        ...createNodeWithComponent("phoneNumberInput"),
        next: {
          question: "Seleccione un opción",
          options: [
            {
              label: "Recarga saldo",
              next: {
                audio: "/audio/MEGAN-AUTOS.mp3",
                question:
                  "Por favor, dirijase al autoservicio para realizar la recarga, recuerda que tambien puedes realizar dicho proceso mediante la app Mi Claro, en nuestra página web o llamando al *123#",
                end: true,
              },
            },
            {
              label: "Activar paquetes",
              next: endpoints.ADQUIRIR_SERVICIO,
            },
          ],
        },
      },
    },
    {
      label: "Reposición de chip",
      next: {
        question: "Por favor, digita el número",
        ...createNodeWithComponent("phoneNumberInput"),
        next: {
          audio: "/audio/MEGAN_ 1OP.mp3",
          question: "Por favor, seleccione una opción",
          options: [
            {
              label: "Generar nuevo proceso",
              next: {
                audio: "/audio/MEGAN_TITULAR.mp3",
                question: "¿Es usted el titular de la linea?",
                options: [
                  {
                    label: "Sí",
                    next: endpoints.ADQUIRIR_SERVICIO,
                  },
                  {
                    label: "No",
                    next: {
                      audio: "/audio/MEGAN-MAS TARDE.mp3",
                      question:
                        "Por favor, dirijase al autoservicio para realizar el proceso de reposición, en caso de no funcionar intentalo más tarde",
                      end: true,
                    },
                  },
                ],
              },
            },
            {
              label: "Problemas con reposición",
              next: {
                label:
                  "Por favor, digite el número con el cual estuvo realizando el proceso de reposición",
                audio: "/audio/MEGAN-REPOSICION.mp3",
                ...createNodeWithComponent("phoneNumberInput"),
                next: endpoints.ADQUIRIR_SERVICIO,
              },
            },
            {
              label: "Solicitud de ESIM",
              next: {
                label:
                  "Por favor, digite el número de línea con el que desea realizar la solicitud de ESIM",
                audio: "/audio/MEGAN-ESIM.mp3",
                ...createNodeWithComponent("phoneNumberInput"),
                next: endpoints.ADQUIRIR_SERVICIO,
              },
            },
            {
              label:
                "¿No recibiste tu cambio al realizar la transaccion en le cajero?",
              next: endpoints.ADQUIRIR_SERVICIO,
            },
          ],
        },
      },
    },
  ],
};
