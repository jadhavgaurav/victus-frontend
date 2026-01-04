import React, { useState } from 'react';
import { JarvisBackdrop } from '../components/auth/JarvisBackdrop';
import { OnboardingStepper } from './OnboardingStepper';
import { Step1Contract } from './steps/Step1Contract';
import { Step2Preferences } from './steps/Step2Preferences';
import { Step3Permissions } from './steps/Step3Permissions';
import { Step4FirstSuccess } from './steps/Step4FirstSuccess';
import { AnimatePresence, motion } from 'framer-motion';
import './onboarding.css';

export const OnboardingShell: React.FC = () => {
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
    // Back navigation logic could be added here if needed, but linear flow is often simpler for onboarding.

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1Contract onNext={nextStep} />;
            case 2: return <Step2Preferences onNext={nextStep} />;
            case 3: return <Step3Permissions onNext={nextStep} />;
            case 4: return <Step4FirstSuccess />;
            default: return null;
        }
    };

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
            {/* Background Reused from Auth */}
            <JarvisBackdrop />

            <div className="relative z-10 w-full max-w-lg px-6">
                 {/* Main Card */}
                 <motion.div 
                    className="onboarding-glass rounded-2xl p-8 md:p-10 w-full text-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                 >
                    <OnboardingStepper currentStep={step} totalSteps={totalSteps} />
                    
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>

                 </motion.div>
            </div>
        </div>
    );
};
