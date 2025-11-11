import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Plus } from 'lucide-react';
import { useContactInfo, useCreateContactInfo, useUpdateContactInfo } from '@/hooks/useSupabase';
import { fadeInUp, staggerContainer } from '@/utils/motion';
import type { ContactInfo } from '@/types/database';
import { z } from 'zod';

const contactInfoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  value: z.string().min(1, 'Value is required'),
  description: z.string().optional().nullable(),
  icon: z.string().min(1, 'Icon is required'),
});

const createEmptyFormData = (): Partial<ContactInfo> => ({
  title: '',
  value: '',
  description: '',
  icon: '',
});

const quickPresets: Array<{
  label: string;
  title: string;
  value: string;
  icon: string;
  description?: string;
}> = [
  {
    label: 'Phone',
    title: 'Phone',
    value: '+1 (555) 123-4567',
    icon: 'phone',
    description: 'Mon – Fri, 09:00 - 18:00',
  },
  {
    label: 'Email',
    title: 'Email',
    value: 'hello@example.com',
    icon: 'mail',
  },
  {
    label: 'Office',
    title: 'Office',
    value: '123 Innovation Street, San Francisco, CA',
    icon: 'address',
  },
];

export function ContactInfoForm() {
  const { data: contactInfo, isLoading } = useContactInfo();
  const createMutation = useCreateContactInfo();
  const updateMutation = useUpdateContactInfo();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formMode, setFormMode] = useState<'idle' | 'edit' | 'create'>('idle');
  const [formData, setFormData] = useState<Partial<ContactInfo>>(() => createEmptyFormData());
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === 'idle') return;

    try {
      setFieldErrors({});
      setFeedback(null);

      // Normalize form data: convert empty strings to null for optional fields
      const normalizedData = {
        title: formData.title?.trim() || '',
        value: formData.value?.trim() || '',
        icon: formData.icon?.trim() || '',
        description: formData.description?.trim() || null,
      };

      const validated = contactInfoSchema.parse(normalizedData);
      // Only include fields that exist in the database schema
      const payload = {
        title: validated.title,
        value: validated.value,
        icon: validated.icon,
        description: validated.description || null,
      };

      if (formMode === 'edit' && editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...payload });
      } else if (formMode === 'create') {
        await createMutation.mutateAsync(payload);
      }

      const successMessage =
        formMode === 'create' ? 'Contact method added successfully.' : 'Contact method updated successfully.';
      setFeedback({ type: 'success', message: successMessage });

      if (formMode === 'create') {
        setFormData(createEmptyFormData());
      } else {
        setFormData({
          title: payload.title || '',
          value: payload.value || '',
          description: payload.description || '',
          icon: payload.icon || '',
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErrors: Partial<Record<keyof ContactInfo, string>> = {};
        error.errors.forEach((err) => {
          const key = err.path[0] as keyof ContactInfo | undefined;
          if (key) {
            zodErrors[key] = err.message;
          }
        });
        setFieldErrors(zodErrors);
        setFeedback({ type: 'error', message: 'Please fix the highlighted fields.' });
      } else {
        console.error('Error updating contact info:', error);
        let errorMessage = 'Failed to save contact method. Please try again.';
        
        // Extract error message from various error types
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error && typeof error === 'object' && 'message' in error) {
          errorMessage = String(error.message);
        } else if (error && typeof error === 'object' && 'details' in error) {
          errorMessage = String(error.details);
        }
        
        setFeedback({
          type: 'error',
          message: errorMessage,
        });
      }
    }
  };

  const handleEdit = (info: ContactInfo) => {
    setEditingId(info.id);
    setFormData({
      title: info.title || '',
      value: info.value || '',
      description: info.description || '',
      icon: info.icon || '',
    });
    setFormMode('edit');
    setFieldErrors({});
    setFeedback(null);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(createEmptyFormData());
    setFormMode('create');
    setFieldErrors({});
    setFeedback(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormMode('idle');
    setFormData(createEmptyFormData());
    setFieldErrors({});
    setFeedback(null);
  };

  if (isLoading) {
    return <div>Loading contact info...</div>;
  }

  return (
    <div className="space-y-8">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <h2 className="text-3xl font-bold gradient-text">Contact Info</h2>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Contact Method
          </button>
        </motion.div>

        {/* Contact Info List */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {contactInfo?.map((info) => (
            <motion.div
              key={info.id}
              variants={fadeInUp}
              className="glass p-4 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{info.icon}</span>
                <button
                  onClick={() => handleEdit(info)}
                  className="p-2 glass rounded-lg hover:bg-opacity-80 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-semibold mb-1">{info.title}</h3>
              <p className="text-sm text-foreground/70">{info.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {!contactInfo?.length && (
          <motion.div
            variants={fadeInUp}
            className="glass p-4 rounded-lg border border-dashed border-primary/30 text-sm text-foreground/80"
          >
            No contact methods yet. Click "Add Contact Method" to create your phone number, address, or other details.
          </motion.div>
        )}

        {/* Edit/Create Form */}
        {formMode !== 'idle' && (
          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="glass p-6 rounded-lg space-y-4"
          >
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg px-4 py-3 text-sm font-medium ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/15 text-emerald-500'
                    : 'bg-red-500/15 text-red-500'
                }`}
              >
                {feedback.message}
              </motion.div>
            )}

            {formMode === 'create' && (
              <div className="space-y-2">
                <p className="text-sm text-foreground/70">
                  Start with a quick template or customise the fields below. You can edit everything later.
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-sm hover:border-primary/60 transition-colors glass"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          title: preset.title,
                          value: preset.value,
                          icon: preset.icon,
                          description: preset.description || '',
                        }));
                        setFieldErrors({});
                        setFeedback(null);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Label, e.g., Email"
                className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl"
                required
              />
              {fieldErrors.title && <p className="mt-1 text-sm text-red-500">{fieldErrors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Value</label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="The value, e.g., you@example.com"
                className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl"
                required
              />
              {fieldErrors.value && <p className="mt-1 text-sm text-red-500">{fieldErrors.value}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
                className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Icon name or emoji"
                className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl"
                required
              />
              <p className="mt-1 text-xs text-foreground/60">
                Use keywords like <span className="font-semibold">phone</span>, <span className="font-semibold">mail</span>, <span className="font-semibold">address</span>, or paste an emoji.
              </p>
              {fieldErrors.icon && <p className="mt-1 text-sm text-red-500">{fieldErrors.icon}</p>}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formMode === 'create' ? 'Create Contact Info' : 'Update Contact Info'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 glass rounded-lg hover:bg-opacity-80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}

