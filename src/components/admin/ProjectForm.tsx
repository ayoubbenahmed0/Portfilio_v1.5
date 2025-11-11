import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/useSupabase';
import { fadeInUp, staggerContainer } from '@/utils/motion';
import type { Project } from '@/types/database';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url().optional().or(z.literal('')),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  github: z.string().url().optional().or(z.literal('')),
  demo: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

export function ProjectForm() {
  const { data: projects, isLoading } = useProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    image: '',
    technologies: [],
    github: '',
    demo: '',
    featured: false,
  });
  const [techInput, setTechInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = projectSchema.parse(formData);
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...validated });
      } else {
        await createMutation.mutateAsync(validated as Omit<Project, 'id' | 'created_at' | 'updated_at'>);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
    setTechInput(project.technologies.join(', '));
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      technologies: [],
      github: '',
      demo: '',
      featured: false,
    });
    setTechInput('');
  };

  const handleTechChange = (value: string) => {
    setTechInput(value);
    setFormData({
      ...formData,
      technologies: value.split(',').map((t) => t.trim()).filter(Boolean),
    });
  };

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="space-y-8">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-6 gradient-text">
          Projects
        </motion.h2>

        {/* Form */}
        <motion.form
          variants={fadeInUp}
          onSubmit={handleSubmit}
          className="glass p-6 rounded-lg mb-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Project title"
              className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short description of the project"
              className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image || ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Technologies (comma-separated)</label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => handleTechChange(e.target.value)}
              placeholder="React, TypeScript, Node.js"
              className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.github || ''}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Demo URL</label>
              <input
                type="url"
                value={formData.demo || ''}
                onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Featured
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {editingId ? 'Update' : 'Create'} Project
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

        {/* Projects List */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {projects?.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              className="glass p-4 rounded-lg"
            >
              <h3 className="font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 glass rounded-lg hover:bg-opacity-80 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 glass rounded-lg hover:bg-opacity-80 transition-colors text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

