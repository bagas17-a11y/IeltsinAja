/**
 * Vocabulary passages for IELTS practice.
 * Short passages with difficult words having pop-up definitions.
 */

export interface VocabularyWord {
  word: string;
  definition: string;
  /** If true, use for practice sentence */
  practice?: boolean;
}

export interface VocabularyPassage {
  id: string;
  title: string;
  passage: string;
  /** Words to highlight and show definitions; passage should contain these exactly */
  words: VocabularyWord[];
}

export const VOCABULARY_PASSAGES: VocabularyPassage[] = [
  {
    id: "urbanisation",
    title: "Urbanisation and cities",
    passage:
      "Urbanisation has led to significant changes in how people live and work. As populations migrate to cities in search of employment and better facilities, housing demand increases. This often results in congestion and strain on infrastructure. However, cities also offer opportunities for innovation and cultural exchange. Sustainable urban planning can mitigate some of these challenges.",
    words: [
      { word: "Urbanisation", definition: "The process of people moving from rural areas to cities" },
      { word: "migrate", definition: "To move from one place to another, often for work or a better life" },
      { word: "congestion", definition: "Too many people or vehicles in one place; overcrowding" },
      { word: "infrastructure", definition: "Basic systems and services (roads, transport, water, etc.)" },
      { word: "mitigate", definition: "To make something less severe or harmful" },
      { word: "Sustainable", definition: "Able to be maintained without harming the environment or using up resources" },
    ],
  },
  {
    id: "technology-education",
    title: "Technology in education",
    passage:
      "The proliferation of digital devices has transformed how students learn. Online platforms enable access to resources that were previously inaccessible. Nevertheless, some argue that excessive screen time may impair concentration and social skills. A balanced approach that combines traditional and digital methods is often recommended.",
    words: [
      { word: "proliferation", definition: "Rapid increase in number" },
      { word: "enable", definition: "To make something possible" },
      { word: "inaccessible", definition: "Difficult or impossible to reach or obtain" },
      { word: "impair", definition: "To weaken or damage" },
      { word: "recommended", definition: "Suggested as good or suitable" },
    ],
  },
];
