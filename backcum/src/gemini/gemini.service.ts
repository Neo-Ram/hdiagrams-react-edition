import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as JSZip from 'jszip';

dotenv.config();

@Injectable()
export class GeminiService {
  private readonly API_KEY: string;
  private readonly API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY no está definida en las variables de entorno');
    }
    this.API_KEY = apiKey;
    this.genAI = new GoogleGenerativeAI(this.API_KEY);
  }

  private async callGeminiAPI(prompt: string) {
    try {
      console.log('Llamando a la API de Gemini...');
      const response = await axios.post(
        `${this.API_URL}?key=${this.API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1, // Reducir la temperatura para respuestas más consistentes
            topK: 1,
            topP: 1,
            maxOutputTokens: 8192,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Respuesta de la API de Gemini recibida');
      const text = response.data.candidates[0].content.parts[0].text;
      console.log('Texto de la respuesta:', text);
      
      // Limpiar la respuesta de cualquier formato no deseado
      let cleanedText = text
        .replace(/```json\n?/g, '')  // Eliminar ```json
        .replace(/```\n?/g, '')      // Eliminar ```
        .replace(/^[\s\S]*?({[\s\S]*})[\s\S]*$/, '$1')  // Extraer solo el JSON
        .replace(/\n/g, ' ')         // Reemplazar saltos de línea con espacios
        .replace(/\s+/g, ' ')        // Normalizar espacios
        .trim();                     // Eliminar espacios en blanco

      console.log('Texto limpio:', cleanedText);

      // Intentar extraer el JSON si está dentro de un bloque de código
      if (cleanedText.includes('{') && cleanedText.includes('}')) {
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanedText = jsonMatch[0];
        }
      }

      try {
        // Intentar parsear el JSON para validarlo
        const parsed = JSON.parse(cleanedText);
        console.log('JSON validado correctamente');
        
        // Validar la estructura del JSON
        if (!parsed.files || !Array.isArray(parsed.files)) {
          throw new Error('La respuesta no tiene la estructura esperada (falta el array "files")');
        }

        // Validar cada archivo
        for (const file of parsed.files) {
          if (!file.path || !file.content) {
            throw new Error('Algunos archivos no tienen path o content');
          }
        }

        return JSON.stringify(parsed); // Devolver un JSON limpio
      } catch (error) {
        console.error('Error al parsear JSON:', error);
        console.error('Texto recibido:', text);
        console.error('Texto limpio:', cleanedText);
        
        // Intentar una limpieza más agresiva
        cleanedText = cleanedText
          .replace(/[^\x20-\x7E]/g, '') // Eliminar caracteres no imprimibles
          .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3') // Asegurar que las claves estén entre comillas
          .replace(/(:\s*)([^"{\[\d][^,}\]]*?)([,\s}])/g, '$1"$2"$3'); // Asegurar que los valores string estén entre comillas

        try {
          const parsed = JSON.parse(cleanedText);
          console.log('JSON validado después de limpieza agresiva');
          return JSON.stringify(parsed);
        } catch (finalError) {
          console.error('Error final al parsear JSON:', finalError);
          throw new Error('No se pudo obtener un JSON válido de la respuesta de Gemini');
        }
      }
    } catch (error) {
      console.error('Error en la llamada a Gemini:', error.response?.data || error.message);
      throw new Error(`Error en la llamada a Gemini: ${error.message}`);
    }
  }

  async analyzeDiagram(diagramData: any, diagramType: string) {
    try {
      const prompt = `Analiza el siguiente diagrama UML de tipo ${diagramType} y proporciona un análisis detallado: ${JSON.stringify(diagramData)}`;
      return await this.callGeminiAPI(prompt);
    } catch (error) {
      throw new Error(`Error al analizar el diagrama: ${error.message}`);
    }
  }

  async generateProject(projectData: any) {
    try {
      console.log('Iniciando generación de proyecto con datos:', JSON.stringify(projectData, null, 2));

      // Generar primero la estructura básica del proyecto
      let structurePrompt = `Genera la estructura básica de un proyecto basado en los siguientes diagramas UML.
      IMPORTANTE: La respuesta DEBE ser un JSON válido con la siguiente estructura exacta:
      {
        "files": [
          {
            "path": "ruta/del/archivo",
            "content": "contenido del archivo"
          }
        ]
      }

      REGLAS ESTRICTAS:
      1. NO uses markdown
      2. NO uses backticks
      3. NO uses comentarios
      4. SOLO devuelve el JSON puro
      5. Asegúrate de que todas las claves estén entre comillas dobles
      6. Asegúrate de que todos los strings estén entre comillas dobles
      7. Asegúrate de que no haya comas finales en objetos o arrays
      8. Asegúrate de que el JSON sea válido y pueda ser parseado
      9. Asegúrate de que cada archivo tenga path y content
      10. Asegúrate de que el path sea una ruta válida
      11. Asegúrate de que el content sea el contenido completo del archivo

      Diagramas disponibles:\n\n`;

      const { diagrams } = projectData;
      console.log('Diagramas recibidos:', JSON.stringify(diagrams, null, 2));
      
      if (diagrams.class) {
        structurePrompt += `1. Diagrama de Clases:\n${JSON.stringify(diagrams.class)}\n\n`;
      }
      
      if (diagrams.sequence) {
        structurePrompt += `2. Diagrama de Secuencia:\n${JSON.stringify(diagrams.sequence)}\n\n`;
      }
      
      if (diagrams.usecase) {
        structurePrompt += `3. Diagrama de Casos de Uso:\n${JSON.stringify(diagrams.usecase)}\n\n`;
      }
      
      if (diagrams.component) {
        structurePrompt += `4. Diagrama de Componentes:\n${JSON.stringify(diagrams.component)}\n\n`;
      }
      
      if (diagrams.package) {
        structurePrompt += `5. Diagrama de Paquetes:\n${JSON.stringify(diagrams.package)}\n\n`;
      }

      structurePrompt += `Genera SOLO los siguientes archivos de configuración inicial:

1. package.json (tanto para frontend como backend)
2. tsconfig.json (tanto para frontend como backend)
3. .env.example
4. .gitignore
5. README.md con instrucciones básicas

IMPORTANTE:
- La respuesta DEBE ser un JSON válido
- NO uses markdown
- NO uses backticks
- NO uses comentarios
- SOLO devuelve el JSON puro con la estructura especificada
- Asegúrate de que todos los strings estén correctamente escapados
- Asegúrate de que todas las comillas sean dobles
- Asegúrate de que no haya comas finales en los objetos o arrays

RECUERDA: La respuesta DEBE ser un JSON válido que pueda ser parseado directamente.`;

      console.log('Enviando prompt de estructura a Gemini...');
      const structureResponse = await this.callGeminiAPI(structurePrompt);
      console.log('Respuesta de estructura recibida:', structureResponse);

      // Generar el backend
      const backendPrompt = `Basado en los diagramas UML proporcionados, genera el código del backend.
      IMPORTANTE: La respuesta DEBE ser un JSON válido con la siguiente estructura exacta:
      {
        "files": [
          {
            "path": "ruta/del/archivo",
            "content": "contenido del archivo"
          }
        ]
      }

      Genera SOLO los archivos del backend con la siguiente estructura:
      - src/
        - controllers/
        - models/
        - routes/
        - services/
        - middleware/
        - config/
        - utils/

      Incluye:
      - Configuración de Express
      - Middleware de autenticación
      - Manejo de errores
      - Conexión a base de datos
      - Validación de datos
      - Documentación de API con Swagger

      REGLAS ESTRICTAS:
      1. NO uses markdown
      2. NO uses backticks
      3. NO uses comentarios
      4. SOLO devuelve el JSON puro
      5. Asegúrate de que todas las claves estén entre comillas dobles
      6. Asegúrate de que todos los strings estén entre comillas dobles
      7. Asegúrate de que no haya comas finales en objetos o arrays
      8. Asegúrate de que el JSON sea válido y pueda ser parseado
      9. Asegúrate de que cada archivo tenga path y content
      10. Asegúrate de que el path sea una ruta válida
      11. Asegúrate de que el content sea el contenido completo del archivo

      RECUERDA: La respuesta DEBE ser un JSON válido que pueda ser parseado directamente.`;

      console.log('Enviando prompt de backend a Gemini...');
      const backendResponse = await this.callGeminiAPI(backendPrompt);
      console.log('Respuesta de backend recibida:', backendResponse);

      // Generar el frontend
      const frontendPrompt = `Basado en los diagramas UML proporcionados, genera el código del frontend.
      IMPORTANTE: La respuesta DEBE ser un JSON válido con la siguiente estructura exacta:
      {
        "files": [
          {
            "path": "ruta/del/archivo",
            "content": "contenido del archivo"
          }
        ]
      }

      Genera SOLO los archivos del frontend con la siguiente estructura:
      - src/
        - components/
        - pages/
        - hooks/
        - context/
        - services/
        - utils/
        - styles/

      Incluye:
      - Configuración de React Router
      - Manejo de estado con Context API
      - Componentes reutilizables
      - Formularios con validación
      - Estilos con Tailwind CSS
      - Manejo de errores
      - Loading states

      REGLAS ESTRICTAS:
      1. NO uses markdown
      2. NO uses backticks
      3. NO uses comentarios
      4. SOLO devuelve el JSON puro
      5. Asegúrate de que todas las claves estén entre comillas dobles
      6. Asegúrate de que todos los strings estén entre comillas dobles
      7. Asegúrate de que no haya comas finales en objetos o arrays
      8. Asegúrate de que el JSON sea válido y pueda ser parseado
      9. Asegúrate de que cada archivo tenga path y content
      10. Asegúrate de que el path sea una ruta válida
      11. Asegúrate de que el content sea el contenido completo del archivo

      RECUERDA: La respuesta DEBE ser un JSON válido que pueda ser parseado directamente.`;

      console.log('Enviando prompt de frontend a Gemini...');
      const frontendResponse = await this.callGeminiAPI(frontendPrompt);
      console.log('Respuesta de frontend recibida:', frontendResponse);

      // Combinar todas las respuestas
      const structureFiles = JSON.parse(structureResponse).files;
      const backendFiles = JSON.parse(backendResponse).files;
      const frontendFiles = JSON.parse(frontendResponse).files;

      const allFiles = [...structureFiles, ...backendFiles, ...frontendFiles];
      
      return { files: allFiles };
    } catch (error) {
      console.error('Error en generateProject:', error);
      throw new Error(`Error al generar el proyecto: ${error.message}`);
    }
  }

  async generateCode(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating code:', error);
      throw new Error('Failed to generate code');
    }
  }

  async generateProjectZip(files: { path: string; content: string }[]): Promise<Buffer> {
    try {
      const zip = new JSZip();
      
      // Crear la estructura de directorios y agregar archivos
      files.forEach(file => {
        // Asegurarse de que la ruta use forward slashes
        const normalizedPath = file.path.replace(/\\/g, '/');
        
        // Crear la estructura de directorios si es necesario
        const pathParts = normalizedPath.split('/');
        let currentFolder = zip;
        
        // Crear la estructura de carpetas
        for (let i = 0; i < pathParts.length - 1; i++) {
          const folderName = pathParts[i];
          if (!currentFolder.folder(folderName)) {
            currentFolder = currentFolder.folder(folderName)!;
          }
        }
        
        // Agregar el archivo
        const fileName = pathParts[pathParts.length - 1];
        currentFolder.file(fileName, file.content);
      });

      // Generar el ZIP como Buffer
      const zipBuffer = await zip.generateAsync({ 
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      });
      
      return zipBuffer;
    } catch (error) {
      console.error('Error creating ZIP:', error);
      throw new Error('Failed to create ZIP file');
    }
  }
} 