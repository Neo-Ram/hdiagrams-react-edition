// Función para inicializar los eventos de los botones
export const initializeMenuEvents = (): void => {
  // Esperar a que el DOM esté completamente cargado
  document.addEventListener("DOMContentLoaded", () => {
    // Obtener el botón por su ID
    const opcion1Btn = document.getElementById("opcion1-btn");

    // Verificar si el botón existe
    if (opcion1Btn) {
      // Agregar un event listener para el evento click
      opcion1Btn.addEventListener("click", () => {
        // Mostrar la alerta
        alert("Se está trabajando en esta funcionalidad");
      });
    }
  });
};
