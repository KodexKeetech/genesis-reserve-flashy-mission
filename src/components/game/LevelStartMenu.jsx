import React from 'react';
import { Flame, Snowflake, Coins, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GUNS = [
  { id: 0, name: 'Arcane Bolt', icon: '🔮', color: 'from-purple-500 to-purple-700', desc: 'Balanced magic projectile' },
  { id: 1, name: 'Frost Ray', icon: '❄️', color: 'from-cyan-500 to-cyan-700', desc: 'Slows enemies on hit' },
  { id: 2, name: 'Golden Gun', icon: '🪙', color: 'from-yellow-500 to-yellow-700', desc: 'High damage, uses coins' },
];

export default function LevelStartMenu({ level, coinAmmo, onSelectGun, onStart }) {
  const [selectedGun, setSelectedGun] = React.useState(0);

  const handleStart = () => {
    onSelectGun(selectedGun);
    onStart();
  };

  return (
    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center rounded-xl p-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
        Level {level}
      </h2>
      <p className="text-slate-400 mb-6">Choose your starting spell</p>

      <div className="flex flex-col gap-3 w-full max-w-sm mb-6">
        {GUNS.map((gun) => {
          const isDisabled = gun.id === 2 && coinAmmo <= 0;
          const isSelected = selectedGun === gun.id;
          
          return (
            <button
              key={gun.id}
              disabled={isDisabled}
              onClick={() => !isDisabled && setSelectedGun(gun.id)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isSelected 
                  ? `border-white bg-gradient-to-r ${gun.color} shadow-lg scale-105` 
                  : isDisabled
                    ? 'border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed'
                    : 'border-slate-600 bg-slate-800 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{gun.icon}</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-white">{gun.name}</div>
                  <div className="text-sm text-slate-300">{gun.desc}</div>
                  {gun.id === 2 && (
                    <div className={`text-xs mt-1 ${coinAmmo > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {coinAmmo > 0 ? `${coinAmmo} coins available` : 'No coins!'}
                    </div>
                  )}
                </div>
                {isSelected && (
                  <div className="text-white text-xl">✓</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleStart}
        size="lg"
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-10 py-6 text-xl rounded-xl shadow-lg"
      >
        <Play className="w-6 h-6 mr-2" />
        Start Level
      </Button>
    </div>
  );
}