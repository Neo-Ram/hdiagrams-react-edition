import * as UI from "./Inputs";
import "./Login.css";

const Register = () => {
  return (
    <div className="fondo">
      <div className="login">
        <form className="login-form2">
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
