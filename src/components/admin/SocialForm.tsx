import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit } from 'lucide-react';
import { useSocialLinks, useCreateSocialLink, useUpdateSocialLink, useDeleteSocialLink } from '@/hooks/useSupabase';
import { fadeInUp, staggerContainer } from '@/utils/motion';
import type { SocialLink } from '@/types/database';
import { z } from 'zod';

const socialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Invalid URL'),
  icon: z.string().min(1, 'Icon is required'),
});

export function SocialForm() {
  const { data: socialLinks, isLoading } = useSocialLinks();
  const createMutation = useCreateSocialLink();
  const updateMutation = useUpdateSocialLink();
  const deleteMutation = useDeleteSocialLink();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<SocialLink>>({
    name: '',
    url: '',
    icon: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = socialSchema.parse(formData);
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...validated });
      } else {
        await createMutation.mutateAsync(validated as Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving social link:', error);
    }
  };

  const handleEdit = (link: SocialLink) => {
    setEditingId(link.id);
    setFormData(link);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this social link?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      url: '',
      icon: '',
    });
  };

  if (isLoading) {
    return <div>Loading social links...</div>;
  }

  return (
    <div className="space-y-8">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-6 gradient-text">
          Social Links
        </motion.h2>

        {/* Form */}
        <motion.form
          variants={fadeInUp}
          onSubmit={handleSubmit}
          className="glass p-6 rounded-lg mb-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Platform name"
              className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Icon (emoji or text)</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl"
              placeholder="🔗"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {editingId ? 'Update' : 'Create'} Link
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 glass rounded-lg hover:bg-opacity-80 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.form>

        {/* Social Links List */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {socialLinks?.map((link) => (
            <motion.div
              key={link.id}
              variants={fadeInUp}
              className="glass p-4 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{link.icon}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-2 glass rounded-lg hover:bg-opacity-80 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 glass rounded-lg hover:bg-opacity-80 transition-colors text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold mb-1">{link.name}</h3>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {link.url}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

