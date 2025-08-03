import React from 'react';
import { useGame } from '../context/GameContext';
import { Users, Crown, AlertTriangle, Wine } from 'lucide-react';

function TeamStatus() {
  const { state } = useGame();

  return (
    <div className="team-status">
      <h3><Users className="icon" /> Team Status</h3>
      
      {state.teams.map((team, index) => {
        const isCurrentTeam = index === state.currentTeamIndex;
        const isShameHatHolder = state.shameHatHolder === team.id;
        const drinkingPenalties = state.drinkingPenalties[team.id] || 0;
        
        return (
          <div 
            key={team.id} 
            className={`team-card ${isCurrentTeam ? 'current-turn' : ''} ${isShameHatHolder ? 'shame-hat' : ''}`}
          >
            <div className="team-header">
              <h4>
                {isCurrentTeam && <Crown className="icon current-turn-icon" />}
                {team.name}
                {isShameHatHolder && <AlertTriangle className="icon shame-icon" />}
              </h4>
            </div>

            <div className="team-players">
              {team.players.map((player, playerIndex) => (
                <span key={playerIndex} className="player-tag">
                  {player}
                </span>
              ))}
            </div>

            <div className="team-scores">
              <div className="score-row">
                <span>Mind:</span>
                <div className="score-dots">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div 
                      key={i} 
                      className={`score-dot ${i < state.scores[team.id].phase1 ? 'filled' : ''}`}
                    />
                  ))}
                </div>
                <span>{state.scores[team.id].phase1}/3</span>
              </div>

              <div className="score-row">
                <span>Body:</span>
                <div className="score-dots">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div 
                      key={i} 
                      className={`score-dot ${i < state.scores[team.id].phase2 ? 'filled' : ''}`}
                    />
                  ))}
                </div>
                <span>{state.scores[team.id].phase2}/3</span>
              </div>

              <div className="score-row">
                <span>Spirit:</span>
                <div className="score-dots">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div 
                      key={i} 
                      className={`score-dot ${i < state.scores[team.id].phase3 ? 'filled' : ''}`}
                    />
                  ))}
                </div>
                <span>{state.scores[team.id].phase3}/3</span>
              </div>

              {state.horrorUnlocked && (
                <div className="score-row horror">
                  <span>Horror:</span>
                  <div className="score-dots">
                    {Array.from({ length: 2 }, (_, i) => (
                      <div 
                        key={i} 
                        className={`score-dot ${i < state.scores[team.id].phase4 ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                  <span>{state.scores[team.id].phase4}/2</span>
                </div>
              )}
            </div>

            {drinkingPenalties > 0 && (
              <div className="drinking-penalties">
                <Wine className="icon" />
                <span>Drinking Penalties: {drinkingPenalties}</span>
              </div>
            )}

            {isShameHatHolder && (
              <div className="shame-hat-notice">
                <AlertTriangle className="icon" />
                <span>WEARING SHAME HAT</span>
                <div className="shame-hat-emoji">🎩</div>
              </div>
            )}

            {isCurrentTeam && (
              <div className="current-turn-indicator">
                <Crown className="icon" />
                <span>CURRENT TURN</span>
              </div>
            )}
          </div>
        );
      })}

      <div className="game-stats">
        <h4>Game Statistics</h4>
        <div className="stat-item">
          <span>Total Cards Drawn:</span>
          <span>{state.gameHistory.filter(h => h.type === 'card_drawn').length}</span>
        </div>
        <div className="stat-item">
          <span>Wildcards Played:</span>
          <span>{state.gameHistory.filter(h => h.type === 'wildcard_applied').length}</span>
        </div>
        <div className="stat-item">
          <span>Phase Advances:</span>
          <span>{state.gameHistory.filter(h => h.type === 'phase_advanced').length}</span>
        </div>
        {state.achievements.length > 0 && (
          <div className="achievements">
            <h5>Achievements Unlocked:</h5>
            {state.achievements.map((achievement, index) => (
              <div key={index} className="achievement">
                🏆 {achievement.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamStatus;
