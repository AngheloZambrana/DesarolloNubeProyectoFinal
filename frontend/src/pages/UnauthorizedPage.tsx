import { useNavigate } from 'react-router-dom';
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase/firebaseInit";
import { useEffect } from 'react';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    logEvent(analytics, 'screen_view', {
      firebase_screen: 'UnauthorizedPage',
      firebase_screen_class: 'UnauthorizedPage'
    });
    
    logEvent(analytics, 'unauthorized_access');
  }, []);

  const handleBackClick = () => {
    logEvent(analytics, 'unauthorized_back_click');
    navigate(-1);
  };

  const handleLoginClick = () => {
    logEvent(analytics, 'unauthorized_login_click');
    navigate('/login');
  };

  return (
    <div className="unauthorized-container">
      <h1>No tienes permiso para acceder a esta página</h1>
      <div className="button-group">
        <button onClick={handleBackClick}>Volver atrás</button>
        <button onClick={handleLoginClick}>Ir al login</button>
      </div>
    </div>
  );
};