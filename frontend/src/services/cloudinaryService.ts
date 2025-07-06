const CLOUDINARY_BASE_URL = "https://api.cloudinary.com/v1_1/dei3nadsq";
const UPLOAD_PRESET = "musicfy";

export const cloudinaryService = {
  async subirImagen(file: File, folder: string): Promise<string | null> {
    return this.subirArchivo(file, folder, "image");
  },

  async subirArchivo(
    file: File, 
    folder: string, 
    resourceType: "image" | "video" | "audio" | "auto" = "auto"
  ): Promise<string | null> {
    const endpoint = resourceType === "image" 
      ? `${CLOUDINARY_BASE_URL}/image/upload`
      : `${CLOUDINARY_BASE_URL}/video/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);
    
    // Para recursos que no son imágenes, añadimos el resource_type
    if (resourceType !== "image") {
      formData.append("resource_type", resourceType);
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Error al subir archivo");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      console.error(`Error al subir ${resourceType}:`, err);
      throw err; // Re-lanzamos el error para manejarlo en el componente
    }
  }
};