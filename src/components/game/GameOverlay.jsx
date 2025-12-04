import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Play, Sparkles, Save, FolderOpen, Star, Shield, Flame, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIFFICULTY_MODES } from './BiomeConfig';

const VICTORY_BACKGROUNDS = [
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/3d2f3538c_Victoyart1.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/21cfbacfa_Victoyart2.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/5ada07b29_Victoyart3.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/a38da3da1_Victoyart4.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/0a5f45d0e_Victoyart5.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/f34df1739_Victoyart6.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/dad7942d3_Victoyart7.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/4104c5874_Victoyart8.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/c93e3ef6d_Victoyart9.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/524dc88a8_Victoyart10.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/851b4fa5c_Victoyart11.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/dc57a7249_Victoyart12.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/bc96f8571_Victoyart13.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/8109efe9c_Victoyart14.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/529fda65b_Victoyart15.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/8286beab6_Victoyart16.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/b8303324d_Victoyart17.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/0fae9d6ff_Victoyart18.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/1307f5dc7_Victoyart19.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/e7bc8bddb_Victoyart20.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/405126cff_Victoyart21.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/7440f5a1b_Victoyart22.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/1877b39da_Victoyart23.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/7e58a7998_Victoyart24.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/277afb71b_Victoyart25.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/d4d8a2a29_Victoyart26.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/fdab2ba00_Victoyart27.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/97c43712e_Victoyart28.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/895acf8a4_Victoyart29.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/ba5daea64_Victoyart30.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/e0d022bd2_Victoyart31.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/0fe68db4a_Victoyart32.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/cf79214c3_Victoyart33.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/02e63e501_Victoyart34.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/099a2e1b8_Victoyart35.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/1b555926a_Victoyart37.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/01ab8fdde_Victoyart38.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/64ed32b6b_Victoyart39.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/54dec00b8_Victoyart40.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/37dee339d_Victoyart41.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/fa746e4a0_Victoyart42.jpg',
  'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/135380275_Victoyart43.jpg',
];

