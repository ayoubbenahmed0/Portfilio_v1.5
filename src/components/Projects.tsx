import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/utils/motion';
import { usePortfolio } from '@/context/PortfolioContext';
import type { Project } from '@/types/database';

export function Projects() {
  const { projects } = usePortfolio();

  if (projects.isLoading) {
    return (
      <section id="projects" className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">Loading projects...</div>
      </section>
    );
  }

  const projectsData = projects.data || [];

  return (
    <section id="projects" className="relative min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            Projects
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-foreground/70 max-w-2xl mx-auto"
          >
            A collection of my recent work and side projects
          </motion.p>
        </motion.div>

        {projectsData.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            className="text-center py-20"
          >
            <p className="text-foreground/70 text-lg">No projects available yet.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projectsData.map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="glass rounded-2xl overflow-hidden card-hover border-2 border-primary/20 hover:border-primary/50 group"
    >
      {project.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          {project.featured && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-lg">
              Featured
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 gradient-text">{project.title}</h3>
        <p className="text-foreground/70 mb-4 text-sm line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium border border-primary/30"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-3 py-1 text-foreground/50 text-xs">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>
        <div className="flex gap-4 pt-2 border-t border-border">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-all hover:scale-110 font-medium"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">Code</span>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-all hover:scale-110 font-medium"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="text-sm">Demo</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

