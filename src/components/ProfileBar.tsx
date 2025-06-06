import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "./ProfileBar.css";

const ProfileBar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>(
    "/default-profile.png"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPasswordModal, setShowPasswordModal] = useState<
    null | "good" | "bad"
  >(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const savedImage = localStorage.getItem("profileImage");
    if (name) {
      setUserName(name);
    }
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setProfileImage(imageUrl);
        localStorage.setItem("profileImage", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const menuItems = [
    { icon: "📊", text: "Recientes", onClick: () => console.log("Recientes") },
    {
      icon: "📁",
      text: "Mis Diagramas",
      onClick: () => console.log("Mis Diagramas"),
    },
    { icon: "⭐", text: "Favoritos", onClick: () => console.log("Favoritos") },
    {
      icon: "✨",
      text: "Hopes and Dreams",
      onClick: () => console.log("Hopes and Dreams"),
    },
    { icon: "🏆", text: "???", onClick: () => setShowPasswordModal("good") },
    { icon: "❌", text: "???", onClick: () => setShowPasswordModal("bad") },
  ];

  return (
    <div className="profile-bar">
      <div className="profile-section">
        <div className="profile-image-container">
          <img src={profileImage} alt="Profile" className="profile-image" />
          <div
            className="edit-profile-image"
            onClick={() => fileInputRef.current?.click()}
            title="Cambiar foto de perfil"
          >
            ✏️
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="file-input"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="welcome-message">
          ¡Bienvenido, <span className="user-name">{userName}</span>!
        </div>
      </div>

      <div className="menu-sections">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item" onClick={item.onClick}>
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        <span>🚪</span>
        <span>Cerrar Sesión</span>
      </button>

      {showPasswordModal && (
        <div className="mini-modal">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Cambia las contraseñas aquí
              if (showPasswordModal === "good" && password === "ganamos") {
                setShowPasswordModal(null);
                setPassword("");
                setError("");
                navigate("/good");
              } else if (
                showPasswordModal === "bad" &&
                password === "perdimos"
              ) {
                setShowPasswordModal(null);
                setPassword("");
                setError("");
                navigate("/bad");
              } else {
                setError("Contraseña incorrecta");
              }
            }}
          >
            <label>Introduce la contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button type="submit">Entrar</button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(null);
                  setPassword("");
                  setError("");
                }}
              >
                Cancelar
              </button>
            </div>
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileBar;
