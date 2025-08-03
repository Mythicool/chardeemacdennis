import { GAME_RULES, DENNIS_QUOTES } from '../data/gameRules';

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const checkPhaseWin = (teamScores, currentPhase) => {
  const phaseKey = `phase${currentPhase}`;
  const requiredWins = GAME_RULES.phases[currentPhase].winCondition;
  return teamScores[phaseKey] >= requiredWins;
};

export const checkGameWin = (teamScores, currentPhase, horrorUnlocked) => {
  const maxPhase = horrorUnlocked ? 4 : 3;
  if (currentPhase < maxPhase) return false;
  
  const phaseKey = `phase${currentPhase}`;
  const requiredWins = GAME_RULES.phases[currentPhase].winCondition;
  return teamScores[phaseKey] >= requiredWins;
};

export const checkHorrorUnlockConditions = (gameState) => {
  // Check various conditions that might unlock horror mode
  const conditions = {
    emotionallyUnstable: gameState.drinkingPenalties && 
      Object.values(gameState.drinkingPenalties).some(penalties => penalties >= 5),
    shameHatUsed: gameState.shameHatHolder !== null,
    longGame: gameState.gameTimer > 3600, // Over 1 hour
    manyWildcards: gameState.gameHistory.filter(h => h.type === 'wildcard_applied').length >= 3,
    currentPhase: gameState.currentPhase >= 3
  };

  const metConditions = Object.values(conditions).filter(Boolean).length;
  return metConditions >= 3; // Need at least 3 conditions met
};

export const getRandomDennisQuote = () => {
  return DENNIS_QUOTES[Math.floor(Math.random() * DENNIS_QUOTES.length)];
};

export const calculateTeamRanking = (teams, scores) => {
  return teams.map(team => {
    const teamScores = scores[team.id];
    const totalWins = teamScores.phase1 + teamScores.phase2 + teamScores.phase3 + teamScores.phase4;
    return {
      ...team,
      totalWins,
      scores: teamScores
    };
  }).sort((a, b) => b.totalWins - a.totalWins);
};

export const checkAchievements = (gameState, action) => {
  const achievements = [];
  
  // First Blood - first person to make someone cry (simulated by shame hat)
  if (action.type === 'SET_SHAME_HAT' && !gameState.achievements.some(a => a.name === 'First Blood')) {
    achievements.push({ name: 'First Blood', description: 'First person to make someone cry' });
  }

  // Chaos Agent - draw 3 wildcards
  const wildcardCount = gameState.gameHistory.filter(h => 
    h.type === 'card_drawn' && h.card && h.card.isWildcard
  ).length;
  if (wildcardCount >= 3 && !gameState.achievements.some(a => a.name === 'Chaos Agent')) {
    achievements.push({ name: 'Chaos Agent', description: 'Draw 3 wildcards in one game' });
  }

  // Survivor - complete all phases without wearing shame hat
  if (action.type === 'SET_WINNER' && gameState.shameHatHolder !== action.payload.teamId) {
    achievements.push({ name: 'Survivor', description: 'Complete all phases without crying' });
  }

  // Long Game - over 2 hours
  if (gameState.gameTimer > 7200 && !gameState.achievements.some(a => a.name === 'Endurance Test')) {
    achievements.push({ name: 'Endurance Test', description: 'Play for over 2 hours' });
  }

  return achievements;
};

export const applyWildcardEffect = (effect, gameState) => {
  switch (effect.type) {
    case 'reverse_drinking':
      return {
        ...gameState,
        wildcardEffects: [...gameState.wildcardEffects, {
          type: 'reverse_drinking',
          duration: effect.duration,
          cardsRemaining: effect.duration
        }]
      };

    case 'immunity_physical':
      return {
        ...gameState,
        wildcardEffects: [...gameState.wildcardEffects, {
          type: 'immunity_physical',
          duration: effect.duration,
          cardsRemaining: effect.duration
        }]
      };

    case 'immunity_emotional':
      return {
        ...gameState,
        wildcardEffects: [...gameState.wildcardEffects, {
          type: 'immunity_emotional',
          duration: effect.duration,
          cardsRemaining: effect.duration
        }]
      };

    case 'nuclear_option':
      // This would trigger a special UI state for voting
      return {
        ...gameState,
        specialState: 'nuclear_voting'
      };

    case 'apocalypse_reset':
      return {
        ...gameState,
        currentPhase: 1,
        currentTeamIndex: 0,
        scores: Object.keys(gameState.scores).reduce((acc, teamId) => ({
          ...acc,
          [teamId]: { phase1: 0, phase2: 0, phase3: 0, phase4: 0 }
        }), {}),
        shameHatHolder: null,
        gameHistory: [...gameState.gameHistory, {
          type: 'apocalypse_reset',
          timestamp: Date.now()
        }]
      };

    default:
      return gameState;
  }
};

export const updateWildcardEffects = (wildcardEffects) => {
  return wildcardEffects.map(effect => ({
    ...effect,
    cardsRemaining: effect.cardsRemaining - 1
  })).filter(effect => effect.cardsRemaining > 0);
};

export const isTeamImmune = (wildcardEffects, challengeType) => {
  return wildcardEffects.some(effect => 
    (effect.type === 'immunity_physical' && challengeType === 'body') ||
    (effect.type === 'immunity_emotional' && challengeType === 'spirit')
  );
};

export const shouldReverseDrinking = (wildcardEffects) => {
  return wildcardEffects.some(effect => effect.type === 'reverse_drinking');
};

export const generateGameSummary = (gameState) => {
  const totalTime = gameState.gameTimer;
  const totalCards = gameState.gameHistory.filter(h => h.type === 'card_drawn').length;
  const wildcards = gameState.gameHistory.filter(h => h.type === 'wildcard_applied').length;
  const phaseAdvances = gameState.gameHistory.filter(h => h.type === 'phase_advanced').length;
  
  return {
    duration: totalTime,
    cardsPlayed: totalCards,
    wildcardsTriggered: wildcards,
    phasesCompleted: phaseAdvances,
    horrorUnlocked: gameState.horrorUnlocked,
    achievements: gameState.achievements.length,
    finalScores: gameState.scores
  };
};
