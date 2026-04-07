import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthUser {
  name: string;
  email: string;
  role: string;
  company: string;
  initials: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
}

const MOCK_USERS: Record<string, { password: string; user: AuthUser }> = {
  'arjun.menon@company.com': {
    password: 'tripmind2024',
    user: {
      name: 'Arjun Menon',
      email: 'arjun.menon@company.com',
      role: 'Senior Product Manager',
      company: 'Company Inc.',
      initials: 'A',
    },
  },
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isSignedIn: false,
  signIn: async () => ({ ok: false }),
  signOut: () => {},
});

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem('tripmind-user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadUser());

  async function signIn(email: string, password: string) {
    // Simulate network latency
    await new Promise(r => setTimeout(r, 900));

    const entry = MOCK_USERS[email.toLowerCase().trim()];
    if (entry && entry.password === password) {
      setUser(entry.user);
      try { localStorage.setItem('tripmind-user', JSON.stringify(entry.user)); } catch {}
      return { ok: true };
    }
    // Accept any non-empty credentials as a guest/demo login
    if (email.trim() && password.trim()) {
      const guestUser: AuthUser = {
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email: email.trim(),
        role: 'Team Member',
        company: email.split('@')[1] ?? 'Your Company',
        initials: email[0].toUpperCase(),
      };
      setUser(guestUser);
      try { localStorage.setItem('tripmind-user', JSON.stringify(guestUser)); } catch {}
      return { ok: true };
    }
    return { ok: false, error: 'Please enter a valid email and password.' };
  }

  function signOut() {
    setUser(null);
    try { localStorage.removeItem('tripmind-user'); } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, isSignedIn: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
