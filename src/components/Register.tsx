import * as UI from "./Inputs";
import "./Login.css";
import { useState } from "react";
import Spinner from "./Spinner"; 
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        name,
        email,
        password,
      });
      toast.success(response.data); // Mensaje del backend
      setTimeout(() => {
        navigate('/login'); // Redirige al login después de registrarse
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      {loading && <Spinner />}
      <div className="fondo" style={{ display: loading ? "none" : "block" }}>
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
    </>
  );
};

export default Register;
