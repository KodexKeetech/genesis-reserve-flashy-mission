import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Play, Sparkles, Save, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameOverlay({ type, score, level, onRestart, onNextLevel, onStart, onLoadGame }) {
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('jeff_save_game');
    setHasSavedGame(!!saved);
  }, []);
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
          
          <Button
            onClick={onRestart}
            size="lg"
            className="bg-white text-red-900 hover:bg-red-100 font-bold px-8 py-6 text-xl rounded-xl"
          >
            <RotateCcw className="w-6 h-6 mr-2" />
            Try Again
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  if (type === 'levelComplete') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-purple-900/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring' }}
          className="text-center"
        >
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 drop-shadow-lg" />
          <h2 className="text-5xl font-black text-yellow-300 mb-2">LEVEL {level} COMPLETE!</h2>
          <p className="text-purple-200 text-xl mb-8">Score: {score.toLocaleString()}</p>
          
          <div className="flex flex-col gap-3">
            <Button
              onClick={onNextLevel}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold px-8 py-6 text-xl rounded-xl shadow-lg shadow-yellow-500/30"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Next Level
            </Button>
            
            <Button
              onClick={() => {
                const saveData = {
                  level: level + 1,
                  score,
                  savedAt: new Date().toISOString()
                };
                localStorage.setItem('jeff_save_game', JSON.stringify(saveData));
                alert('Game saved!');
              }}
              size="lg"
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500/20 font-bold px-6 py-3 rounded-xl"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Progress
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return null;
}