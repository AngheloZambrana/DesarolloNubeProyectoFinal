import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generoService, type Genero } from "../../services/generoService";
import { ListaArtistasPorGenero } from "../../components/ListaArtistasPorGenero";
import "../styles/GeneroDetallePage.css";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase/firebaseInit";

export function GeneroDetallePage() {
  const { generoId } = useParams();
  const [genero, setGenero] = useState<Genero | null>(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarGenero = async () => {
      try {
        const generos = await generoService.obtenerGeneros();
        const encontrado = generos.find((g) => g.id === generoId);
        
        if (encontrado) {
          logEvent(analytics, 'genre_view', {
            genre_id: encontrado.id,
            genre_name: encontrado.name
          });
        }
        
        setGenero(encontrado || null);
      } catch (error) {
        logEvent(analytics, 'genre_load_error', {
          genre_id: generoId || 'unknown',
          error: error instanceof Error ? error.message : String(error)
        });
      } finally {
        setCargando(false);
      }
    };
    
    cargarGenero();
  }, [generoId]);

  const handleBackClick = () => {
    logEvent(analytics, 'back_to_home', {
      from_page: 'GenreDetailPage'
    });
    navigate("/UserHome");
  };

  if (cargando) {
    logEvent(analytics, 'genre_loading', {
      genre_id: generoId || 'unknown'
    });
    return <p className="genero-loading">Cargando género...</p>;
  }
  
  if (!genero) {
    logEvent(analytics, 'genre_not_found', {
      genre_id: generoId || 'unknown'
    });
    return <p className="genero-notfound">Género no encontrado.</p>;
  }

  return (
  <div className="genero-detalle-page">
    <div className="genero-contenedor">
      <h1 className="genero-nombre">{genero.name}</h1>
      <img src={genero.imageUrl} alt={genero.name} className="genero-imagen" />
      <h2 className="genero-subtitulo">Artistas del género:</h2>
      <ListaArtistasPorGenero generoId={genero.id} />
      <button className="volver-btn" onClick={handleBackClick}>
        Volver al Home
      </button>
    </div>
  </div>
);
}
