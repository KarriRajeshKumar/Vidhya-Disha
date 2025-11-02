import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  role_title: string | null;
  experience_level: string;
  education_level?: string;
  skills: string[] | null;
  interests: string[] | null;
  total_points: number;
  streak_days: number;
  created_at: string;
  updated_at: string;
  job_title?: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create profile if it doesn't exist
        const newProfile = {
          user_id: user.id,
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
          email: user.email,
          experience_level: 'beginner',
          skills: [],
          interests: [],
          total_points: 0,
          streak_days: 0,
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;
        setProfile(createdProfile as Profile);
      } else {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Handle education_level separately - try database first, fallback to localStorage
      const educationLevel = updates.education_level;
      if (educationLevel !== undefined) {
        localStorage.setItem('education_level', educationLevel);
      }

      // Only send fields that exist in the database
      const allowedFields = ['display_name', 'email', 'bio', 'skills', 'interests'];
      const filteredUpdates: any = {};

      Object.keys(updates).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredUpdates[key] = (updates as any)[key];
        }
      });

      const { data, error } = await supabase
        .from('profiles')
        .update(filteredUpdates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Merge education_level from localStorage if it wasn't saved to database
      const updatedProfile = data as Profile;
      if (educationLevel !== undefined && !updatedProfile.education_level) {
        updatedProfile.education_level = educationLevel;
      }

      setProfile(updatedProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { profile, loading, updateProfile, refetch: fetchProfile };
};