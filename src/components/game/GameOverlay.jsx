import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Play, Sparkles, Save, FolderOpen, Star } from 'lucide-react';
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
        className="absolute inset-0 rounded-xl overflow-hidden"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692c28c6355507b7b2161062/5b1e396d3_ak_00019.png)',
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-purple-900/40 to-transparent" />
        
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
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
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
                className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 hover:from-yellow-400 hover:via-orange-400 hover:to-yellow-400 text-black font-bold px-10 py-6 text-xl rounded-2xl shadow-2xl shadow-yellow-500/40 border-2 border-yellow-300/50"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                Continue Adventure
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
                className="border-2 border-emerald-400/70 text-emerald-300 hover:bg-emerald-500/20 font-bold px-6 py-4 rounded-xl backdrop-blur-sm bg-black/30"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Progress
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return null;
}