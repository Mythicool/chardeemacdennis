export const GAME_RULES = {
  phases: {
    1: {
      name: "MIND",
      description: "Your intellect is weak, like your grip strength.",
      winCondition: 3,
      color: "#8B0000"
    },
    2: {
      name: "BODY", 
      description: "There will be blood, and that's fine.",
      winCondition: 3,
      color: "#FF4500"
    },
    3: {
      name: "SPIRIT",
      description: "Now we break each other emotionally.",
      winCondition: 3,
      color: "#4B0082"
    },
    4: {
      name: "HORROR",
      description: "Unlocked when everyone is emotionally unstable.",
      winCondition: 2,
      color: "#000000"
    }
  },

  basicRules: [
    "All rules are binding, unless overturned by The Gavel of Judgment™",
    "Only winners may read the next phase's rules",
    "Always be drinking unless you're bleeding, crying, or wearing the Shame Hat",
    "Cheating is encouraged, but only if you don't get caught",
    "If caught cheating, claim 'Wildcard Status' and confuse your accusers"
  ],

  drinkingRules: [
    "Incorrect answer? Drink.",
    "Laugh during opponent's turn? Drink.",
    "Ask 'Is that allowed?' Drink and wear the Shame Hat.",
    "Skip a card? 2 drinks + one emotional insult from opposing team"
  ],

  victoryConditions: [
    "Complete all 3 phases (or 4 if Horror is unlocked)",
    "Opposing team cannot continue due to injury, intoxication, or pride",
    "Give a Triumphant Acceptance Speech (must include false humility)",
    "Pass the final Judgment card"
  ],

  shameHatRules: [
    "Worn for asking stupid questions",
    "Worn for failing spectacularly", 
    "Worn for being voted 'most toxic'",
    "Can be passed to others through certain cards",
    "Wearer cannot drink (making challenges harder)"
  ],

  wildcardEffects: {
    "reverse_drinking": "All drinking penalties are reversed for next 3 cards",
    "immunity_physical": "Team immune to physical challenges for 2 cards", 
    "immunity_emotional": "Team immune to emotional damage for 3 cards",
    "nuclear_option": "Everyone reveals most toxic trait, worst one gets Shame Hat",
    "apocalypse_reset": "All progress reset, game begins anew",
    "final_judgment": "Vote-based elimination from victory consideration"
  },

  horrorUnlockConditions: [
    "Everyone is emotionally unstable",
    "The Shame Hat has been set on fire", 
    "At least one person has cried",
    "Someone has stormed off and returned",
    "Friendships are visibly strained"
  ],

  achievements: [
    { name: "First Blood", description: "First person to make someone cry" },
    { name: "Shame Spiral", description: "Wear the Shame Hat 3 times in one game" },
    { name: "Emotional Breakdown", description: "Successfully break someone's spirit" },
    { name: "Survivor", description: "Complete all phases without crying" },
    { name: "Chaos Agent", description: "Draw 3 wildcards in one game" },
    { name: "The Dennis", description: "Win through pure narcissism" },
    { name: "The Charlie", description: "Win despite making no sense" },
    { name: "Friendship Ender", description: "Cause someone to leave the game" }
  ]
};

export const DENNIS_QUOTES = [
  "I am a five-star man!",
  "I'm not getting got. I'm going to get.",
  "I'm a legend. A legend, man!",
  "The implication...",
  "I'm the best. I'm the best, and I'm gonna prove it.",
  "This is about the thrill of wearing another man's skin.",
  "I like to bind, I like to be bound!",
  "I'm not fat, I'm cultivating mass!",
  "Wildcard, bitches!",
  "Can I offer you an egg in this trying time?"
];

export const CARD_CATEGORIES = {
  mind: [
    "Delusions of Godhood",
    "Bird Law", 
    "Kitten Mittens Knowledge",
    "Philadelphia Trivia",
    "The Implication",
    "Charlie Work",
    "Mac's Moves",
    "Dee's Failures",
    "Frank's Schemes",
    "Paddy's Pub"
  ],
  body: [
    "Physical Prowess",
    "Pain Tolerance", 
    "Coordination",
    "Endurance",
    "Balance",
    "Dexterity",
    "Flexibility",
    "Speed",
    "Strength",
    "Gross Motor Skills"
  ],
  spirit: [
    "Emotional Warfare",
    "Moral Superiority",
    "Soul Crushing", 
    "Betrayal",
    "Psychological Manipulation",
    "Shame Spiral",
    "Existential Dread",
    "Relationship Destruction",
    "Identity Crisis",
    "Social Destruction"
  ],
  horror: [
    "Existential Terror",
    "Social Annihilation",
    "Egg-Based Ritual",
    "Digital Humiliation", 
    "Psychological Torture",
    "Physical Degradation",
    "Relationship Apocalypse",
    "Identity Destruction"
  ]
};
