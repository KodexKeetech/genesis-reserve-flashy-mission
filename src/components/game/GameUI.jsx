import React from 'react';
import { Heart, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GameUI({ score, health, level }) {
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
      {/* Health Bar */}
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
          <span className="text-white font-bold text-sm">JEFF</span>
        </div>
        <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 to-pink-500"
            initial={{ width: '100%' }}
            animate={{ width: `${health}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
      </div>

      {/* Score & Level */}
      <div className="flex gap-3">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-yellow-500/30">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
            <span className="text-yellow-400 font-bold text-lg">{score.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-blue-500/30">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" fill="currentColor" />
            <span className="text-blue-400 font-bold text-lg">Level {level}</span>
          </div>
        </div>
      </div>
    </div>
  );
}