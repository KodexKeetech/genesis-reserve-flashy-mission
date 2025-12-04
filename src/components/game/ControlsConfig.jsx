import React from 'react';
import { Keyboard, Gamepad2, Smartphone } from 'lucide-react';

export default function ControlsConfig({ keybinds, gamepadBinds, touchBinds }) {
  const formatKey = (key) => {
    return key.replace('Key', '').replace('Arrow', '').replace('Shift', '⇧').replace('Left', '').replace('Right', '');
  };

  return (
    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
      {/* Keyboard */}
      <div className="bg-slate-800/50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Keyboard className="w-4 h-4 text-purple-400" />
          <span className="text-white font-medium text-sm">Keyboard</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-xs text-slate-300">
          <p>Move: <span className="text-cyan-400">{keybinds?.moveLeft?.map(formatKey).join('/')}, {keybinds?.moveRight?.map(formatKey).join('/')}</span></p>
          <p>Jump: <span className="text-green-400">{keybinds?.jump?.map(formatKey).join('/')}</span></p>
          <p>Dash: <span className="text-blue-400">{keybinds?.dash?.map(formatKey).join('/')}</span></p>
          <p>Cast: <span className="text-purple-400">Click</span></p>
          <p>Switch: <span className="text-yellow-400">{keybinds?.switchSpell?.map(formatKey).join('/')}</span></p>
          <p>Abilities: <span className="text-red-400">{keybinds?.aoeBlast?.map(formatKey).join('/')}/{keybinds?.reflectShield?.map(formatKey).join('/')}/{keybinds?.hover?.map(formatKey).join('/')}</span></p>
        </div>
      </div>

      {/* Gamepad */}
      <div className="bg-slate-800/50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Gamepad2 className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium text-sm">Controller</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-xs text-slate-300">
          <p>Move: <span className="text-cyan-400">{gamepadBinds?.move}</span></p>
          <p>Aim: <span className="text-red-400">{gamepadBinds?.aim}</span></p>
          <p>Jump: <span className="text-green-400">{gamepadBinds?.jump}</span></p>
          <p>Dash: <span className="text-blue-400">{gamepadBinds?.dash}</span></p>
          <p>Cast: <span className="text-purple-400">{gamepadBinds?.cast}</span></p>
          <p>Switch: <span className="text-yellow-400">{gamepadBinds?.switchSpell}</span></p>
          <p>AOE: <span className="text-red-400">{gamepadBinds?.aoeBlast}</span></p>
          <p>Reflect: <span className="text-indigo-400">{gamepadBinds?.reflectShield}</span></p>
        </div>
      </div>

      {/* Touch */}
      <div className="bg-slate-800/50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="w-4 h-4 text-green-400" />
          <span className="text-white font-medium text-sm">Touch</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-xs text-slate-300">
          <p>Move: <span className="text-cyan-400">Left Stick</span></p>
          <p>Jump: <span className="text-green-400">Button</span></p>
          <p>Dash: <span className="text-blue-400">Button</span></p>
          <p>Cast: <span className="text-purple-400">Aim + Button</span></p>
          <p>Switch: <span className="text-yellow-400">Button</span></p>
        </div>
      </div>
    </div>
  );
}