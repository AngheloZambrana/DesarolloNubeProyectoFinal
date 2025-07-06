import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { AsignarGeneroModal } from "../../components/AsignarGeneroModal";
import { UploadSongModal } from "../../components/UploadSongModal";
import { singerService } from "../../services/singerService";
import { songService, type Song } from "../../services/songService";
import { cloudinaryService } from "../../services/cloudinaryService";
import "../styles/AdminHomePage.css";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase/firebaseInit";

export function AdminHomePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  
  const [mostrarModalGeneros, setMostrarModalGeneros] = useState(false);
  const [imagenPerfil, setImagenPerfil] = useState<File | null>(null);
  const [cargandoImagen, setCargandoImagen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const [mostrarModalCancion, setMostrarModalCancion] = useState(false);
  const [canciones, setCanciones] = useState<Song[]>([]);
  const [cargandoCanciones, setCargandoCanciones] = useState(false);
  
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      logEvent(analytics, 'admin_dashboard_view', {
        user_id: user.uid
      });
    }
  }, [user]);

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      if (user) {
        try {
          logEvent(analytics, 'admin_data_loading');
          
          const singerData = await singerService.obtenerSingerPorId(user.uid);
          if (singerData?.imageUrl) {
            setImageUrl(singerData.imageUrl);
            logEvent(analytics, 'profile_image_loaded');
          }
          
          setCargandoCanciones(true);
          const cancionesData = await songService.getSongsBySinger(user.uid);
          setCanciones(cancionesData);
          
          logEvent(analytics, 'admin_songs_loaded', {
            song_count: cancionesData.length
          });
        } catch (error) {
          logEvent(analytics, 'admin_data_error', {
            error: error instanceof Error ? error.message : String(error)
          });
        } finally {
          setCargandoCanciones(false);
        }
      }
    };
    
    cargarDatosIniciales();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logEvent(analytics, 'admin_logout');
      navigate("/login");
    } catch (error) {
      logEvent(analytics, 'admin_logout_error', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagenPerfil(e.target.files[0]);
      logEvent(analytics, 'profile_image_selected');
    }
  };

  const uploadProfileImage = async () => {
    if (!imagenPerfil || !user) return;
    
    setCargandoImagen(true);
    try {
      logEvent(analytics, 'profile_image_upload_start');
      
      const url = await cloudinaryService.subirImagen(imagenPerfil, "singer-profiles");
      if (url) {
        await singerService.actualizarImagenPerfil(user.uid, url);
        setImageUrl(url);
        
        logEvent(analytics, 'profile_image_upload_success');
      }
    } catch (error) {
      console.error("Error al subir imagen:", error);
      logEvent(analytics, 'profile_image_upload_error', {
        error: error instanceof Error ? error.message : String(error)
      });
      alert("Error al subir imagen de perfil");
    } finally {
      setCargandoImagen(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSongUploaded = (newSong: Song) => {
    setCanciones(prev => [...prev, newSong]);
    setMostrarModalCancion(false);
    logEvent(analytics, 'new_song_uploaded', {
      song_id: newSong.id,
      song_name: newSong.name
    });
  };

  const handleOpenSongModal = () => {
    setMostrarModalCancion(true);
    logEvent(analytics, 'open_song_upload_modal');
  };

  const handleOpenGenreModal = () => {
    setMostrarModalGeneros(true);
    logEvent(analytics, 'open_genre_management_modal');
  };

  const handleNavigateToGenreManagement = () => {
    logEvent(analytics, 'navigate_to_genre_management');
    navigate("/ManageGenre");
  };

  if (!user) {
    logEvent(analytics, 'admin_page_no_user');
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Panel de Artista</h1>
        <button onClick={handleLogout} className="logout-btn">
          Cerrar sesión
        </button>
      </header>

      <section className="profile-section">
        <div className="profile-image-container">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Perfil" 
              className="profile-image"
              onLoad={() => logEvent(analytics, 'profile_image_displayed')}
            />
          ) : (
            <div className="profile-placeholder">Foto</div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <div className="profile-actions">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={cargandoImagen}
              className="btn-secondary"
            >
              Cambiar Foto
            </button>
            
            {imagenPerfil && (
              <>
                <button 
                  onClick={uploadProfileImage}
                  disabled={cargandoImagen}
                  className="btn-primary"
                >
                  {cargandoImagen ? "Subiendo..." : "Guardar Foto"}
                </button>
                <button 
                  onClick={() => {
                    setImagenPerfil(null);
                    logEvent(analytics, 'profile_image_upload_cancelled');
                  }}
                  disabled={cargandoImagen}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="actions-section">
        <div className="action-buttons">
          <button 
            onClick={handleOpenSongModal}
            className="btn-primary"
          >
            Subir Nueva Canción
          </button>
          <button 
            onClick={handleOpenGenreModal}
            className="btn-secondary"
          >
            Mis Géneros Musicales
          </button>
          <button 
            onClick={handleNavigateToGenreManagement}
            className="btn-secondary"
          >
            Gestionar Géneros
          </button>
        </div>
      </section>

      <section className="songs-section">
        <h2>Mis Canciones</h2>
        
        {cargandoCanciones ? (
          <div className="loading">Cargando canciones...</div>
        ) : canciones.length === 0 ? (
          <div className="empty-state">
            <p>No has subido ninguna canción aún.</p>
            <button 
              onClick={handleOpenSongModal}
              className="btn-primary"
            >
              Subir Mi Primera Canción
            </button>
          </div>
        ) : (
          <div className="songs-grid">
            {canciones.map(cancion => (
              <div key={cancion.id} className="song-card">
                <div className="song-info">
                  <h3>{cancion.name}</h3>
                  {cancion.description && <p>{cancion.description}</p>}
                  <audio 
                    controls 
                    src={cancion.audioUrl} 
                    className="audio-player" 
                    onPlay={() => {
                      logEvent(analytics, 'song_play_in_dashboard', {
                        song_id: cancion.id,
                        song_name: cancion.name
                      });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {mostrarModalCancion && (
        <UploadSongModal 
          singerId={user.uid}
          onClose={() => {
            setMostrarModalCancion(false);
            logEvent(analytics, 'song_upload_modal_closed');
          }}
          onSongUploaded={handleSongUploaded}
        />
      )}

      {mostrarModalGeneros && (
        <AsignarGeneroModal 
          singerId={user.uid} 
          onClose={() => {
            setMostrarModalGeneros(false);
            logEvent(analytics, 'genre_management_modal_closed');
          }} 
        />
      )}
    </div>
  );
}