import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit } from 'lucide-react';
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '@/hooks/useSupabase';
import { fadeInUp, staggerContainer } from '@/utils/motion';
import type { Skill } from '@/types/database';
import { z } from 'zod';

const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.number().min(0).max(100),
  icon: z.string().optional().or(z.literal('')),
});

export function SkillForm() {
  const { data: skills, isLoading } = useSkills();
  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill();
  const deleteMutation = useDeleteSkill();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    category: '',
    level: 50,
    icon: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = skillSchema.parse(formData);
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...validated });
      } else {
        await createMutation.mutateAsync(validated as Omit<Skill, 'id' | 'created_at' | 'updated_at'>);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData(skill);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: '',
      level: 50,
      icon: '',
    });
  };

  if (isLoading) {
    return <div>Loading skills...</div>;
  }

  return (
    <div className="space-y-8">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-6 gradient-text">
          Skills
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
              placeholder="Skill name"
              className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-card text-foreground border-2 border-border rounded-xl"
              required
            >
              <option value="">Select category</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="tools">Tools</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Level: {formData.level}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Icon (emoji or text)</label>
            <input
              type="text"
              value={formData.icon || ''}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl"
              placeholder="💻"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {editingId ? 'Update' : 'Create'} Skill
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

        {/* Skills List */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {skills?.map((skill) => (
            <motion.div
              key={skill.id}
              variants={fadeInUp}
              className="glass p-4 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{skill.icon || '💻'}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="p-2 glass rounded-lg hover:bg-opacity-80 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="p-2 glass rounded-lg hover:bg-opacity-80 transition-colors text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold mb-1">{skill.name}</h3>
              <p className="text-sm text-foreground/70 mb-2">{skill.category}</p>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <div className="text-xs text-foreground/70 mt-1">{skill.level}%</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

