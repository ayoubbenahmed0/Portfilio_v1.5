import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings, useUpdateSettings } from '@/hooks/useSupabase';
import { fadeInUp } from '@/utils/motion';
import { z } from 'zod';

const settingsSchema = z.object({
  theme: z.string(),
  emailjs_service_id: z.string().optional().nullable(),
  emailjs_template_id: z.string().optional().nullable(),
  emailjs_public_key: z.string().optional().nullable(),
});

export function Settings() {
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  const [formData, setFormData] = useState({
    theme: 'dark',
    emailjs_service_id: '',
    emailjs_template_id: '',
    emailjs_public_key: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        theme: settings.theme || 'dark',
        emailjs_service_id: settings.emailjs_service_id || '',
        emailjs_template_id: settings.emailjs_template_id || '',
        emailjs_public_key: settings.emailjs_public_key || '',
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = settingsSchema.parse(formData);
      await updateMutation.mutateAsync(validated);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <h2 className="text-3xl font-bold mb-6 gradient-text">Settings</h2>

      <form onSubmit={handleSubmit} className="glass p-6 rounded-lg space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <select
            value={formData.theme}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            className="w-full px-4 py-3 bg-card text-foreground border-2 border-border rounded-xl"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">EmailJS Service ID</label>
          <input
            type="text"
            value={formData.emailjs_service_id}
            onChange={(e) => setFormData({ ...formData, emailjs_service_id: e.target.value })}
            placeholder="service_xxxxxx"
            className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">EmailJS Template ID</label>
          <input
            type="text"
            value={formData.emailjs_template_id}
            onChange={(e) => setFormData({ ...formData, emailjs_template_id: e.target.value })}
            placeholder="template_xxxxxx"
            className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">EmailJS Public Key</label>
          <input
            type="text"
            value={formData.emailjs_public_key}
            onChange={(e) => setFormData({ ...formData, emailjs_public_key: e.target.value })}
            placeholder="public_xxxxxx"
            className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Save Settings
        </button>
      </form>
    </motion.div>
  );
}

