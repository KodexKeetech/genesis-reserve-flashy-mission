import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Play, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameOverlay({ type, score, level, onRestart, onNextLevel, onStart }) {
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
          {/* Jeff ASCII-style art */}
          <div className="mb-6 relative">
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-600 to-purple-800 rounded-full" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-purple-700" />
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-20 h-8 bg-blue-500 rounded-lg opacity-80" />
              <div className="absolute top-14 left-1/2 -translate-x-1/2 flex gap-3">
                <div className="w-3 h-3 bg-white rounded-full" />
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <motion.div
                className="absolute -right-4 top-20 w-8 h-8 bg-purple-500 rounded-full opacity-70"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-purple-400 animate-pulse" />
          </div>
          
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2">
            JEFF
          </h1>
          <p className="text-2xl font-bold text-slate-400 mb-1">The Robot Wizard</p>
          <p className="text-slate-500 mb-8">A Magical Platformer Adventure</p>
          
          <Button
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-8 py-6 text-xl rounded-xl shadow-lg shadow-purple-500/30"
          >
            <Play className="w-6 h-6 mr-2" />
            Start Game
          </Button>
          
          <div className="mt-8 text-slate-500 text-sm space-y-1">
            <p>← → or A/D to move</p>
            <p>↑ or W or SPACE to jump</p>
            <p>CLICK to cast magic</p>
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
          
          <Button
            onClick={onNextLevel}
            size="lg"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold px-8 py-6 text-xl rounded-xl shadow-lg shadow-yellow-500/30"
          >
            <Sparkles className="w-6 h-6 mr-2" />
            Next Level
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return null;
}