export type PracticeCategory = 'all' | 'technique' | 'paragraph' | 'tongue_twister' | 'conversation';

export interface PracticeExerciseItem {
  id: string;
  title: string;
  technique: string;
  category: 'technique' | 'paragraph' | 'tongue_twister' | 'conversation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  wpm: number;
  description: string;
  sample: string;
  phoneticFocus?: string;
  wordCount?: number;
}

export const PRACTICE_CATEGORIES: { id: PracticeCategory; label: string; iconName: string; count?: number }[] = [
  { id: 'all', label: 'All Exercises', iconName: 'Layers' },
  { id: 'technique', label: 'Speech Techniques', iconName: 'Sparkles' },
  { id: 'paragraph', label: 'Paragraphs & Passages', iconName: 'BookOpen' },
  { id: 'tongue_twister', label: 'Tongue Twisters', iconName: 'Zap' },
  { id: 'conversation', label: 'Daily Conversations', iconName: 'MessageSquare' }
];

export const PRACTICE_SPEECHES: PracticeExerciseItem[] = [
  // ==================== 1. CLINICAL SPEECH TECHNIQUES ====================
  {
    id: 'tech-1',
    title: 'Gentle Consonant Onset (Easy Starts)',
    technique: 'Phonation Mechanics',
    category: 'technique',
    difficulty: 'beginner',
    wpm: 120,
    phoneticFocus: 'Plosives /p/, /b/, /t/, /d/',
    description: 'Begin vocal cord vibration with a gentle sigh of air before shaping the initial consonant.',
    sample: 'Peter opened the blue umbrella before the sudden rain began.'
  },
  {
    id: 'tech-2',
    title: 'Continuous Phonation (Flow Technique)',
    technique: 'Acoustic Continuity',
    category: 'technique',
    difficulty: 'intermediate',
    wpm: 135,
    phoneticFocus: 'Voiced linkage across boundaries',
    description: 'Keep your vocal cords vibrating gently throughout the entire sentence, connecting word boundaries without stopping.',
    sample: 'Every morning brings a quiet calm that slowly warms the valley.'
  },
  {
    id: 'tech-3',
    title: 'Light Articulatory Contact',
    technique: 'Tension Reduction',
    category: 'technique',
    difficulty: 'beginner',
    wpm: 130,
    phoneticFocus: 'Bilabial & alveolar feather touch',
    description: 'Make feather-light contact between your tongue, palate, and lips when producing plosives (/p/, /b/, /t/, /d/).',
    sample: 'The bakery delivers fresh bread and sweet pastries down town.'
  },
  {
    id: 'tech-4',
    title: 'Pausing & Phrasing Strategy',
    technique: 'Breath Recovery & Cadence',
    category: 'technique',
    difficulty: 'intermediate',
    wpm: 110,
    phoneticFocus: 'Chunking & micro-pauses',
    description: 'Divide thoughts into 3 to 4 word units, inhaling gently through your nose at natural breaks.',
    sample: 'When we divide our ideas into small segments, our breathing stays calm and speech flows with ease.'
  },
  {
    id: 'tech-5',
    title: 'Prolonged Vowel Gliding',
    technique: 'Syllable Stretching',
    category: 'technique',
    difficulty: 'beginner',
    wpm: 105,
    phoneticFocus: 'Open vowel lengthening',
    description: 'Extend the initial vowel sound for one extra second to remove vocal fold constrictions.',
    sample: 'All open ocean waters reflect the golden rays of the setting afternoon sun.'
  },
  {
    id: 'tech-6',
    title: 'Diaphragmatic Breath Anchor',
    technique: 'Respiratory Support',
    category: 'technique',
    difficulty: 'beginner',
    wpm: 115,
    phoneticFocus: 'Abdominal air support',
    description: 'Inhale smoothly from your abdomen without lifting your shoulders, releasing sound on the exhale wave.',
    sample: 'Take a deep breath from your belly and release steady airflow with every syllable.'
  },

  // ==================== 2. PARAGRAPHS & EXTENDED PASSAGES ====================
  {
    id: 'para-1',
    title: 'The Rainbow Passage (Clinical Standard)',
    technique: 'Sustained Oral Reading',
    category: 'paragraph',
    difficulty: 'intermediate',
    wpm: 125,
    phoneticFocus: 'Broad phonetic distribution',
    description: 'The gold standard reading passage used by Speech-Language Pathologists worldwide to evaluate connected speech.',
    sample: 'When the sunlight strikes raindrops in the air, they act like a prism and form a rainbow. The rainbow is a division of white light into many beautiful colors. These take the shape of a long round arch, with its path high above, and its two ends apparently beyond the horizon. People look with wonder at the vibrant spectacle overhead.'
  },
  {
    id: 'para-2',
    title: 'The Grandfather Passage (ASHA Standard)',
    technique: 'Connected Articulation',
    category: 'paragraph',
    difficulty: 'intermediate',
    wpm: 120,
    phoneticFocus: 'Rhythm & multi-syllabic pacing',
    description: 'A classic clinical evaluation passage designed to measure reading cadence, pausing, and consonant clarity across multiple sentences.',
    sample: 'You wish to know all about my grandfather. Well, he is nearly ninety-three years old, yet he dresses himself in an ancient black coat with several shiny buttons. A long, flowing beard clings to his chin, giving those who observe him a pronounced feeling of the utmost respect and admiration.'
  },
  {
    id: 'para-3',
    title: 'Mindful River Walk (Story Passage)',
    technique: 'Narrative Pacing & Imagery',
    category: 'paragraph',
    difficulty: 'intermediate',
    wpm: 115,
    phoneticFocus: 'Relaxed jaw & prosodic variation',
    description: 'Practice descriptive storytelling while maintaining abdominal breathing and relaxed shoulder muscles.',
    sample: 'Taking a quiet morning walk clears the fog from your mind and relaxes your shoulder muscles. The cool crisp breeze rustles through the golden leaves along the peaceful river path. Wild birds sing melodious tunes from the tree tops, inviting you to inhale deeply and greet the new day with patience.'
  },
  {
    id: 'para-4',
    title: 'The Journey to Confident Speaking',
    technique: 'Mindful Speech & Acceptance',
    category: 'paragraph',
    difficulty: 'beginner',
    wpm: 110,
    phoneticFocus: 'Calm rhythm & steady airflow',
    description: 'A therapeutic reflection reminding speakers that true fluency is grounded in physical ease and self-patience.',
    sample: 'Mastering fluency is not about speaking without any pauses; it is about feeling calm in your chest, trusting your breath, and moving forward with confidence. Each step you take trains your vocal tract to release tension and embrace your unique voice. There is never any need to rush your thoughts.'
  },
  {
    id: 'para-5',
    title: 'Gazing at the Starlit Sky',
    technique: 'Expressive Prosody & Pausing',
    category: 'paragraph',
    difficulty: 'advanced',
    wpm: 120,
    phoneticFocus: 'Pitch inflection & breath resets',
    description: 'Practice wide pitch variation and rhythmic pauses while describing constellations and galaxies.',
    sample: 'On a clear starry night, countless distant suns sparkle across the dark velvet sky. Looking up through a telescope reveals ancient rings around distant planets and glowing nebulae millions of miles away. It reminds us how vast our universe truly is and how precious each quiet moment can be.'
  },

  // ==================== 3. TONGUE TWISTERS ====================
  {
    id: 'twister-1',
    title: 'Peter Piper (Plosive /p/ Drill)',
    technique: 'Articulatory Agility',
    category: 'tongue_twister',
    difficulty: 'intermediate',
    wpm: 130,
    phoneticFocus: 'Bilabial plosive /p/',
    description: 'Strengthens light articulatory contact on rapid bilabial plosives (/p/) without pressing lips tightly.',
    sample: 'Peter Piper picked a peck of pickled peppers. If Peter Piper picked a peck of pickled peppers, where is the peck of pickled peppers Peter Piper picked?'
  },
  {
    id: 'twister-2',
    title: 'She Sells Seashells (Sibilant /s/ & /ʃ/)',
    technique: 'Fricative Precision',
    category: 'tongue_twister',
    difficulty: 'intermediate',
    wpm: 125,
    phoneticFocus: 'Sibilants /s/ and /ʃ/ distinction',
    description: 'Practice alternating tongue tip position between alveolar /s/ and postalveolar /ʃ/ without clenching teeth.',
    sample: 'She sells seashells by the seashore, and the shells she sells are seashells, I am sure.'
  },
  {
    id: 'twister-3',
    title: 'Betty Botter (Bilabial /b/ & Tap /t/)',
    technique: 'Tension Release',
    category: 'tongue_twister',
    difficulty: 'advanced',
    wpm: 135,
    phoneticFocus: 'Bilabial /b/ and alveolar /t/',
    description: 'Releases tension in the lips and tongue tip while coordinating rapid vowel transitions.',
    sample: 'Betty Botter bought some butter, but she said the butter is bitter. If I put it in my batter, it will make my batter bitter, but a bit of better butter will make my bitter batter better.'
  },
  {
    id: 'twister-4',
    title: 'Red Lorry, Yellow Lorry (Liquids /l/ & /r/)',
    technique: 'Lingual Coordination',
    category: 'tongue_twister',
    difficulty: 'advanced',
    wpm: 120,
    phoneticFocus: 'Liquid consonants /l/ and /r/',
    description: 'Sharpens tongue elevation and retroflex positioning for smooth transitions between /l/ and /r/.',
    sample: 'Red lorry, yellow lorry, red lorry, yellow lorry, rolling down the winding rural road.'
  },
  {
    id: 'twister-5',
    title: 'Unique New York (Nasal & Velar)',
    technique: 'Palatal Speed',
    category: 'tongue_twister',
    difficulty: 'intermediate',
    wpm: 125,
    phoneticFocus: 'Nasal /n/ and velar /k/',
    description: 'Improves soft palate coordination and rapid nasal airflow regulation without glottal locking.',
    sample: 'You know New York, you need New York, you know you need unique New York.'
  },
  {
    id: 'twister-6',
    title: 'Fuzzy Wuzzy (Fricatives /f/ & /z/)',
    technique: 'Acoustic Friction',
    category: 'tongue_twister',
    difficulty: 'beginner',
    wpm: 130,
    phoneticFocus: 'Voiced & voiceless fricatives',
    description: 'Coordinates continuous vocal fold vibration while modulating lip-teeth fricative air streams.',
    sample: 'Fuzzy Wuzzy was a bear, Fuzzy Wuzzy had no hair, Fuzzy Wuzzy was not very fuzzy, was he?'
  },
  {
    id: 'twister-7',
    title: 'Fresh Fried Flying Fish (Labiodental /f/)',
    technique: 'Light Contact Drill',
    category: 'tongue_twister',
    difficulty: 'intermediate',
    wpm: 125,
    phoneticFocus: 'Labiodental /f/ + liquid /r/',
    description: 'Trains the lower lip to make feather-soft contact with the upper front teeth without biting.',
    sample: 'Fresh French fried flying fish flesh served for five friendly fishermen.'
  },
  {
    id: 'twister-8',
    title: 'Six Thick Thistle Sticks (Dental /θ/)',
    technique: 'Tongue Tip Positioning',
    category: 'tongue_twister',
    difficulty: 'advanced',
    wpm: 115,
    phoneticFocus: 'Voiceless dental fricative /θ/',
    description: 'Teaches light tongue protrusion for /θ/ without locking the tongue between the front teeth.',
    sample: 'Six sleek swans swam swiftly southwards while six thick thistle sticks stood still.'
  },

  // ==================== 4. EVERYDAY CONVERSATIONS ====================
  {
    id: 'conv-1',
    title: 'Ordering at a Coffee Shop',
    technique: 'Everyday Interaction',
    category: 'conversation',
    difficulty: 'beginner',
    wpm: 125,
    phoneticFocus: 'Social ease & polite phrasing',
    description: 'Practice natural, relaxed speaking in a routine social setting where time pressure often triggers blocks.',
    sample: 'Good morning! Could I please order a warm vanilla latte with oat milk and a toasted blueberry muffin to go, please?'
  },
  {
    id: 'conv-2',
    title: 'Workplace Meeting Introduction',
    technique: 'Professional Fluency',
    category: 'conversation',
    difficulty: 'intermediate',
    wpm: 120,
    phoneticFocus: 'Assertive pacing & eye contact',
    description: 'Master steady breathing and confident pausing during professional workplace introductions.',
    sample: 'Hello everyone, my name is Morgan. Today I am delighted to share our team progress, key project highlights, and future milestones with you all.'
  },
  {
    id: 'conv-3',
    title: 'Calling for an Appointment',
    technique: 'Phone Call Confidence',
    category: 'conversation',
    difficulty: 'intermediate',
    wpm: 115,
    phoneticFocus: 'Numeric & calendar articulation',
    description: 'Practice speaking clearly without rushing when communicating important times, dates, and details on a call.',
    sample: 'Hello, I am calling to schedule a routine dental checkup for next Tuesday afternoon around three oclock if you have an appointment available.'
  },
  {
    id: 'conv-4',
    title: 'Asking for Public Directions',
    technique: 'Social Inquiries',
    category: 'conversation',
    difficulty: 'beginner',
    wpm: 120,
    phoneticFocus: 'Spontaneous conversation',
    description: 'Overcome conversational hesitation when initiating dialogue with people in public places.',
    sample: 'Excuse me, could you please tell me the quickest way to get to the central train station and the public botanical garden from here?'
  },
  {
    id: 'conv-5',
    title: 'Returning an Item at a Store',
    technique: 'Assertive Service Dialogue',
    category: 'conversation',
    difficulty: 'intermediate',
    wpm: 120,
    phoneticFocus: 'Confident requests & explanations',
    description: 'Maintain steady cadence and easy onsets when explaining a request at a checkout counter.',
    sample: 'Hello! I would like to return this jacket that I bought last weekend. Here is my receipt and the original packaging. Could I exchange it for a medium size?'
  }
];

// Enrich with word count
PRACTICE_SPEECHES.forEach((item) => {
  if (!item.wordCount) {
    item.wordCount = item.sample.split(/\s+/).filter(Boolean).length;
  }
});
