import Button1, { Button2 } from "./Inputs";
import { InputText } from "./Inputs";
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
    <div className="login">
      <form onSubmit={handleSubmit} className="login-form">
        <img src="../../public/UasLogo.png" alt="" />
        <InputText
          type="email"
          id="email"
          placeholder="Correo Electronico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputText
          type="password"
          id="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button1>Iniciar Sesión</Button1>
        <Button2 onClick={() => navigate("/register")}>Registrarse</Button2>
      </form>
    </div>
  );
};

export default Login;
