import { useEffect, useState } from "react";
import { LoginFormUser } from "../components/LoginFormUser";
import { LoginFormSinger } from "../components/LoginFormSinger";
import { logEvent } from "firebase/analytics";
import "./styles/LoginPage.css";
import { analytics } from "../firebase/firebaseInit";

export function LoginPage() {
  const [tipo, setTipo] = useState<"user" | "singer">("user");

  useEffect(() => {
    logEvent(analytics, 'screen_view', {
      firebase_screen: 'LoginPage',
      firebase_screen_class: 'LoginPage'
    });
  }, []);

  const handleTypeChange = (newType: "user" | "singer") => {
    setTipo(newType);
    logEvent(analytics, 'login_type_selected', {
      login_type: newType
    });
  };

  return (
    <div className="login-page">
      <h1 className="login-title">Iniciar Sesión</h1>
      <div className="login-toggle">
        <button
          className={tipo === "user" ? "active" : ""}
          onClick={() => handleTypeChange("user")}
        >
          Usuario
        </button>
        <button
          className={tipo === "singer" ? "active" : ""}
          onClick={() => handleTypeChange("singer")}
        >
          Artista
        </button>
      </div>
      <div className="login-form-container">
        {tipo === "user" ? <LoginFormUser /> : <LoginFormSinger />}
      </div>
    </div>
  );
}
