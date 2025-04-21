import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface Avatar {
  id: string;
  name: string;
  url: string;
  description?: string;
  unlockCondition?: string;
  unlockRequirementText?: string;
}

type UserRole = 'patient' | 'family';

interface User {
  email: string;
  id: string;
  role: UserRole;
  lastTestDate?: string;
  lastHamiltonDate?: string;
  streak: number;
  testsCompleted: number;
  hamiltonTestsCompleted: number;
  highestStreak: number;
  joinDate: string;
  unlockedAvatars: string[];
  linkedPatientId?: string; // Only for family members
}

interface AuthState {
  isAuthenticated: boolean;
  hasAcceptedTerms: boolean;
  user: User | null;
  selectedAvatar: Avatar | null;
  availableAvatars: Avatar[];
  unlockedAvatars: string[];
  setSelectedAvatar: (avatar: Avatar) => void;
  signIn: (email: string, password: string, role?: UserRole) => Promise<void>;
  signOut: () => void;
  acceptTerms: () => void;
  updateStreak: () => void;
  incrementTestsCompleted: () => void;
  incrementHamiltonTestsCompleted: () => void;
  checkAndUnlockAvatars: () => void;
  canTakeTest: () => boolean;
}

const AVATARS: Avatar[] = [
  {
    id: 'default_1',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500',
    name: 'Professional',
    description: 'Avatar profesional por defecto',
  },
  {
    id: 'default_2',
    url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500',
    name: 'Creative',
    description: 'Avatar creativo por defecto',
  },
  {
    id: '30_days_streak',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
    name: 'Perseverante',
    description: '¡Felicitaciones por mantener tu compromiso durante 30 días consecutivos!',
    unlockCondition: '30_DAYS_STREAK',
    unlockRequirementText: 'Completa el test diario durante 30 días consecutivos',
  },
  {
    id: '3_months_active',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500',
    name: 'Veterano',
    description: 'Has demostrado un compromiso excepcional durante 3 meses',
    unlockCondition: '3_MONTHS',
    unlockRequirementText: 'Mantén tu cuenta activa durante 3 meses',
  },
];

export const useAuth = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  hasAcceptedTerms: false,
  user: null,
  selectedAvatar: null,
  availableAvatars: AVATARS,
  unlockedAvatars: ['default_1', 'default_2'],

  canTakeTest: () => {
    const { user } = get();
    if (!user) return false;
    
    // Family members can't take tests
    if (user.role === 'family') return false;
    
    // Check if patient has already taken test today
    if (!user.lastTestDate) return true;
    const lastTestDate = new Date(user.lastTestDate).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return lastTestDate !== today;
  },

  setSelectedAvatar: (avatar) => {
    set({ selectedAvatar: avatar });
    SecureStore.setItemAsync('selectedAvatar', JSON.stringify(avatar));
  },

  checkAndUnlockAvatars: () => {
    const { user } = get();
    if (!user || user.role === 'family') return;

    const newUnlockedAvatars = [...get().unlockedAvatars];
    let avatarsUnlocked = false;

    if (user.streak >= 30 && !newUnlockedAvatars.includes('30_days_streak')) {
      newUnlockedAvatars.push('30_days_streak');
      avatarsUnlocked = true;
    }

    const joinDate = new Date(user.joinDate);
    const monthsActive = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (monthsActive >= 3 && !newUnlockedAvatars.includes('3_months_active')) {
      newUnlockedAvatars.push('3_months_active');
      avatarsUnlocked = true;
    }

    if (avatarsUnlocked) {
      set({ unlockedAvatars: newUnlockedAvatars });
      SecureStore.setItemAsync('unlockedAvatars', JSON.stringify(newUnlockedAvatars));
    }
  },

  incrementTestsCompleted: () => {
    set((state) => {
      if (!state.user || state.user.role === 'family') return state;
      const updatedUser = {
        ...state.user,
        testsCompleted: state.user.testsCompleted + 1,
      };
      SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
      return { ...state, user: updatedUser };
    });
    get().checkAndUnlockAvatars();
  },

  incrementHamiltonTestsCompleted: () => {
    set((state) => {
      if (!state.user || state.user.role === 'family') return state;
      const updatedUser = {
        ...state.user,
        hamiltonTestsCompleted: (state.user.hamiltonTestsCompleted || 0) + 1,
        lastHamiltonDate: new Date().toISOString(),
      };
      SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
      return { ...state, user: updatedUser };
    });
    get().checkAndUnlockAvatars();
  },

  signIn: async (email: string, password: string, role: UserRole = 'patient') => {
    if (email && password) {
      const user = { 
        email, 
        id: '1',
        role,
        streak: 0,
        lastTestDate: undefined,
        lastHamiltonDate: undefined,
        testsCompleted: 0,
        hamiltonTestsCompleted: 0,
        highestStreak: 0,
        joinDate: new Date().toISOString(),
        unlockedAvatars: ['default_1', 'default_2'],
        linkedPatientId: role === 'family' ? '2' : undefined,
      };
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      
      const storedUnlockedAvatars = await SecureStore.getItemAsync('unlockedAvatars');
      const storedSelectedAvatar = await SecureStore.getItemAsync('selectedAvatar');
      
      set({ 
        isAuthenticated: true, 
        user,
        unlockedAvatars: storedUnlockedAvatars ? JSON.parse(storedUnlockedAvatars) : ['default_1', 'default_2'],
        selectedAvatar: storedSelectedAvatar ? JSON.parse(storedSelectedAvatar) : AVATARS[0],
      });
    } else {
      throw new Error('Invalid credentials');
    }
  },

  signOut: () => {
    SecureStore.deleteItemAsync('user');
    SecureStore.deleteItemAsync('unlockedAvatars');
    SecureStore.deleteItemAsync('selectedAvatar');
    set({ 
      isAuthenticated: false, 
      user: null, 
      hasAcceptedTerms: false, 
      selectedAvatar: null,
      unlockedAvatars: ['default_1', 'default_2'],
    });
  },

  acceptTerms: () => {
    set({ hasAcceptedTerms: true });
  },

  updateStreak: () => {
    set((state) => {
      if (!state.user || state.user.role === 'family') return state;

      const today = new Date().toISOString().split('T')[0];
      const lastTestDate = state.user.lastTestDate;
      let newStreak = state.user.streak;
      let highestStreak = state.user.highestStreak;

      if (!lastTestDate) {
        newStreak = 1;
      } else if (lastTestDate === today) {
        return state;
      } else {
        const lastDate = new Date(lastTestDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      if (newStreak > highestStreak) {
        highestStreak = newStreak;
      }

      const updatedUser = {
        ...state.user,
        streak: newStreak,
        lastTestDate: today,
        highestStreak,
      };

      SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
      
      get().checkAndUnlockAvatars();
      
      return { ...state, user: updatedUser };
    });
  },
}));