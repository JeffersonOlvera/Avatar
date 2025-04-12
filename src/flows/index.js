import { newCustomerFlow } from "./service/newCustomer.js";
import { postpaidFlow } from "./service/postpago.js";
import { prepagoFlow } from "./service/prepago.js";
import { hogarFlow } from "./service/hogar.js";
import { createNodeWithComponent } from "./common/components.js";
import ApiService from "../services/ApiService.jsx";

const API_ENDPOINT = import.meta.env.VITE_URL_CONSULTAR;
const API_KEY = import.meta.env.VITE_API_KEY;
const apiService = new ApiService(API_ENDPOINT, API_KEY);

const flowData = {
  question: "¿Es usted cliente Claro?",
  audio: "/audio/MEGAN-HOLA_2.mp3",
  options: [
    {
      label: "Aún no soy cliente",
      next: newCustomerFlow,
    },
    {
      label: "Sí, soy cliente Claro",
      next: {
        question: "Ingrese la cédula, RUC o pasaporte del titular del servicio",
        ...createNodeWithComponent("idInput"),
        next: async (inputValue, answers, serviceResponse) => {
          try {
            console.log("Documento recibido:", inputValue);
            console.log("Tipo de documento:", answers.identificationType);
            console.log("Respuesta de servicios:", serviceResponse);

            let response = serviceResponse;

            if (!response) {
              const docKey =
                answers.identificationType.charAt(0).toUpperCase() +
                answers.identificationType.slice(1);
              response = await apiService.getServiceAvailables(
                inputValue,
                docKey
              );
              console.log(response);
            }

            // Guardar la respuesta en el objeto answers
            answers.serviceResponse = response;

            // Validar si el cliente es válido
            const customerId = response?.apiResponse?.Cliente?.CustomerId;

            if (!customerId || customerId === 0) {
              // Reiniciar el flujo
              //return flowData;

              return {
                question:
                  "La cédula ingresada no es válida o no pertenece a un cliente Claro. Por favor, verifique e intente nuevamente.",
                audio: "/audio/MEGAN-CEDULA_INVALIDA.mp3",
                end: true,
                options: [
                  {
                    label: "Volver al inicio",
                    next: flowData,
                  },
                ],
              };
            }

            // Guardar el CustomerId en caso de que aún no esté
            if (!answers.CustomerId) {
              answers.CustomerId = customerId;
            }

            return {
              question: "Por favor, seleccione una opción",
              key: "customerId",
              value: response,
              audio: "/audio/MEGAN_1OP.mp3",
              options: [
                {
                  label: "Cliente Postpago",
                  next: postpaidFlow,
                },
                {
                  label: "Cliente Prepago",
                  next: prepagoFlow,
                },
                {
                  label: "Cliente Hogar",
                  next: hogarFlow,
                },
              ],
            };
          } catch (error) {
            console.error("Error al verificar el cliente:", error);
            return {
              question:
                "Error al verificar la información, intente nuevamente.",
            };
          }
        },
      },
    },
  ],
};

export default flowData;
