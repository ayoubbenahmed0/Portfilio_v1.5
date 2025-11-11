import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/utils/motion';
import { usePortfolio } from '@/context/PortfolioContext';
import { env } from '@/config/env';
import emailjs from '@emailjs/browser';
import { z } from 'zod';
import type { ContactInfo } from '@/types/database';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export function Contact() {
  const { contactInfo, socialLinks, settings } = usePortfolio();
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [honeypot, setHoneypot] = useState('');
  const [cooldownMs, setCooldownMs] = useState(0);

  const contactInfoData = contactInfo.data || [];
  const socialLinksData = socialLinks.data || [];
  const contactItems = contactInfoData.length > 0 ? contactInfoData : [];
  
  // Get EmailJS config from settings or environment variables
  const emailjsConfig = {
    serviceId: settings.data?.emailjs_service_id || env.emailjsServiceId,
    templateId: settings.data?.emailjs_template_id || env.emailjsTemplateId,
    publicKey: settings.data?.emailjs_public_key || env.emailjsPublicKey,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const lastSent = Number(localStorage.getItem('contact_last_sent') || '0');
      const remaining = Math.max(0, 60_000 - (Date.now() - lastSent));
      setCooldownMs(remaining);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const primaryEmail = useMemo(() => {
    const emailRow = contactInfoData.find((c) => c.title?.toLowerCase().includes('email'));
    return emailRow?.value || '';
  }, [contactInfoData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitStatus('idle');

    // Honeypot (spam bots)
    if (honeypot.trim().length > 0) {
      return; // silently ignore
    }

    // Cooldown guard
    if (cooldownMs > 0) {
      setSubmitStatus('error');
      return;
    }

    try {
      const validated = contactSchema.parse(formData);
      
      if (!emailjsConfig.serviceId || !emailjsConfig.templateId || !emailjsConfig.publicKey) {
        throw new Error('EmailJS is not configured. Please configure it in the admin settings.');
      }

      setIsSubmitting(true);

      const templateParams = {
        from_name: validated.name,
        from_email: validated.email,
        subject: validated.subject,
        message: validated.message,
      };

      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        templateParams,
        emailjsConfig.publicKey
      );

      localStorage.setItem('contact_last_sent', String(Date.now()));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ContactForm] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setSubmitStatus('error');
        console.error('Error sending message:', error);
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconLibrary: Record<string, React.ComponentType<{ className?: string }>> = {
    mail: Mail,
    email: Mail,
    'mail-open': Mail,
    phone: Phone,
    'phone-call': Phone,
    call: Phone,
    mobile: Phone,
    map: MapPin,
    address: MapPin,
    location: MapPin,
    office: MapPin,
    clock: Clock,
    hours: Clock,
    time: Clock,
  };

  const getIcon = (iconName?: string | null) => {
    if (!iconName) {
      return <Mail className="w-6 h-6" />;
    }

    const key = iconName.trim().toLowerCase();
    const IconComponent = iconLibrary[key];

    if (IconComponent) {
      return <IconComponent className="w-6 h-6" />;
    }

    if (iconName.trim().length <= 3) {
      return <span className="text-2xl leading-none">{iconName}</span>;
    }

    return (
      <span className="text-xs font-semibold uppercase tracking-wide">
        {iconName.slice(0, 3)}
      </span>
    );
  };

  const formatContactValue = (info: ContactInfo) => {
    const rawValue = info.value?.trim();
    if (!rawValue) return null;

    const isUrl = /^https?:\/\//i.test(rawValue);
    if (isUrl) {
      return (
        <a
          href={rawValue}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {rawValue}
        </a>
      );
    }

    if (rawValue.includes('@')) {
      return (
        <a href={`mailto:${rawValue}`} className="hover:underline">
          {rawValue}
        </a>
      );
    }

    const isPhone = /^\+?[\d\s().-]{7,}$/.test(rawValue);
    if (isPhone) {
      const tel = rawValue.replace(/[^+\d]/g, '');
      return (
        <a href={`tel:${tel}`} className="hover:underline">
          {rawValue}
        </a>
      );
    }

    return <span>{rawValue}</span>;
  };

  return (
    <section id="contact" className="relative min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl sm:text-5xl font-bold mb-4 gradient-text"
          >
            Get In Touch
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-foreground/70 max-w-2xl mx-auto"
          >
            Let's work together on your next project
          </motion.p>
          {primaryEmail && (
            <motion.a
              variants={fadeInUp}
              href={`mailto:${primaryEmail}`}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border-2 border-primary/30 hover:border-primary/60 transition-all glass"
            >
              <Mail className="w-4 h-4" /> {primaryEmail}
            </motion.a>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Info & Social Links */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {contactItems.length > 0 ? (
                contactItems.map((info) => {
                  const formattedValue = formatContactValue(info);

                  return (
                    <motion.div
                      key={info.id}
                      variants={fadeInUp}
                      className="glass p-6 rounded-xl card-hover border-2 border-primary/20 hover:border-primary/50 transition-colors"
                      style={{
                        backgroundColor: info.bgColor || undefined,
                        borderColor: info.borderColor || undefined,
                      }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <div
                        className="text-primary mb-3 text-3xl"
                        style={{ color: info.color || undefined }}
                      >
                        {getIcon(info.icon)}
                      </div>
                      <h3 className="font-bold mb-2 text-lg">{info.title}</h3>
                      {formattedValue && (
                        <p className="text-sm text-foreground/80">
                          {formattedValue}
                        </p>
                      )}
                      {info.description && (
                        <p className="text-xs text-foreground/60 mt-2">
                          {info.description}
                        </p>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  variants={fadeInUp}
                  className="glass p-6 rounded-xl border-2 border-dashed border-primary/20 text-sm text-foreground/70"
                >
                  No contact details configured yet. Add your phone number, address, and other
                  details from the admin dashboard to display them here.
                </motion.div>
              )}
            </div>

            {/* Social Links */}
            {socialLinksData.length > 0 && (
              <motion.div variants={fadeInUp}>
                <h3 className="text-xl font-semibold mb-4">Connect With Me</h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinksData.map((link) => (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 glass rounded-xl border-2 border-primary/20 hover:border-primary/50 transition-all"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-2xl">{link.icon}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="glass p-6 rounded-lg border-2 border-primary/20">
              {/* honeypot */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    aria-label="Name"
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    aria-label="Email"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can I help?"
                  className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  aria-label="Subject"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell me a bit about your project..."
                  className="w-full px-4 py-3 bg-card text-foreground placeholder:text-foreground/60 border-2 border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                  aria-label="Message"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-500/20 text-green-500 rounded-lg text-sm"
                >
                  Message sent successfully!
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-500/20 text-red-500 rounded-lg text-sm"
                >
                  {cooldownMs > 0 ? `Please wait ${Math.ceil(cooldownMs / 1000)}s before sending another message.` : 'Failed to send message. Please try again.'}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting || cooldownMs > 0}
                className="w-full px-6 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting || cooldownMs > 0 ? 1 : 1.02, y: isSubmitting || cooldownMs > 0 ? 0 : -2 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Sending...' : cooldownMs > 0 ? `Please wait ${Math.ceil(cooldownMs / 1000)}s` : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

