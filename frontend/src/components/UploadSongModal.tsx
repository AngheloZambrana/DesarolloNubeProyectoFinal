import { useState, useRef } from "react";
import { songService } from "../services/songService";
import "./styles/UploadSongModal.css"

interface Song {
  id?: string;
  name: string;
  description: string;
  singerId: string;
  audioUrl: string;
}

interface UploadSongModalProps {
  singerId: string;
  onClose: () => void;
  onSongUploaded: (song: Song) => void;
}

export function UploadSongModal({ singerId, onClose, onSongUploaded }: UploadSongModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-m4a'];
      if (!validTypes.includes(file.type)) {
        setError("Formato de audio no soportado. Use MP3, WAV u OGG");
        return;
      }
      
      if (file.size > 20 * 1024 * 1024) {
        setError("El archivo es demasiado grande (máximo 20MB)");
        return;
      }
      
      setAudioFile(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("El nombre de la canción es requerido");
      return;
    }
    
    if (!audioFile) {
      setError("Debes seleccionar un archivo de audio");
      return;
    }

    setIsUploading(true);
    setError("");
    setUploadProgress(0);

    try {
      const audioUrl = await songService.uploadSongFile(audioFile, "songs");
      
      const newSong = {
        name: name.trim(),
        description: description.trim(),
        singerId,
        audioUrl
      };

      const songId = await songService.createSong(newSong);
      
      onSongUploaded({
        id: songId,
        ...newSong
      });
      
      setTimeout(onClose, 500);
      
    } catch (err) {
      console.error("Error en handleSubmit:", err);
      setError("Error al subir la canción. Por favor, inténtalo de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal-content">
        <button className="close-button" onClick={onClose} disabled={isUploading}>
          &times;
        </button>
        
        <h2>Subir Nueva Canción</h2>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la canción *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isUploading}
            />
          </div>
          
          <div className="form-group">
            <label>Descripción (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
            />
          </div>
          
          <div className="form-group">
            <label>Archivo de audio *</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/*"
              required
              disabled={isUploading}
            />
            {audioFile && (
              <div className="file-info">
                <p>{audioFile.name}</p>
                <p>{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            )}
          </div>
          
          {isUploading && (
            <div className="upload-progress">
              <progress value={uploadProgress} max="100" />
              <span>{uploadProgress}%</span>
            </div>
          )}
          
          <div className="modal-actions">
            <button 
              type="submit" 
              disabled={isUploading}
              className="primary-button"
            >
              {isUploading ? "Subiendo..." : "Subir Canción"}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              disabled={isUploading}
              className="secondary-button"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}