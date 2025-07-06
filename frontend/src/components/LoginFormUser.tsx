import { useState } from "react";
import { userService } from "../services/userService";
import { useNavigate } from "react-router-dom";
import "./styles/LoginFormUser.css";

export function LoginFormUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.login(email, password);
      navigate("/UserHome");
    } catch (error) {
      alert("Error al iniciar sesión: " + error);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <form onSubmit={handleLogin} className="form-user-login">
      <h2>Login Usuario</h2>
      <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Iniciar sesión</button>
      <p>
        ¿No tienes cuenta?{" "}
        <span onClick={handleRegisterRedirect}>¡Regístrate aquí!</span>
      </p>
    </form>
  );
}