export default function GameOverlay({ type, score, level, onRestart, onNextLevel, onStart, onLoadGame, hasCheckpoint, onContinueFromCheckpoint, difficulty, onDifficultyChange }) {
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty || 'medium');
  const [selectedButton, setSelectedButton] = useState(0);
  
  // Randomly select a background image when level complete
  const victoryBackground = useMemo(() => {
    return VICTORY_BACKGROUNDS[Math.floor(Math.random() * VICTORY_BACKGROUNDS.length)];
  }, [type, level]);

  useEffect(() => {
    const saved = localStorage.getItem('jeff_save_game');
    setHasSavedGame(!!saved);
  }, []);

  // Gamepad support for menu navigation
  useEffect(() => {
    let lastDpadUp = false;
    let lastDpadDown = false;
    let lastAButton = false;
    let lastDpadLeft = false;
    let lastDpadRight = false;

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      let gamepad = null;
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          gamepad = gamepads[i];
          break;
        }
      }
      if (!gamepad) return;

      const buttons = gamepad.buttons;
      const axes = gamepad.axes;
      
      // D-pad or left stick for navigation
      const dpadUp = buttons[12]?.pressed || axes[1] < -0.5;
      const dpadDown = buttons[13]?.pressed || axes[1] > 0.5;
      const dpadLeft = buttons[14]?.pressed || axes[0] < -0.5;
      const dpadRight = buttons[15]?.pressed || axes[0] > 0.5;
      const aButton = buttons[0]?.pressed;
      const startButton = buttons[9]?.pressed;

      // Navigate up
      if (dpadUp && !lastDpadUp) {
        setSelectedButton(prev => Math.max(0, prev - 1));
      }
      // Navigate down
      if (dpadDown && !lastDpadDown) {
        setSelectedButton(prev => prev + 1);
      }
      
      // Difficulty selection with left/right
      if (type === 'tutorial') {
        const diffKeys = Object.keys(DIFFICULTY_MODES);
        const currentIdx = diffKeys.indexOf(selectedDifficulty);
        if (dpadLeft && !lastDpadLeft && currentIdx > 0) {
          const newDiff = diffKeys[currentIdx - 1];
          setSelectedDifficulty(newDiff);
          localStorage.setItem('jeff_difficulty', newDiff);
          if (onDifficultyChange) onDifficultyChange(newDiff);
        }
        if (dpadRight && !lastDpadRight && currentIdx < diffKeys.length - 1) {
          const newDiff = diffKeys[currentIdx + 1];
          setSelectedDifficulty(newDiff);
          localStorage.setItem('jeff_difficulty', newDiff);
          if (onDifficultyChange) onDifficultyChange(newDiff);
        }
      }

      // Select with A button or Start
      if ((aButton && !lastAButton) || (startButton && !buttons[9]?.pressed)) {
        handleGamepadSelect();
      }

      lastDpadUp = dpadUp;
      lastDpadDown = dpadDown;
      lastDpadLeft = dpadLeft;
      lastDpadRight = dpadRight;
      lastAButton = aButton;
    };

    const handleGamepadSelect = () => {
      if (type === 'tutorial') {
        if (selectedButton === 0) onStart?.();
        else if (selectedButton === 1) onNextLevel?.();
      } else if (type === 'levelComplete') {
        if (selectedButton === 0) onNextLevel?.();
      } else if (type === 'gameOver') {
        if (hasCheckpoint && selectedButton === 0) onContinueFromCheckpoint?.();
        else if (hasCheckpoint && selectedButton === 1) onRestart?.();
        else if (!hasCheckpoint && selectedButton === 0) onRestart?.();
      } else if (type === 'start') {
        if (selectedButton === 0) onStart?.();
        else if (selectedButton === 1 && hasSavedGame) onLoadGame?.();
      }
    };

    const interval = setInterval(pollGamepad, 16);
    return () => clearInterval(interval);
  }, [type, selectedButton, selectedDifficulty, hasCheckpoint, hasSavedGame, onStart, onNextLevel, onRestart, onContinueFromCheckpoint, onLoadGame, onDifficultyChange]);

  const handleDifficultySelect = (diff) => {
    setSelectedDifficulty(diff);
    localStorage.setItem('jeff_difficulty', diff);
    if (onDifficultyChange) onDifficultyChange(diff);
  };

  const difficultyIcons = {
    easy: <Shield className="w-5 h-5" />,
    medium: <Flame className="w-5 h-5" />,
    hard: <Skull className="w-5 h-5" />
  };
  if (type === 'tutorial') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center rounded-xl p-2 md:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-center max-w-lg w-full"
        >
          <h2 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2 md:mb-6">
            Welcome, Wizard!
          </h2>
          
          <div className="bg-slate-800/80 rounded-lg md:rounded-xl p-2 md:p-5 mb-2 md:mb-6 text-left grid grid-cols-2 md:grid-cols-1 gap-1 md:gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <kbd className="px-1 md:px-2 py-0.5 md:py-1 bg-slate-700 rounded text-cyan-400 text-xs md:text-sm">←→</kbd>
              <span className="text-slate-300 text-xs md:text-base">Move</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <kbd className="px-1 md:px-2 py-0.5 md:py-1 bg-slate-700 rounded text-green-400 text-xs md:text-sm">SPACE</kbd>
              <span className="text-slate-300 text-xs md:text-base">Jump/Double jump</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <kbd className="px-1 md:px-2 py-0.5 md:py-1 bg-slate-700 rounded text-purple-400 text-xs md:text-sm">CLICK</kbd>
              <span className="text-slate-300 text-xs md:text-base">Cast magic</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <kbd className="px-1 md:px-2 py-0.5 md:py-1 bg-slate-700 rounded text-cyan-400 text-xs md:text-sm">SHIFT</kbd>
              <span className="text-slate-300 text-xs md:text-base">Dash</span>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <kbd className="px-1 md:px-2 py-0.5 md:py-1 bg-slate-700 rounded text-yellow-400 text-xs md:text-sm">Q</kbd>
              <span className="text-slate-300 text-xs md:text-base">Switch spell</span>
            </div>
          </div>

          <p className="text-slate-400 mb-2 md:mb-4 text-xs md:text-sm">
            Collect coins 🪙 and reach the portal!
          </p>
          
          {/* Difficulty Selection */}
          <div className="mb-3 md:mb-5">
            <p className="text-slate-500 text-xs mb-2">Select Difficulty:</p>
            <div className="flex gap-2 justify-center">
              {Object.entries(DIFFICULTY_MODES).map(([key, mode]) => (
                <button
                  key={key}
                  onClick={() => handleDifficultySelect(key)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${
                    selectedDifficulty === key 
                      ? 'border-white bg-white/10' 
                      : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'
                  }`}
                  style={{ borderColor: selectedDifficulty === key ? mode.color : undefined }}
                >
                  <span style={{ color: mode.color }}>{difficultyIcons[key]}</span>
                  <span className="text-xs font-bold" style={{ color: mode.color }}>{mode.name}</span>
                </button>
              ))}
            </div>
            <p className="text-slate-500 text-[10px] mt-1">
              {DIFFICULTY_MODES[selectedDifficulty]?.description}
            </p>
          </div>
          
          <div className="flex flex-col gap-2 md:gap-3">
            <Button
              onClick={onStart}
              className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-4 md:px-8 py-2 md:py-5 text-sm md:text-lg rounded-lg md:rounded-xl shadow-lg shadow-purple-500/30 ${selectedButton === 0 ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
            >
              <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Start Tutorial
            </Button>
            
            <Button
              onClick={onNextLevel}
              variant="outline"
              className={`border-slate-600 text-slate-400 hover:text-white hover:bg-slate-800 font-medium px-4 md:px-6 py-2 md:py-4 text-sm rounded-lg md:rounded-xl ${selectedButton === 1 ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
            >
              Skip →
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (type === 'start') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center rounded-xl"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-center"
        >
          {/* Jeff character preview */}
          <div className="mb-6 relative">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/7af5ab7fc_GeneratedImageSeptember302025-6_44PM.png"
              alt="Jeff the Robot Wizard"
              className="w-40 h-40 mx-auto object-contain drop-shadow-2xl"
            />
            <motion.div
              className="absolute -right-2 top-1/2 w-6 h-6 bg-cyan-400 rounded-full opacity-70"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <motion.div
              className="absolute -left-2 top-1/3 w-4 h-4 bg-blue-400 rounded-full opacity-70"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
            />
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-cyan-400 animate-pulse" />
            <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-blue-400 animate-pulse" />
          </div>
          
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-slate-400 mb-2">
            JEFF
          </h1>
          <p className="text-2xl font-bold text-slate-400 mb-1">The Robot Wizard</p>
          <p className="text-slate-500 mb-8">A Magical Platformer Adventure</p>
          
          <div className="flex flex-col gap-3">
            <Button
              onClick={onStart}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-8 py-6 text-xl rounded-xl shadow-lg shadow-purple-500/30"
            >
              <Play className="w-6 h-6 mr-2" />
              New Game
            </Button>
            
            {hasSavedGame && (
              <Button
                onClick={onLoadGame}
                size="lg"
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 font-bold px-8 py-4 text-lg rounded-xl"
              >
                <FolderOpen className="w-5 h-5 mr-2" />
                Continue (Level {JSON.parse(localStorage.getItem('jeff_save_game') || '{}').level || 1})
              </Button>
            )}
          </div>
          
          <div className="mt-8 text-slate-500 text-sm space-y-1">
            <p>← → or A/D to move | SPACE to jump</p>
            <p>CLICK to cast magic | Q to switch spell</p>
            <p>SHIFT to dash through enemies</p>
            <p className="text-cyan-400 mt-2">Collect power-ups for buffs!</p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (type === 'gameOver') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-red-900/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <h2 className="text-5xl font-black text-red-300 mb-4">GAME OVER</h2>
          <p className="text-red-200 text-xl mb-2">Jeff has fallen...</p>
          <p className="text-red-300 text-2xl font-bold mb-8">Score: {score.toLocaleString()}</p>
          
          <div className="flex flex-col gap-3">
            {hasCheckpoint && (
              <Button
                onClick={onContinueFromCheckpoint}
                size="lg"
                className={`bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold px-8 py-6 text-xl rounded-xl shadow-lg shadow-blue-500/30 ${selectedButton === 0 ? 'ring-2 ring-white' : ''}`}
              >
                <Play className="w-6 h-6 mr-2" />
                Continue from Checkpoint
              </Button>
            )}
            
            <Button
              onClick={onRestart}
              size="lg"
              className={`${hasCheckpoint ? "bg-slate-700 text-white hover:bg-slate-600 font-bold px-8 py-4 text-lg rounded-xl" : "bg-white text-red-900 hover:bg-red-100 font-bold px-8 py-6 text-xl rounded-xl"} ${(hasCheckpoint && selectedButton === 1) || (!hasCheckpoint && selectedButton === 0) ? 'ring-2 ring-white' : ''}`}
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              {hasCheckpoint ? "Restart Level" : "Try Again"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (type === 'levelComplete') {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-xl overflow-hidden w-full h-full"
          >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${victoryBackground})`,
          }}
        />
        {/* Overlay gradient - subtle darkening at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              initial={{ 
                x: Math.random() * 800, 
                y: 600,
                opacity: 0 
              }}
              animate={{ 
                y: -50,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
        
        {/* Comic Links - Top Left */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          <a 
            href="https://globalcomix.com/a/jeff-the-robot-wizard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white text-xs px-3 py-2 rounded-lg border border-purple-500/50 hover:border-purple-400 transition-all flex items-center gap-2"
          >
            <span>📖</span>
            <span>Read Jeff's Comic</span>
          </a>
          <a 
            href="https://linktr.ee/JeffTheRobotWizard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white text-xs px-3 py-2 rounded-lg border border-cyan-500/50 hover:border-cyan-400 transition-all flex items-center gap-2"
          >
            <span>🔗</span>
            <span>Jeff's Socials</span>
          </a>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-8">
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="text-center"
          >
            {/* Trophy with glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative inline-block mb-4"
            >
              <div className="absolute inset-0 bg-yellow-400/50 blur-2xl rounded-full" />
              <Trophy className="w-24 h-24 text-yellow-400 relative drop-shadow-2xl" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-black text-yellow-300 mb-2"
              style={{
                textShadow: `
                  0 1px 0 #d97706,
                  0 2px 0 #c2410c,
                  0 3px 0 #b45309,
                  0 4px 0 #a16207,
                  0 5px 0 #854d0e,
                  0 6px 0 #713f12,
                  0 7px 10px rgba(0,0,0,0.5),
                  0 10px 20px rgba(0,0,0,0.4)
                `
              }}
            >
              LEVEL {level} COMPLETE!
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 mb-8"
            >
              <Star className="w-6 h-6 text-yellow-400" fill="currentColor" />
              <p className="text-2xl font-bold text-white">{score.toLocaleString()} pts</p>
              <Star className="w-6 h-6 text-yellow-400" fill="currentColor" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-3"
            >
              <Button
                onClick={onNextLevel}
                size="lg"
                className={`bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 hover:from-yellow-400 hover:via-orange-400 hover:to-yellow-400 text-black font-bold px-10 py-6 text-xl rounded-2xl shadow-2xl shadow-yellow-500/40 border-2 border-yellow-300/50 ${selectedButton === 0 ? 'ring-4 ring-white' : ''}`}
              >
                <Sparkles className="w-6 h-6 mr-2" />
                Continue Adventure
              </Button>
              
              <p className="text-emerald-400 text-sm flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                Progress saved automatically
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return null;
}