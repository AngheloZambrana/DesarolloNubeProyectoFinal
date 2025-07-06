import { useEffect, useState } from "react";
import { RegistroFormUser } from "../components/RegistroFormUser";
import { RegistroFormSinger } from "../components/RegistroFormSinger";
import "./styles/RegisterPage.css";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase/firebaseInit";

export function RegisterPage() {
  const [tipo, setTipo] = useState<"user" | "singer">("user");

  useEffect(() => {
    logEvent(analytics, 'screen_view', {
      firebase_screen: 'RegisterPage', 
      firebase_screen_class: 'RegisterPage'
    });
  }, []);

  const handleTypeChange = (newType: "user" | "singer") => {
    setTipo(newType);
    logEvent(analytics, 'register_type_selected', {
      register_type: newType
    });
  };

  return (
    <div className="register-page">
      <h1 className="register-title">Registro</h1>
      <div className="register-buttons">
        <button onClick={() => handleTypeChange("user")} className={tipo === "user" ? "active" : ""}>Usuario</button>
        <button onClick={() => handleTypeChange("singer")} className={tipo === "singer" ? "active" : ""}>Artista</button>
      </div>
      <div className="register-form-container">
        {tipo === "user" ? <RegistroFormUser /> : <RegistroFormSinger />}
      </div>
    </div>
  );
}
