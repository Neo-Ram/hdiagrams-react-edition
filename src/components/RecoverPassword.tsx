import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import "./Login.css";
import Spinner from "./Spinner";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validación simple de correo
  const isEmailValid = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid(email)) {
      toast.error("Ingresa un correo válido");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/auth/recover-password", { email });
      toast.success("Si el correo existe, se enviaron instrucciones.");
    } catch {
      toast.error("Hubo un problema. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/login");
      setLoading(false);
    }, 800);
  };

  return (
    <>
      <Toaster />
      {loading && <Spinner />}
      <div className="fondo" style={{ display: loading ? "none" : "block" }}>
        <form onSubmit={handleRecover} className="recover-form">
          <div className="form-imagen">
            <img src="/UasLogo.png" alt="Logo" />
          </div>
          <h2>Recuperar contraseña</h2>
          <div className="recover-message">Ingresa tu correo</div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isEmailValid(email)}
            >
              Recuperar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RecoverPassword;