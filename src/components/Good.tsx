import "./GoodFireworks.css";

const Good = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(#0007, #0000), #123",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* Imagen al fondo */}
      <img
        src="/good.jpg"
        alt="Good"
        style={{
          maxWidth: "90vw",
          maxHeight: "60vh",
          marginTop: 24,
          borderRadius: "32px",
          boxShadow: "0 8px 32px #000a",
          zIndex: 0,
          position: "absolute", // <-- importante
        }}
      />
      {/* Fuegos artificiales encima */}
      <div className="firework"></div>
      <div className="firework"></div>
      <div className="firework"></div>
      <div className="firework"></div>
      <div className="firework"></div>
    </div>
  );
};

export default Good;