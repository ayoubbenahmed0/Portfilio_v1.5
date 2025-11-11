import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/utils/motion';
import { usePortfolio } from '@/context/PortfolioContext';
import { NAV_LINKS } from '@/config/constants';

export function Footer() {
  const { socialLinks } = usePortfolio();
  const socialLinksData = socialLinks.data || [];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 border-t-2 border-border/50 glass">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
        >
          <div className="text-center md:text-left">
            <div className="text-lg font-bold gradient-text mb-2">Ayoub Ben Ahmed</div>
            <div className="text-sm text-foreground/70">
              © {new Date().getFullYear()} All rights reserved.
            </div>
          </div>

          <div className="flex justify-center">
            <nav className="flex flex-wrap gap-4 text-sm text-foreground/70">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.href)}
                  className="hover:text-primary transition-colors"
                  aria-label={`Go to ${link.label}`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex justify-center md:justify-end gap-4">
            {socialLinksData.map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-xl border-2 border-primary/20 hover:border-primary/50 transition-all"
                aria-label={link.name}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">{link.icon}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <motion.button
            onClick={() => scrollTo('#home')}
            className="px-4 py-2 rounded-full glass border-2 border-primary/30 hover:border-primary/60 transition-all text-sm"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Back to top"
          >
            Back to top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}

