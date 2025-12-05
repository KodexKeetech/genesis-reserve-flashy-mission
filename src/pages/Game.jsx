import React, { useState, useCallback, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GameEngine from '@/components/game/GameEngine';
import GameUI from '@/components/game/GameUI';
import GameOverlay from '@/components/game/GameOverlay';
import TouchControls from '@/components/game/TouchControls';
import SettingsMenu from '@/components/game/SettingsMenu';
import useGamepad from '@/components/game/useGamepad';

import soundManager from '@/components/game/SoundManager';

import { Sparkles, ShoppingBag, Gem, Zap, Settings, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Game() {
  // Check if continuing from saved game or starting from specific level
  const urlParams = new URLSearchParams(window.location.search);
  const shouldContinue = urlParams.get('continue') === 'true';
  const startLevelParam = urlParams.get('startLevel');
  const hiddenLevelParam = urlParams.get('hiddenLevel');
  
  const startLevelParamInit = new URLSearchParams(window.location.search).get('startLevel');
  const hiddenLevelInit = new URLSearchParams(window.location.search).get('hiddenLevel');
  const [gameState, setGameState] = useState(startLevelParamInit || hiddenLevelInit ? 'playing' : 'tutorial'); // tutorial, playing, gameOver, levelComplete
  const [hiddenLevelId, setHiddenLevelId] = useState(hiddenLevelInit || null);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [level, setLevel] = useState(startLevelParamInit ? parseInt(startLevelParamInit, 10) : (hiddenLevelInit ? 100 : 0)); // Start at 0 for tutorial, 100+ for hidden
  const [powerUps, setPowerUps] = useState({});
  const [abilityCooldowns, setAbilityCooldowns] = useState({
    dashCooldown: 0,
    dashMaxCooldown: 60,
    selectedProjectile: 0
  });
  const [magicScraps, setMagicScraps] = useState(0);
  const [sessionScraps, setSessionScraps] = useState(0);
  const [playerUpgrades, setPlayerUpgrades] = useState({
    maxHealth: 0,
    spellPower: 0,
    dashEfficiency: 0,
    magicRegen: 0,
    scrapMagnet: 0
  });
  const [unlockedAbilities, setUnlockedAbilities] = useState({
    aoeBlast: false,
    reflectShield: false,
    hover: false
  });
  const [abilityUpgrades, setAbilityUpgrades] = useState({
    aoeBlastPower: 0,
    aoeBlastRadius: 0,
    reflectDuration: 0,
    hoverDuration: 0
  });
  const [arcaneCrystals, setArcaneCrystals] = useState(0);
  const [sessionCrystals, setSessionCrystals] = useState(0);
  const [coinAmmo, setCoinAmmo] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [checkpointData, setCheckpointData] = useState(null);
  const [isCheckpointActivated, setIsCheckpointActivated] = useState(false);
  const [respawnAtCheckpoint, setRespawnAtCheckpoint] = useState(false);
  
  const [startingGun, setStartingGun] = useState(0);
  const [currentGun, setCurrentGun] = useState(0);
  
  const [difficulty, setDifficulty] = useState(() => {
    const saved = localStorage.getItem('jeff_difficulty');
    return saved || 'medium';
  });
  
  const [gameSettings, setGameSettings] = useState(() => {
    const saved = localStorage.getItem('jeff_settings');
    const defaults = {
      sound: true,
      graphics: 'high',
      particles: true,
      keybinds: {
        moveLeft: ['ArrowLeft', 'KeyA'],
        moveRight: ['ArrowRight', 'KeyD'],
        jump: ['ArrowUp', 'KeyW', 'Space'],
        dash: ['ShiftLeft', 'ShiftRight'],
        switchSpell: ['KeyQ'],
        aoeBlast: ['KeyE'],
        reflectShield: ['KeyR'],
        hover: ['KeyF'],
      },
      gamepadBinds: {
        move: 'L-Stick',
        aim: 'R-Stick',
        jump: 'A',
        dash: 'LT',
        cast: 'RT / X',
        switchSpell: 'Y',
        aoeBlast: 'LB',
        reflectShield: 'RB',
      },
      touchBinds: {}
    };
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaults, ...parsed };
    }
    return defaults;
  });
  
  const gameInputRef = useRef({
    move: { x: 0, y: 0 },
    aim: { x: 0, y: 0 },
    jump: false,
    dash: false,
    cast: false,
    switch: false,
    aoeBlast: false,
    reflectShield: false,
    hover: false
  });

  const [gamepadConnected, setGamepadConnected] = useState(false);

  // Gamepad input handler
  const handleGamepadInput = useCallback((input) => {
    gameInputRef.current = {
      ...gameInputRef.current,
      move: input.move,
      aim: input.aim,
      jump: input.jump,
      dash: input.dash,
      cast: input.cast,
      switch: input.switch,
      aoeBlast: input.aoeBlast,
      reflectShield: input.reflectShield,
      hover: input.hover,
      timeSlow: input.timeSlow,
      chainLightning: input.chainLightning,
      shadowClone: input.shadowClone,
      magneticPull: input.magneticPull,
      teleport: input.teleport
    };
    setGamepadConnected(true);
  }, []);

  // Touch input handler
  const handleTouchInput = useCallback((action, value) => {
    if (action === 'move') {
      gameInputRef.current.move = value;
    } else if (action === 'aimX') {
      gameInputRef.current.aimX = value;
    } else if (action === 'aimY') {
      gameInputRef.current.aimY = value;
    } else {
      gameInputRef.current[action] = value;
    }
  }, []);

  // Use gamepad hook
  useGamepad(handleGamepadInput);

  // Load player upgrades and scraps on mount
  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        const user = await base44.auth.me();
        if (user.upgrades) {
          setPlayerUpgrades(user.upgrades);
        }
        if (user.magicScraps) {
          setMagicScraps(user.magicScraps);
        }
        if (user.unlockedAbilities) {
          setUnlockedAbilities({
            aoeBlast: false, reflectShield: false, hover: false, 
            timeSlow: false, chainLightning: false, shadowClone: false, 
            magneticPull: false, teleport: false,
            ...user.unlockedAbilities
          });
        }
        if (user.abilityUpgrades) {
          setAbilityUpgrades({
            aoeBlastPower: 0, aoeBlastRadius: 0, reflectDuration: 0, hoverDuration: 0,
            timeSlowDuration: 0, chainLightningDamage: 0, chainLightningChains: 0,
            shadowCloneDuration: 0, magneticPullRadius: 0, teleportDistance: 0, teleportCooldown: 0,
            ...user.abilityUpgrades
          });
        }
        if (user.arcaneCrystals) {
          setArcaneCrystals(user.arcaneCrystals);
        }
        if (user.lastGun !== undefined) {
          setStartingGun(user.lastGun);
          setCurrentGun(user.lastGun);
        }
        // Also sync to localStorage
        localStorage.setItem('jeff_player_data', JSON.stringify({
          magicScraps: user.magicScraps || 0,
          arcaneCrystals: user.arcaneCrystals || 0,
          highestLevel: user.highestLevel || 1
        }));
      } catch (e) {
        // Not logged in - load from localStorage
        const localData = localStorage.getItem('jeff_player_data');
        if (localData) {
          const data = JSON.parse(localData);
          setMagicScraps(data.magicScraps || 0);
          setArcaneCrystals(data.arcaneCrystals || 0);
        }
      }
    };
    loadPlayerData();
  }, []);

  // Save scraps when level completes or game over
  const saveScraps = useCallback(async (scrapsToAdd, crystalsToAdd = 0) => {
    try {
      const user = await base44.auth.me();
      const newTotal = (user.magicScraps || 0) + scrapsToAdd;
      const newLifetime = (user.totalScrapsEarned || 0) + scrapsToAdd;
      const newCrystals = (user.arcaneCrystals || 0) + crystalsToAdd;
      const newHighestLevel = Math.max(user.highestLevel || 1, level);
      await base44.auth.updateMe({ 
        magicScraps: newTotal,
        totalScrapsEarned: newLifetime,
        arcaneCrystals: newCrystals,
        highestLevel: newHighestLevel
      });
      setMagicScraps(newTotal);
      setArcaneCrystals(newCrystals);
      // Also save to localStorage as backup
      localStorage.setItem('jeff_player_data', JSON.stringify({
        magicScraps: newTotal,
        arcaneCrystals: newCrystals,
        highestLevel: newHighestLevel
      }));
    } catch (e) {
      // Not logged in - save to localStorage instead
      const localData = localStorage.getItem('jeff_player_data');
      const existing = localData ? JSON.parse(localData) : { magicScraps: 0, arcaneCrystals: 0, highestLevel: 1 };
      const newTotal = existing.magicScraps + scrapsToAdd;
      const newCrystals = existing.arcaneCrystals + crystalsToAdd;
      const newHighestLevel = Math.max(existing.highestLevel, level);
      localStorage.setItem('jeff_player_data', JSON.stringify({
        magicScraps: newTotal,
        arcaneCrystals: newCrystals,
        highestLevel: newHighestLevel
      }));
      setMagicScraps(newTotal);
      setArcaneCrystals(newCrystals);
    }
  }, [level]);

  const handleCrystalsEarned = useCallback((crystals) => {
    setSessionCrystals(prev => prev + crystals);
  }, []);

  const handleScrapsEarned = useCallback((scraps) => {
    setSessionScraps(prev => prev + scraps);
  }, []);



  // Save settings when changed
  useEffect(() => {
    localStorage.setItem('jeff_settings', JSON.stringify(gameSettings));
    soundManager.setMuted(!gameSettings.sound);
  }, [gameSettings]);

  // Load saved game on mount if continuing or start from specific level
  useEffect(() => {
    soundManager.init();
    soundManager.setMuted(!gameSettings.sound);
    if (shouldContinue) {
      const saved = localStorage.getItem('jeff_save_game');
      if (saved) {
        const saveData = JSON.parse(saved);
        setLevel(saveData.level || 1);
        setScore(saveData.score || 0);
        setGameState('playing');
      }
    }
  }, [shouldContinue, startLevelParam]);

  // Initialize sound on first load
  React.useEffect(() => {
    soundManager.init();
  }, []);

  // Key to force GameEngine remount on full restart
  const [gameKey, setGameKey] = useState(0);

  const handleRestart = useCallback(() => {
    // Reset input to prevent auto-movement
    gameInputRef.current = {
      move: { x: 0, y: 0 },
      aim: { x: 0, y: 0 },
      jump: false,
      dash: false,
      cast: false,
      switch: false,
      aoeBlast: false,
      reflectShield: false,
      hover: false
    };
    // Clear checkpoint data on full restart
    setCheckpointData(null);
    setIsCheckpointActivated(false);
    setRespawnAtCheckpoint(false);
    setScore(0);
    setHealth(100);
    setSessionScraps(0);
    setSessionCrystals(0);
    // Keep using the same gun
    setStartingGun(currentGun);
    // Force GameEngine remount to regenerate level
    setGameKey(prev => prev + 1);
    setGameState('playing');
  }, [currentGun]);

  const handleNextLevel = useCallback(() => {
    // Reset input to prevent auto-movement
    gameInputRef.current = {
      move: { x: 0, y: 0 },
      aim: { x: 0, y: 0 },
      jump: false,
      dash: false,
      cast: false,
      switch: false,
      aoeBlast: false,
      reflectShield: false,
      hover: false
    };
    setLevel(prev => prev + 1);
    setHealth(100);
    setCheckpointData(null);
    setIsCheckpointActivated(false);
    setGameState('playing');
  }, []);

  const handleStartTutorial = useCallback(() => {
    setGameState('playing');
    setLevel(0);
  }, []);

  const handleSkipTutorial = useCallback(() => {
    setLevel(1);
    setGameState('playing');
  }, []);

  

  const handleGunChange = useCallback((gun) => {
    setCurrentGun(gun);
  }, []);

  

  // Save gun preference
  const saveGunPreference = useCallback(async (gun) => {
    try {
      await base44.auth.updateMe({ lastGun: gun });
    } catch (e) {
      // Not logged in
    }
  }, []);

  const handleCheckpointActivated = useCallback((checkpoint) => {
    setCheckpointData(checkpoint);
    setIsCheckpointActivated(true);
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState('gameOver');
    if (sessionScraps > 0 || sessionCrystals > 0) {
      saveScraps(sessionScraps, sessionCrystals);
    }
    // Save the gun the player was using
    saveGunPreference(currentGun);
  }, [sessionScraps, sessionCrystals, saveScraps, currentGun, saveGunPreference]);

  // Use a ref to store checkpoint data that persists across re-renders
  const checkpointRef = useRef(null);

  const handleContinueFromCheckpoint = useCallback(() => {
    // Reset input to prevent auto-movement
    gameInputRef.current = {
      move: { x: 0, y: 0 },
      aim: { x: 0, y: 0 },
      jump: false,
      dash: false,
      cast: false,
      switch: false,
      aoeBlast: false,
      reflectShield: false,
      hover: false
    };
    // Store checkpoint data in ref so it persists
    checkpointRef.current = checkpointData;
    setHealth(50);
    setRespawnAtCheckpoint(true);
    setGameState('playing');
  }, [checkpointData]);

  const handleRespawnComplete = useCallback(() => {
    setRespawnAtCheckpoint(false);
  }, []);

  const handleLevelComplete = useCallback(() => {
    setGameState('levelComplete');
    // Award bonus crystal every 5 levels
    const bonusCrystal = level % 5 === 0 ? 1 : 0;
    const totalCrystals = sessionCrystals + bonusCrystal;
    if (sessionScraps > 0 || totalCrystals > 0) {
      saveScraps(sessionScraps, totalCrystals);
      setSessionScraps(0);
      setSessionCrystals(0);
    }
    // Save the gun and clear checkpoint for next level
    saveGunPreference(currentGun);
    setStartingGun(currentGun);
    
    // Auto-save progress
    const saveData = {
      level: level + 1,
      score,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('jeff_save_game', JSON.stringify(saveData));
  }, [sessionScraps, sessionCrystals, saveScraps, level, currentGun, saveGunPreference, score]);

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

  // Check if in portrait mode on mobile
  const [isPortrait, setIsPortrait] = useState(false);
  
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 900);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Show rotate prompt on portrait mobile
  if (isPortrait) {
    return (
      <div className="h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-6 animate-pulse">📱↻</div>
        <h2 className="text-2xl font-bold text-white mb-2">Rotate Your Device</h2>
        <p className="text-slate-400">Please rotate to landscape mode for the best experience</p>
      </div>
    );
  }

  // Check if on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;

  return (
    <div className="h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-1 md:p-4 overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Title - hide on mobile */}
      {!isMobile && (
        <div className="flex items-center justify-center gap-4 mb-2 md:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-tight">
            JEFF: The Robot Wizard
          </h1>
        </div>
      )}

      {/* Game Container */}
      <div className="relative w-[65vw] md:w-full md:max-w-[800px]" style={{ aspectRatio: '800/600' }}>
        {/* Settings button inside game container */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(true)}
          className="absolute top-2 right-2 z-40 text-slate-400 hover:text-white hover:bg-slate-800/50 backdrop-blur-sm w-12 h-12"
        >
          <Settings className="w-8 h-8" />
        </Button>

        <div className="absolute inset-0">
        {gameState === 'tutorial' && (
          <div className="w-full h-full bg-slate-900 rounded-xl relative">
            <GameOverlay
              type="tutorial"
              score={score}
              level={level}
              onStart={handleStartTutorial}
              onNextLevel={handleSkipTutorial}
              difficulty={difficulty}
              onDifficultyChange={(d) => {
                setDifficulty(d);
                localStorage.setItem('jeff_difficulty', d);
              }}
            />
          </div>
        )}
        {gameState === 'playing' && (
              <GameEngine
                key={gameKey}
                currentLevel={level}
                hiddenLevelId={hiddenLevelId}
                difficulty={difficulty}
                onScoreChange={handleScoreChange}
                onHealthChange={handleHealthChange}
                onLevelComplete={handleLevelComplete}
                onGameOver={handleGameOver}
                onPowerUpChange={handlePowerUpChange}
                onAbilityCooldowns={handleAbilityCooldowns}
                onScrapsEarned={handleScrapsEarned}
                onCrystalsEarned={handleCrystalsEarned}
                onCoinAmmoChange={setCoinAmmo}
                savedCoinAmmo={coinAmmo}
                playerUpgrades={playerUpgrades}
                unlockedAbilities={unlockedAbilities}
                abilityUpgrades={abilityUpgrades}
                gameInput={gameInputRef}
                startingGun={startingGun}
                gameSettings={gameSettings}
                onGunChange={handleGunChange}
                onCheckpointActivated={handleCheckpointActivated}
                respawnAtCheckpoint={respawnAtCheckpoint}
                onRespawnComplete={handleRespawnComplete}
                savedCheckpoint={checkpointRef.current}
              />
            )}



          {showSettings && (
            <SettingsMenu
              settings={gameSettings}
              onSettingsChange={setGameSettings}
              onClose={() => setShowSettings(false)}
            />
          )}
        
        {gameState !== 'playing' && gameState !== 'tutorial' && (
          <div className="w-full h-full bg-slate-900 rounded-xl relative">
            <GameOverlay
              type={gameState}
              score={score}
              level={level}
              onRestart={handleRestart}
              onNextLevel={handleNextLevel}
              hasCheckpoint={isCheckpointActivated && !!checkpointData}
              onContinueFromCheckpoint={handleContinueFromCheckpoint}
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
            sessionScraps={sessionScraps}
            isTutorial={level === 0}
          />
        )}
        </div>
      </div>

        {/* Touch controls for mobile */}
        {gameState === 'playing' && !gamepadConnected && (
          <TouchControls onInput={handleTouchInput} />
        )}

      {/* Shop Buttons - smaller on mobile */}
      <div className={`${isMobile ? 'mt-1' : 'mt-4'} flex gap-2 md:gap-3 flex-wrap justify-center`}>
        <Link to={createPageUrl('UpgradeShop')}>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Upgrades
            <div className="ml-2 flex items-center gap-1 bg-black/30 rounded px-2 py-0.5">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-purple-200">{magicScraps}</span>
            </div>
          </Button>
        </Link>
        <Link to={createPageUrl('AbilityShop')}>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500">
            <Zap className="w-5 h-5 mr-2" />
            Abilities
            <div className="ml-2 flex items-center gap-1 bg-black/30 rounded px-2 py-0.5">
              <Gem className="w-4 h-4 text-indigo-300" />
              <span className="text-indigo-200">{arcaneCrystals}</span>
            </div>
          </Button>
        </Link>
      </div>

      {/* Controls hint - hide on small screens */}
      <div className="hidden md:flex mt-6 flex-wrap justify-center gap-4 text-slate-500 text-sm">
        {gamepadConnected ? (
          <>
            <span className="flex items-center gap-2 text-green-400">
              <Gamepad2 className="w-4 h-4" />
              Controller Connected
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400">L-Stick</kbd>
              Move
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400">A</kbd>
              Jump
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400">RT/X</kbd>
              Cast
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400">LT</kbd>
              Dash
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400">Y</kbd>
              Switch
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400">LB/RB</kbd>
              Abilities
            </span>
          </>
        ) : (
          <>
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
            <span className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400">E/R/F</kbd>
              Special Abilities
            </span>
          </>
        )}
        </div>
    </div>
  );
}