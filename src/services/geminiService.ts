import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const analyzeDiagram = async (diagramData: any, diagramType: string) => {
  try {
    const response = await axios.post(`${API_URL}/gemini/analyze`, {
      diagramData,
      diagramType,
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al analizar el diagrama');
  }
};

export const generateProject = async (projectId: string) => {
  try {
    // Obtener todos los diagramas del proyecto desde el backend
    const diagramTypes = ['class', 'sequence', 'usecase', 'component', 'package'];
    const diagramsPromises = diagramTypes.map(type => 
      axios.get(`${API_URL}/diagrams/get?project_id=${projectId}&type=${type}`)
    );

    const diagramsResponses = await Promise.all(diagramsPromises);
    
    // Procesar las respuestas y extraer los JSON
    const diagrams = diagramsResponses.reduce((acc, response, index) => {
      if (response.data && response.data.json) {
        try {
          acc[diagramTypes[index]] = JSON.parse(response.data.json);
        } catch (e) {
          console.error(`Error al parsear el diagrama de ${diagramTypes[index]}:`, e);
          acc[diagramTypes[index]] = null;
        }
      } else {
        acc[diagramTypes[index]] = null;
      }
      return acc;
    }, {} as Record<string, any>);

    // Enviar los diagramas a Gemini para generar el código
    const response = await axios.post(`${API_URL}/gemini/generate-project`, {
      projectId,
      diagrams,
    });

    return response.data;
  } catch (error) {
    throw new Error('Error al generar el proyecto');
  }
}; 