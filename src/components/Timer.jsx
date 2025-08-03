import React from 'react';
import { useGame } from '../context/GameContext';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

function Timer() {
  const { state, dispatch } = useGame();

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    dispatch({ type: 'START_TIMER' });
  };

  const stopTimer = () => {
    dispatch({ type: 'STOP_TIMER' });
  };

  const resetTimer = () => {
    dispatch({ type: 'STOP_TIMER' });
    dispatch({ type: 'UPDATE_TIMER', payload: 0 });
  };

  const getTimerClass = () => {
    if (state.gameTimer > 7200) return 'timer-danger'; // Over 2 hours
    if (state.gameTimer > 3600) return 'timer-warning'; // Over 1 hour
    return 'timer-normal';
  };

  return (
    <div className={`game-timer ${getTimerClass()}`}>
      <div className="timer-display">
        <Clock className="icon" />
        <span className="time-text">{formatTime(state.gameTimer)}</span>
      </div>
      
      <div className="timer-controls">
        {!state.isTimerRunning ? (
          <button 
            className="timer-btn start"
            onClick={startTimer}
            title="Start Timer"
          >
            <Play className="icon" />
          </button>
        ) : (
          <button 
            className="timer-btn pause"
            onClick={stopTimer}
            title="Pause Timer"
          >
            <Pause className="icon" />
          </button>
        )}
        
        <button 
          className="timer-btn reset"
          onClick={resetTimer}
          title="Reset Timer"
        >
          <RotateCcw className="icon" />
        </button>
      </div>

      {state.gameTimer > 3600 && (
        <div className="timer-warning-text">
          {state.gameTimer > 7200 
            ? "⚠️ This game has gone on too long. Someone should cry soon."
            : "⏰ Over an hour of psychological warfare. Impressive."
          }
        </div>
      )}
    </div>
  );
}

export default Timer;
