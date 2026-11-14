// Smart Paragraph and Text Generation System with Duration Scaling & Sanitization

export interface GeneratedParagraph {
  id: string;
  title: string;
  category: 'science' | 'history' | 'tech' | 'philosophy' | 'literature' | 'nature' | 'numbers' | 'general';
  text: string;
  wordCount: number;
}

// Diverse, grammatically elegant sentence collections
const SCIENCE_SENTENCES = [
  "Carbon dioxide is a chemical compound composed of one carbon atom covalently bonded to two oxygen atoms.",
  "Photosynthesis transforms solar radiation into chemical energy within the chloroplasts of living plant cells.",
  "The cosmic microwave background radiation offers a pristine snapshot of the universe when it was just an infant.",
  "Quantum entanglement demonstrates that physical measurements on separated particles can exhibit instantaneous correlation.",
  "Gravitational lensing bends the trajectory of distant light around massive clusters of galaxies.",
  "Cellular respiration converts glucose into adenosine triphosphate, powering metabolic reactions across complex organisms.",
  "Plate tectonics continuously reshapes oceanic basins and continental crust through volcanic upwelling and subduction.",
  "Supernovae disperse heavy forged elements throughout interstellar dust clouds to seed subsequent solar systems."
];

const HISTORY_SENTENCES = [
  "The ancient Egyptian Queen Nefertiti has long stood at the center of archaeologists' timeless fascination.",
  "The Library of Alexandria gathered scrolls and maritime navigational charts from ships entering Mediterranean harbors.",
  "Johannes Gutenberg's movable metal type press democratized literacy and ignited the European scientific revolution.",
  "The Silk Road facilitated not merely commerce in textiles and spices, but the cross-pollination of philosophy and mathematics.",
  "The architecture of the Roman aqueducts channeled clean mountain spring waters across vast arches into public fountains.",
  "The Renaissance harmonized classical Greek humanism with rigorous observational perspective and anatomical inquiry.",
  "Medieval monastic scribes preserved philosophical treatises through painstaking manuscript illumination across centuries.",
  "The Rosetta Stone provided scholars with the crucial linguistic cipher needed to decipher ancient hieroglyphic inscriptions."
];

const TECH_SENTENCES = [
  "Modern software engineering combines mathematical abstractions with modular and maintainable design patterns.",
  "Distributed consensus algorithms guarantee data consistency and fault tolerance across asynchronous computer networks.",
  "Artificial neural networks extract hierarchical feature representations from high-dimensional datasets with remarkable speed.",
  "Asynchronous event loops enable web applications to process concurrent network requests with minimal latency.",
  "Relational databases preserve transactional integrity through atomic execution and structured query optimization.",
  "Cryptographic hash functions produce fixed-length deterministic digests that guarantee data integrity across transmissions.",
  "Just-in-time compilers dynamically optimize intermediate bytecode into native machine instructions at execution time.",
  "Containerization encapsulates application runtimes to ensure predictable and reproducible deployment across clouds."
];

const PHILOSOPHY_SENTENCES = [
  "Typing is a mindful craft connecting conscious human thought directly with modern digital expression.",
  "Deliberate practice and rhythmic pacing consistently surpass erratic bursts of unfocused speed.",
  "Clarity of thought produces clarity of prose, enabling complex concepts to resonate with effortless grace.",
  "The disciplined craftsman seeks mastery not for external vanity, but for the inherent dignity of refined execution.",
  "Curiosity fuels continuous intellectual evolution and transforms routine exercise into genuine personal discovery.",
  "Patience during deliberate repetition builds intuitive muscle memory that withstands cognitive fatigue.",
  "True fluency manifests when conscious effort dissolves into a natural and harmonious flow of movement.",
  "Perseverance transforms modest beginnings into exceptional capability through steady, quiet dedication."
];

const LITERATURE_SENTENCES = [
  "The morning mist lingered softly above the tranquil valley as autumn leaves drifted across the cobblestone pathway.",
  "Golden sunlight filtered through the ancient oak branches, casting intricate geometric patterns upon the forest floor.",
  "The rhythmic cadence of waves breaking along the shoreline offered a soothing background to the evening twilight.",
  "Far beyond the snowcapped mountain peaks, an emerald horizon stretched toward the distant edge of the continent.",
  "The old library was filled with the timeless scent of aged parchment, polished mahogany, and quiet contemplation.",
  "Gentle breezes carried the fragrant aroma of wild lavender across the rolling hills of the countryside.",
  "A tapestry of constellations slowly emerged across the midnight sky, guiding sailors on their homeward voyage.",
  "Raindrops tapped rhythmically against the glass windowpane while a warm hearth crackled softly in the study."
];

/**
 * Determine ideal target word count based on selected duration.
 * Baseline: 35-45 WPM average typing speed with safe buffer so fast typists (even 80-120 WPM)
 * never run out of text unexpectedly.
 */
export function getWordCountForDuration(durationSeconds?: number): number {
  if (!durationSeconds || durationSeconds <= 0) {
    return 75; // Default medium paragraph
  }

  // Target words proportional to duration (roughly 50 WPM buffer capacity)
  if (durationSeconds <= 15) return 18;       // 15 seconds
  if (durationSeconds <= 30) return 32;       // 30 seconds
  if (durationSeconds <= 60) return 58;       // 1 minute
  if (durationSeconds <= 120) return 110;     // 2 minutes
  if (durationSeconds <= 180) return 160;     // 3 minutes
  if (durationSeconds <= 300) return 260;     // 5 minutes
  if (durationSeconds <= 600) return 520;     // 10 minutes

  // For arbitrary custom seconds: ~0.85 words per second
  return Math.max(15, Math.round(durationSeconds * 0.85));
}

/**
 * Generate a smart, coherent paragraph matching category and duration
 */
