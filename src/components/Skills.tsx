import { useState, useMemo, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/utils/motion';
import { usePortfolio } from '@/context/PortfolioContext';
import { SKILL_CATEGORIES } from '@/config/constants';
import { ErrorBoundary } from './3D/ErrorBoundary';

const SkillSphere = lazy(() => import('./3D/SkillSphere').then(module => ({ default: module.SkillSphere })));

export function Skills() {
  const { skills } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>(SKILL_CATEGORIES.ALL);

  const filteredSkills = useMemo(() => {
    if (!skills.data) return [];
    if (selectedCategory === SKILL_CATEGORIES.ALL) return skills.data;
    return skills.data.filter((skill) => skill.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [skills.data, selectedCategory]);

  const categories = useMemo(() => {
    if (!skills.data) return [SKILL_CATEGORIES.ALL];
    const uniqueCategories = new Set(skills.data.map((s) => s.category.toLowerCase()));
    return [SKILL_CATEGORIES.ALL, ...Array.from(uniqueCategories)];
  }, [skills.data]);

  const stats = useMemo(() => {
    if (!skills.data || skills.data.length === 0) {
      return { total: 0, average: 0, expert: 0 };
    }
    const total = skills.data.length;
    const average = Math.round(skills.data.reduce((sum, s) => sum + s.level, 0) / total);
    const expert = skills.data.filter((s) => s.level >= 80).length;
    return { total, average, expert };
  }, [skills.data]);

  if (skills.isLoading) {
    return (
      <section id="skills" className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">Loading skills...</div>
      </section>
    );
  }

  return (
    <section id="skills" className="relative min-h-screen py-20">
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
            Skills
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-foreground/70 max-w-2xl mx-auto"
          >
            Technologies and tools I work with
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { label: 'Total Skills', value: stats.total, icon: '🎯' },
            { label: 'Avg Proficiency', value: `${stats.average}%`, icon: '⭐' },
            { label: 'Expert Level', value: stats.expert, icon: '🚀' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="glass p-6 rounded-xl text-center card-hover border-2 border-primary/20 hover:border-primary/50"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
              <div className="text-sm text-foreground/70 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Category Filters */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              variants={fadeInUp}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'glass hover:bg-opacity-80'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid and 3D Sphere */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Skills Grid */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                variants={fadeInUp}
                className="glass p-6 rounded-xl text-center card-hover border-2 border-primary/20 hover:border-primary/50 group"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">{skill.icon || '💻'}</div>
                <div className="font-bold mb-3 text-foreground">{skill.name}</div>
                <div className="w-full bg-border/50 rounded-full h-3 mb-2 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-primary to-purple-600 h-3 rounded-full shadow-lg"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                  />
                </div>
                <div className="text-sm font-semibold text-primary">{skill.level}%</div>
              </motion.div>
            ))}
          </motion.div>

          {/* 3D Skill Sphere */}
          <motion.div
            variants={fadeInUp}
            className="relative h-[400px] lg:h-[500px] flex items-center justify-center"
          >
            <ErrorBoundary fallback={
              <div className="w-full h-full bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg flex items-center justify-center">
                <div className="text-6xl">💻</div>
              </div>
            }>
              <Suspense fallback={<div className="w-full h-full bg-card rounded-lg animate-pulse" />}>
                <SkillSphere skills={skills.data || []} />
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

