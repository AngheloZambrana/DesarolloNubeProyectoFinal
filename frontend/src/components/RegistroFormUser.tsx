import { useState } from "react";
import { userService } from "../services/userService";
import { useNavigate } from "react-router-dom";
import "./styles/RegistroFormUser.css";

export function RegistroFormUser() {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const uid = await userService.register(email, password, nombre);
      alert("Usuario registrado con UID: " + uid);
      navigate("/login");
    } catch (err) {
      alert("Error al registrar: " + err);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="form-user">
      <h2>Registro Usuario</h2>
      <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
      <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Registrarse</button>
      <p>
        ¿Ya tienes una cuenta?{" "}
        <span onClick={handleLoginRedirect}>¡Inicia Sesión!</span>
      </p>
    </form>
  );
}
