import React from 'react';
import '../../styles/auth.css';
import { motion } from 'framer-motion';

export const JarvisBackdrop: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black pointer-events-none select-none z-0">
      {/* Deep Background Gradient */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-950/20 via-black to-black"
        style={{ opacity: 0.6 }}
      />
      
      {/* Large Rotating Rings - Decorative */}
      <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] opacity-20">
         <motion.div 
            className="absolute inset-0 jarvis-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
         />
         <motion.div 
            className="absolute inset-12 jarvis-ring border-dashed"
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            style={{ borderColor: 'rgba(6, 182, 212, 0.15)' }}
         />
         <motion.div 
            className="absolute inset-32 jarvis-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            style={{ borderColor: 'rgba(59, 130, 246, 0.2)' }}
         />
      </div>

       {/* Floating Particles (CSS based for performance) */}
       <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-500 rounded-full opacity-0 animate-[float-particle_4s_ease-in-out_infinite]" />
          <div className="absolute top-3/4 left-3/4 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 animate-[float-particle_6s_ease-in-out_infinite_1s]" />
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-teal-400 rounded-full opacity-0 animate-[float-particle_5s_ease-in-out_infinite_2s]" />
       </div>
       
       {/* Vignette Overlay */}
       <div className="absolute inset-0 bg-transparent shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
    </div>
  );
};
