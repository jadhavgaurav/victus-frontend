import React from 'react';
import { motion } from 'framer-motion';

interface OnboardingStepperProps {
    currentStep: number;
    totalSteps: number;
}

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ currentStep, totalSteps }) => {
    return (
        <div className="w-full mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">
                    Setup {currentStep} of {totalSteps}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                    {Math.round((currentStep / totalSteps) * 100)}%
                </span>
            </div>
            {/* Progress Bar Track */}
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                {/* Active Progress Bar */}
                <motion.div 
                    className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                />
            </div>
        </div>
    );
};
