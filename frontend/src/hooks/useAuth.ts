import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { type User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseInit';

interface UserData {
  role?: string;
  [key: string]: unknown;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const singerDoc = await getDoc(doc(db, 'singers', currentUser.uid));
          
          if (userDoc.exists()) {
            setUserData({ ...userDoc.data(), role: 'user' });
          } else if (singerDoc.exists()) {
            setUserData({ ...singerDoc.data(), role: 'singer' });
          } else {
            setUserData({ role: 'unknown' });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, userData, loading };
};