import React from 'react';
import { Volume2, VolumeX, Zap, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ControlsConfig from './ControlsConfig';

export default function SettingsMenu({ settings, onSettingsChange, onClose }) {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl overflow-y-auto">
      <div className="bg-slate-900 border border-purple-500/50 rounded-xl p-6 w-96 max-w-[95%] max-h-[90%] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Sound */}
        <div className="mb-4">
          <label className="text-slate-300 text-sm mb-2 block">Sound</label>
          <div className="flex gap-2">
            <Button
              variant={settings.sound ? "default" : "outline"}
              className={settings.sound ? "bg-purple-600 flex-1" : "flex-1"}
              onClick={() => onSettingsChange({ ...settings, sound: true })}
            >
              <Volume2 className="w-4 h-4 mr-2" /> On
            </Button>
            <Button
              variant={!settings.sound ? "default" : "outline"}
              className={!settings.sound ? "bg-slate-600 flex-1" : "flex-1"}
              onClick={() => onSettingsChange({ ...settings, sound: false })}
            >
              <VolumeX className="w-4 h-4 mr-2" /> Off
            </Button>
          </div>
        </div>

        {/* Graphics Quality */}
        <div className="mb-4">
          <label className="text-slate-300 text-sm mb-2 block">Graphics</label>
          <div className="flex gap-2">
            {['low', 'medium', 'high'].map((quality) => (
              <Button
                key={quality}
                variant={settings.graphics === quality ? "default" : "outline"}
                className={`flex-1 capitalize ${settings.graphics === quality ? 
                  (quality === 'low' ? 'bg-green-600' : quality === 'medium' ? 'bg-yellow-600' : 'bg-purple-600') : ''}`}
                onClick={() => onSettingsChange({ ...settings, graphics: quality })}
              >
                {quality}
              </Button>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-1">
            {settings.graphics === 'low' ? 'Best performance, minimal effects' :
             settings.graphics === 'medium' ? 'Balanced visuals and performance' :
             'Full effects, may lag on older devices'}
          </p>
        </div>

        {/* Particles */}
        <div className="mb-6">
          <label className="text-slate-300 text-sm mb-2 block">Particles</label>
          <div className="flex gap-2">
            <Button
              variant={settings.particles ? "default" : "outline"}
              className={settings.particles ? "bg-purple-600 flex-1" : "flex-1"}
              onClick={() => onSettingsChange({ ...settings, particles: true })}
            >
              <Sparkles className="w-4 h-4 mr-2" /> On
            </Button>
            <Button
              variant={!settings.particles ? "default" : "outline"}
              className={!settings.particles ? "bg-slate-600 flex-1" : "flex-1"}
              onClick={() => onSettingsChange({ ...settings, particles: false })}
            >
              Off
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6">
          <label className="text-slate-300 text-sm mb-2 block">Controls</label>
          <ControlsConfig 
            keybinds={settings.keybinds}
            gamepadBinds={settings.gamepadBinds}
            touchBinds={settings.touchBinds}
          />
        </div>

        <Button onClick={onClose} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
          Done
        </Button>
      </div>
    </div>
  );
}