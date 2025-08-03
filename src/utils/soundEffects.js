// Sound effects using Web Audio API
class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.enabled = false;
    }
  }

  // Create a simple tone
  createTone(frequency, duration, type = 'sine') {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Card draw sound
  cardDraw() {
    this.createTone(440, 0.1, 'square');
    setTimeout(() => this.createTone(550, 0.1, 'square'), 100);
  }

  // Success sound
  success() {
    this.createTone(523, 0.2, 'sine'); // C
    setTimeout(() => this.createTone(659, 0.2, 'sine'), 200); // E
    setTimeout(() => this.createTone(784, 0.3, 'sine'), 400); // G
  }

  // Failure sound
  failure() {
    this.createTone(220, 0.5, 'sawtooth');
    setTimeout(() => this.createTone(196, 0.5, 'sawtooth'), 250);
  }

  // Wildcard sound
  wildcard() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createTone(Math.random() * 800 + 200, 0.1, 'square');
      }, i * 50);
    }
  }

  // Shame hat sound
  shameHat() {
    this.createTone(150, 1, 'sawtooth');
  }

  // Victory fanfare
  victory() {
    const notes = [523, 659, 784, 1047]; // C, E, G, C
    notes.forEach((note, index) => {
      setTimeout(() => this.createTone(note, 0.5, 'sine'), index * 200);
    });
  }

  // Horror unlock sound
  horrorUnlock() {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        this.createTone(Math.random() * 200 + 100, 0.2, 'sawtooth');
      }, i * 100);
    }
  }

  // Phase advance sound
  phaseAdvance() {
    this.createTone(392, 0.3, 'sine'); // G
    setTimeout(() => this.createTone(523, 0.3, 'sine'), 300); // C
    setTimeout(() => this.createTone(659, 0.5, 'sine'), 600); // E
  }

  // Timer warning sound
  timerWarning() {
    this.createTone(800, 0.1, 'square');
    setTimeout(() => this.createTone(800, 0.1, 'square'), 200);
  }

  // Enable/disable sounds
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

// Create singleton instance
export const soundEffects = new SoundEffects();

// Dennis quotes for random Easter eggs
export const EASTER_EGG_QUOTES = [
  "I am a five-star man!",
  "I'm not getting got. I'm going to get.",
  "I'm a legend. A legend, man!",
  "The implication...",
  "I'm the best. I'm the best, and I'm gonna prove it.",
  "This is about the thrill of wearing another man's skin.",
  "I like to bind, I like to be bound!",
  "I'm not fat, I'm cultivating mass!",
  "Wildcard, bitches!",
  "Can I offer you an egg in this trying time?",
  "Because of the implication.",
  "I'm a five-star man! A five-star man!",
  "You haven't thought of the smell, you bitch!",
  "I am untethered and my rage knows no bounds!",
  "Begone, vile man! Begone from me!",
  "I'm not allowed to eat it with the skin, Dee!",
  "Charlie, there is no Pepe Silvia!",
  "Day man! Fighter of the night man!",
  "Rum ham! I'm sorry, rum ham!",
  "The gang gets psychological."
];

// Random quote generator
export const getRandomQuote = () => {
  return EASTER_EGG_QUOTES[Math.floor(Math.random() * EASTER_EGG_QUOTES.length)];
};

// Konami code Easter egg
export class KonamiCode {
  constructor(callback) {
    this.sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    this.userInput = [];
    this.callback = callback;
    this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => {
      this.userInput.push(e.code);
      
      if (this.userInput.length > this.sequence.length) {
        this.userInput.shift();
      }
      
      if (this.userInput.length === this.sequence.length) {
        if (this.userInput.every((key, index) => key === this.sequence[index])) {
          this.callback();
          this.userInput = [];
        }
      }
    });
  }
}

// Achievement system
export class AchievementSystem {
  constructor() {
    this.achievements = new Set();
    this.callbacks = [];
  }

  unlock(achievementName) {
    if (!this.achievements.has(achievementName)) {
      this.achievements.add(achievementName);
      this.callbacks.forEach(callback => callback(achievementName));
      soundEffects.success();
      return true;
    }
    return false;
  }

  onAchievement(callback) {
    this.callbacks.push(callback);
  }

  getUnlocked() {
    return Array.from(this.achievements);
  }
}

export const achievements = new AchievementSystem();
