import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import type { AppUser, UserRole } from '@/types';

interface AuthContextValue {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchOrCreateAppUser(firebaseUser: User): Promise<AppUser> {
  const ref = doc(db, 'users', firebaseUser.uid);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    return { uid: firebaseUser.uid, ...snapshot.data() } as AppUser;
  }

  const now = new Date().toISOString();
  const newUser: AppUser = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    role: firebaseUser.isAnonymous ? 'anonymous' : 'student',
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(ref, newUser);
  return newUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await fetchOrCreateAppUser(firebaseUser);
        setAppUser(profile);
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const now = new Date().toISOString();
    await setDoc(doc(db, 'users', credential.user.uid), {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName,
      role: 'student',
      createdAt: now,
      updatedAt: now,
    });
  }, []);

  const signInAsGuest = useCallback(async () => {
    await signInAnonymously(auth);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!appUser) return roles.includes('anonymous');
      return roles.includes(appUser.role);
    },
    [appUser],
  );

  const value = useMemo(
    () => ({
      user,
      appUser,
      loading,
      signIn,
      signUp,
      signInAsGuest,
      logout,
      hasRole,
    }),
    [user, appUser, loading, signIn, signUp, signInAsGuest, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
