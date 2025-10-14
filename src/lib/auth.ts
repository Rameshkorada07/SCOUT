import { supabase } from './supabase';

// Admin login
export const loginAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// Check if user is logged in
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Logout
export const logoutAdmin = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Check auth state
export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChanged((event, session) => {
    callback(session?.user ?? null);
  });
};

