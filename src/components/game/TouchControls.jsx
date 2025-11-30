import React, { useState, useRef, useCallback } from 'react';

export default function TouchControls({ onInput }) {
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const joystickRef = useRef(null);
  const joystickCenter = useRef({ x: 0, y: 0 });

  const handleJoystickStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = joystickRef.current.getBoundingClientRect();
    joystickCenter.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    setIsJoystickActive(true);
    
    const dx = touch.clientX - joystickCenter.current.x;
    const dy = touch.clientY - joystickCenter.current.y;
    const maxDist = 35;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
    const angle = Math.atan2(dy, dx);
    
    setJoystickPos({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist
    });
    
    onInput('move', { x: dx / maxDist, y: dy / maxDist });
  }, [onInput]);

  const handleJoystickMove = useCallback((e) => {
    if (!isJoystickActive) return;
    e.preventDefault();
    const touch = e.touches[0];
    
    const dx = touch.clientX - joystickCenter.current.x;
    const dy = touch.clientY - joystickCenter.current.y;
    const maxDist = 35;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
    const angle = Math.atan2(dy, dx);
    
    setJoystickPos({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist
    });
    
    onInput('move', { x: dx / maxDist, y: dy / maxDist });
  }, [isJoystickActive, onInput]);

  const handleJoystickEnd = useCallback(() => {
    setIsJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
    onInput('move', { x: 0, y: 0 });
  }, [onInput]);

  const handleButtonStart = useCallback((action) => (e) => {
    e.preventDefault();
    onInput(action, true);
  }, [onInput]);

  const handleButtonEnd = useCallback((action) => (e) => {
    e.preventDefault();
    onInput(action, false);
  }, [onInput]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-40 pointer-events-none z-50 md:hidden">
      {/* Left side - Joystick */}
      <div
        ref={joystickRef}
        className="absolute left-6 bottom-6 w-28 h-28 rounded-full bg-slate-800/60 border-2 border-slate-600/50 pointer-events-auto"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
      >
        <div
          className="absolute w-14 h-14 rounded-full bg-slate-600/80 border-2 border-slate-400/50 transition-transform duration-75"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`
          }}
        />
      </div>

      {/* Right side - Action buttons */}
      <div className="absolute right-4 bottom-4 flex flex-col gap-2 pointer-events-auto">
        {/* Top row - Jump and Dash */}
        <div className="flex gap-2">
          <button
            className="w-14 h-14 rounded-full bg-cyan-600/70 border-2 border-cyan-400/50 flex items-center justify-center text-white text-xs font-bold active:bg-cyan-500/90"
            onTouchStart={handleButtonStart('dash')}
            onTouchEnd={handleButtonEnd('dash')}
          >
            DASH
          </button>
          <button
            className="w-16 h-16 rounded-full bg-green-600/70 border-2 border-green-400/50 flex items-center justify-center text-white text-sm font-bold active:bg-green-500/90"
            onTouchStart={handleButtonStart('jump')}
            onTouchEnd={handleButtonEnd('jump')}
          >
            JUMP
          </button>
        </div>
        
        {/* Bottom row - Cast and Switch */}
        <div className="flex gap-2 justify-end">
          <button
            className="w-12 h-12 rounded-full bg-purple-600/70 border-2 border-purple-400/50 flex items-center justify-center text-white text-xs font-bold active:bg-purple-500/90"
            onTouchStart={handleButtonStart('switch')}
            onTouchEnd={handleButtonEnd('switch')}
          >
            Q
          </button>
          <button
            className="w-16 h-16 rounded-full bg-purple-600/70 border-2 border-purple-400/50 flex items-center justify-center text-white text-sm font-bold active:bg-purple-500/90"
            onTouchStart={handleButtonStart('cast')}
            onTouchEnd={handleButtonEnd('cast')}
          >
            CAST
          </button>
        </div>
      </div>
    </div>
  );
}