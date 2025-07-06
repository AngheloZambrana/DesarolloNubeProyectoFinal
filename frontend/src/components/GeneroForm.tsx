import { useState } from "react";
import { cloudinaryService } from "../services/cloudinaryService";
import { generoService } from "../services/generoService";
import { getAuth } from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase/firebaseInit";
import "./styles/GeneroForm.css"

export function GeneroForm() {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const auth = getAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagen) {
      logEvent(analytics, 'genre_creation_error', {
        reason: 'no_image_selected'
      });
      alert("Selecciona una imagen");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      logEvent(analytics, 'genre_creation_error', {
        reason: 'unauthenticated_user'
      });
      alert("Debes iniciar sesión para crear géneros");
      return;
    }

    setCargando(true);
    logEvent(analytics, 'genre_creation_start', {
      genre_name: nombre
    });

    try {
      logEvent(analytics, 'genre_image_upload_start');
      const imageUrl = await cloudinaryService.subirImagen(imagen, "genres");
      if (!imageUrl) throw new Error("No se pudo subir la imagen");
      logEvent(analytics, 'genre_image_upload_success');

      logEvent(analytics, 'genre_creation_in_progress');
      await generoService.crearGenero(nombre, imageUrl, user.uid);

      logEvent(analytics, 'genre_creation_success', {
        genre_name: nombre
      });
      alert("Género creado con éxito 🎉");
      setNombre("");
      setImagen(null);
    } catch (error) {
      console.error("Error al crear género:", error);
      const errorMsg = (error as Error).message;
      logEvent(analytics, 'genre_creation_error', {
        reason: errorMsg
      });
      alert("Error al crear género: " + errorMsg);
    } finally {
      setCargando(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImagen(e.target.files[0]);
      logEvent(analytics, 'genre_image_selected');
    }
  };

  return (
    <form className="genero-form-container" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre del género"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        required
      />
      <button type="submit" disabled={cargando}>
        {cargando ? "Creando..." : "Crear Género"}
      </button>
    </form>
  );
}