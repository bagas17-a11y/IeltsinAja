import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  subscription_tier: "free" | "pro" | "elite";
  subscription_end_date: string | null;
  target_band_score: number | null;
  current_reading_score: number | null;
  current_listening_score: number | null;
  current_writing_score: number | null;
  current_speaking_score: number | null;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  /** True until BOTH the session check AND profile fetch have resolved. */
  isLoading: boolean;
  isAdmin: boolean;
  isCheckingAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data as unknown as Profile | null;
  };

  const checkAdminRole = async (userId: string) => {
    setIsCheckingAdmin(true);
    try {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      setIsAdmin(!error && (data || false));
    } catch {
      setIsAdmin(false);
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    // ── Initial session check ─────────────────────────────────────────────────
    // Await the profile fetch so isLoading=false only when profile is known.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const [profileData] = await Promise.all([
          fetchProfile(session.user.id),
          checkAdminRole(session.user.id),
        ]);
        setProfile(profileData);
      }

      setIsLoading(false);
    });

    // ── Subsequent auth state changes (login / logout / token refresh) ────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch profile asynchronously — don't block the event handler
          fetchProfile(session.user.id).then(setProfile);
          checkAdminRole(session.user.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsCheckingAdmin(false);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    
    // Clear all application-specific storage (both session and local)
    // All relevant keys start with 'ielts-'
    [localStorage, sessionStorage].forEach(storage => {
      Object.keys(storage).forEach(key => {
        if (key.startsWith('ielts-')) {
          storage.removeItem(key);
        }
      });
    });

    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, profile, isLoading, isAdmin, isCheckingAdmin, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
