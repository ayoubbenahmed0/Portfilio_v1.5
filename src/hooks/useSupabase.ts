import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/utils/supabaseClient';
import type { Project, Skill, SocialLink, ContactInfo, Settings } from '@/types/database';

// Projects
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('projects').insert(project).select().single();
      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: number }) => {
      const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Skills
export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase.from('skills').select('*').order('level', { ascending: false });
      if (error) throw error;
      return data as Skill[];
    },
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('skills').insert(skill).select().single();
      if (error) throw error;
      return data as Skill;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Skill> & { id: number }) => {
      const { data, error } = await supabase.from('skills').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as Skill;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

// Social Links
export function useSocialLinks() {
  return useQuery({
    queryKey: ['socialLinks'],
    queryFn: async () => {
      const { data, error } = await supabase.from('social_links').select('*').order('name');
      if (error) throw error;
      return data as SocialLink[];
    },
  });
}

export function useCreateSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (link: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('social_links').insert(link).select().single();
      if (error) throw error;
      return data as SocialLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
    },
  });
}

export function useUpdateSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SocialLink> & { id: number }) => {
      const { data, error } = await supabase.from('social_links').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as SocialLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
    },
  });
}

export function useDeleteSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('social_links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
    },
  });
}

// Contact Info
export function useContactInfo() {
  return useQuery({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_info').select('*').order('title');
      if (error) throw error;
      return data as ContactInfo[];
    },
  });
}

export function useCreateContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contact: Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>) => {
      // Only include fields that exist in the database schema
      const { bgColor, borderColor, color, ...dbContact } = contact;
      const { data, error } = await supabase.from('contact_info').insert(dbContact).select().single();
      if (error) {
        const errorMessage = error.message || error.details || 'Failed to create contact info';
        throw new Error(errorMessage);
      }
      return data as ContactInfo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
  });
}

export function useUpdateContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ContactInfo> & { id: number }) => {
      // Only include fields that exist in the database schema
      const { bgColor, borderColor, color, ...dbUpdates } = updates;
      const { data, error } = await supabase.from('contact_info').update(dbUpdates).eq('id', id).select().single();
      if (error) {
        const errorMessage = error.message || error.details || 'Failed to update contact info';
        throw new Error(errorMessage);
      }
      return data as ContactInfo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
  });
}

// Settings
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('*').limit(1).single();
      if (error) {
        // If settings don't exist, return default settings
        if (error.code === 'PGRST116') {
          return {
            id: 1,
            theme: 'dark',
            emailjs_service_id: null,
            emailjs_template_id: null,
            emailjs_public_key: null,
          } as Settings;
        }
        throw error;
      }
      return data as Settings;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<Settings>) => {
      // Try to update first, if it fails, insert
      let { data, error } = await supabase.from('settings').update(updates).eq('id', 1).select().single();
      
      if (error && error.code === 'PGRST116') {
        // Settings don't exist, create them
        const { data: newData, error: insertError } = await supabase
          .from('settings')
          .insert({ id: 1, ...updates })
          .select()
          .single();
        if (insertError) throw insertError;
        return newData as Settings;
      }
      
      if (error) throw error;
      return data as Settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

