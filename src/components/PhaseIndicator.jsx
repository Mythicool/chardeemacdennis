import React from 'react';
import { Brain, Dumbbell, Heart, Skull } from 'lucide-react';

function PhaseIndicator({ currentPhase, horrorUnlocked }) {
  const phases = [
    { 
      number: 1, 
      name: 'MIND', 
      icon: Brain, 
      color: '#8B0000',
      description: 'Your intellect is weak, like your grip strength.'
    },
    { 
      number: 2, 
      name: 'BODY', 
      icon: Dumbbell, 
      color: '#FF4500',
      description: 'There will be blood, and that\'s fine.'
    },
    { 
      number: 3, 
      name: 'SPIRIT', 
      icon: Heart, 
      color: '#4B0082',
      description: 'Now we break each other emotionally.'
    },
    { 
      number: 4, 
      name: 'HORROR', 
      icon: Skull, 
      color: '#000000',
      description: 'Unlocked when everyone is emotionally unstable.',
      locked: !horrorUnlocked
    }
  ];

  return (
    <div className="phase-indicator">
      <div className="phase-track">
        {phases.map((phase) => {
          const Icon = phase.icon;
          const isActive = phase.number === currentPhase;
          const isCompleted = phase.number < currentPhase;
          const isLocked = phase.locked;
          
          return (
            <div 
              key={phase.number}
              className={`phase-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
              style={{ '--phase-color': phase.color }}
            >
              <div className="phase-icon">
                <Icon className="icon" />
              </div>
              <div className="phase-info">
                <div className="phase-name">{phase.name}</div>
                <div className="phase-number">Phase {phase.number}</div>
              </div>
              
              {isActive && (
                <div className="phase-description">
                  {phase.description}
                </div>
              )}
              
              {isLocked && (
                <div className="locked-overlay">
                  <span>🔒</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="phase-progress-bar">
        <div 
          className="progress-fill"
          style={{ 
            width: `${(currentPhase / (horrorUnlocked ? 4 : 3)) * 100}%`,
            backgroundColor: phases[currentPhase - 1]?.color || '#666'
          }}
        />
      </div>
    </div>
  );
}

export default PhaseIndicator;
