import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import CardDisplay from './CardDisplay';
import TeamStatus from './TeamStatus';
import PhaseIndicator from './PhaseIndicator';
import Timer from './Timer';
import { GAME_RULES } from '../data/gameRules';
import { Crown, Skull, AlertTriangle, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

function GameBoard() {
  const { state, dispatch } = useGame();
  const [showRules, setShowRules] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentPhase = GAME_RULES.phases[state.currentPhase];
  const currentTeam = state.teams[state.currentTeamIndex];

  const drawCard = () => {
    if (!state.currentCard) {
      soundEffects.cardDraw();
      dispatch({ type: 'DRAW_CARD' });
    }
  };

  const completeCard = (success) => {
    dispatch({ type: 'COMPLETE_CARD', payload: { success } });
    
    // Check if team won the phase
    const phaseKey = `phase${state.currentPhase}`;
    const teamScore = state.scores[currentTeam.id][phaseKey] + (success ? 1 : 0);
    
    if (teamScore >= currentPhase.winCondition) {
      // Team won this phase
      if (state.currentPhase === 3 || (state.currentPhase === 4 && state.horrorUnlocked)) {
        // Game won!
        soundEffects.victory();
        dispatch({ type: 'SET_WINNER', payload: { teamId: currentTeam.id } });
      } else {
        // Advance to next phase
        soundEffects.phaseAdvance();
        dispatch({ type: 'ADVANCE_PHASE' });
      }
    }
  };

  const resetGame = () => {
    if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      dispatch({ type: 'RESET_GAME' });
    }
  };

  const unlockHorror = () => {
    if (confirm('Are you sure you want to unlock Level 4: HORROR? There is no going back.')) {
      soundEffects.horrorUnlock();
      dispatch({ type: 'UNLOCK_HORROR' });
    }
  };

  const toggleSound = () => {
    const newState = soundEffects.toggle();
    setSoundEnabled(newState);
  };

  if (state.gameWinner) {
    const winningTeam = state.teams.find(team => team.id === state.gameWinner);
    return (
      <div className="victory-screen">
        <div className="victory-content">
          <Crown className="victory-icon" />
          <h1>VICTORY ACHIEVED</h1>
          <h2>{winningTeam.name} HAS ASCENDED</h2>
          <p>You have survived the trial by fire and emerged victorious!</p>
          
          <div className="victory-stats">
            <h3>Final Scores:</h3>
            {state.teams.map(team => (
              <div key={team.id} className={`team-final-score ${team.id === state.gameWinner ? 'winner' : ''}`}>
                <span>{team.name}:</span>
                <span>
                  Phase 1: {state.scores[team.id].phase1} | 
                  Phase 2: {state.scores[team.id].phase2} | 
                  Phase 3: {state.scores[team.id].phase3}
                  {state.horrorUnlocked && ` | Horror: ${state.scores[team.id].phase4}`}
                </span>
              </div>
            ))}
          </div>

          <button className="reset-btn" onClick={resetGame}>
            <RotateCcw className="icon" />
            Play Again (If You Dare)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-board">
      <header className="game-header">
        <div className="header-left">
          <h1>🃏 CHARDEE MACDENNIS</h1>
          <PhaseIndicator currentPhase={state.currentPhase} horrorUnlocked={state.horrorUnlocked} />
        </div>
        
        <div className="header-center">
          <Timer />
        </div>

        <div className="header-right">
          <button onClick={() => setShowRules(!showRules)}>Rules</button>
          <button onClick={() => setShowHistory(!showHistory)}>History</button>
          <button onClick={toggleSound} title={soundEnabled ? 'Disable Sound' : 'Enable Sound'}>
            {soundEnabled ? <Volume2 className="icon" /> : <VolumeX className="icon" />}
          </button>
          {!state.horrorUnlocked && state.currentPhase >= 3 && (
            <button className="horror-unlock" onClick={unlockHorror}>
              <Skull className="icon" />
              Unlock Horror
            </button>
          )}
          <button className="reset-btn" onClick={resetGame}>
            <RotateCcw className="icon" />
          </button>
        </div>
      </header>

      <main className="game-main">
        <div className="game-left">
          <TeamStatus />
        </div>

        <div className="game-center">
          <div className="current-turn">
            <h2>Current Turn: {currentTeam.name}</h2>
            <p className="phase-description">{currentPhase.description}</p>
          </div>

          {state.currentCard ? (
            <CardDisplay 
              card={state.currentCard} 
              onComplete={completeCard}
            />
          ) : (
            <div className="draw-card-area">
              <button className="draw-card-btn" onClick={drawCard}>
                DRAW CARD
              </button>
              <p>Click to draw a {currentPhase.name} phase card</p>
            </div>
          )}

          {state.shameHatHolder && (
            <div className="shame-hat-notice">
              <AlertTriangle className="icon" />
              {state.teams.find(t => t.id === state.shameHatHolder)?.name} is wearing the SHAME HAT
            </div>
          )}
        </div>

        <div className="game-right">
          <div className="phase-progress">
            <h3>{currentPhase.name} Phase Progress</h3>
            {state.teams.map(team => {
              const phaseKey = `phase${state.currentPhase}`;
              const wins = state.scores[team.id][phaseKey];
              return (
                <div key={team.id} className="team-progress">
                  <span>{team.name}:</span>
                  <div className="progress-bar">
                    {Array.from({ length: currentPhase.winCondition }, (_, i) => (
                      <div 
                        key={i} 
                        className={`progress-dot ${i < wins ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                  <span>{wins}/{currentPhase.winCondition}</span>
                </div>
              );
            })}
          </div>

          <div className="cards-remaining">
            <h3>Cards Remaining</h3>
            <div className="card-counts">
              <div>Mind: {state.cardsRemaining.mind.length}</div>
              <div>Body: {state.cardsRemaining.body.length}</div>
              <div>Spirit: {state.cardsRemaining.spirit.length}</div>
              {state.horrorUnlocked && (
                <div>Horror: {state.cardsRemaining.horror.length}</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showRules && (
        <div className="modal-overlay" onClick={() => setShowRules(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Game Rules - {currentPhase.name} Phase</h2>
            <div className="rules-content">
              <h3>Basic Rules:</h3>
              <ul>
                {GAME_RULES.basicRules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
              
              <h3>Drinking Rules:</h3>
              <ul>
                {GAME_RULES.drinkingRules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
            <button onClick={() => setShowRules(false)}>Close</button>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Game History</h2>
            <div className="history-content">
              {state.gameHistory.slice(-10).reverse().map((event, index) => (
                <div key={index} className="history-item">
                  <span className="timestamp">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="event">
                    {event.type === 'card_drawn' && `${event.team.name} drew: ${event.card.title}`}
                    {event.type === 'card_completed' && `Card ${event.success ? 'succeeded' : 'failed'}`}
                    {event.type === 'phase_advanced' && `Advanced to Phase ${event.newPhase}`}
                    {event.type === 'shame_hat_assigned' && `Shame Hat assigned`}
                    {event.type === 'horror_unlocked' && `LEVEL 4: HORROR UNLOCKED`}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowHistory(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameBoard;
