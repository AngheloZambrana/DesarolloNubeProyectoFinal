import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseInit";

export const singerService = {
  async register(email: string, password: string, nombreArtistico: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "singer", uid), {
      email,
      nombreArtistico,
      rol: "singer",
      createdAt: new Date(),
    });
    return uid;
  },

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const singerDoc = await getDoc(doc(db, "singer", uid));
    if (!singerDoc.exists()) {
      await signOut(auth);
      throw new Error("Este correo no está registrado como artista.");
    }

    return userCredential.user;
  },

  async agregarGeneroASinger(singerId: string, genreId: string) {
    const singerRef = doc(db, "singer", singerId);
    const singerDoc = await getDoc(singerRef);
    const generosActuales = singerDoc.data()?.generos || [];
    
    if (!generosActuales.includes(genreId)) {
        await updateDoc(singerRef, {
        generos: [...generosActuales, genreId], 
        lastUpdated: serverTimestamp()
        });
    }
  },

  async obtenerSingerPorId(singerId: string) {
    const ref = doc(db, "singer", singerId);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? snapshot.data() : null;
  },
  
  async actualizarImagenPerfil(singerId: string, imageUrl: string) {
    const singerRef = doc(db, "singer", singerId);
    await updateDoc(singerRef, {
      imageUrl,
      lastUpdated: serverTimestamp()
    });
  },
};
