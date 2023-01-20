import { delay } from './delay';

export class SimonButton {
  constructor(el) {
    this.el = el;
    this.sound = new Audio(`/${el.id}.mp3`);
  }

  async press(delayMs = 500, playSound = true) {
    this.el.classList.remove('light-on');
    if (playSound) {
      this.sound.play();
    }
    await delay(delayMs);
    this.el.classList.add('light-on');
    await delay(100);
  }
}
