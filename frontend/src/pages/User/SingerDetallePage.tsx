import { useNavigate } from "react-router-dom";
import { ListaCancionesArtista } from "../../components/ListaCancionesArtista";
import "../styles/SingerDetallePage.css"
import { useEffect } from "react";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase/firebaseInit";

export function SingerDetallePage() {
  const navigate = useNavigate();

  useEffect(() => {
    logEvent(analytics, 'screen_view', {
      firebase_screen: 'SingerDetailPage',
      firebase_screen_class: 'SingerDetailPage'
    });
  }, []);

  const handleBackClick = () => {
    logEvent(analytics, 'back_button_click', {
      from_page: 'SingerDetailPage'
    });
    navigate(-1);
  };

  return (
    <div className="singer-detalle-page">
      <div className="singer-contenido-principal">
        <ListaCancionesArtista />
        <button className="volver-btn" onClick={handleBackClick}>
          Volver a canciones
        </button>
      </div>
    </div>
  );
}

