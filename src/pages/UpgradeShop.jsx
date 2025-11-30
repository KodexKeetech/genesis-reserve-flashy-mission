import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Heart, Flame, Wind, Zap, Magnet, Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const UPGRADES = [
  {
    id: 'maxHealth',
    name: 'Vitality Core',
    description: '+20 Max HP per level',
    icon: Heart,
    color: '#EF4444',
    maxLevel: 5,
    baseCost: 100,
    costMultiplier: 1.8
  },
  {
    id: 'spellPower',
    name: 'Arcane Amplifier',
    description: '+1 Spell Damage per level',
    icon: Flame,
    color: '#A855F7',
    maxLevel: 5,
    baseCost: 150,
    costMultiplier: 2
  },
  {
    id: 'dashEfficiency',
    name: 'Phase Capacitor',
    description: '-10% Dash Cooldown per level',
    icon: Wind,
    color: '#22D3EE',
    maxLevel: 5,
    baseCost: 120,
    costMultiplier: 1.7
  },
  {
    id: 'magicRegen',
    name: 'Rapid Conduit',
    description: '-10% Cast Time per level',
    icon: Zap,
    color: '#FBBF24',
    maxLevel: 5,
    baseCost: 130,
    costMultiplier: 1.8
  },
  {
    id: 'scrapMagnet',
    name: 'Scrap Attractor',
    description: '+20% Scrap Drops per level',
    icon: Magnet,
    color: '#22C55E',
    maxLevel: 5,
    baseCost: 200,
    costMultiplier: 2.2
  }
];

export default function UpgradeShop() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      // Initialize upgrades if not present
      if (!userData.upgrades) {
        userData.upgrades = {
          maxHealth: 0,
          spellPower: 0,
          dashEfficiency: 0,
          magicRegen: 0,
          scrapMagnet: 0
        };
      }
      if (!userData.magicScraps) {
        userData.magicScraps = 0;
      }
      setUser(userData);
    } catch (e) {
      // Not logged in - load from localStorage
      const localData = localStorage.getItem('jeff_player_data');
      const localUpgrades = localStorage.getItem('jeff_upgrades');
      const data = localData ? JSON.parse(localData) : { magicScraps: 0 };
      const upgrades = localUpgrades ? JSON.parse(localUpgrades) : {
        maxHealth: 0, spellPower: 0, dashEfficiency: 0, magicRegen: 0, scrapMagnet: 0
      };
      setUser({ magicScraps: data.magicScraps || 0, upgrades });
    }
    setLoading(false);
  };

  const getUpgradeCost = (upgrade, currentLevel) => {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
  };

  const purchaseUpgrade = async (upgrade) => {
    const currentLevel = user.upgrades?.[upgrade.id] || 0;
    if (currentLevel >= upgrade.maxLevel) return;

    const cost = getUpgradeCost(upgrade, currentLevel);
    if (user.magicScraps < cost) return;

    setPurchasing(upgrade.id);
    
    const newUpgrades = { ...user.upgrades, [upgrade.id]: currentLevel + 1 };
    const newScraps = user.magicScraps - cost;

    try {
      await base44.auth.updateMe({
        upgrades: newUpgrades,
        magicScraps: newScraps
      });
    } catch (e) {
      // Not logged in - save to localStorage
    }
    
    // Always save to localStorage as backup
    localStorage.setItem('jeff_upgrades', JSON.stringify(newUpgrades));
    const localData = localStorage.getItem('jeff_player_data');
    const data = localData ? JSON.parse(localData) : {};
    localStorage.setItem('jeff_player_data', JSON.stringify({ ...data, magicScraps: newScraps }));

    setUser({ ...user, upgrades: newUpgrades, magicScraps: newScraps });
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 p-6">
      {/* Comic Links - Top Left */}
      <div className="fixed top-3 left-3 z-20 flex flex-col gap-2">
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

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to={createPageUrl('Game')}>
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Game
            </Button>
          </Link>

          <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-sm rounded-xl px-5 py-3 border border-purple-500/30">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-2xl font-bold text-purple-300">{user?.magicScraps || 0}</span>
            <span className="text-slate-400">Magic Scraps</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
            UPGRADE SHOP
          </h1>
          <p className="text-slate-400">Enhance Jeff's abilities permanently</p>
        </div>

        {/* Upgrades Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {UPGRADES.map((upgrade, index) => {
            const Icon = upgrade.icon;
            const currentLevel = user?.upgrades?.[upgrade.id] || 0;
            const isMaxed = currentLevel >= upgrade.maxLevel;
            const cost = getUpgradeCost(upgrade, currentLevel);
            const canAfford = (user?.magicScraps || 0) >= cost;

            return (
              <motion.div
                key={upgrade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700 hover:border-purple-500/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: `${upgrade.color}22` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: upgrade.color }} />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{upgrade.name}</CardTitle>
                          <CardDescription className="text-slate-400">
                            {upgrade.description}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Level indicators */}
                    <div className="flex gap-2 mb-4">
                      {Array.from({ length: upgrade.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full transition-colors ${
                            i < currentLevel 
                              ? '' 
                              : 'bg-slate-700'
                          }`}
                          style={i < currentLevel ? { backgroundColor: upgrade.color } : {}}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-400">
                        Level {currentLevel} / {upgrade.maxLevel}
                      </div>

                      {isMaxed ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <Check className="w-5 h-5" />
                          <span className="font-bold">MAXED</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => purchaseUpgrade(upgrade)}
                          disabled={!canAfford || purchasing === upgrade.id}
                          className={`${
                            canAfford 
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500' 
                              : 'bg-slate-700 text-slate-500'
                          }`}
                        >
                          {purchasing === upgrade.id ? (
                            'Upgrading...'
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              {cost}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Stats summary */}
        <div className="mt-10 bg-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Current Bonuses</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-400">+{(user?.upgrades?.maxHealth || 0) * 20}</div>
              <div className="text-xs text-slate-400">Max HP</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">+{user?.upgrades?.spellPower || 0}</div>
              <div className="text-xs text-slate-400">Spell Damage</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">-{(user?.upgrades?.dashEfficiency || 0) * 10}%</div>
              <div className="text-xs text-slate-400">Dash Cooldown</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">-{(user?.upgrades?.magicRegen || 0) * 10}%</div>
              <div className="text-xs text-slate-400">Cast Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">+{(user?.upgrades?.scrapMagnet || 0) * 20}%</div>
              <div className="text-xs text-slate-400">Scrap Bonus</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}