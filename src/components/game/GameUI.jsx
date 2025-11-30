import React from 'react';
import { Heart, Star, Zap, Wind, Shield, Flame, Snowflake, Map, Sparkles, Circle } from 'lucide-react';
import { SPECIAL_ABILITIES } from './AbilitySystem';
import { motion, AnimatePresence } from 'framer-motion';
import { getBiomeForLevel, isBossLevel } from './BiomeConfig';

const POWERUP_INFO = {
  SPEED: { color: '#22D3EE', icon: Wind, name: 'Speed', maxDuration: 300 },
  INVINCIBILITY: { color: '#FBBF24', icon: Star, name: 'Invincible', maxDuration: 200 },
  POWER_SHOT: { color: '#EF4444', icon: Flame, name: 'Power Shot', maxDuration: 250 },
  SHIELD: { color: '#3B82F6', icon: Shield, name: 'Shield', maxDuration: 400 }
};

export default function GameUI({ score, health, level, powerUps, abilityCooldowns, sessionScraps = 0 }) {
  const activePowerUps = powerUps ? Object.entries(powerUps).filter(
    ([key, value]) => key !== 'shieldHealth' && value > 0
  ) : [];
  
  const biome = getBiomeForLevel(level);
  const isBoss = isBossLevel(level);

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
      {/* Left side - Health & Power-ups */}
      <div className="space-y-3">
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

        {/* Active Power-ups */}
        <AnimatePresence>
          {activePowerUps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 border border-cyan-500/30"
            >
              <p className="text-xs text-slate-400 mb-2">ACTIVE BUFFS</p>
              <div className="space-y-2">
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
                      className="flex items-center gap-2"
                    >
                      <div 
                        className="p-1.5 rounded-lg"
                        style={{ backgroundColor: `${info.color}33` }}
                      >
                        <Icon 
                          className="w-4 h-4" 
                          style={{ color: info.color }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-white">{info.name}</p>
                        <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: info.color }}
                            animate={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side - Score, Level & Abilities */}
      <div className="space-y-3">
        {/* Biome indicator */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-purple-500/30 mb-2">
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 font-medium text-sm">{biome?.name || 'Unknown'}</span>
              {isBoss && (
                <span className="bg-red-500/80 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                  BOSS
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-yellow-500/30">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                <span className="text-yellow-400 font-bold text-lg">{score.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-purple-500/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-bold text-lg">+{sessionScraps}</span>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-blue-500/30">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" fill="currentColor" />
                <span className="text-blue-400 font-bold text-lg">Level {level}</span>
              </div>
            </div>
          </div>

        {/* Abilities */}
        {abilityCooldowns && (
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 border border-slate-500/30">
            <p className="text-xs text-slate-400 mb-2">ABILITIES</p>
            <div className="flex gap-2 flex-wrap">
              {/* Dash ability */}
              <div className="text-center">
                <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center ${
                  abilityCooldowns.dashCooldown <= 0 
                    ? 'bg-cyan-500/30 border border-cyan-400' 
                    : 'bg-slate-700/50 border border-slate-600'
                }`}>
                  <Wind className={`w-4 h-4 ${
                    abilityCooldowns.dashCooldown <= 0 ? 'text-cyan-400' : 'text-slate-500'
                  }`} />
                  {abilityCooldowns.dashCooldown > 0 && (
                    <div className="absolute inset-0 bg-slate-900/70 rounded-lg flex items-center justify-center">
                      <span className="text-[10px] text-slate-400">
                        {Math.ceil(abilityCooldowns.dashCooldown / 60)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-[8px] text-slate-500 mt-0.5">SHIFT</p>
              </div>

              {/* Projectile type selector */}
              <div className="text-center">
                <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center border ${
                  abilityCooldowns.selectedProjectile === 0 
                    ? 'bg-purple-500/30 border-purple-400' 
                    : 'bg-cyan-500/30 border-cyan-400'
                }`}>
                  {abilityCooldowns.selectedProjectile === 0 ? (
                    <Flame className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Snowflake className="w-4 h-4 text-cyan-400" />
                  )}
                </div>
                <p className="text-[8px] text-slate-500 mt-0.5">Q</p>
              </div>

              {/* Special Abilities */}
              {abilityCooldowns.unlockedAbilities?.aoeBlast && (
                <div className="text-center">
                  <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center ${
                    abilityCooldowns.specialAbilities?.aoeBlast?.cooldown <= 0 
                      ? 'bg-purple-500/30 border border-purple-400' 
                      : 'bg-slate-700/50 border border-slate-600'
                  }`}>
                    <span className="text-sm">💥</span>
                    {abilityCooldowns.specialAbilities?.aoeBlast?.cooldown > 0 && (
                      <div className="absolute inset-0 bg-slate-900/70 rounded-lg flex items-center justify-center">
                        <span className="text-[10px] text-slate-400">
                          {Math.ceil(abilityCooldowns.specialAbilities.aoeBlast.cooldown / 60)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[8px] text-slate-500 mt-0.5">E</p>
                </div>
              )}

              {abilityCooldowns.unlockedAbilities?.reflectShield && (
                <div className="text-center">
                  <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center ${
                    abilityCooldowns.specialAbilities?.reflectShield?.active
                      ? 'bg-blue-500/50 border-2 border-blue-400 animate-pulse'
                      : abilityCooldowns.specialAbilities?.reflectShield?.cooldown <= 0 
                        ? 'bg-blue-500/30 border border-blue-400' 
                        : 'bg-slate-700/50 border border-slate-600'
                  }`}>
                    <span className="text-sm">🔮</span>
                    {!abilityCooldowns.specialAbilities?.reflectShield?.active && 
                     abilityCooldowns.specialAbilities?.reflectShield?.cooldown > 0 && (
                      <div className="absolute inset-0 bg-slate-900/70 rounded-lg flex items-center justify-center">
                        <span className="text-[10px] text-slate-400">
                          {Math.ceil(abilityCooldowns.specialAbilities.reflectShield.cooldown / 60)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[8px] text-slate-500 mt-0.5">R</p>
                </div>
              )}

              {abilityCooldowns.unlockedAbilities?.hover && (
                <div className="text-center">
                  <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center ${
                    abilityCooldowns.specialAbilities?.hover?.active
                      ? 'bg-cyan-500/50 border-2 border-cyan-400 animate-pulse'
                      : abilityCooldowns.specialAbilities?.hover?.cooldown <= 0 
                        ? 'bg-cyan-500/30 border border-cyan-400' 
                        : 'bg-slate-700/50 border border-slate-600'
                  }`}>
                    <span className="text-sm">🌀</span>
                    {!abilityCooldowns.specialAbilities?.hover?.active && 
                     abilityCooldowns.specialAbilities?.hover?.cooldown > 0 && (
                      <div className="absolute inset-0 bg-slate-900/70 rounded-lg flex items-center justify-center">
                        <span className="text-[10px] text-slate-400">
                          {Math.ceil(abilityCooldowns.specialAbilities.hover.cooldown / 60)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[8px] text-slate-500 mt-0.5">F</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}