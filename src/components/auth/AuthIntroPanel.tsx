import React from 'react';
import { motion } from 'framer-motion';
import { JarvisBackdrop } from './JarvisBackdrop';
import { ShieldCheck, Terminal, Activity, Cpu } from 'lucide-react';
import '../../styles/auth.css';

export const AuthIntroPanel: React.FC = () => {
    
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col items-center justify-center p-8 overflow-hidden">
      <JarvisBackdrop />

      {/* Content wrapper */}
      <motion.div 
        className="relative z-10 max-w-lg w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-10">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-3">
                <span className="auth-gradient-text">VICTUS</span>
            </h1>
            <p className="text-lg text-cyan-100/70 font-light tracking-wide leading-relaxed">
                Advanced autonomous agent for complex system automation and engineering workflows.
            </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-8 mb-12">
            <FeatureRow 
                icon={<Cpu size={24} />} 
                title="Autonomous Reasoning"
                text="Executes complex, multi-step engineering tasks with self-correction capabilities." 
            />
            <FeatureRow 
                icon={<ShieldCheck size={24} />} 
                title="Secure Tool Use"
                text="Sandboxed environment with granular permission scopes and approval gates for high-risk actions." 
            />
            <FeatureRow 
                icon={<Activity size={24} />} 
                title="Full Observability"
                text="Comprehensive session timelines and structured logs for every agent decision and tool call." 
            />
             <FeatureRow 
                icon={<Terminal size={24} />} 
                title="Deep Integration"
                text="Seamlessly interacts with your local environment, file system, and development workflow." 
            />
        </motion.div>

        <motion.div variants={itemVariants}>
            <div className="bg-cyan-950/20 border border-cyan-800/30 rounded-lg p-5 backdrop-blur-sm">
                <div className="flex items-center space-x-2 text-cyan-400 mb-2">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Enterprise Security Model</span>
                </div>
                <p className="text-sm text-cyan-200/80 leading-relaxed">
                    Built for safety with mandatory human-in-the-loop verification for critical system changes and complete audit trails.
                </p>
            </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

const FeatureRow = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => (
    <div className="flex items-start space-x-4">
        <div className="mt-1 text-cyan-500 shrink-0">{icon}</div>
        <div>
            <h3 className="font-bold text-gray-200 text-base mb-1">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-light">{text}</p>
        </div>
    </div>
);
