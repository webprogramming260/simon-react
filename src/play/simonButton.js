import React from 'react';
import { delay } from './delay';

export const SimonButton = React.forwardRef(({ position, onPressed }, ref) => {
  const [lightOn, setLightOn] = React.useState(true);
  const sound = new Audio(`/${position}.mp3`);

  // We use React refs so the game can drive button press events
  React.useImperativeHandle(ref, () => ({
    async press(delayMs = 500, playSound = true) {
      setLightOn(false);
      if (playSound) {
        sound.play();
      }
      await delay(delayMs);
      setLightOn(true);
      await delay(100);
    },
  }));

  return (
    <button
      id={position}
      className={`game-button ${position} ${lightOn ? 'light-on' : ''}`}
      onClick={() => onPressed(position)}
    ></button>
  );
});
