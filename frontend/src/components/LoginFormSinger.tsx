import { useState } from "react";
import { singerService } from "../services/singerService";
import { useNavigate } from "react-router-dom";
import "./styles/LoginFormSinger.css";

export function LoginFormSinger() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await singerService.login(email, password);
      navigate("/AdminHome");
    } catch (error) {
      alert("Error al iniciar sesión: " + error);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <form onSubmit={handleLogin} className="form-singer-login">
      <h2>Login Artista</h2>
      <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Iniciar sesión</button>
      <p>
        ¿Quieres registrarte como un nuevo cantante?{" "}
        <span onClick={handleRegisterRedirect}>¡Regístrate aquí!</span>
      </p>
    </form>
  );
}
