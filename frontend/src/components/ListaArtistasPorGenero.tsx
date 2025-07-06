import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";
import { useNavigate } from "react-router-dom";
import "./styles/ListaArtistasPorGenero.css";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase/firebaseInit";

export interface Artista {
  id: string;
  nombreArtistico: string;
  email: string;
  imageUrl?: string;
  generos?: string[];
}

interface Props {
  generoId: string;
}

export function ListaArtistasPorGenero({ generoId }: Props) {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [generosMap, setGenerosMap] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarArtistas = async () => {
      try {
        setCargando(true);
        
        logEvent(analytics, 'artists_loading', {
          genre_id: generoId
        });

        const artistasRef = collection(db, "singer");
        const q = query(artistasRef, where("generos", "array-contains", generoId));
        const artistasSnapshot = await getDocs(q);
        const artistasData = artistasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Artista[];

        logEvent(analytics, 'artists_loaded', {
          genre_id: generoId,
          artist_count: artistasData.length
        });

        const generosIds = new Set<string>();
        artistasData.forEach((artista) => {
          artista.generos?.forEach((generoId) => generosIds.add(generoId));
        });

        const generosMap: Record<string, string> = {};
        const generosRef = collection(db, "genres"); 
        const generosSnapshot = await getDocs(generosRef);

        generosSnapshot.forEach((doc) => {
          if (generosIds.has(doc.id)) {
            generosMap[doc.id] = doc.data().name; 
          }
        });

        setGenerosMap(generosMap);
        setArtistas(artistasData);
        
      } catch (error) {
        logEvent(analytics, 'artists_load_error', {
          genre_id: generoId,
          error: error instanceof Error ? error.message : String(error)
        });
      } finally {
        setCargando(false);
      }
    };

    cargarArtistas();
  }, [generoId]);

  const handleArtistaClick = (artistaId: string, artistaName: string) => {
    logEvent(analytics, 'artist_selected', {
      genre_id: generoId,
      artist_id: artistaId,
      artist_name: artistaName
    });
    navigate(`/artista/${artistaId}/canciones`);
  };

  if (cargando) return <p>Cargando artistas...</p>;
  
  if (artistas.length === 0) {
    logEvent(analytics, 'no_artists_for_genre', {
      genre_id: generoId
    });
    return <p>No hay artistas en este género.</p>;
  }

  return (
    <div className="artistas-grid">
      {artistas.map((artista) => (
        <div 
          key={artista.id} 
          className="artista-card"
          onClick={() => handleArtistaClick(artista.id, artista.nombreArtistico)}
        >
          <img
            src={artista.imageUrl || "/default-artist.jpg"}
            alt={artista.nombreArtistico}
            className="artista-img"
            onLoad={() => {
              logEvent(analytics, 'artist_image_loaded', {
                artist_id: artista.id
              });
            }}
          />
          <h3 className="artista-nombre">{artista.nombreArtistico}</h3>
          {artista.generos && (
            <div className="generos-container">
              {artista.generos.slice(0, 3).map((generoId) => (
                <span key={generoId} className="genero-tag">
                  {generosMap[generoId] || generoId}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}