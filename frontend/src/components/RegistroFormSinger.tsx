import { useState } from "react";
import { singerService } from "../services/singerService";
import { useNavigate } from "react-router-dom";
import "./styles/RegistroFormSinger.css";

export function RegistroFormSinger() {
  const [email, setEmail] = useState("");
  const [nombreArtistico, setNombreArtistico] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const uid = await singerService.register(email, password, nombreArtistico);
      alert("Artista registrado con UID: " + uid);
      navigate("/login");
    } catch (err) {
      alert("Error al registrar: " + err);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="form-singer">
      <h2>Registro Artista</h2>
      <input type="text" placeholder="Nombre Artístico" value={nombreArtistico} onChange={e => setNombreArtistico(e.target.value)} required />
      <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Registrarse</button>
      <p>
        ¿Eres un cantante ya registrado?{" "}
        <span onClick={handleLoginRedirect}>¡Inicia Sesión!</span>
      </p>
    </form>
  );
}
