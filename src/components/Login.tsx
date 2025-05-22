import * as UI from "./Inputs";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner"; 
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true); // cargando al inicio
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // muestra spinner al enviar el formulario
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      alert(response.data.message); // Muestra el mensaje del backend

      if (response.data.message === "Inicio de sesión exitoso") {
        navigate("/menu"); // Redirige al menú si el login es exitoso
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner />}

      <div className="fondo" style={{ display: loading ? "none" : "block" }}>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-imagen">
            <img
              src="/UasLogo.png"
              alt="Logo"
              onLoad={() => setLoading(false)} // oculta spinner al cargar
            />
          </div>
          <div className="yamecanse">
            <UI.H2>Iniciar Sesión</UI.H2>
            <UI.Label>Correo Electronico</UI.Label>
            <UI.InputText
              type="email"
              id="email"
              placeholder="reprobados@uas"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <UI.Label>Contraseña</UI.Label>
            <UI.InputText
              type="password"
              id="password"
              placeholder="**************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="contraseña">
              <UI.Button3>Recuperar contraseña</UI.Button3>
            </div>
          </div>

          <UI.Button1>Iniciar Sesión</UI.Button1>
          <UI.Button2 onClick={() => navigate("/register")}>
            Registrarse
          </UI.Button2>
        </form>
      </div>
    </>
  );
};

export default Login;
