import { useEffect, useRef } from "react";

const fireColorsPalette = [
  [0, 0, 0], [7, 7, 7], [31, 7, 7], [47, 15, 7], [71, 15, 7], [87, 23, 7], [103, 31, 7], [119, 31, 7],
  [143, 39, 7], [159, 47, 7], [175, 63, 7], [191, 71, 7], [199, 71, 7], [223, 79, 7], [223, 87, 7], [223, 87, 7],
  [215, 95, 7], [215, 95, 7], [215, 103, 15], [207, 111, 15], [207, 119, 15], [207, 127, 15], [207, 135, 23],
  [199, 135, 23], [199, 143, 23], [199, 151, 31], [191, 159, 31], [191, 159, 31], [191, 167, 39], [191, 167, 39],
  [191, 175, 47], [183, 175, 47], [183, 183, 47], [183, 183, 55], [207, 207, 111], [223, 223, 159], [239, 239, 199],
  [255, 255, 255]
];

const Bad = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Usamos el ancho de la ventana
  const width = window.innerWidth;
  const height = window.innerHeight; // Ahora todo el alto de la ventana

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajusta el tamaño del canvas al tamaño de la ventana
    canvas.width = width;
    canvas.height = height;

    const firePixelsArray = new Uint8Array(width * height);

    function createFireDataStructure() {
      firePixelsArray.fill(0);
    }

    function createFireSource() {
      for (let x = 0; x < width; x++) {
        const overflowPixelIndex = width * height;
        const pixelIndex = (overflowPixelIndex - width) + x;
        firePixelsArray[pixelIndex] = 36;
      }
    }

    function updateFireIntensityPerPixel(currentPixelIndex: number) {
      const belowPixelIndex = currentPixelIndex + width;
      if (belowPixelIndex >= width * height) return;
      const decay = Math.floor(Math.random() * 1.2);
      const belowPixelFireIntensity = firePixelsArray[belowPixelIndex];
      const newFireIntensity = belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0;
      firePixelsArray[currentPixelIndex - decay] = newFireIntensity;
    }

    function calculateFirePropagation() {
      for (let x = 0; x < width; x++) {
        for (let y = 1; y < height; y++) {
          const pixelIndex = x + y * width;
          updateFireIntensityPerPixel(pixelIndex);
        }
      }
    }

    function renderFire() {
      if (!ctx) return;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pixelIndex = x + y * width;
          const fireIntensity = firePixelsArray[pixelIndex];
          const color = fireColorsPalette[fireIntensity] || [0, 0, 0];
          const dataIndex = (x + y * width) * 4;
          data[dataIndex] = color[0];
          data[dataIndex + 1] = color[1];
          data[dataIndex + 2] = color[2];
          data[dataIndex + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }

    let animationFrameId: number;

    function animate() {
      calculateFirePropagation();
      renderFire();
      animationFrameId = requestAnimationFrame(animate);
    }

    createFireDataStructure();
    createFireSource();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* Canvas de fuego, fondo */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          bottom: 0, // <-- pegado abajo
          left: 0,
          width: "100vw",
          height: "100vh", // <-- todo el alto
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      {/* Imagen encima del fuego */}
      <img
        src="/bad.jpg"
        alt="Bad"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "60vw", // más grande
          maxHeight: "60vh",
          borderRadius: "16px",
          boxShadow: "0 8px 32px #000a"
        }}
      />
    </div>
  );
};

export default Bad;