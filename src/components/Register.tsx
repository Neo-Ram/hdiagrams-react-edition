import Button1, { Button2 } from "./Inputs";
import { InputText } from "./Inputs";
import "./Login.css";

const Register = () => {
  return (
    <div className="login">
      <form className="login-form">
        <img src="../../public/UasLogo.png" alt="" />
        <InputText
          type="text"
          id="name"
          placeholder="Nombre de Usuario"
          required
        />
        <InputText
          type="email"
          id="email"
          placeholder="Correo Electronico"
          required
        />
        <InputText
          type="password"
          id="password"
          placeholder="Contraseña"
          required
        />
        <InputText
          type="password"
          id="confirmPassword"
          placeholder="Confirmar Contraseña"
          required
        />
        <Button1>Registrarse</Button1>
        <Button2>Iniciar sesion</Button2>
      </form>
    </div>
  );
};

export default Register;
