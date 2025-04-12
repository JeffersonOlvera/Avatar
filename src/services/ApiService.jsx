class ApiService {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  //Enqueue
  async post(data) {
    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${this.apiKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en la solicitud a QFLOW");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en la solicitud a QFLOW:", error);
      throw error;
    }
  }

  //Service-availables
  async getServiceAvailables(identificationNumber, identificationType) {
    console.log(
      "Enviando a service-availables:",
      identificationNumber + " " + identificationType
    );

    try {
      const serviceAvailablesURL = import.meta.env.VITE_URL_CONSULTAR;

      const requestData = {
        identificationNumber,
        identificationType,
      };

      const response = await fetch(serviceAvailablesURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${this.apiKey}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en la solicitud a QFLOW");
      }

      return await response.json();
    } catch (error) {
      console.error("Error en la solicitud a QFLOW:", error);
      throw error;
    }
  }
}

export default ApiService;
