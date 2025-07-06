import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { analytics, db } from "../../firebase/firebaseInit";
import { ListaGeneros } from "../../components/ListaGeneros";
import { useNavigate } from "react-router-dom"; 
import "../styles/UserHomePage.css";
import { logEvent } from "firebase/analytics";

export function UserHomePage() {
  const [nombre, setNombre] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logEvent(analytics, 'screen_view', {
      firebase_screen: 'UserHomePage', 
      firebase_screen_class: 'UserHomePage'
    });
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logEvent(analytics, 'logout', {
        user_type: 'regular_user'
      });
      navigate("/login");
    } catch (error) {
      logEvent(analytics, 'logout_error', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  useEffect(() => {
    const fetchNombreUsuario = async () => {
      const user = auth.currentUser;
      if (user) {
        logEvent(analytics, 'user_home_accessed', {
          user_id: user.uid
        });
        
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setNombre(data.nombre || "Usuario");
          
          logEvent(analytics, 'user_data_loaded', {
            has_name: !!data.nombre
          });
        }
      }
    };

    fetchNombreUsuario();
  }, []);

  return (
    <div className="user-homepage">
      <h1 className="title">Bienvenido a la Plataforma Musical 🎵</h1>
      <h2 className="welcome">¡Bienvenido, {nombre}!</h2>
      <h3 className="subtitle">Explora géneros musicales:</h3>
      <p className="description">Aquí irá tu contenido principal como géneros, artistas, etc.</p>
      <ListaGeneros />
      <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}
