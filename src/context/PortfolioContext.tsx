import React, { createContext, useContext } from 'react';
import { useProjects, useSkills, useSocialLinks, useContactInfo, useSettings } from '@/hooks/useSupabase';

interface PortfolioContextType {
  projects: ReturnType<typeof useProjects>;
  skills: ReturnType<typeof useSkills>;
  socialLinks: ReturnType<typeof useSocialLinks>;
  contactInfo: ReturnType<typeof useContactInfo>;
  settings: ReturnType<typeof useSettings>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const projects = useProjects();
  const skills = useSkills();
  const socialLinks = useSocialLinks();
  const contactInfo = useContactInfo();
  const settings = useSettings();

  return (
    <PortfolioContext.Provider value={{ projects, skills, socialLinks, contactInfo, settings }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

