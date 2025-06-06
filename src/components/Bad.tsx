const Bad = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "80vh"
    }}>
      <img
        src="/bad.jpg" 
        alt="Bad"
        style={{ maxWidth: "90vw", maxHeight: "60vh", marginTop: 24 }}
      />
    </div>
  );
};

export default Bad;