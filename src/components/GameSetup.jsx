import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Users, Plus, Trash2, Play } from 'lucide-react';

// Import card data
import mindCards from '../data/cards/mind.json';
import bodyCards from '../data/cards/body.json';
import spiritCards from '../data/cards/spirit.json';
import horrorCards from '../data/cards/horror.json';

function GameSetup() {
  const { dispatch } = useGame();
  const [teams, setTeams] = useState([
    { id: 1, name: 'Team Narcissus', players: ['Dennis'] },
    { id: 2, name: 'Team Chaos', players: ['Charlie'] }
  ]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(1);

  const addTeam = () => {
    if (newTeamName.trim() && teams.length < 6) {
      const newTeam = {
        id: Date.now(),
        name: newTeamName.trim(),
        players: []
      };
      setTeams([...teams, newTeam]);
      setNewTeamName('');
    }
  };

  const removeTeam = (teamId) => {
    if (teams.length > 2) {
      setTeams(teams.filter(team => team.id !== teamId));
      if (selectedTeamId === teamId) {
        setSelectedTeamId(teams[0].id);
      }
    }
  };

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setTeams(teams.map(team => 
        team.id === selectedTeamId 
          ? { ...team, players: [...team.players, newPlayerName.trim()] }
          : team
      ));
      setNewPlayerName('');
    }
  };

  const removePlayer = (teamId, playerIndex) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, players: team.players.filter((_, index) => index !== playerIndex) }
        : team
    ));
  };

  const startGame = () => {
    // Validate teams
    const validTeams = teams.filter(team => team.players.length > 0);
    if (validTeams.length < 2) {
      alert('You need at least 2 teams with players to start the game!');
      return;
    }

    // Shuffle cards
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const gameData = {
      teams: validTeams,
      cards: {
        mind: shuffleArray(mindCards),
        body: shuffleArray(bodyCards),
        spirit: shuffleArray(spiritCards),
        horror: shuffleArray(horrorCards)
      }
    };

    dispatch({ type: 'START_GAME', payload: gameData });
  };

  return (
    <div className="game-setup">
      <div className="setup-header">
        <h1 className="game-title">
          🃏 CHARDEE MACDENNIS
          <span className="subtitle">THE GAME OF GAMES™</span>
        </h1>
        <p className="game-description">
          "Part board game, part drinking game, part psychological warfare. 
          Banned in 17 countries and legally classified as 'a cult initiation ritual' in three."
        </p>
        <div className="dennis-quote">
          — Dennis Reynolds, probably
        </div>
      </div>

      <div className="setup-content">
        <div className="teams-section">
          <h2><Users className="icon" /> Team Setup</h2>
          
          <div className="add-team">
            <input
              type="text"
              placeholder="Enter team name..."
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTeam()}
            />
            <button onClick={addTeam} disabled={teams.length >= 6}>
              <Plus className="icon" /> Add Team
            </button>
          </div>

          <div className="teams-list">
            {teams.map(team => (
              <div key={team.id} className="team-card">
                <div className="team-header">
                  <h3>{team.name}</h3>
                  {teams.length > 2 && (
                    <button 
                      className="remove-btn"
                      onClick={() => removeTeam(team.id)}
                    >
                      <Trash2 className="icon" />
                    </button>
                  )}
                </div>
                
                <div className="players-list">
                  {team.players.map((player, index) => (
                    <div key={index} className="player-item">
                      <span>{player}</span>
                      <button 
                        className="remove-player"
                        onClick={() => removePlayer(team.id, index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="add-player">
            <select 
              value={selectedTeamId} 
              onChange={(e) => setSelectedTeamId(Number(e.target.value))}
            >
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter player name..."
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button onClick={addPlayer}>
              <Plus className="icon" /> Add Player
            </button>
          </div>
        </div>

        <div className="rules-preview">
          <h3>🔥 Game Summary</h3>
          <ul>
            <li><strong>📦 Phases:</strong> 3 (Mind, Body, Spirit) + Optional Horror</li>
            <li><strong>👫 Players:</strong> 4–6 (2 teams minimum)</li>
            <li><strong>⏳ Length:</strong> Until someone cries, leaves, or ascends spiritually</li>
            <li><strong>🍷 Drinking:</strong> Constant and non-negotiable</li>
          </ul>
          
          <div className="warning">
            ⚖️ <strong>Legal Disclaimer:</strong> By participating in Chardee MacDennis, 
            you legally acknowledge that all emotional damage, bodily harm, lost relationships, 
            and ruined friendships are your fault for being weak.
          </div>
        </div>

        <button 
          className="start-game-btn"
          onClick={startGame}
          disabled={teams.filter(t => t.players.length > 0).length < 2}
        >
          <Play className="icon" />
          BEGIN THE TRIAL BY FIRE
        </button>
      </div>
    </div>
  );
}

export default GameSetup;
