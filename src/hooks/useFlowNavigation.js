import { useCallback } from "react";

const useFlowNavigation = (flowData, setCurrentFlow) => {
  // Navegar al siguiente flujo usando string de ruta o referencia directa
  const navigateToFlow = useCallback(
    (nextFlowPath) => {
      if (!nextFlowPath) return;

      // Si nextFlow es una referencia string, resolverla desde flowData
      if (typeof nextFlowPath === "string") {
        const pathParts = nextFlowPath.split(".");
        let targetFlow = flowData;

        for (const part of pathParts) {
          if (targetFlow?.[part]) {
            targetFlow = targetFlow[part];
          } else {
            console.error(`Flujo "${nextFlowPath}" no encontrado`);
            targetFlow = {};
            break;
          }
        }

        setCurrentFlow(targetFlow);
      } else {
        // Objeto de flujo directo
        setCurrentFlow(nextFlowPath);
      }
    },
    [flowData, setCurrentFlow]
  );

  return { navigateToFlow };
};

export default useFlowNavigation;
