import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

const initialState = {
  gameStarted: false,
  currentPhase: 1,
  teams: [],
  currentTeamIndex: 0,
  scores: {}, // teamId: { phase1: wins, phase2: wins, phase3: wins, phase4: wins }
  currentCard: null,
  cardsRemaining: {
    mind: [],
    body: [],
    spirit: [],
    horror: []
  },
  shameHatHolder: null,
  drinkingPenalties: {}, // teamId: count
  gameTimer: 0,
  isTimerRunning: false,
  horrorUnlocked: false,
  gameWinner: null,
  achievements: [],
  wildcardEffects: [],
  gameHistory: []
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStarted: true,
        teams: action.payload.teams,
        scores: action.payload.teams.reduce((acc, team) => ({
          ...acc,
          [team.id]: { phase1: 0, phase2: 0, phase3: 0, phase4: 0 }
        }), {}),
        drinkingPenalties: action.payload.teams.reduce((acc, team) => ({
          ...acc,
          [team.id]: 0
        }), {}),
        cardsRemaining: action.payload.cards
      };

    case 'DRAW_CARD':
      const phase = ['mind', 'body', 'spirit', 'horror'][state.currentPhase - 1];
      const cards = [...state.cardsRemaining[phase]];
      const cardIndex = Math.floor(Math.random() * cards.length);
      const drawnCard = cards[cardIndex];
      cards.splice(cardIndex, 1);
      
      return {
        ...state,
        currentCard: drawnCard,
        cardsRemaining: {
          ...state.cardsRemaining,
          [phase]: cards
        },
        gameHistory: [...state.gameHistory, {
          type: 'card_drawn',
          card: drawnCard,
          team: state.teams[state.currentTeamIndex],
          timestamp: Date.now()
        }]
      };

    case 'COMPLETE_CARD':
      const currentTeam = state.teams[state.currentTeamIndex];
      const phaseKey = `phase${state.currentPhase}`;
      const newScores = {
        ...state.scores,
        [currentTeam.id]: {
          ...state.scores[currentTeam.id],
          [phaseKey]: state.scores[currentTeam.id][phaseKey] + (action.payload.success ? 1 : 0)
        }
      };

      return {
        ...state,
        scores: newScores,
        currentTeamIndex: (state.currentTeamIndex + 1) % state.teams.length,
        currentCard: null,
        gameHistory: [...state.gameHistory, {
          type: 'card_completed',
          success: action.payload.success,
          team: currentTeam,
          timestamp: Date.now()
        }]
      };

    case 'ADVANCE_PHASE':
      return {
        ...state,
        currentPhase: state.currentPhase + 1,
        currentTeamIndex: 0,
        gameHistory: [...state.gameHistory, {
          type: 'phase_advanced',
          newPhase: state.currentPhase + 1,
          timestamp: Date.now()
        }]
      };

    case 'SET_SHAME_HAT':
      return {
        ...state,
        shameHatHolder: action.payload.teamId,
        gameHistory: [...state.gameHistory, {
          type: 'shame_hat_assigned',
          teamId: action.payload.teamId,
          timestamp: Date.now()
        }]
      };

    case 'ADD_DRINKING_PENALTY':
      return {
        ...state,
        drinkingPenalties: {
          ...state.drinkingPenalties,
          [action.payload.teamId]: state.drinkingPenalties[action.payload.teamId] + action.payload.count
        }
      };

    case 'UNLOCK_HORROR':
      return {
        ...state,
        horrorUnlocked: true,
        gameHistory: [...state.gameHistory, {
          type: 'horror_unlocked',
          timestamp: Date.now()
        }]
      };

    case 'SET_WINNER':
      return {
        ...state,
        gameWinner: action.payload.teamId,
        gameHistory: [...state.gameHistory, {
          type: 'game_won',
          winner: action.payload.teamId,
          timestamp: Date.now()
        }]
      };

    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload]
      };

    case 'APPLY_WILDCARD':
      return {
        ...state,
        wildcardEffects: [...state.wildcardEffects, action.payload],
        gameHistory: [...state.gameHistory, {
          type: 'wildcard_applied',
          effect: action.payload,
          timestamp: Date.now()
        }]
      };

    case 'START_TIMER':
      return {
        ...state,
        isTimerRunning: true
      };

    case 'STOP_TIMER':
      return {
        ...state,
        isTimerRunning: false
      };

    case 'UPDATE_TIMER':
      return {
        ...state,
        gameTimer: action.payload
      };

    case 'RESET_GAME':
      return initialState;

    case 'RESTORE_STATE':
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Timer effect
  useEffect(() => {
    let interval;
    if (state.isTimerRunning) {
      interval = setInterval(() => {
        dispatch({ type: 'UPDATE_TIMER', payload: state.gameTimer + 1 });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isTimerRunning, state.gameTimer]);

  // Save game state to localStorage
  useEffect(() => {
    localStorage.setItem('chardeeMacDennisGame', JSON.stringify(state));
  }, [state]);

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedGame = localStorage.getItem('chardeeMacDennisGame');
    if (savedGame) {
      try {
        const parsedGame = JSON.parse(savedGame);
        // Only restore if it's a valid game state
        if (parsedGame.gameStarted) {
          Object.keys(parsedGame).forEach(key => {
            if (key !== 'isTimerRunning') { // Don't restore timer running state
              dispatch({ type: 'RESTORE_STATE', payload: { key, value: parsedGame[key] } });
            }
          });
        }
      } catch (error) {
        console.error('Failed to restore game state:', error);
      }
    }
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
