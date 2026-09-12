import { TherapyExercise, Badge } from '../types';

export const INITIAL_EXERCISES: TherapyExercise[] = [
  // 1. Breathing Exercises
  {
    id: 'breath-1',
    title: 'Diaphragmatic Breath Anchor',
    description: 'Learn belly breathing to stabilize airflow, reduce vocal cord tension, and ground the nervous system before speaking.',
    category: 'breathing',
    difficulty: 'beginner',
    durationMinutes: 5,
    instructions: [
      'Sit upright with your shoulders relaxed and feet flat on the floor.',
      'Place one hand on your chest and the other hand over your abdomen.',
      'Inhale deeply through your nose for 4 seconds, feeling your stomach expand while your chest remains quiet.',
      'Hold the air gently for 2 seconds without locking your throat.',
      'Release smoothly through slightly parted lips for 6 seconds as if blowing a gentle candle.',
      'Repeat for 6 gentle cycles before initiating any sound.'
    ],
    tips: [
      'Avoid raising your shoulders during the inhale.',
      'Keep your throat completely relaxed and soft.',
      'Let the exhale be silent and effortless.'
    ]
  },
  {
    id: 'breath-2',
    title: '4-7-8 Relaxation Cycle',
    description: 'A calming parasympathetic breathing technique designed to dissipate pre-speech adrenaline and speaking block panic.',
    category: 'breathing',
    difficulty: 'intermediate',
    durationMinutes: 6,
    instructions: [
      'Empty your lungs completely through your mouth with a soft whoosh sound.',
      'Close your mouth and inhale quietly through your nose to a count of 4.',
      'Hold your breath for a serene count of 7.',
      'Exhale completely through your mouth for a count of 8.',
      'Perform 4 consecutive repetitions.'
    ],
    tips: [
      'The hold should never feel stressful; adjust the pace if needed.',
      'Focus on the cooling sensation of air entering your nostrils.'
    ]
  },
  {
    id: 'breath-3',
    title: 'Easy Exhale & Soft Phonation',
    description: 'Bridge airflow and gentle vocalization to eliminate hard vocal tract blockages.',
    category: 'breathing',
    difficulty: 'beginner',
    durationMinutes: 5,
    instructions: [
      'Take a comfortable abdominal inhale.',
      'Start exhaling gently, and halfway through the exhale, ease into a soft /h-h-h/ sound.',
      'Transition softly from /h/ into an open /aah/ vowel.',
      'Feel the vocal cords vibration start like a gentle whisper.'
    ],
    tips: [
      'Think of sliding into sound rather than hitting it with force.',
      'Use zero neck or jaw tension.'
    ]
  },

  // 2. Slow Speaking Practice
  {
    id: 'slow-1',
    title: 'Turtle Pacing (90-100 WPM)',
    description: 'Deliberately stretch your syllables and double vowel lengths to give your brain and articulators ample coordination time.',
    category: 'slow_speaking',
    difficulty: 'beginner',
    durationMinutes: 7,
    targetPaceWpm: 95,
    passageText: 'Today is a calm and peaceful morning. I am taking my time with every single word. There is no rush, and I have all the space I need to express my thoughts.',
    instructions: [
      'Set your intention to speak at roughly half your habitual speed.',
      'Prolong the initial vowel of each major word by one second.',
      'Pause naturally at punctuation and natural phrase boundaries.',
      'Notice that slowing down increases physical ease and control.'
    ],
    tips: [
      'Do not worry if it sounds exaggerated at first; exaggeration builds neurological muscle memory.',
      'Keep your tongue and lips light.'
    ]
  },
  {
    id: 'slow-2',
    title: 'Rhythmic Phrase Pacing',
    description: 'Chunk complex sentences into small 3 to 4 word thought groups separated by relaxing micro-pauses.',
    category: 'slow_speaking',
    difficulty: 'intermediate',
    durationMinutes: 8,
    targetPaceWpm: 110,
    passageText: 'When we divide our ideas / into manageable segments / our breathing remains steady / and speaking becomes a smooth flowing river.',
    instructions: [
      'Look ahead at the slash marks indicating natural pause breaks.',
      'Take a mini-inhalation or silent pause at each slash.',
      'Deliver each 3-word phrase with a gentle, unified wave.'
    ],
    tips: [
      'Never run out of air at the end of a phrase; pause and top up effortlessly.'
    ]
  },

  // 3. Reading Practice
  {
    id: 'read-1',
    title: 'The Rainbow Passage (Part 1)',
    description: 'The standard phonetically balanced passage used in speech therapy to evaluate and practice all consonant and vowel transitions.',
    category: 'reading',
    difficulty: 'beginner',
    durationMinutes: 8,
    targetPaceWpm: 120,
    passageText: 'When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow. The rainbow is a division of white light into many beautiful colors. These take the shape of a long round arch, with its path high above, and its two ends apparently beyond the horizon.',
    instructions: [
      'Read the passage aloud into the microphone.',
      'Focus on continuous phonation across word boundaries.',
      'Use light touches for consonants like /p/, /b/, /t/, and /k/.'
    ],
    tips: [
      'If you anticipate a stutter, softly prolong the preceding sound rather than forcing through.'
    ]
  },
  {
    id: 'read-2',
    title: 'Arthur the Rat (Fluency Classic)',
    description: 'A classic descriptive narrative passage ideal for developing natural inflection, pitch variation, and rhythmic confidence.',
    category: 'reading',
    difficulty: 'intermediate',
    durationMinutes: 10,
    targetPaceWpm: 125,
    passageText: 'Once there was a young rat named Arthur, who could never make up his mind. Whenever his friends asked him if he would like to go out with them, he would only answer, "I do not know." He would neither say yes nor no.',
    instructions: [
      'Read with expressive cadence and calm pacing.',
      'Maintain an open posture and steady eye contact with the screen.',
      'Celebrate any instances where you smoothly navigated a tricky word.'
    ],
    tips: [
      'Speech rate is less important than ease of articulation.'
    ]
  },
  {
    id: 'read-3',
    title: 'Reflections on Courage & Expression',
    description: 'A modern motivational text emphasizing that what you say is infinitely more valuable than how smoothly it comes out.',
    category: 'reading',
    difficulty: 'advanced',
    durationMinutes: 8,
    targetPaceWpm: 130,
    passageText: 'True eloquence is not the absence of hesitation; it is the courage to speak your truth with dignity. Every word you share carries your unique spirit, your wisdom, and your perspective. Your voice deserves to be heard.',
    instructions: [
      'Read aloud with conviction.',
      'Notice any tension in your forehead, neck, or chest and consciously soften it.',
      'Embrace pauses as natural tools of dramatic emphasis.'
    ],
    tips: [
      'Pausing looks confident to listeners, even when it feels long to you.'
    ]
  },

  // 4. Difficult Word Practice
  {
    id: 'word-1',
    title: 'Plosives with Light Contact (/p/, /b/, /t/, /d/, /k/, /g/)',
    description: 'Master "light articulatory contact" to prevent the lips or tongue from sealing too tightly on pressure consonants.',
    category: 'difficult_words',
    difficulty: 'intermediate',
    durationMinutes: 7,
    targetWords: ['Paper', 'Bottle', 'Table', 'Doctor', 'Kitchen', 'Garden', 'Problem', 'Business', 'Tomorrow', 'Together'],
    instructions: [
      'Bring your lips or tongue into feather-light touch—do not press hard.',
      'Imagine your lips are as delicate as butterfly wings.',
      'Release the air immediately into the following vowel without building pressure.',
      'Practice each word 3 times slowly, then in a short sentence.'
    ],
    tips: [
      'Say "p-p-paper" mentally with light air cushion, then speak "pppaaaper" smoothly.'
    ]
  },
  {
    id: 'word-2',
    title: 'Consonant Clusters & Blends (/str/, /spl/, /gr/, /pr/)',
    description: 'Smooth navigation through heavy consonant transitions without vocal freezing.',
    category: 'difficult_words',
    difficulty: 'advanced',
    durationMinutes: 8,
    targetWords: ['Street', 'Splendid', 'Great', 'Practice', 'Strategy', 'Structure', 'Clear', 'Flight', 'Progress', 'Confidence'],
    instructions: [
      'Slide slowly from the first consonant into the second without a hard stop.',
      'Keep airflow continuous beneath the consonants.',
      'Elongate the vowel that follows the cluster.'
    ],
    tips: [
      'Think of consonant clusters as a smooth ramp rather than stairs.'
    ]
  },

  // 5. Conversation Practice
  {
    id: 'conv-1',
    title: 'Ordering at a Coffee Shop',
    description: 'Simulate the common real-world situation of placing an order at a busy counter under perceived time pressure.',
    category: 'conversation',
    difficulty: 'beginner',
    durationMinutes: 6,
    promptScenarios: [
      'Barista: "Hi there! What can I get started for you today?"',
      'Your turn: "Good morning. May I please have a medium hot oat milk latte and a blueberry muffin?"',
      'Barista: "Sure thing! And what name can I put on the cup for you?"',
      'Your turn: "My name is [Your Name]. Thank you so much."'
    ],
    instructions: [
      'Before speaking your turn, take one silent abdominal breath.',
      'Remind yourself that the barista is happy to wait.',
      'Practice stating your name with a gentle onset on the first vowel or consonant.'
    ],
    tips: [
      'Saying your own name is often the most anxiety-provoking; allow an easy onset.'
    ]
  },
  {
    id: 'conv-2',
    title: 'Introducing Yourself in a Meeting',
    description: 'Practice your 20-second professional or personal introduction with self-assurance and steady pacing.',
    category: 'conversation',
    difficulty: 'intermediate',
    durationMinutes: 8,
    promptScenarios: [
      'Host: "Let us go around the virtual room and share a quick 1-sentence intro!"',
      'Your turn: "Hello everyone, my name is Alex, and I am excited to collaborate on this project together."'
    ],
    instructions: [
      'Keep your hands open and relax your shoulder blades down.',
      'Begin with an easy "Hello..." letting the breath start slightly before the sound.',
      'Smile softly—it naturally relaxes the jaw muscles.'
    ],
    tips: [
      'A relaxed smile relieves physical tension across the facial mask.'
    ]
  },

  // 6. Confidence Building Exercises
  {
    id: 'conf-1',
    title: 'Voluntary Stuttering (Desensitization)',
    description: 'Intentionally introduce easy, loose repetitions on non-feared words to dismantle the fear of stuttering itself.',
    category: 'confidence',
    difficulty: 'advanced',
    durationMinutes: 6,
    targetWords: ['b-b-book', 't-t-today', 'm-m-morning', 's-s-sunny'],
    instructions: [
      'Choose a neutral word like "today".',
      'Deliberately stutter on purpose: "t-t-today is Wednesday."',
      'Keep the repetition loose, bouncy, and completely free of physical struggle.',
      'Notice that you are in total control of when and how the sound repeats.'
    ],
    tips: [
      'This technique removes the taboo and fear of stuttering, lowering overall subconscious anxiety.'
    ]
  },
  {
    id: 'conf-2',
    title: 'Fluency & Self-Compassion Affirmations',
    description: 'Rewire negative cognitive self-talk into supportive, encouraging neural pathways.',
    category: 'confidence',
    difficulty: 'beginner',
    durationMinutes: 5,
    instructions: [
      'Read each affirmation out loud with quiet conviction:',
      '1. "I have the right to take up time and space when I speak."',
      '2. "My worth as a human being is completely independent of my fluency."',
      '3. "I am patient with my speech system as it builds new habits."',
      '4. "Disfluency is simply a bump in the road, not a roadblock."'
    ],
    tips: [
      'Repeat these every morning to build an emotional shield against speaking anxiety.'
    ]
  },

  // 7. Daily Challenges
  {
    id: 'chall-1',
    title: '3-Minute Gentle Onset Challenge',
    description: 'Complete 180 seconds of continuous easy-onset speech reading without rushing or holding breath.',
    category: 'daily_challenges',
    difficulty: 'intermediate',
    durationMinutes: 4,
    targetPaceWpm: 110,
    passageText: 'Every challenge we face today is an opportunity to cultivate resilience. When I approach words gently, my muscles relax. When I breathe with intention, my voice finds its calm rhythm. I am proud of the effort I put into my practice today.',
    instructions: [
      'Maintain continuous gentle airflow.',
      'If you encounter a tension block, stop, release the breath, reset your shoulders, and begin the word again with a whisper onset.'
    ],
    tips: [
      'Success is measured by ease of recovery, not perfection.'
    ]
  },
  {
    id: 'chall-2',
    title: 'Mindful Phone Call Prep Challenge',
    description: 'Rehearse a telephone greeting and question 3 times using slow speech and diaphragmatic pacing.',
    category: 'daily_challenges',
    difficulty: 'intermediate',
    durationMinutes: 5,
    promptScenarios: [
      '"Hello, I am calling to inquire about clinic appointment hours for tomorrow afternoon."',
      '"Could you please verify the street address for me? Thank you for your patience."'
    ],
    instructions: [
      'Simulate holding a phone to your ear.',
      'Wait 2 seconds after the simulated ring before speaking.',
      'Deliver the sentence with smooth, elongated vowels.'
    ],
    tips: [
      'Do not answer instantly; take a grounding breath first.'
    ]
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    title: 'First Step',
    description: 'Completed your very first speech practice session.',
    iconName: 'Sparkles',
    unlockedAt: '2026-08-28T10:00:00.000Z',
    category: 'sessions'
  },
  {
    id: 'badge-2',
    title: 'Breath Master',
    description: 'Completed 5 diaphragmatic breathing exercises.',
    iconName: 'Wind',
    unlockedAt: '2026-08-30T14:30:00.000Z',
    category: 'breathing'
  },
  {
    id: 'badge-3',
    title: 'Weekly Champion',
    description: 'Maintained an active 5-day practice streak.',
    iconName: 'Flame',
    unlockedAt: '2026-09-02T18:00:00.000Z',
    category: 'streak'
  },
  {
    id: 'badge-4',
    title: 'Fluency Pioneer',
    description: 'Achieved a fluency score above 85% in a reading session.',
    iconName: 'Award',
    unlockedAt: undefined,
    category: 'fluency'
  },
  {
    id: 'badge-5',
    title: 'Fearless Speaker',
    description: 'Completed a conversation scenario practice without skipping.',
    iconName: 'ShieldCheck',
    unlockedAt: undefined,
    category: 'sessions'
  },
  {
    id: 'badge-6',
    title: '7-Day Milestone',
    description: 'Completed the full 7-day personalized practice journey.',
    iconName: 'Trophy',
    unlockedAt: undefined,
    category: 'streak'
  }
];
