import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/utils/motion';
import { ErrorBoundary } from './3D/ErrorBoundary';

const Globe3D = lazy(() => import('./3D/Globe3D').then(module => ({ default: module.Globe3D })));

export function About() {
  return (
    <section id="about" className="relative min-h-screen py-20 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <motion.div variants={fadeInUp}>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold mb-6 gradient-text"
            >
              About Me
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-foreground/70 mb-6 leading-relaxed"
            >
              I'm a passionate full-stack developer with over 5 years of experience building
              modern web applications. I love turning complex problems into simple, beautiful,
              and intuitive solutions.
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-foreground/70 mb-8 leading-relaxed"
            >
              When I'm not coding, you can find me exploring new technologies, contributing to
              open-source projects, or sharing knowledge with the developer community.
            </motion.p>

            {/* Info Cards */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {[
                { label: 'Experience', value: '5+ Years' },
                { label: 'Projects', value: '50+' },
                { label: 'Clients', value: '30+' },
                { label: 'Countries', value: '10+' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="glass p-6 rounded-xl text-center card-hover border-2 border-primary/20 hover:border-primary/50"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-sm text-foreground/70 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Languages */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-xl font-semibold mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {['English', 'French', 'Arabic', 'Spanish'].map((lang) => (
                  <motion.span
                    key={lang}
                    className="px-4 py-2 glass rounded-full text-sm font-medium border border-primary/30 hover:border-primary/60 transition-all"
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    {lang}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right 3D Content */}
          <motion.div
            variants={fadeInUp}
            className="relative h-[400px] lg:h-[500px] flex items-center justify-center"
          >
            <ErrorBoundary fallback={
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                <div className="text-6xl animate-spin">🌍</div>
              </div>
            }>
              <Suspense fallback={<div className="w-full h-full bg-card rounded-lg animate-pulse" />}>
                <Globe3D />
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </motion.div>

        {/* What I Do Best */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-20"
        >
          <motion.h3
            variants={fadeInUp}
            className="text-3xl font-bold mb-8 text-center gradient-text"
          >
            What I Do Best
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Frontend Development',
                description: 'Building responsive and interactive user interfaces with React, TypeScript, and modern CSS.',
                icon: '🎨',
              },
              {
                title: 'Backend Development',
                description: 'Creating scalable APIs and serverless functions with Node.js, Python, and cloud services.',
                icon: '⚙️',
              },
              {
                title: 'Full Stack Solutions',
                description: 'End-to-end development from database design to deployment and DevOps.',
                icon: '🚀',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass p-8 rounded-2xl card-hover border-2 border-primary/20 hover:border-primary/50 group"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{item.icon}</div>
                <h4 className="text-xl font-bold mb-3 gradient-text">{item.title}</h4>
                <p className="text-foreground/70 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

