import * as UI from "./Inputs";
import "./Login.css";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        name,
        email,
        password,
      });
      alert(response.data); // Mensaje del backend
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fondo">
      {loading && <div>Cargando...</div>}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <UI.InputText
              type="email"
              id="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <UI.InputText
              type="password"
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <UI.InputText
              type="password"
              id="confirmPassword"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <UI.Button1>Registrarse</UI.Button1>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
