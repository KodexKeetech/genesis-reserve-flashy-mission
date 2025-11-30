import React, { useState, useCallback, useRef } from 'react';
import GameEngine from '@/components/game/GameEngine';
import GameUI from '@/components/game/GameUI';
import GameOverlay from '@/components/game/GameOverlay';
import TouchControls from '@/components/game/TouchControls';
import soundManager from '@/components/game/SoundManager';

export default function Game() {
  const [gameState, setGameState] = useState('playing'); // start, playing, gameOver, levelComplete
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [level, setLevel] = useState(1);
  const [powerUps, setPowerUps] = useState({});
  const [abilityCooldowns, setAbilityCooldowns] = useState({
    dashCooldown: 0,
    dashMaxCooldown: 60,
    selectedProjectile: 0
  });
  
  const touchInputRef = useRef({
    move: { x: 0, y: 0 },
    jump: false,
    dash: false,
    cast: false,
    switch: false
  });

  const handleTouchInput = useCallback((action, value) => {
    touchInputRef.current[action] = value;
  }, []);

  const handleStart = useCallback(() => {
    soundManager.init();
    setGameState('playing');
    setScore(0);
    setHealth(100);
    setLevel(1);
  }, []);

  // Initialize sound on first load
  React.useEffect(() => {
    soundManager.init();
  }, []);

  const handleRestart = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setHealth(100);
  }, []);

  const handleNextLevel = useCallback(() => {
    setLevel(prev => prev + 1);
    setHealth(100);
    setGameState('playing');
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState('gameOver');
  }, []);

  const handleLevelComplete = useCallback(() => {
    setGameState('levelComplete');
  }, []);

  const handleScoreChange = useCallback((newScore) => {
    setScore(newScore);
  }, []);

  const handleHealthChange = useCallback((newHealth) => {
    setHealth(newHealth);
  }, []);

  const handlePowerUpChange = useCallback((newPowerUps) => {
    setPowerUps(newPowerUps);
  }, []);

  const handleAbilityCooldowns = useCallback((cooldowns) => {
    setAbilityCooldowns(cooldowns);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-4">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6 tracking-tight">
        JEFF: The Robot Wizard
      </h1>

      {/* Game Container */}
      <div className="relative">
        {gameState === 'playing' && (
          <GameEngine
            currentLevel={level}
            onScoreChange={handleScoreChange}
            onHealthChange={handleHealthChange}
            onLevelComplete={handleLevelComplete}
            onGameOver={handleGameOver}
            onPowerUpChange={handlePowerUpChange}
            onAbilityCooldowns={handleAbilityCooldowns}
            touchInput={touchInputRef}
          />
        )}
        
        {gameState !== 'playing' && (
          <div className="w-[800px] h-[600px] bg-slate-900 rounded-xl relative">
            <GameOverlay
              type={gameState}
              score={score}
              level={level}
              onStart={handleStart}
              onRestart={handleRestart}
              onNextLevel={handleNextLevel}
            />
          </div>
        )}

        {gameState === 'playing' && (
          <GameUI 
            score={score} 
            health={health} 
            level={level} 
            powerUps={powerUps}
            abilityCooldowns={abilityCooldowns}
          />
        )}
        </div>

        {/* Touch controls for mobile */}
        {gameState === 'playing' && (
        <TouchControls onInput={handleTouchInput} />
        )}

      {/* Controls hint */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-slate-500 text-sm">
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400">←→</kbd>
          Move
        </span>
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400">SPACE</kbd>
          Jump
        </span>
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400">CLICK</kbd>
          Cast Magic
        </span>
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400">SHIFT</kbd>
          Dash
        </span>
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400">Q</kbd>
          Switch Spell
        </span>
      </div>
    </div>
  );
}