import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { singerService } from "../services/singerService";
import { type Song, songService } from "../services/songService";
import { generoService, type Genero } from "../services/generoService";
import type { Artista } from "./ListaArtistasPorGenero";
import "./styles/ListaCancionesArtista.css"
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase/firebaseInit";

export function ListaCancionesArtista() {
  const { artistaId } = useParams<{ artistaId: string }>();
  const [canciones, setCanciones] = useState<Song[]>([]);
  const [artista, setArtista] = useState<Artista | null>(null);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<string | null>(null);

  useEffect(() => {
    if (artistaId) {
      logEvent(analytics, 'artist_view', {
        artist_id: artistaId
      });
    }
  }, [artistaId]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError(null);
        
        if (!artistaId) {
          throw new Error("No se proporcionó ID de artista");
        }

        const generosData = await generoService.obtenerGeneros();
        setGeneros(generosData);
        logEvent(analytics, 'genres_loaded', {
          count: generosData.length
        });

        const artistaData = await singerService.obtenerSingerPorId(artistaId);
        if (!artistaData) {
          throw new Error("Artista no encontrado");
        }
        setArtista({
          id: artistaData.id,
          nombreArtistico: artistaData.nombreArtistico,
          email: artistaData.email,
          imageUrl: artistaData.imageUrl,
          generos: artistaData.generos,
        });
        logEvent(analytics, 'artist_data_loaded', {
          artist_name: artistaData.nombreArtistico,
          genre_count: artistaData.generos?.length || 0
        });

        const cancionesData = await songService.getSongsBySinger(artistaId);
        setCanciones(cancionesData);
        logEvent(analytics, 'artist_songs_loaded', {
          song_count: cancionesData.length,
          artist_id: artistaId
        });
        
      } catch (err) {
        console.error("Error al cargar datos:", err);
        const errorMsg = err instanceof Error ? err.message : "Error desconocido";
        setError(errorMsg);
        
        logEvent(analytics, 'artist_page_error', {
          error: errorMsg,
          artist_id: artistaId
        });
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [artistaId]);

  const obtenerNombresGeneros = (generosIds: string[] | undefined): string => {
    if (!generosIds || generosIds.length === 0) return "Sin géneros especificados";
    
    return generosIds
      .map((id) => generos.find((g) => g.id === id)?.name || id) 
      .join(", ");
  };

  const handleSongPlay = (song: Song) => {
    setCurrentSong(song.name);
    logEvent(analytics, 'song_play', {
      song_id: song.id,
      song_name: song.name,
      artist_id: artistaId,
      artist_name: artista?.nombreArtistico || 'unknown'
    });
  };

  if (cargando) {
    logEvent(analytics, 'artist_page_loading', {
      artist_id: artistaId
    });
    return <div className="loading-spinner">Cargando...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!artista) {
    logEvent(analytics, 'artist_not_found', {
      artist_id: artistaId
    });
    return <div className="error-message">Artista no encontrado</div>;
  }

  return (
    <div className="artist-songs-container">
      <div className="artist-header">
        <img
          src={artista.imageUrl || "/default-artist.jpg"}
          alt={artista.nombreArtistico}
          className="artist-image"
        />
        <div className="artist-info">
          <h1 className="artist-name">{artista.nombreArtistico}</h1>
          <p className="artist-genres">
            {obtenerNombresGeneros(artista.generos)}
          </p>
        </div>
      </div>

      <div className="songs-list">
        <h2 className="songs-title">Canciones</h2>
        {canciones.length === 0 ? (
          <>
            {logEvent(analytics, 'no_songs_for_artist', {
              artist_id: artistaId
            })}
            <div className="empty-state">
              <p>Este artista no tiene canciones publicadas aún.</p>
            </div>
          </>
        ) : (
          <div className="songs-grid">
            {canciones.map((song) => (
              <div 
                key={song.id} 
                className={`song-card ${currentSong === song.name ? "active" : ""}`}
              >
                <div className="song-info">
                  <h3>{song.name}</h3>
                  {song.description && <p className="song-description">{song.description}</p>}
                </div>
                <audio
                  controls
                  src={song.audioUrl}
                  onPlay={() => handleSongPlay(song)}
                  className="audio-player"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
