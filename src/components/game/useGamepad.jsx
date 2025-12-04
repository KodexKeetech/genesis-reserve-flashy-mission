import { useEffect, useRef, useCallback } from 'react';

export default function useGamepad(onInput) {
  const gamepadIndexRef = useRef(null);
  const prevButtonsRef = useRef({});

  const pollGamepad = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[gamepadIndexRef.current];
    
    if (!gamepad) return;

    const buttons = gamepad.buttons;
    const axes = gamepad.axes;
    const prev = prevButtonsRef.current;

    // Left stick for movement (axes 0 = X, axes 1 = Y)
    const moveX = Math.abs(axes[0]) > 0.15 ? axes[0] : 0; // deadzone
    const moveY = Math.abs(axes[1]) > 0.15 ? axes[1] : 0;

    // Right stick for aiming (axes 2 = X, axes 3 = Y)
    const aimX = Math.abs(axes[2]) > 0.15 ? axes[2] : 0;
    const aimY = Math.abs(axes[3]) > 0.15 ? axes[3] : 0;

    // Xbox 360 button mapping:
    // 0 = A (jump)
    // 1 = B 
    // 2 = X (cast/shoot)
    // 3 = Y (switch spell)
    // 4 = LB (special ability 1 - AOE)
    // 5 = RB (special ability 2 - Reflect)
    // 6 = LT (trigger - dash)
    // 7 = RT (trigger - cast)
    // 8 = Back
    // 9 = Start
    // 10 = Left Stick Press
    // 11 = Right Stick Press
    // 12 = D-pad Up
    // 13 = D-pad Down
    // 14 = D-pad Left
    // 15 = D-pad Right

    const aPressed = buttons[0]?.pressed;
    const xPressed = buttons[2]?.pressed;
    const yPressed = buttons[3]?.pressed;
    const lbPressed = buttons[4]?.pressed;
    const rbPressed = buttons[5]?.pressed;
    const ltValue = buttons[6]?.value || 0;
    const rtValue = buttons[7]?.value || 0;

    // Detect button press (not held)
    const aJustPressed = aPressed && !prev.a;
    const xJustPressed = xPressed && !prev.x;
    const yJustPressed = yPressed && !prev.y;
    const lbJustPressed = lbPressed && !prev.lb;
    const rbJustPressed = rbPressed && !prev.rb;
    const ltJustPressed = ltValue > 0.5 && !(prev.lt > 0.5);
    const rtJustPressed = rtValue > 0.5 && !(prev.rt > 0.5);

    // Send input to game
    onInput({
      move: { x: moveX, y: moveY },
      aim: { x: aimX, y: aimY },
      jump: aJustPressed,
      dash: ltJustPressed,
      cast: rtValue > 0.5 || xPressed,
      switch: yJustPressed,
      aoeBlast: lbJustPressed,
      reflectShield: rbJustPressed,
      hover: buttons[3]?.pressed && buttons[0]?.pressed // Y + A for hover
    });

    // Store previous button states
    prevButtonsRef.current = {
      a: aPressed,
      x: xPressed,
      y: yPressed,
      lb: lbPressed,
      rb: rbPressed,
      lt: ltValue,
      rt: rtValue
    };
  }, [onInput]);

  useEffect(() => {
    const handleGamepadConnected = (e) => {
      console.log('Gamepad connected:', e.gamepad.id);
      gamepadIndexRef.current = e.gamepad.index;
    };

    const handleGamepadDisconnected = (e) => {
      console.log('Gamepad disconnected:', e.gamepad.id);
      if (gamepadIndexRef.current === e.gamepad.index) {
        gamepadIndexRef.current = null;
      }
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    // Poll gamepad at 60fps - always poll to detect new gamepads
    let animationId;
    const poll = () => {
      // Check for gamepads each frame (needed for some browsers)
      const gamepads = navigator.getGamepads();
      if (gamepadIndexRef.current === null) {
        for (let i = 0; i < gamepads.length; i++) {
          if (gamepads[i]) {
            console.log('Gamepad detected:', gamepads[i].id);
            gamepadIndexRef.current = i;
            break;
          }
        }
      }
      
      if (gamepadIndexRef.current !== null) {
        pollGamepad();
      }
      animationId = requestAnimationFrame(poll);
    };
    poll();

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
      cancelAnimationFrame(animationId);
    };
  }, [pollGamepad]);

  return gamepadIndexRef.current !== null;
}