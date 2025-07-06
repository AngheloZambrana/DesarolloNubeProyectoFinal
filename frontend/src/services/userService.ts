import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseInit";

export const userService = {
  async register(email: string, password: string, nombre: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "users", uid), {
      email,
      nombre,
      rol: "user",
      createdAt: new Date(),
    });
    return uid;
  },

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      await signOut(auth);
      throw new Error("Este correo no está registrado como usuario.");
    }

    return userCredential.user;
  }
};
