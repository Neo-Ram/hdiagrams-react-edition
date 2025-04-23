import * as UI from "./Inputs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de autenticación
    console.log("Login attempt:", { email, password });
    // Redirigir al menú después de iniciar sesión
    navigate("/menu");
  };

  return (
    <div className="fondo">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-imagen">
          <img src="/UasLogo.png" alt="" />
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

        <div className="login-buton">
          <UI.Button1>Iniciar Sesión</UI.Button1>
          <UI.Button3 onClick={() => navigate("/register")}>
            Registrarse
          </UI.Button3>
        </div>
      </form>
    </div>
  );
};

export default Login;
