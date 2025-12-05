import React from 'react';
import { Volume2, VolumeX, Zap, Sparkles, X, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ControlsConfig from './ControlsConfig';

export default function SettingsMenu({ settings, onSettingsChange, onClose }) {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 rounded-xl overflow-y-auto py-4">
      <div className="bg-slate-900 border border-purple-500/50 rounded-xl p-4 w-80 max-w-[95%] my-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Game Speed */}
        <div className="mb-3">
          <label className="text-slate-300 text-xs mb-1 block flex items-center gap-1">
            <Gauge className="w-3 h-3" /> Game Speed
          </label>
          <div className="flex gap-2">
            {[0.5, 0.75, 1].map((speed) => (
              <Button
                key={speed}
                size="sm"
                variant={(settings.gameSpeed || 1) === speed ? "default" : "outline"}
                className={`flex-1 text-xs ${(settings.gameSpeed || 1) === speed ? 
                  (speed === 0.5 ? 'bg-orange-600' : speed === 0.75 ? 'bg-green-600' : 'bg-purple-600') : ''}`}
                onClick={() => onSettingsChange({ ...settings, gameSpeed: speed })}
              >
                {speed === 1 ? 'Normal' : `${speed * 100}%`}
              </Button>
            ))}
          </div>
          <p className="text-slate-500 text-[10px] mt-1">
            {(settings.gameSpeed || 1) === 0.5 ? 'Half speed - easiest' : 
             (settings.gameSpeed || 1) === 0.75 ? 'Slower gameplay' : 'Normal speed'}
          </p>
        </div>

        {/* Sound */}
        <div className="mb-3">
          <label className="text-slate-300 text-xs mb-1 block">Sound</label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={settings.sound ? "default" : "outline"}
              className={settings.sound ? "bg-purple-600 flex-1" : "flex-1"}
              onClick={() => onSettingsChange({ ...settings, sound: true })}
            >
              <Volume2 className="w-3 h-3 mr-1" /> On
            </Button>
            <Button
              size="sm"
              variant={!settings.sound ? "default" : "outline"}
              className={!settings.sound ? "bg-slate-600 flex-1" : "flex-1"}
              onClick={() => onSettingsChange({ ...settings, sound: false })}
            >
              <VolumeX className="w-3 h-3 mr-1" /> Off
            </Button>
          </div>
        </div>

        {/* Graphics Quality */}
        <div className="mb-3">
          <label className="text-slate-300 text-xs mb-1 block">Graphics</label>
          <div className="flex gap-2">
            {['low', 'medium', 'high'].map((quality) => (
              <Button
                key={quality}
                size="sm"
                variant={settings.graphics === quality ? "default" : "outline"}
                className={`flex-1 capitalize text-xs ${settings.graphics === quality ? 
                  (quality === 'low' ? 'bg-green-600' : quality === 'medium' ? 'bg-yellow-600' : 'bg-purple-600') : ''}`}
                onClick={() => onSettingsChange({ ...settings, graphics: quality })}
              >
                {quality}
              </Button>
            ))}
          </div>
        </div>

        {/* Particles */}
        <div className="mb-3">
          <label className="text-slate-300 text-xs mb-1 block">Particles</label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={settings.particles ? "default" : "outline"}
              className={settings.particles ? "bg-purple-600 flex-1" : "flex-1"}
              onClick={() => onSettingsChange({ ...settings, particles: true })}
            >
              <Sparkles className="w-3 h-3 mr-1" /> On
            </Button>
            <Button
              size="sm"
              variant={!settings.particles ? "default" : "outline"}
              className={!settings.particles ? "bg-slate-600 flex-1" : "flex-1"}
              onClick={() => onSettingsChange({ ...settings, particles: false })}
            >
              Off
            </Button>
          </div>
        </div>



        {/* Controls */}
        <div className="mb-4">
          <label className="text-slate-300 text-xs mb-1 block">Controls</label>
          <ControlsConfig 
            keybinds={settings.keybinds}
            gamepadBinds={settings.gamepadBinds}
            touchBinds={settings.touchBinds}
          />
        </div>

        <Button size="sm" onClick={onClose} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
          Done
        </Button>
      </div>
    </div>
  );
}