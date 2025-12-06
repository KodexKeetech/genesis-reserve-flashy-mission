import React from 'react';
import { Heart, Star, Zap, Wind, Shield, Flame, Snowflake, Map, Sparkles, Circle, Coins } from 'lucide-react';
import { SPECIAL_ABILITIES } from './AbilitySystem';
import { motion, AnimatePresence } from 'framer-motion';
import { getBiomeForLevel, isBossLevel, HIDDEN_LEVELS } from './BiomeConfig';

const POWERUP_INFO = {
  SPEED: { color: '#22D3EE', icon: Wind, name: 'Speed', maxDuration: 300 },
  INVINCIBILITY: { color: '#FBBF24', icon: Star, name: 'Invincible', maxDuration: 200 },
  POWER_SHOT: { color: '#EF4444', icon: Flame, name: 'Power Shot', maxDuration: 250 },
  SHIELD: { color: '#3B82F6', icon: Shield, name: 'Shield', maxDuration: 400 }
};

export default function GameUI({ score, health, level, powerUps, abilityCooldowns, sessionScraps = 0, isTutorial = false, hiddenLevelId, lives = 10 }) {
  const activePowerUps = powerUps ? Object.entries(powerUps).filter(
    ([key, value]) => key !== 'shieldHealth' && value > 0
  ) : [];
  
  const biome = getBiomeForLevel(level);
  const isBoss = isBossLevel(level);
  
  // Get hidden level info if this is a secret level
  const hiddenLevel = hiddenLevelId && HIDDEN_LEVELS[hiddenLevelId];
  const levelDisplay = hiddenLevel ? hiddenLevel.name : `Lv${level}`;

  return (
    <div className="absolute top-2 left-2 right-2 flex justify-between items-start pointer-events-none">
      {/* Tutorial instructions overlay */}
      {isTutorial && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm rounded-b-lg px-4 py-2 border border-cyan-500/50 border-t-0 z-10">
          <div className="flex gap-4 text-xs text-slate-300">
            <span><kbd className="px-1 bg-slate-700 rounded text-cyan-400">←→</kbd> Move</span>
            <span><kbd className="px-1 bg-slate-700 rounded text-green-400">SPACE</kbd> Jump</span>
            <span><kbd className="px-1 bg-slate-700 rounded text-purple-400">CLICK</kbd> Cast</span>
            <span><kbd className="px-1 bg-slate-700 rounded text-cyan-400">SHIFT</kbd> Dash</span>
            <span><kbd className="px-1 bg-slate-700 rounded text-yellow-400">Q</kbd> Switch</span>
          </div>
        </div>
      )}
      {/* Left side - Health & Power-ups */}
      <div className="space-y-1">
        {/* Health Bar - compact */}
        <div className="bg-slate-900/70 backdrop-blur-sm rounded-lg px-2 py-1 border border-purple-500/30 flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-pink-500"
              initial={{ width: '100%' }}
              animate={{ width: `${health}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
          </div>
        </div>

        {/* Active Power-ups - compact row */}
        <AnimatePresence>
          {activePowerUps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-1"
            >
              {activePowerUps.map(([key, value]) => {
                const info = POWERUP_INFO[key];
                const Icon = info.icon;
                const percentage = (value / info.maxDuration) * 100;
                const isExpiring = percentage < 25;
                
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: isExpiring ? [1, 0.5, 1] : 1,
                      scale: 1 
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={isExpiring ? { repeat: Infinity, duration: 0.5 } : {}}
                    className="bg-slate-900/70 rounded-lg p-1 border border-slate-600/50"
                    style={{ borderColor: `${info.color}50` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: info.color }} />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side - Score, Level & Abilities */}
      <div className="space-y-1">
        {/* Top row - Level, Score, Scraps, Lives */}
        <div className="flex gap-2 justify-end">
          <div className="bg-slate-900/70 backdrop-blur-sm rounded-lg px-2 py-1 border border-blue-500/30 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-blue-400" fill="currentColor" />
                          <span className="text-blue-400 font-bold text-xs">{levelDisplay}</span>
                          {level === 0 && <span className="text-cyan-400 text-xs font-bold">TUT</span>}
                          {hiddenLevel && <span className="text-purple-400 text-xs font-bold">SECRET</span>}
                          {isBoss && level !== 0 && !hiddenLevel && <span className="text-red-400 text-xs font-bold animate-pulse">BOSS</span>}
                        </div>
          <div className="bg-slate-900/70 backdrop-blur-sm rounded-lg px-2 py-1 border border-yellow-500/30 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
            <span className="text-yellow-400 font-bold text-xs">{score.toLocaleString()}</span>
          </div>
          <div className="bg-slate-900/70 backdrop-blur-sm rounded-lg px-2 py-1 border border-purple-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span className="text-purple-400 font-bold text-xs">+{sessionScraps}</span>
          </div>
          <div className="bg-slate-900/70 backdrop-blur-sm rounded-lg px-2 py-1 border border-red-500/30 flex items-center gap-1">
            <Heart className="w-3 h-3 text-red-400" fill="currentColor" />
            <span className="text-red-400 font-bold text-xs">{lives}</span>
          </div>
        </div>

        {/* Abilities - compact row */}
        {abilityCooldowns && (
          <div className="flex gap-1 justify-end">
            {/* Dash */}
            <div className={`relative w-7 h-7 rounded flex items-center justify-center ${
              abilityCooldowns.dashCooldown <= 0 ? 'bg-cyan-500/40' : 'bg-slate-700/50'
            }`}>
              <Wind className={`w-3 h-3 ${abilityCooldowns.dashCooldown <= 0 ? 'text-cyan-400' : 'text-slate-500'}`} />
              {abilityCooldowns.dashCooldown > 0 && (
                <span className="absolute text-[8px] text-white">{Math.ceil(abilityCooldowns.dashCooldown / 60)}</span>
              )}
            </div>

            {/* Spell type */}
            <div className={`w-7 h-7 rounded flex items-center justify-center ${
              abilityCooldowns.selectedProjectile === 0 ? 'bg-purple-500/40' : 
              abilityCooldowns.selectedProjectile === 1 ? 'bg-cyan-500/40' : 'bg-yellow-500/40'
            }`}>
              {abilityCooldowns.selectedProjectile === 0 ? (
                <Flame className="w-3 h-3 text-purple-400" />
              ) : abilityCooldowns.selectedProjectile === 1 ? (
                <Snowflake className="w-3 h-3 text-cyan-400" />
              ) : (
                <Coins className="w-3 h-3 text-yellow-400" />
              )}
            </div>

            {/* Coin ammo indicator */}
            {abilityCooldowns.coinAmmo > 0 && (
              <div className="bg-yellow-500/40 rounded px-1.5 py-0.5 flex items-center gap-1">
                <Coins className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400 text-xs font-bold">{abilityCooldowns.coinAmmo}</span>
              </div>
            )}

            {/* Special abilities */}
            {abilityCooldowns.unlockedAbilities?.aoeBlast && (
              <div className={`relative w-7 h-7 rounded flex items-center justify-center ${
                abilityCooldowns.specialAbilities?.aoeBlast?.cooldown <= 0 ? 'bg-purple-500/40' : 'bg-slate-700/50'
              }`}>
                <span className="text-xs">💥</span>
                {abilityCooldowns.specialAbilities?.aoeBlast?.cooldown > 0 && (
                  <span className="absolute text-[8px] text-white">{Math.ceil(abilityCooldowns.specialAbilities.aoeBlast.cooldown / 60)}</span>
                )}
              </div>
            )}

            {abilityCooldowns.unlockedAbilities?.reflectShield && (
              <div className={`relative w-7 h-7 rounded flex items-center justify-center ${
                abilityCooldowns.specialAbilities?.reflectShield?.active ? 'bg-blue-500/60 animate-pulse' :
                abilityCooldowns.specialAbilities?.reflectShield?.cooldown <= 0 ? 'bg-blue-500/40' : 'bg-slate-700/50'
              }`}>
                <span className="text-xs">🔮</span>
                {!abilityCooldowns.specialAbilities?.reflectShield?.active && abilityCooldowns.specialAbilities?.reflectShield?.cooldown > 0 && (
                  <span className="absolute text-[8px] text-white">{Math.ceil(abilityCooldowns.specialAbilities.reflectShield.cooldown / 60)}</span>
                )}
              </div>
            )}

            {abilityCooldowns.unlockedAbilities?.hover && (
              <div className={`relative w-7 h-7 rounded flex items-center justify-center ${
                abilityCooldowns.specialAbilities?.hover?.active ? 'bg-cyan-500/60 animate-pulse' :
                abilityCooldowns.specialAbilities?.hover?.cooldown <= 0 ? 'bg-cyan-500/40' : 'bg-slate-700/50'
              }`}>
                <span className="text-xs">🌀</span>
                {!abilityCooldowns.specialAbilities?.hover?.active && abilityCooldowns.specialAbilities?.hover?.cooldown > 0 && (
                  <span className="absolute text-[8px] text-white">{Math.ceil(abilityCooldowns.specialAbilities.hover.cooldown / 60)}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}