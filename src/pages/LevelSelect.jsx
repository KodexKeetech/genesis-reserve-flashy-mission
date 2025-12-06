import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Lock, Star, Trophy, Sparkles, Gem, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { BIOMES, HIDDEN_LEVELS, getAvailableHiddenLevels } from '@/components/game/BiomeConfig';

export default function LevelSelect() {
  const [highestLevel, setHighestLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [unlockedSecrets, setUnlockedSecrets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const user = await base44.auth.me();
      setHighestLevel(user.highestLevel || 1);
      setCompletedLevels(user.completedLevels || []);
      setUnlockedSecrets(user.unlockedSecrets || []);
    } catch (e) {
      const localData = localStorage.getItem('jeff_player_data');
      if (localData) {
        const data = JSON.parse(localData);
        setHighestLevel(data.highestLevel || 1);
        setCompletedLevels(data.completedLevels || []);
        setUnlockedSecrets(data.unlockedSecrets || []);
      }
    }
    setLoading(false);
  };

  const biomeList = Object.entries(BIOMES);
  const availableHiddenLevels = getAvailableHiddenLevels(highestLevel);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 p-6 overflow-auto">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-slate-400">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span>Highest Level: <span className="text-yellow-400 font-bold">{highestLevel}</span></span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
            <Map className="inline w-10 h-10 mr-3" />
            LEVEL SELECT
          </h1>
          <p className="text-slate-400">Choose your adventure</p>
        </div>

        {/* Biomes Grid */}
        <div className="space-y-8">
          {biomeList.map(([biomeKey, biome], biomeIndex) => {
            const isUnlocked = highestLevel >= biome.levels[0];
            const allLevelsCompleted = biome.levels.every(l => completedLevels.includes(l));

            return (
              <motion.div
                key={biomeKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: biomeIndex * 0.1 }}
              >
                <Card className={`bg-slate-900/80 backdrop-blur-sm border-2 transition-all ${
                  isUnlocked ? 'border-slate-700 hover:border-purple-500/50' : 'border-slate-800 opacity-60'
                }`}>
                  <CardContent className="p-6">
                    {/* Biome Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: biome.boss.color + '33', border: `2px solid ${biome.boss.color}` }}
                        >
                          {biomeKey === 'forest' && '🌲'}
                          {biomeKey === 'volcano' && '🌋'}
                          {biomeKey === 'ice' && '❄️'}
                          {biomeKey === 'void' && '🌀'}
                          {biomeKey === 'sky' && '☁️'}
                          {biomeKey === 'ruins' && '🏛️'}
                          {biomeKey === 'crystal' && '💎'}
                          {biomeKey === 'techno' && '🤖'}
                          {biomeKey === 'arcane' && '✨'}
                          {biomeKey === 'space' && '🌌'}
                          {biomeKey === 'mystical' && '∞'}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{biome.name}</h3>
                          <p className="text-sm text-slate-400">Levels {biome.levels[0]} - {biome.levels[biome.levels.length - 1]}</p>
                        </div>
                      </div>
                      {allLevelsCompleted && (
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-5 h-5 fill-yellow-400" />
                          <span className="text-sm font-bold">Complete!</span>
                        </div>
                      )}
                      {!isUnlocked && (
                        <div className="flex items-center gap-1 text-slate-500">
                          <Lock className="w-5 h-5" />
                          <span className="text-sm">Locked</span>
                        </div>
                      )}
                    </div>

                    {/* Levels */}
                    <div className="flex gap-3 flex-wrap">
                      {biome.levels.map((level, levelIndex) => {
                        const levelUnlocked = highestLevel >= level;
                        const levelCompleted = completedLevels.includes(level);
                        const isBoss = level === biome.bossLevel;

                        return (
                          <Link
                            key={level}
                            to={levelUnlocked ? createPageUrl('Game') + `?startLevel=${level}` : '#'}
                            className={!levelUnlocked ? 'pointer-events-none' : ''}
                          >
                            <Button
                              variant="outline"
                              className={`w-16 h-16 flex flex-col items-center justify-center gap-1 transition-all ${
                                levelCompleted 
                                  ? 'bg-green-600/20 border-green-500 text-green-400 hover:bg-green-600/30' 
                                  : levelUnlocked 
                                    ? 'bg-purple-600/20 border-purple-500 text-purple-300 hover:bg-purple-600/30'
                                    : 'bg-slate-800 border-slate-700 text-slate-500'
                              } ${isBoss ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-yellow-500/50' : ''}`}
                              disabled={!levelUnlocked}
                            >
                              {levelUnlocked ? (
                                <>
                                  <span className="text-lg font-bold">{level}</span>
                                  {isBoss && <span className="text-[10px]">BOSS</span>}
                                  {levelCompleted && <Star className="w-3 h-3 fill-current" />}
                                </>
                              ) : (
                                <Lock className="w-5 h-5" />
                              )}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Boss Preview */}
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">Boss:</span>
                        <span className="text-white font-medium" style={{ color: biome.boss.color }}>
                          {biome.boss.name}
                        </span>
                        <span className="text-slate-500">• HP: {biome.boss.health}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Hidden Levels Section */}
        {availableHiddenLevels.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Secret Levels
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {availableHiddenLevels.map((hidden, index) => (
                <motion.div
                  key={hidden.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-yellow-300">{hidden.name}</h3>
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                          Difficulty x{hidden.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">{hidden.unlockedBy}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1 text-purple-300">
                            <Sparkles className="w-4 h-4" /> {hidden.rewards.scraps}
                          </span>
                          <span className="flex items-center gap-1 text-indigo-300">
                            <Gem className="w-4 h-4" /> {hidden.rewards.crystals}
                          </span>
                        </div>
                        <Link to={createPageUrl('Game') + `?hiddenLevel=${hidden.id}`}>
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-500">
                            Play
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* All Hidden Levels Info */}
        <div className="mt-8 bg-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-3">🔓 Secret Levels</h3>
          <p className="text-sm text-slate-400 mb-4">Complete regular levels to unlock secret levels with higher difficulty and better rewards!</p>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-400">
            {Object.entries(HIDDEN_LEVELS).map(([id, hidden]) => {
              const unlocked = highestLevel > hidden.afterLevel;
              return (
                <div key={id} className={`flex items-start gap-2 ${unlocked ? 'text-green-400' : ''}`}>
                  <span>{unlocked ? '✅' : '🔒'}</span>
                  <span><strong>{hidden.name}:</strong> {hidden.unlockedBy}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}