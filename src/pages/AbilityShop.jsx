import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Lock, Check, Gem, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SPECIAL_ABILITIES, ABILITY_UPGRADES } from '@/components/game/AbilitySystem';

export default function AbilityShop() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      if (!userData.unlockedAbilities) {
        userData.unlockedAbilities = { aoeBlast: false, reflectShield: false, hover: false };
      }
      if (!userData.abilityUpgrades) {
        userData.abilityUpgrades = { aoeBlastPower: 0, aoeBlastRadius: 0, reflectDuration: 0, hoverDuration: 0 };
      }
      if (!userData.arcaneCrystals) {
        userData.arcaneCrystals = 0;
      }
      setUser(userData);
    } catch (e) {
      console.error('Failed to load user', e);
    }
    setLoading(false);
  };

  const unlockAbility = async (abilityId) => {
    const ability = SPECIAL_ABILITIES[abilityId];
    if (user.arcaneCrystals < ability.unlockCost) return;

    setPurchasing(abilityId);
    
    const newUnlocked = { ...user.unlockedAbilities, [abilityId]: true };
    const newCrystals = user.arcaneCrystals - ability.unlockCost;

    await base44.auth.updateMe({
      unlockedAbilities: newUnlocked,
      arcaneCrystals: newCrystals
    });

    setUser({ ...user, unlockedAbilities: newUnlocked, arcaneCrystals: newCrystals });
    setPurchasing(null);
  };

  const purchaseUpgrade = async (upgradeId) => {
    const upgrade = ABILITY_UPGRADES[upgradeId];
    const currentLevel = user.abilityUpgrades?.[upgradeId] || 0;
    if (currentLevel >= upgrade.maxLevel) return;

    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
    if (user.arcaneCrystals < cost) return;

    setPurchasing(upgradeId);
    
    const newUpgrades = { ...user.abilityUpgrades, [upgradeId]: currentLevel + 1 };
    const newCrystals = user.arcaneCrystals - cost;

    await base44.auth.updateMe({
      abilityUpgrades: newUpgrades,
      arcaneCrystals: newCrystals
    });

    setUser({ ...user, abilityUpgrades: newUpgrades, arcaneCrystals: newCrystals });
    setPurchasing(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Game')}>
              <Button variant="ghost" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            </Link>
            <Link to={createPageUrl('UpgradeShop')}>
              <Button variant="outline" className="text-slate-400 border-slate-600 hover:text-white">
                <Sparkles className="w-4 h-4 mr-2" />
                Basic Upgrades
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-sm rounded-xl px-5 py-3 border border-indigo-500/30">
            <Gem className="w-6 h-6 text-indigo-400" />
            <span className="text-2xl font-bold text-indigo-300">{user?.arcaneCrystals || 0}</span>
            <span className="text-slate-400">Arcane Crystals</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
            SPECIAL ABILITIES
          </h1>
          <p className="text-slate-400">Unlock and upgrade powerful new abilities</p>
          <p className="text-indigo-400 text-sm mt-2">Earn Arcane Crystals by defeating bosses!</p>
        </div>

        {/* Abilities Grid */}
        <div className="grid gap-6 mb-10">
          {Object.values(SPECIAL_ABILITIES).map((ability, index) => {
            const isUnlocked = user?.unlockedAbilities?.[ability.id];
            const canAfford = (user?.arcaneCrystals || 0) >= ability.unlockCost;
            const relatedUpgrades = Object.values(ABILITY_UPGRADES).filter(u => u.abilityId === ability.id);

            return (
              <motion.div
                key={ability.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-slate-900/80 backdrop-blur-sm border-2 transition-all ${
                  isUnlocked ? 'border-green-500/50' : 'border-slate-700'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                          style={{ backgroundColor: `${ability.color}22`, border: `2px solid ${ability.color}` }}
                        >
                          {ability.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl flex items-center gap-2">
                            {ability.name}
                            <kbd className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                              {ability.key.replace('Key', '')}
                            </kbd>
                          </CardTitle>
                          <CardDescription className="text-slate-400 mt-1">
                            {ability.description}
                          </CardDescription>
                        </div>
                      </div>

                      {!isUnlocked ? (
                        <Button
                          onClick={() => unlockAbility(ability.id)}
                          disabled={!canAfford || purchasing === ability.id}
                          className={`${
                            canAfford 
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500' 
                              : 'bg-slate-700 text-slate-500'
                          }`}
                        >
                          {purchasing === ability.id ? (
                            'Unlocking...'
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              <Gem className="w-4 h-4 mr-1" />
                              {ability.unlockCost}
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-green-400">
                          <Check className="w-6 h-6" />
                          <span className="font-bold">UNLOCKED</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  {isUnlocked && relatedUpgrades.length > 0 && (
                    <CardContent className="border-t border-slate-700 pt-4">
                      <p className="text-sm text-slate-500 mb-3">ABILITY UPGRADES</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {relatedUpgrades.map(upgrade => {
                          const currentLevel = user?.abilityUpgrades?.[upgrade.id] || 0;
                          const isMaxed = currentLevel >= upgrade.maxLevel;
                          const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
                          const canAffordUpgrade = (user?.arcaneCrystals || 0) >= cost;

                          return (
                            <div 
                              key={upgrade.id}
                              className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3"
                            >
                              <div>
                                <p className="text-white font-medium text-sm">{upgrade.name}</p>
                                <p className="text-slate-500 text-xs">{upgrade.description}</p>
                                <div className="flex gap-1 mt-1">
                                  {Array.from({ length: upgrade.maxLevel }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-6 h-1.5 rounded-full ${
                                        i < currentLevel ? '' : 'bg-slate-600'
                                      }`}
                                      style={i < currentLevel ? { backgroundColor: upgrade.color } : {}}
                                    />
                                  ))}
                                </div>
                              </div>

                              {isMaxed ? (
                                <span className="text-xs text-green-400 font-bold">MAX</span>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => purchaseUpgrade(upgrade.id)}
                                  disabled={!canAffordUpgrade || purchasing === upgrade.id}
                                  className={`text-xs ${
                                    canAffordUpgrade 
                                      ? 'bg-indigo-600 hover:bg-indigo-500' 
                                      : 'bg-slate-700 text-slate-500'
                                  }`}
                                >
                                  <Gem className="w-3 h-3 mr-1" />
                                  {cost}
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* How to earn crystals */}
        <Card className="bg-slate-900/60 border-indigo-500/30">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Gem className="w-5 h-5 text-indigo-400" />
              How to Earn Arcane Crystals
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-indigo-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Defeat Bosses</p>
                  <p className="text-slate-400">+2 crystals per boss</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-indigo-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Complete Levels</p>
                  <p className="text-slate-400">+1 crystal every 5 levels</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-indigo-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">No-Hit Boss</p>
                  <p className="text-slate-400">+1 bonus crystal</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}