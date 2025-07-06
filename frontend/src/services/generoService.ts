import { collection, getDocs, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";

const GENEROS_COLLECTION = "genres";


export interface Genero {
  id: string;
  name: string;
  imageUrl: string;
  createdAt?: Date;
}

export const generoService = {
  async crearGenero(nombre: string, imageUrl: string, userId: string) {
    const newDocRef = doc(collection(db, GENEROS_COLLECTION));
    
    await setDoc(newDocRef, {
      name: nombre,
      imageUrl,
      id: newDocRef.id,
      createdBy: userId, 
      createdAt: serverTimestamp()
    });
    
    return newDocRef.id;
  },

  async obtenerGeneros(): Promise<Genero[]> {
    const snapshot = await getDocs(collection(db, "genres"));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt,
      };
    });
  },
  
};