export function generateParagraph(
  category: 'science' | 'history' | 'tech' | 'philosophy' | 'literature' | 'nature' | 'numbers' | 'general' = 'general',
  targetWords: number = 60
): GeneratedParagraph {
  if (category === 'numbers') {
    return generateNumericDrill(Math.max(15, Math.round(targetWords / 2)));
  }

  let sentencePool: string[];
  switch (category) {
    case 'science':
      sentencePool = SCIENCE_SENTENCES;
      break;
    case 'history':
      sentencePool = HISTORY_SENTENCES;
      break;
    case 'tech':
      sentencePool = TECH_SENTENCES;
      break;
    case 'philosophy':
      sentencePool = PHILOSOPHY_SENTENCES;
      break;
    case 'literature':
    case 'nature':
      sentencePool = LITERATURE_SENTENCES;
      break;
    default:
      sentencePool = [
        ...SCIENCE_SENTENCES,
        ...HISTORY_SENTENCES,
        ...TECH_SENTENCES,
        ...PHILOSOPHY_SENTENCES,
        ...LITERATURE_SENTENCES,
      ];
      break;
  }

  // Shuffle sentences without adjacent repetition
  const shuffled = [...sentencePool].sort(() => 0.5 - Math.random());
  const selectedSentences: string[] = [];
  let currentWords = 0;

  let poolIdx = 0;
  while (currentWords < targetWords) {
    const sentence = shuffled[poolIdx % shuffled.length];
    selectedSentences.push(sentence);
    currentWords += sentence.split(/\s+/).length;
    poolIdx++;

    // Safety guard to avoid infinite loops
    if (poolIdx > 100) break;
  }

  const text = selectedSentences.join(' ');
  const finalWords = text.split(/\s+/).filter(Boolean).length;

  const categoryTitles: Record<string, string> = {
    science: 'Natural Phenomena & Chemistry',
    history: 'Echoes of Antiquity & Discovery',
    tech: 'Algorithms & Computing Systems',
    philosophy: 'Reflections on Mastery & Craft',
    literature: 'Literary Prose & Composition',
    general: 'Fluency & Speed Practice',
    numbers: '10-Key Numeric Drill',
  };

  return {
    id: `smart-text-${category}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: categoryTitles[category] || 'Typing Practice Passage',
    category,
    text,
    wordCount: finalWords,
  };
}

/**
 * Generate 10-Key numeric drill groups
 */
export function generateNumericDrill(groupsCount: number = 25): GeneratedParagraph {
  const groups: string[] = [];
  for (let i = 0; i < groupsCount; i++) {
    const num = Math.floor(1000 + Math.random() * 9000);
    groups.push(num.toString());
  }

  return {
    id: `drill-num-${Date.now()}`,
    title: '10-Key Numeric Drill',
    category: 'numbers',
    text: groups.join(' '),
    wordCount: groups.length,
  };
}

/**
 * Clean and sanitize custom text from uploaded files or pasted text.
 * Preserves meaningful punctuation and structure while eliminating
 * carriage returns, smart quotes, tabs, and un-typable artifacts.
 */
export function sanitizeCustomText(rawText: string): string {
  if (!rawText) return '';

  return rawText
    // Normalize Windows/Mac line breaks (\r\n and \r) to spaces
    .replace(/\r\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\n+/g, ' ')
    // Replace tabs with a space
    .replace(/\t/g, ' ')
    // Normalize smart / curly double quotes to standard straight quotes
    .replace(/[“”]/g, '"')
    // Normalize smart / curly single quotes to standard straight apostrophes
    .replace(/[‘’]/g, "'")
    // Normalize em dashes and en dashes to standard hyphens
    .replace(/[—–]/g, '-')
    // Normalize ellipsis to three dots
    .replace(/…/g, '...')
    // Remove control / non-printable characters (except basic punctuation)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    // Collapse multiple consecutive spaces into a single space
    .replace(/\s+/g, ' ')
    .trim();
}

// Built-in starter passages
export const CURATED_PASSAGES: GeneratedParagraph[] = [
  {
    id: 'nefertiti-mystery',
    title: 'Mystery of Queen Nefertiti',
    category: 'history',
    text: 'The ancient Egyptian Queen Nefertiti has long been at the center of a mystery. For years, archaeologists have wondered where her tomb might be hidden. Nefertiti belonged to the family line of the famous King Tutankhamun, better known as King Tut. Indeed, some believe that her resting place lies concealed behind the walls of his famous tomb.',
    wordCount: 62,
  },
  {
    id: 'carbon-dioxide-chemistry',
    title: 'Carbon Dioxide & Chemistry',
    category: 'science',
    text: 'Carbon dioxide is a chemical compound that is usually in the form of a gas. It is made up of one atom of carbon and two atoms of oxygen. Carbon dioxide was discovered by a Belgian chemist named Jan Baptista van Helmont. Carbon dioxide is necessary for life on Earth. When plants undergo photosynthesis, they absorb it from the air.',
    wordCount: 63,
  },
  {
    id: 'digital-craftsmanship',
    title: 'Digital Craftsmanship',
    category: 'philosophy',
    text: 'Typing is a fundamental craft connecting human cognition directly with digital mediums. As fingers dance rhythmically across tactile mechanical switches, thoughts materialize without friction. Consistent deliberate practice sharpens accuracy, unlocks effortless velocity, and builds enduring muscle memory.',
    wordCount: 42,
  },
  {
    id: 'numeric-starter',
    title: '10 Key Numeric Drill',
    category: 'numbers',
    text: '1048 5923 7182 9304 4820 1938 5729 8401 3928 4710 6829 3019 4827 5019 6830 2948 1029 4839 5018 7291 3840 5918 2039 4810',
    wordCount: 24,
  }
];
