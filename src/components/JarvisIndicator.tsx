import React from 'react';
import './jarvis.css';

export type JarvisState = 'wake_ready' | 'listening' | 'processing' | 'speaking' | 'error' | 'offline';

interface JarvisIndicatorProps {
  state: JarvisState;
  level?: number; // 0-1, reserved for future amplitude viz
  size?: number; // scale factor?, reserved
}

export const JarvisIndicator: React.FC<JarvisIndicatorProps> = ({ state }) => {
  return (
    <div className={`jarvis-container state-${state}`}>
      {/* Central Core */}
      <div className="jarvis-core" />
      
      {/* Animated Rings */}
      <div className="jarvis-ring" />
      <div className="jarvis-ring" />
      {/* Optional third ring for detailed states if needed */}
    </div>
  );
};
