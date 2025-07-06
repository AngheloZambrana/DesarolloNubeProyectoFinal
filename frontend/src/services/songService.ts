import { doc, collection, setDoc, getDocs, query, where, getDoc } from "firebase/firestore";
import { cloudinaryService } from "./cloudinaryService";
import { db } from "../firebase/firebaseInit";

export interface Song {
  id?: string;
  name: string;
  description: string;
  singerId: string;
  audioUrl: string;
  createdAt?: Date;
  duration?: number;
  genreIds?: string[];
}

const SONGS_COLLECTION = "songs";

export const songService = {
  async createSong(songData: Omit<Song, 'id' | 'createdAt'>): Promise<string> {
    const songsRef = collection(db, SONGS_COLLECTION);
    const newSongRef = doc(songsRef);
    
    const songWithMetadata: Song = {
      ...songData,
      id: newSongRef.id,
      createdAt: new Date()
    };
    
    await setDoc(newSongRef, songWithMetadata);
    return newSongRef.id;
  },

  async uploadSongFile(file: File, folder = "songs"): Promise<string> {
    try {
      const audioUrl = await cloudinaryService.subirArchivo(file, folder, "audio");
      if (!audioUrl) {
        throw new Error("No se recibió URL del audio después de la subida");
      }
      return audioUrl;
    } catch (err) {
      console.error("Error en uploadSongFile:", err);
      if (err instanceof Error) {
        throw new Error(`Error al subir el archivo de audio: ${err.message}`);
      } else {
        throw new Error("Error al subir el archivo de audio: error desconocido");
      }
    }
  },
  async getSongsBySinger(singerId: string): Promise<Song[]> {
    const q = query(
      collection(db, SONGS_COLLECTION),
      where("singerId", "==", singerId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Song));
  },

  async getSongsByGenre(genreId: string): Promise<Song[]> {
    const q = query(
      collection(db, SONGS_COLLECTION),
      where("genreIds", "array-contains", genreId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Song);
  },

  async obtenerCancionPorId(songId: string): Promise<Song | null> {
    try {
      const songRef = doc(db, SONGS_COLLECTION, songId);
      const songSnap = await getDoc(songRef);
      
      if (songSnap.exists()) {
        return {
          id: songSnap.id,
          ...songSnap.data()
        } as Song;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener canción por ID:", error);
      throw new Error("No se pudo obtener la canción");
    }
  },
};