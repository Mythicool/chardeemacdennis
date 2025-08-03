import React from 'react';
import { GameProvider } from './context/GameContext';
import GameSetup from './components/GameSetup';
import GameBoard from './components/GameBoard';
import EasterEggs from './components/EasterEggs';
import { useGame } from './context/GameContext';
import './App.css';

function AppContent() {
  const { state } = useGame();

  return (
    <div className="app">
      {!state.gameStarted ? <GameSetup /> : <GameBoard />}
      <EasterEggs />
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
