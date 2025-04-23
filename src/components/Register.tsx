import * as UI from "./Inputs";
import "./Login.css";

const Register = () => {
  return (
    <div className="login">
      <form className="login-form">
        <img src="../../public/UasLogo.png" alt="" />
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
      </form>
    </div>
  );
};

export default Register;
