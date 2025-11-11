import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '@/context/PortfolioContext';
import { fadeInUp, staggerContainer } from '@/utils/motion';
import { FolderOpen, Code, Link as LinkIcon, Mail } from 'lucide-react';

export function Statistics() {
  const { projects, skills, socialLinks, contactInfo } = usePortfolio();

  const stats = [
    {
      label: 'Projects',
      value: projects.data?.length || 0,
      icon: FolderOpen,
      color: 'text-blue-500',
    },
    {
      label: 'Skills',
      value: skills.data?.length || 0,
      icon: Code,
      color: 'text-green-500',
    },
    {
      label: 'Social Links',
      value: socialLinks.data?.length || 0,
      icon: LinkIcon,
      color: 'text-purple-500',
    },
    {
      label: 'Contact Info',
      value: contactInfo.data?.length || 0,
      icon: Mail,
      color: 'text-orange-500',
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-8"
    >
      <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-6 gradient-text">
        Overview
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="glass p-6 rounded-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-foreground/70">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

