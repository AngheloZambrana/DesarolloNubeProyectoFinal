import { useEffect, useState } from "react";
import { generoService, type Genero } from "../services/generoService";
import { useNavigate } from "react-router-dom";
import "./styles/ListaGeneros.css";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase/firebaseInit";

export function ListaGeneros() {
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarGeneros = async () => {
      try {
        const data = await generoService.obtenerGeneros();
        setGeneros(data);
        
        logEvent(analytics, 'genres_loaded', {
          count: data.length,
          first_genre: data[0]?.name || 'none'
        });
      } catch (error) {
        logEvent(analytics, 'genres_load_error', {
          error: error instanceof Error ? error.message : String(error)
        });
      } finally {
        setCargando(false);
      }
    };
    cargarGeneros();
  }, []);

  const handleGenreClick = (genero: Genero) => {
    logEvent(analytics, 'genre_selected', {
      genre_id: genero.id,
      genre_name: genero.name
    });
    navigate(`/genero/${genero.id}`);
  };


  if (cargando) {
    logEvent(analytics, 'genres_loading');
    return <p>Cargando géneros...</p>;
  }
  
  if (generos.length === 0) {
    logEvent(analytics, 'no_genres_available');
    return <p>No hay géneros disponibles.</p>;
  }

  return (
    <div className="generos-grid">
      {generos.map((g) => (
        <div
          key={g.id}
          className="genero-card"
          onClick={() => handleGenreClick(g)}
          style={{ cursor: "pointer" }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if(e.key === "Enter") navigate(`/genero/${g.id}`) }}
        >
          <img src={g.imageUrl} alt={g.name} className="genero-img" />
          <h3 className="genero-title">{g.name}</h3>
        </div>
      ))}
    </div>
  );
}
