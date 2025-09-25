import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User 
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";

interface AuthContextProps {
  user: User | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (
    email: string, 
    password: string, 
    name: string, 
    phone: string, 
    role: "student" | "teacher"
  ) => Promise<{ error?: any }>;
  signOutUser: () => Promise<void>;
  addDailyReward: () => Promise<{ success: boolean; error?: any }>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Monitorar login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return {};
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    phone: string, 
    role: "student" | "teacher"
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        name,
        phone,
        role,
        rewards: 0,
        createdAt: new Date()
      });

      return {};
    } catch (error) {
      return { error };
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  // 🚀 Sistema de recompensa diária
  const addDailyReward = async () => {
    if (!user) return { success: false, error: "Usuário não autenticado" };

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        rewards: increment(1)
      });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return (
    <AuthContext.Provider 
      value={{ user, role, loading, signIn, signUp, signOutUser, addDailyReward }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
  }
  return context;
};
