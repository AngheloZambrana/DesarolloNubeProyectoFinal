import { useNavigate } from "react-router-dom";
import { GeneroForm } from "../../components/GeneroForm";
import { logEvent } from "firebase/analytics";
import { analytics } from "../../firebase/firebaseInit";
import "../styles/GenerosPage.css"
import { useEffect } from "react";

export function GenerosPage() {
  const navigate = useNavigate();

  useEffect(() => {
    logEvent(analytics, 'screen_view', {
      firebase_screen: 'GenresManagementPage',
      firebase_screen_class: 'GenresManagementPage'
    });
  }, []);

  const handleBackClick = () => {
    logEvent(analytics, 'back_to_admin_home', {
      from_page: 'GenresManagementPage'
    });
    navigate("/AdminHome");
  };
  
  return (
    <div className="generos-page-container">
      <button onClick={handleBackClick}>Volver a Admin Home</button> 
      <h2>Crear Nuevo Género</h2>
      <GeneroForm />
    </div>
  );
}