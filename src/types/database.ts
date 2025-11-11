export interface Project {
  id: number;
  title: string;
  description: string;
  image: string | null;
  technologies: string[];
  github: string | null;
  demo: string | null;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  icon: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SocialLink {
  id: number;
  name: string;
  url: string;
  icon: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactInfo {
  id: number;
  title: string;
  value: string;
  description: string | null;
  icon: string;
  bgColor: string | null;
  borderColor: string | null;
  color: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Settings {
  id: number;
  theme: string;
  emailjs_service_id: string | null;
  emailjs_template_id: string | null;
  emailjs_public_key: string | null;
  created_at?: string;
  updated_at?: string;
}

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;
      };
      skills: {
        Row: Skill;
        Insert: Omit<Skill, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Skill, 'id' | 'created_at' | 'updated_at'>>;
      };
      social_links: {
        Row: SocialLink;
        Insert: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>>;
      };
      contact_info: {
        Row: ContactInfo;
        Insert: Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>>;
      };
      settings: {
        Row: Settings;
        Insert: Omit<Settings, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Settings, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};

