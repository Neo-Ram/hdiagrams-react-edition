import Button1 from "./Inputs";
import { InputText } from "./Inputs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <InputText
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <InputText
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button1>Iniciar Sesión</Button1>
      </form>
    </div>
  );
};

export default Login;
