import React, { useEffect, useState } from 'react';
import { KonamiCode, getRandomQuote, soundEffects, achievements } from '../utils/soundEffects';

function EasterEggs() {
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    // Konami code Easter egg
    new KonamiCode(() => {
      setKonamiActivated(true);
      soundEffects.victory();
      achievements.unlock('Konami Master');
      setTimeout(() => setKonamiActivated(false), 5000);
    });

    // Random quote timer
    const quoteInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        showRandomQuote();
      }
    }, 30000);

    // Achievement listener
    achievements.onAchievement((achievement) => {
      console.log(`🏆 Achievement Unlocked: ${achievement}`);
    });

    return () => clearInterval(quoteInterval);
  }, []);

  const showRandomQuote = () => {
    setCurrentQuote(getRandomQuote());
    setShowQuote(true);
    setTimeout(() => setShowQuote(false), 3000);
  };

  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickCount === 4) { // 5 clicks total
      showRandomQuote();
      achievements.unlock('Logo Clicker');
      setClickCount(0);
    }
  };

  // Secret developer mode (triple-click anywhere)
  const handleTripleClick = (e) => {
    if (e.detail === 3) {
      console.log('🔥 DEVELOPER MODE ACTIVATED 🔥');
      console.log('Available commands:');
      console.log('- window.chardeeMacDennis.unlockAllAchievements()');
      console.log('- window.chardeeMacDennis.playSound(type)');
      console.log('- window.chardeeMacDennis.showQuote()');
      console.log('- window.chardeeMacDennis.konamiCode()');
      
      // Expose developer functions
      window.chardeeMacDennis = {
        unlockAllAchievements: () => {
          const allAchievements = [
            'First Blood', 'Shame Spiral', 'Emotional Breakdown', 
            'Survivor', 'Chaos Agent', 'The Dennis', 'The Charlie',
            'Friendship Ender', 'Konami Master', 'Logo Clicker',
            'Developer Mode', 'Sound Master'
          ];
          allAchievements.forEach(achievement => achievements.unlock(achievement));
        },
        playSound: (type) => {
          if (soundEffects[type]) {
            soundEffects[type]();
          } else {
            console.log('Available sounds:', Object.getOwnPropertyNames(soundEffects).filter(prop => typeof soundEffects[prop] === 'function'));
          }
        },
        showQuote: showRandomQuote,
        konamiCode: () => {
          setKonamiActivated(true);
          setTimeout(() => setKonamiActivated(false), 5000);
        }
      };
      
      achievements.unlock('Developer Mode');
    }
  };

  return (
    <>
      {/* Konami Code Activation */}
      {konamiActivated && (
        <div className="konami-easter-egg">
          <div className="konami-content">
            <h1>🎮 KONAMI CODE ACTIVATED! 🎮</h1>
            <p>You have unlocked the secret developer powers!</p>
            <p>Check the console for available commands.</p>
            <div className="konami-animation">
              🃏✨🔥✨🃏
            </div>
          </div>
        </div>
      )}

      {/* Random Quote Display */}
      {showQuote && (
        <div className="quote-easter-egg">
          <div className="quote-content">
            <p>"{currentQuote}"</p>
            <span>— The Gang</span>
          </div>
        </div>
      )}

      {/* Hidden clickable logo */}
      <div 
        className="hidden-logo-clicker"
        onClick={handleLogoClick}
        onClickCapture={handleTripleClick}
        title="🤫"
      />

      {/* CSS for Easter eggs */}
      <style jsx>{`
        .konami-easter-egg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: konamiAppear 0.5s ease;
        }

        .konami-content {
          background: linear-gradient(145deg, #8B0000, #FF4500);
          border: 5px solid #FFD700;
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
          color: white;
          max-width: 500px;
          animation: konamiPulse 1s ease-in-out infinite alternate;
        }

        .konami-content h1 {
          font-family: 'Creepster', cursive;
          font-size: 2rem;
          margin-bottom: 1rem;
          text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
        }

        .konami-animation {
          font-size: 2rem;
          margin-top: 1rem;
          animation: konamiSpin 2s linear infinite;
        }

        .quote-easter-egg {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(145deg, rgba(139, 0, 0, 0.9), rgba(0, 0, 0, 0.9));
          border: 2px solid #FFD700;
          border-radius: 12px;
          padding: 1rem;
          max-width: 300px;
          z-index: 1000;
          animation: quoteSlideIn 0.5s ease;
        }

        .quote-content {
          color: white;
          text-align: center;
        }

        .quote-content p {
          font-style: italic;
          margin-bottom: 0.5rem;
          color: #FFD700;
        }

        .quote-content span {
          font-size: 0.8rem;
          color: #FF4500;
        }

        .hidden-logo-clicker {
          position: fixed;
          top: 10px;
          left: 10px;
          width: 50px;
          height: 50px;
          opacity: 0;
          cursor: pointer;
          z-index: 100;
        }

        @keyframes konamiAppear {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes konamiPulse {
          from { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
          to { box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
        }

        @keyframes konamiSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes quoteSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default EasterEggs;
