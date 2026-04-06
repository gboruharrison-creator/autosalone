import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getDealerByOwner, type DealerData } from '../lib/db';

interface AuthStore {
  user: User | null;
  dealer: DealerData | null;
  loading: boolean;
  init: () => () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  setDealer: (dealer: DealerData | null) => void;
  refreshDealer: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  dealer: null,
  loading: true,

  init: () => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      set({ user, loading: false });
      if (user) {
        const dealer = await getDealerByOwner(user.uid);
        set({ dealer });
      } else {
        set({ dealer: null });
      }
    });
    return unsub;
  },

  login: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  },

  signup: async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user;
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, dealer: null });
  },

  setDealer: (dealer) => set({ dealer }),

  refreshDealer: async () => {
    const { user } = get();
    if (!user) return;
    const dealer = await getDealerByOwner(user.uid);
    set({ dealer });
  },
}));