const SERVICE_AVAILABLES_URL = "http://10.31.32.76/WsAVATAR/api/avatar/service-availables";

export const getServiceAvailables = async (identificationNumber, identificationType) => {
  try {
    console.log("Datos a enviar a la API" + 
      JSON.stringify({
      identificationNumber,
      identificationType
    }))

    const response = await fetch(SERVICE_AVAILABLES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        identificationNumber,
        identificationType
      })
    });
    if (!response.ok) {
      const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la solicitud de service-availables');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error consultando servicios disponibles:", error);
    throw error;
  }
};
