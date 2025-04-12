class ConversationFlowHandler {
  constructor(flowData, apiService) {
    this.flowData = flowData;
    this.apiService = apiService;
    this.answers = [];
  }

  // Maneja la selección de una opción
  handleOptionSelect(option) {
    this.answers.push(option.label);
    if (option.next) {
      return option.next;
    } else {
      this.sendData();
      return null;
    }
  }

  // Enviar los datos recolectados
  async sendData() {
    try {
      await this.apiService.sendDataToAPI(this.answers);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      throw error;
    }
  }
}

export default ConversationFlowHandler;
