import * as UI from "./Inputs";
import "./Login.css";
import { useState } from "react";
import Spinner from "./Spinner";

const Register = () => {
  const [loading, setLoading] = useState(false); // Estado de carga, inicialmente falso

  // Simulación de un proceso de registro
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Empieza el proceso de carga
    // Aquí iría la lógica real de registro
    setTimeout(() => {
      setLoading(false); // Finaliza la carga después de un tiempo (simulando un proceso)
      console.log("Registro completado");
    }, 2000); // Simula un retraso de 2 segundos
  };

  return (
    <div className="fondo">
      {loading && <Spinner />} {/* Muestra el spinner si está cargando */}
      <div className="login">
        <form onSubmit={handleRegister} className="login-form2">
          <div className="form-imagen">
            <img src="/UasLogo.png" alt="" />
          </div>
          <div className="yamecanse">
            <UI.H2>Registrarse</UI.H2>
            <UI.InputText
              type="text"
              id="name"
              placeholder="Nombre de Usuario"
              required
            />
            <UI.InputText
              type="email"
              id="email"
              placeholder="Correo Electronico"
              required
            />
            <UI.InputText
              type="password"
              id="password"
              placeholder="Contraseña"
              required
            />
            <UI.InputText
              type="password"
              id="confirmPassword"
              placeholder="Confirmar Contraseña"
              required
            />
            <UI.Button1>Registrarse</UI.Button1>
            <UI.Button2>Iniciar sesion</UI.Button2>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
