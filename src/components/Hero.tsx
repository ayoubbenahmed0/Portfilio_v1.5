import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download, Mail } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/utils/motion';
import { ErrorBoundary } from './3D/ErrorBoundary';

const Profile3D = lazy(() => import('./3D/Profile3D').then(module => ({ default: module.Profile3D })));
const Particles = lazy(() => import('./3D/Particles').then(module => ({ default: module.Particles })));

function HeroImage() {
  const [imageError, setImageError] = React.useState(false);
  
  if (imageError) {
    return (
      <ErrorBoundary fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl animate-pulse">👨‍💻</div>
        </div>
      }>
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl animate-pulse">👨‍💻</div>
          </div>
        }>
          <div className="w-full h-full">
            <Profile3D />
          </div>
        </Suspense>
      </ErrorBoundary>
    );
  }
  
  return (
    <img
      src="/images/pdp.png"
      alt="Ayoub Ben Ahmed"
      className="w-full h-full object-cover"
      onError={() => setImageError(true)}
    />
  );
}

export function Hero() {
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Particles */}
      <ErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <Particles />
        </Suspense>
      </ErrorBoundary>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <motion.div variants={fadeInUp} className="text-center lg:text-left">
            <motion.p
              variants={fadeInUp}
              className="text-primary text-lg font-mono mb-4 animate-pulse"
            >
              👋 Hi, my name is
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 gradient-text leading-tight"
            >
              Ayoub Ben Ahmed
            </motion.h1>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground/90"
            >
              Full Stack Developer
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              I build modern, scalable web applications with a focus on performance,
              user experience, and clean code. Passionate about creating digital experiences
              that make a difference.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToContact();
                }}
                className="px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/60 transition-all hover:scale-105"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5" />
                Get In Touch
              </motion.a>
              <motion.a
                href="/resume.pdf"
                download
                className="px-8 py-4 glass border-2 border-primary/30 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary/60 transition-all backdrop-blur-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5" />
                Download CV
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Image/3D Content */}
          <motion.div
            variants={fadeInUp}
            className="relative h-[400px] lg:h-[600px] flex items-center justify-center"
          >
            {/* Profile Image Container */}
            <div className="relative w-full h-full max-w-md">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
              
              {/* Image wrapper with border glow */}
              <motion.div
                className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/50 shadow-2xl shadow-primary/50 bg-gradient-to-br from-primary/20 to-purple-500/20"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Profile Image - You can add your image at public/profile.jpg */}
                <HeroImage />
                
                {/* Floating decorative elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl z-0"
                  animate={{
                    y: [0, -20, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl z-0"
                  animate={{
                    y: [0, 20, 0],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, repeat: Infinity, repeatType: 'reverse', duration: 2 }}
      >
        <ChevronDown className="w-6 h-6 text-foreground/50" />
      </motion.div>
    </section>
  );
}

