export interface MultilingualSpeechItem {
  id: string;
  langCode: string;
  langLabel: string;
  flag: string;
  title: string;
  category: 'paragraph' | 'tongue_twister' | 'technique' | 'conversation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  technique: string;
  wpm: number;
  phoneticFocus: string;
  description: string;
  sample: string;
  wordCount: number;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English (US)', flag: '🇺🇸', shortCode: 'en' },
  { code: 'es-ES', label: 'Español (Spanish)', flag: '🇪🇸', shortCode: 'es' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)', flag: '🇮🇳', shortCode: 'hi' },
  { code: 'fr-FR', label: 'Français (French)', flag: '🇫🇷', shortCode: 'fr' },
  { code: 'de-DE', label: 'Deutsch (German)', flag: '🇩🇪', shortCode: 'de' },
  { code: 'zh-CN', label: '中文 (Mandarin)', flag: '🇨🇳', shortCode: 'zh' }
];

export const MULTILINGUAL_SPEECHES: MultilingualSpeechItem[] = [
  // SPANISH (Español)
  {
    id: 'es-rainbow',
    langCode: 'es-ES',
    langLabel: 'Español',
    flag: '🇪🇸',
    title: 'El Pasaje del Arcoíris (Lectura Clínica)',
    category: 'paragraph',
    difficulty: 'intermediate',
    technique: 'Continuous Phonation',
    wpm: 120,
    phoneticFocus: 'Transiciones vocálicas suaves y flujo espiratorio',
    description: 'Pasaje clínico estándar para evaluar la fluidez y el control respiratorio en español.',
    sample: 'Cuando la luz del sol atraviesa las gotas de lluvia en el aire, actúan como un prisma y forman un hermoso arcoíris. El arcoíris es una división de la luz blanca en muchos colores hermosos.',
    wordCount: 36
  },
  {
    id: 'es-tigres',
    langCode: 'es-ES',
    langLabel: 'Español',
    flag: '🇪🇸',
    title: 'Tres Tristes Tigres (Trabalenguas /t/ y /r/)',
    category: 'tongue_twister',
    difficulty: 'intermediate',
    technique: 'Light Articulatory Contact',
    wpm: 105,
    phoneticFocus: 'Oclusivas alveolares /t/ y vibrantes /r/',
    description: 'Trabalenguas para reducir la fuerza de contacto en la punta de la lengua.',
    sample: 'Tres tristes tigres tragaban trigo en un trigal. En tres tristes trastos, tragaban trigo tres tristes tigres.',
    wordCount: 18
  },
  {
    id: 'es-pedro',
    langCode: 'es-ES',
    langLabel: 'Español',
    flag: '🇪🇸',
    title: 'Pedro Pérez Pintor (Oclusivas Bilabiales /p/)',
    category: 'tongue_twister',
    difficulty: 'intermediate',
    technique: 'Gentle Onset (Easy Starts)',
    wpm: 100,
    phoneticFocus: 'Oclusiva sorda bilabial /p/ con inicio suave',
    description: 'Disminuye la tensión labial en la articulación de la letra P.',
    sample: 'Pedro Pérez pintor perfecto pinta preciosos paisajes para personas pacientes con pinceles primorosos.',
    wordCount: 13
  },

  // HINDI (हिन्दी)
  {
    id: 'hi-rainbow',
    langCode: 'hi-IN',
    langLabel: 'हिन्दी',
    flag: '🇮🇳',
    title: 'इंद्रधनुष की सुंदरता (नैदानिक वाचन)',
    category: 'paragraph',
    difficulty: 'intermediate',
    technique: 'Continuous Phonation',
    wpm: 110,
    phoneticFocus: 'सहज श्वास प्रवाह और निरंतर ध्वनि',
    description: 'हिन्दी में श्वास गति और निरंतर वाक् प्रवाह का अभ्यास।',
    sample: 'जब सूरज की सुनहरी किरणें बारिश की बूंदों से टकराती हैं, तो आकाश में सुंदर सात रंगों का इंद्रधनुष बनता है। शांत मन से बोलने पर शब्द सहजता से बहते हैं।',
    wordCount: 29
  },
  {
    id: 'hi-chandu',
    langCode: 'hi-IN',
    langLabel: 'हिन्दी',
    flag: '🇮🇳',
    title: 'चंदू के चाचा (स्पर्श तालव्य /च/ ध्वनि)',
    category: 'tongue_twister',
    difficulty: 'intermediate',
    technique: 'Light Articulatory Contact',
    wpm: 100,
    phoneticFocus: 'तालव्य /च/ पर हल्का संपर्क',
    description: 'तालू पर जीभ का अत्यधिक दबाव रोके बिना बोलने का अभ्यास।',
    sample: 'चंदू के चाचा ने चंदू की चाची को चांदनी चौक में चांदी की चम्मच से चटनी चटाई।',
    wordCount: 16
  },
  {
    id: 'hi-papita',
    langCode: 'hi-IN',
    langLabel: 'हिन्दी',
    flag: '🇮🇳',
    title: 'पके पेड़ पर पका पपीता (ओष्ठ्य /प/ ध्वनि)',
    category: 'tongue_twister',
    difficulty: 'intermediate',
    technique: 'Gentle Onset',
    wpm: 95,
    phoneticFocus: 'ओष्ठ्य स्पर्श /प/ पर कोमल शुरुआत',
    description: 'होंठों को बिना भींचे सहजता से हवा निकालने का अभ्यास।',
    sample: 'पके पेड़ पर पका पपीता, पका पेड़ या पका पपीता, पके पेड़ को पकड़े पिंकू, पिंकू पकड़े पका पपीता।',
    wordCount: 18
  },

  // FRENCH (Français)
  {
    id: 'fr-rainbow',
    langCode: 'fr-FR',
    langLabel: 'Français',
    flag: '🇫🇷',
    title: "Le Passage de l'Arc-en-Ciel (Lecture Clinique)",
    category: 'paragraph',
    difficulty: 'intermediate',
    technique: 'Continuous Phonation',
    wpm: 115,
    phoneticFocus: 'Liaisons fluides et attaques douces',
    description: 'Passage standard en orthophonie pour évaluer le débit et la régularité vocale.',
    sample: "Lorsque la lumière du soleil frappe les gouttes de pluie dans l'air, elles agissent comme un prisme et forment un bel arc-en-ciel aux reflets chatoyants.",
    wordCount: 26
  },
  {
    id: 'fr-chasseur',
    langCode: 'fr-FR',
    langLabel: 'Français',
    flag: '🇫🇷',
    title: 'Un Chasseur Sachant Chasser (Fricatives /ʃ/ et /s/)',
    category: 'tongue_twister',
    difficulty: 'intermediate',
    technique: 'Light Articulatory Contact',
    wpm: 105,
    phoneticFocus: 'Fricatives sifflantes et chuintantes',
    description: 'Exercice de coordination de la pointe de la langue sur les sons sifflants.',
    sample: "Un chasseur sachant chasser doit savoir chasser sans son chien de chasse dans les champs sereins.",
    wordCount: 17
  },

  // GERMAN (Deutsch)
  {
    id: 'de-rainbow',
    langCode: 'de-DE',
    langLabel: 'Deutsch',
    flag: '🇩🇪',
    title: 'Die Regenbogen-Passage (Klinische Leseprobe)',
    category: 'paragraph',
    difficulty: 'intermediate',
    technique: 'Continuous Phonation',
    wpm: 110,
    phoneticFocus: 'Sanfter Stimmeinsatz und Ausatmungskontrolle',
    description: 'Standardisierter Text zur logopädischen Untersuchung von Redeflussstörungen.',
    sample: 'Wenn das Sonnenlicht auf Regentropfen in der Luft trifft, wirken sie wie ein Prisma und bilden einen wunderschönen bunten Regenbogen am weiten Himmelszelt.',
    wordCount: 23
  },
  {
    id: 'de-fischer',
    langCode: 'de-DE',
    langLabel: 'Deutsch',
    flag: '🇩🇪',
    title: 'Fischers Fritz (Labiodentale Reibelaute /f/)',
    category: 'tongue_twister',
    difficulty: 'intermediate',
    technique: 'Light Articulatory Contact',
    wpm: 100,
    phoneticFocus: 'Zahn-Lippen-Kontakt ohne übermäßigen Muskeltonus',
    description: 'Verhindert Blockaden bei der Artikulation des Buchstabens F.',
    sample: 'Fischers Fritz fischt frische Fische, frische Fische fischt Fischers Fritz im friedlichen Fluss.',
    wordCount: 13
  },

  // MANDARIN (中文)
  {
    id: 'zh-rainbow',
    langCode: 'zh-CN',
    langLabel: '中文',
    flag: '🇨🇳',
    title: '彩虹的奇迹 (临床朗读篇章)',
    category: 'paragraph',
    difficulty: 'intermediate',
    technique: 'Continuous Phonation',
    wpm: 130,
    phoneticFocus: '声调平稳过渡与腹式呼吸',
    description: '中文语境下的呼吸连贯度与喉部肌紧张调节训练。',
    sample: '当阳光照射在空中的雨滴上时，雨滴就像三棱镜一样，将白色的光芒分解成一道美丽的七彩虹。平静的呼吸带来从容的表达。',
    wordCount: 26
  },
  {
    id: 'zh-shisi',
    langCode: 'zh-CN',
    langLabel: '中文',
    flag: '🇨🇳',
    title: '四是四，十是十 (齿音与舌尖音对比)',
    category: 'tongue_twister',
    difficulty: 'intermediate',
    technique: 'Light Articulatory Contact',
    wpm: 110,
    phoneticFocus: '平舌音 /s/ 与翘舌音 /sh/ 轻柔接触',
    description: '改善舌尖在齿龈与硬腭间的过度紧张与卡顿。',
    sample: '四是四，十是十，十四是十四，四十是四十，不能把四十说成十四，也不能把十四说成四十。',
    wordCount: 20
  }
];
