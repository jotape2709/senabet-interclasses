import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, getDoc, updateDoc, increment, Timestamp } from "firebase/firestore";

// Define the shape of the user profile stored in Firestore
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: "student" | "teacher" | "admin";
  rewards: number;
  createdAt: Timestamp;
}

interface AuthContextProps {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: "student" | "teacher"
  ) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  addDailyReward: () => Promise<{ success: boolean; error?: any }>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
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

  const signOut = async () => {
    await firebaseSignOut(auth);
    setProfile(null);
  };

  const addDailyReward = async () => {
    if (!user) return { success: false, error: "Usuário não autenticado" };

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        rewards: increment(1)
      });
      if (profile) {
        setProfile({ ...profile, rewards: profile.rewards + 1 });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signIn, signUp, signOut, addDailyReward }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
