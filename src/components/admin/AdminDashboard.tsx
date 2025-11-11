import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, FolderOpen, Code, Link as LinkIcon, Mail, Settings } from 'lucide-react';
import { Statistics } from './Statistics';
import { ProjectForm } from './ProjectForm';
import { SkillForm } from './SkillForm';
import { SocialForm } from './SocialForm';
import { ContactInfoForm } from './ContactInfoForm';
import { Settings as SettingsPanel } from './Settings';

type Tab = 'overview' | 'projects' | 'skills' | 'social' | 'contact' | 'settings';

export function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'projects' as Tab, label: 'Projects', icon: FolderOpen },
    { id: 'skills' as Tab, label: 'Skills', icon: Code },
    { id: 'social' as Tab, label: 'Social Links', icon: LinkIcon },
    { id: 'contact' as Tab, label: 'Contact Info', icon: Mail },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground/70">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-opacity-80 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <Statistics />}
          {activeTab === 'projects' && <ProjectForm />}
          {activeTab === 'skills' && <SkillForm />}
          {activeTab === 'social' && <SocialForm />}
          {activeTab === 'contact' && <ContactInfoForm />}
          {activeTab === 'settings' && <SettingsPanel />}
        </motion.div>
      </div>
    </div>
  );
}

