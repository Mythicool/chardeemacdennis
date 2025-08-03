import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { CheckCircle, XCircle, Zap, Timer as TimerIcon } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

function CardDisplay({ card, onComplete }) {
  const { dispatch } = useGame();
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Timer for timed challenges
  useEffect(() => {
    let interval;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const startTimer = (seconds) => {
    setTimeLeft(seconds);
    setIsTimerActive(true);
  };

  const handleSuccess = () => {
    soundEffects.success();
    if (card.isWildcard) {
      handleWildcard();
    }
    onComplete(true);
  };

  const handleFailure = () => {
    soundEffects.failure();
    onComplete(false);
  };

  const handleWildcard = () => {
    soundEffects.wildcard();
    // Apply wildcard effects based on card
    if (card.id.includes('reverse')) {
      dispatch({
        type: 'APPLY_WILDCARD',
        payload: { type: 'reverse_drinking', duration: 3 }
      });
    } else if (card.id.includes('immunity')) {
      const immunityType = card.phase === 'body' ? 'physical' : 'emotional';
      dispatch({
        type: 'APPLY_WILDCARD',
        payload: { type: `immunity_${immunityType}`, duration: card.phase === 'body' ? 2 : 3 }
      });
    } else if (card.id.includes('nuclear')) {
      dispatch({
        type: 'APPLY_WILDCARD',
        payload: { type: 'nuclear_option' }
      });
    }
  };

  const getCardStyle = () => {
    const baseStyle = "card-display";
    if (card.isWildcard) return `${baseStyle} wildcard`;
    if (card.difficulty === 'nightmare') return `${baseStyle} nightmare`;
    if (card.difficulty === 'extreme') return `${baseStyle} extreme`;
    return baseStyle;
  };

  const getDifficultyColor = () => {
    switch (card.difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      case 'extreme': return '#9C27B0';
      case 'nightmare': return '#000000';
      case 'special': return '#FFD700';
      default: return '#666';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={getCardStyle()}>
      <div className="card-header">
        <div className="card-title-section">
          <h1 className="card-game-title">CHARDEE MACDENNIS</h1>
          <h2 className="card-subtitle">THE GAME OF GAMES</h2>
        </div>
        
        <div className="card-category" style={{ backgroundColor: getDifficultyColor() }}>
          <div className="category-label">CATEGORY:</div>
          <div className="category-name">{card.category}</div>
        </div>
      </div>

      <div className="card-body">
        <h3 className="challenge-title">{card.title}</h3>
        <div className="challenge-text">
          {card.challenge}
        </div>

        {card.isWildcard && (
          <div className="wildcard-notice">
            <Zap className="icon" />
            WILDCARD EFFECT ACTIVE
          </div>
        )}

        {card.difficulty === 'nightmare' && (
          <div className="nightmare-warning">
            <span className="skull">💀</span>
            LEVEL 4: HORROR - PROCEED WITH CAUTION
            <span className="skull">💀</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        {/* Timer controls for timed challenges */}
        {(card.challenge.includes('minute') || card.challenge.includes('seconds')) && (
          <div className="timer-controls">
            {!isTimerActive && timeLeft === null && (
              <div className="timer-buttons">
                <button onClick={() => startTimer(60)} className="timer-btn">
                  <TimerIcon className="icon" /> 1 Min
                </button>
                <button onClick={() => startTimer(120)} className="timer-btn">
                  <TimerIcon className="icon" /> 2 Min
                </button>
                <button onClick={() => startTimer(180)} className="timer-btn">
                  <TimerIcon className="icon" /> 3 Min
                </button>
              </div>
            )}
            
            {timeLeft !== null && (
              <div className={`timer-display ${timeLeft <= 10 ? 'urgent' : ''}`}>
                <TimerIcon className="icon" />
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
        )}

        <div className="completion-buttons">
          <button 
            className="success-btn" 
            onClick={handleSuccess}
          >
            <CheckCircle className="icon" />
            SUCCESS
          </button>
          
          <button 
            className="failure-btn" 
            onClick={handleFailure}
          >
            <XCircle className="icon" />
            FAILURE
          </button>
        </div>

        <div className="card-footer">
          <div className="difficulty-indicator">
            Difficulty: <span style={{ color: getDifficultyColor() }}>
              {card.difficulty.toUpperCase()}
            </span>
          </div>
          
          {card.phase && (
            <div className="phase-indicator">
              Phase: {card.phase.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardDisplay;
