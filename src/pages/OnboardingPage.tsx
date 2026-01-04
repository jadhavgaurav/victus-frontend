import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { OnboardingShell } from '../onboarding/OnboardingShell';

export const OnboardingPage: React.FC = () => {
    const { settings, isLoading } = useSettings();
    const navigate = useNavigate();

    // Guard: If onboarding is already completed, redirect to home
    useEffect(() => {
        if (!isLoading && settings?.ui?.onboarding_completed) {
            navigate('/', { replace: true });
        }
    }, [settings, isLoading, navigate]);

    if (isLoading) {
        return (
             <div className="flex h-screen items-center justify-center bg-black text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500"></div>
            </div>
        );
    }

    return <OnboardingShell />;
};
