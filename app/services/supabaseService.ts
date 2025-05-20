import supabase from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5226/api/v1";

export const setAuthToken = (token: string) => {
  localStorage.setItem("cmAuth", `Bearer ${token}`);
};

export const setUser = (user: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("cmAuth") || "";
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("user") || "{}");
  }
  return null;
};

export const checkIsSignedIn = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

export const signOut = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem("user");
};

export const signIn = async (data: { email: string; password: string }) => {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) throw error;

  if (authData.user) {
    // Fetch additional user data from your profiles table if needed
    const { data: profileData, error: profileError } = await supabase
      .from('artists')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    const userData = {
      ...authData.user,
      ...profileData
    };

    setUser(userData);
    return { data: { user: userData } };
  }

  throw new Error('Authentication failed');
};

export const signUp = async (data: { email: string; password: string; first_name: string; last_name: string }) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) throw authError;

  if (authData.user) {
    // Create a profile record for the new user
    const { error: profileError } = await supabase
      .from('artists')
      .insert([
        {
          id: authData.user.id,
          first_name: data.first_name,
          last_name: data.last_name,
        }
      ]);

    if (profileError) throw profileError;

    const userData = {
      ...authData.user,
      first_name: data.first_name,
      last_name: data.last_name,
    };

    setUser(userData);
    return { data: { user: userData } };
  }

  throw new Error('Registration failed');
};





