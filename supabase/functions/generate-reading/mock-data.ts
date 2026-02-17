/**
 * Mock Reading Test Data
 * Returns realistic IELTS-style reading passages without using AI
 */

export interface MockReadingTest {
  passage: {
    title: string;
    content: string;
    topic: string;
    wordCount: number;
  };
  difficulty: string;
  questions: {
    typeA: {
      instruction: string;
      items: Array<{
        number: number;
        statement: string;
        answer: string;
        evidence: string;
        explanation: string;
      }>;
    };
    typeB: {
      instruction: string;
      items: Array<{
        number: number;
        question: string;
        options: {
          A: string;
          B: string;
          C: string;
          D: string;
        };
        answer: string;
        evidence: string;
        explanation: string;
      }>;
    };
    typeC: {
      instruction: string;
      items: Array<{
        number: number;
        sentence: string;
        answer: string;
        evidence: string;
        explanation: string;
      }>;
    };
  };
  metadata: {
    estimatedTime: string;
    skillsFocus: string[];
  };
}

const mockTests: Record<string, MockReadingTest> = {
  easy: {
    passage: {
      title: "The History of Coffee",
      topic: "Food History",
      wordCount: 750,
      content: `Coffee is one of the world's most popular beverages, consumed by millions of people every day. The story of coffee begins in the ancient coffee forests of Ethiopia, where legend tells of a goat herder named Kaldi who discovered coffee beans around 850 AD.

According to the legend, Kaldi noticed that his goats became unusually energetic after eating berries from a particular tree. Curious about this effect, he tried the berries himself and experienced a similar boost in energy. He shared his discovery with local monks, who began using the berries to stay awake during long hours of prayer.

From Ethiopia, coffee cultivation spread to the Arabian Peninsula. By the 15th century, coffee was being grown in Yemen, and within a century, it had reached Persia, Egypt, Syria, and Turkey. Coffee houses, called "qahveh khaneh," became popular gathering places where people would meet, discuss news, listen to music, and play games.

European travelers to the Near East brought back tales of this unusual dark beverage. By the 17th century, coffee had reached Europe and was becoming popular across the continent. However, some people were suspicious of the new drink, calling it the "bitter invention of Satan." The controversy was so great that Pope Clement VIII was asked to intervene. Before making his decision, he tasted the beverage and found it so satisfying that he gave it papal approval.

Coffee houses began to appear in major European cities. In England, these establishments became known as "penny universities" because for the price of a penny, one could purchase a cup of coffee and engage in stimulating conversation. Coffee houses became important centers for social activity and communication.

The Dutch were among the first to begin cultivating coffee plants in their colonies. In the early 1700s, they established coffee plantations in Java, which became highly successful. The French, meanwhile, brought coffee cultivation to the Caribbean, and by the mid-1700s, coffee had reached the Americas.

Today, coffee is grown in over 70 countries, primarily in the equatorial regions of the Americas, Southeast Asia, India, and Africa. Brazil is the world's largest coffee producer, followed by Vietnam and Colombia. The coffee industry employs millions of people worldwide and generates billions of dollars in revenue annually.

Modern coffee culture has evolved significantly from its humble beginnings. Specialty coffee shops have become ubiquitous in urban centers, and coffee consumption continues to rise globally. The beverage that once energized Ethiopian goats has become an integral part of daily life for people around the world.`,
    },
    difficulty: "easy",
    questions: {
      typeA: {
        instruction: "Do the following statements agree with the information in the passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
        items: [
          {
            number: 1,
            statement: "Coffee was first discovered in Ethiopia by a goat herder named Kaldi.",
            answer: "TRUE",
            evidence: "The story of coffee begins in the ancient coffee forests of Ethiopia, where legend tells of a goat herder named Kaldi who discovered coffee beans around 850 AD.",
            explanation: "The passage clearly states that according to legend, Kaldi discovered coffee in Ethiopia.",
          },
          {
            number: 2,
            statement: "Kaldi's goats became tired after eating coffee berries.",
            answer: "FALSE",
            evidence: "Kaldi noticed that his goats became unusually energetic after eating berries from a particular tree.",
            explanation: "The passage states the goats became energetic, not tired.",
          },
          {
            number: 3,
            statement: "Coffee was banned in Europe when it first arrived.",
            answer: "NOT GIVEN",
            evidence: "No specific information about a ban",
            explanation: "While the passage mentions controversy and suspicion, it doesn't state that coffee was actually banned.",
          },
          {
            number: 4,
            statement: "Pope Clement VIII approved coffee after tasting it.",
            answer: "TRUE",
            evidence: "Before making his decision, he tasted the beverage and found it so satisfying that he gave it papal approval.",
            explanation: "The passage explicitly states the Pope gave papal approval after tasting coffee.",
          },
          {
            number: 5,
            statement: "English coffee houses were called 'penny universities.'",
            answer: "TRUE",
            evidence: "In England, these establishments became known as 'penny universities' because for the price of a penny, one could purchase a cup of coffee and engage in stimulating conversation.",
            explanation: "The passage directly states this fact about English coffee houses.",
          },
        ],
      },
      typeB: {
        instruction: "Choose the correct letter, A, B, C or D.",
        items: [
          {
            number: 6,
            question: "What did Kaldi do after discovering the effects of coffee berries?",
            options: {
              A: "He sold them to merchants",
              B: "He shared his discovery with monks",
              C: "He planted more coffee trees",
              D: "He kept it a secret",
            },
            answer: "B",
            evidence: "He shared his discovery with local monks, who began using the berries to stay awake during long hours of prayer.",
            explanation: "The passage states Kaldi shared his discovery with monks.",
          },
          {
            number: 7,
            question: "By the 15th century, coffee cultivation had reached:",
            options: {
              A: "Europe",
              B: "The Americas",
              C: "Yemen",
              D: "Brazil",
            },
            answer: "C",
            evidence: "By the 15th century, coffee was being grown in Yemen",
            explanation: "The passage specifically mentions Yemen in the 15th century context.",
          },
          {
            number: 8,
            question: "Which country is currently the world's largest coffee producer?",
            options: {
              A: "Vietnam",
              B: "Colombia",
              C: "Brazil",
              D: "Ethiopia",
            },
            answer: "C",
            evidence: "Brazil is the world's largest coffee producer, followed by Vietnam and Colombia.",
            explanation: "The passage clearly identifies Brazil as the largest producer.",
          },
          {
            number: 9,
            question: "What was the main purpose of early coffee houses?",
            options: {
              A: "Religious ceremonies",
              B: "Social gathering and communication",
              C: "Coffee production",
              D: "Government meetings",
            },
            answer: "B",
            evidence: "Coffee houses became important centers for social activity and communication.",
            explanation: "The passage emphasizes the social and communicative function of coffee houses.",
          },
        ],
      },
      typeC: {
        instruction: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        items: [
          {
            number: 10,
            sentence: "Coffee houses in the Arabian Peninsula were called ___.",
            answer: "qahveh khaneh",
            evidence: "Coffee houses, called 'qahveh khaneh,' became popular gathering places",
            explanation: "The passage provides this specific term for Arabian coffee houses.",
          },
          {
            number: 11,
            sentence: "The ___ were among the first Europeans to cultivate coffee in their colonies.",
            answer: "Dutch",
            evidence: "The Dutch were among the first to begin cultivating coffee plants in their colonies.",
            explanation: "The passage identifies the Dutch as early colonial coffee cultivators.",
          },
          {
            number: 12,
            sentence: "Coffee is grown in over ___ countries today.",
            answer: "70",
            evidence: "Today, coffee is grown in over 70 countries",
            explanation: "The passage states the specific number of countries.",
          },
          {
            number: 13,
            sentence: "Modern ___ coffee shops have become common in urban centers.",
            answer: "specialty",
            evidence: "Specialty coffee shops have become ubiquitous in urban centers",
            explanation: "The passage uses the term 'specialty' to describe modern coffee shops.",
          },
        ],
      },
    },
    metadata: {
      estimatedTime: "20 minutes",
      skillsFocus: ["Skimming", "Scanning", "Fact identification"],
    },
  },

  medium: {
    passage: {
      title: "The Impact of Urbanization on Biodiversity",
      topic: "Urban Planning",
      wordCount: 820,
      content: `The rapid expansion of urban areas has become one of the defining characteristics of the 21st century, with more than half of the world's population now residing in cities. This unprecedented urbanization has profound implications for biodiversity, creating both challenges and unexpected opportunities for wildlife conservation.

Traditional ecological theory suggested that urbanization invariably leads to biodiversity loss. Cities were viewed as ecological dead zones, hostile environments where only the most adaptable species could survive. However, recent research has challenged this simplistic view, revealing a more nuanced relationship between urban development and biological diversity.

Studies conducted in cities across multiple continents have documented surprisingly high levels of species richness in urban environments. Some cities harbor more bird species than nearby rural areas, while urban gardens and parks can support diverse communities of insects and plants. This phenomenon, termed the "urban biodiversity paradox," suggests that certain characteristics of cities can actually promote diversity.

One factor contributing to urban biodiversity is habitat heterogeneity. Cities contain a mosaic of different environments—parks, gardens, vacant lots, green roofs, and water features—creating varied microhabitats that can support different species. This spatial diversity can exceed that found in some natural landscapes, particularly in regions where agriculture has homogenized the countryside.

Additionally, urban areas often function as refugia for species that have declined in intensively farmed rural regions. The absence of pesticides in many urban gardens, combined with year-round food sources provided by ornamental plants and intentional feeding, can make cities unexpectedly suitable for certain wildlife. Native bees, for instance, have been found to be more abundant in some urban areas than in surrounding agricultural landscapes.

However, the relationship between urbanization and biodiversity is far from uniformly positive. Urban areas create significant environmental pressures that many species cannot withstand. Habitat fragmentation isolates populations, preventing genetic exchange and making local extinctions more likely. Light and noise pollution disrupt the behavior of nocturnal species and migratory birds. The urban heat island effect alters local microclimates, favoring heat-tolerant species while disadvantaging others.

Furthermore, cities often become dominated by a relatively small set of cosmopolitan species—rats, pigeons, and certain invasive plants—that thrive in human-modified environments. This can lead to biotic homogenization, where cities around the world come to harbor similar assemblages of species, reducing global biodiversity even if local species richness appears high.

The challenge for urban planners and conservationists is to maximize the biodiversity benefits of cities while minimizing the negative impacts. This requires moving beyond simply preserving isolated green spaces to creating connected networks of habitats that allow species movement throughout urban landscapes. Green corridors, such as vegetated railway embankments and river margins, can link parks and gardens, enabling wildlife to move between habitat patches.

Building design also plays a crucial role. Green roofs and walls can provide additional habitat, particularly for insects and birds. Reducing light pollution through careful lighting design and using native plants in landscaping can make urban environments more hospitable to local species. Even small interventions, such as creating bee hotels or maintaining wildflower meadows in parks, can have measurable positive effects.

Ultimately, reconciling urbanization with biodiversity conservation requires recognizing that cities are not separate from nature but are ecosystems in their own right. By designing urban environments with ecological considerations in mind, it may be possible to create cities that support both human well-being and biological diversity, transforming them from biodiversity deserts into thriving, multi-species communities.`,
    },
    difficulty: "medium",
    questions: {
      typeA: {
        instruction: "Do the following statements agree with the information in the passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
        items: [
          {
            number: 1,
            statement: "More than 50% of the global population currently lives in urban areas.",
            answer: "TRUE",
            evidence: "more than half of the world's population now residing in cities",
            explanation: "The passage explicitly states more than half the world lives in cities.",
          },
          {
            number: 2,
            statement: "All ecological studies previously concluded that cities reduce biodiversity.",
            answer: "FALSE",
            evidence: "Traditional ecological theory suggested that urbanization invariably leads to biodiversity loss... However, recent research has challenged this simplistic view",
            explanation: "The passage indicates recent research challenges the traditional view, not all studies.",
          },
          {
            number: 3,
            statement: "Urban gardens never use pesticides.",
            answer: "NOT GIVEN",
            evidence: "The absence of pesticides in many urban gardens",
            explanation: "The passage says 'many' gardens lack pesticides, not that they 'never' use them.",
          },
          {
            number: 4,
            statement: "Some cities have more bird species than surrounding rural areas.",
            answer: "TRUE",
            evidence: "Some cities harbor more bird species than nearby rural areas",
            explanation: "This is directly stated in the passage.",
          },
          {
            number: 5,
            statement: "Light pollution affects the behavior of nocturnal animals.",
            answer: "TRUE",
            evidence: "Light and noise pollution disrupt the behavior of nocturnal species",
            explanation: "The passage explicitly mentions this impact.",
          },
        ],
      },
      typeB: {
        instruction: "Choose the correct letter, A, B, C or D.",
        items: [
          {
            number: 6,
            question: "What is the 'urban biodiversity paradox'?",
            options: {
              A: "Cities have less biodiversity than expected",
              B: "Urban areas can support more species than anticipated",
              C: "Rural areas have more diversity than cities",
              D: "Biodiversity decreases with city size",
            },
            answer: "B",
            evidence: "Some cities harbor more bird species than nearby rural areas... This phenomenon, termed the 'urban biodiversity paradox'",
            explanation: "The paradox refers to unexpectedly high diversity in cities.",
          },
          {
            number: 7,
            question: "According to the passage, what contributes to habitat heterogeneity in cities?",
            options: {
              A: "Agricultural fields",
              B: "Natural forests",
              C: "A variety of urban environments like parks and gardens",
              D: "Industrial zones",
            },
            answer: "C",
            evidence: "Cities contain a mosaic of different environments—parks, gardens, vacant lots, green roofs, and water features",
            explanation: "The passage lists various urban features creating habitat diversity.",
          },
          {
            number: 8,
            question: "What is biotic homogenization?",
            options: {
              A: "Increasing species diversity in cities",
              B: "Different cities having similar species",
              C: "Natural ecosystem development",
              D: "Genetic diversity within populations",
            },
            answer: "B",
            evidence: "This can lead to biotic homogenization, where cities around the world come to harbor similar assemblages of species",
            explanation: "Biotic homogenization means cities worldwide have similar species.",
          },
          {
            number: 9,
            question: "What does the author suggest is necessary for effective urban conservation?",
            options: {
              A: "Removing all non-native species",
              B: "Creating isolated protected areas",
              C: "Establishing connected habitat networks",
              D: "Limiting human access to green spaces",
            },
            answer: "C",
            evidence: "This requires moving beyond simply preserving isolated green spaces to creating connected networks of habitats",
            explanation: "The passage emphasizes the importance of connected habitats.",
          },
        ],
      },
      typeC: {
        instruction: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        items: [
          {
            number: 10,
            sentence: "Habitat fragmentation makes ___ more likely to occur.",
            answer: "local extinctions",
            evidence: "Habitat fragmentation isolates populations... making local extinctions more likely",
            explanation: "The passage directly links fragmentation to local extinctions.",
          },
          {
            number: 11,
            sentence: "The ___ effect causes changes to local climate conditions in urban areas.",
            answer: "heat island",
            evidence: "The urban heat island effect alters local microclimates",
            explanation: "The passage uses this specific term for urban temperature effects.",
          },
          {
            number: 12,
            sentence: "Green corridors such as vegetated ___ can connect different habitats.",
            answer: "railway embankments",
            evidence: "Green corridors, such as vegetated railway embankments and river margins",
            explanation: "Railway embankments are given as an example of green corridors.",
          },
          {
            number: 13,
            sentence: "Small actions like creating ___ can positively impact biodiversity.",
            answer: "bee hotels",
            evidence: "Even small interventions, such as creating bee hotels or maintaining wildflower meadows",
            explanation: "Bee hotels are mentioned as an example of small helpful interventions.",
          },
        ],
      },
    },
    metadata: {
      estimatedTime: "20 minutes",
      skillsFocus: ["Inference", "Detailed reading", "Vocabulary in context"],
    },
  },

  hard: {
    passage: {
      title: "Quantum Computing and Cryptographic Security",
      topic: "Technology",
      wordCount: 880,
      content: `The emergence of quantum computing represents a paradigm shift in computational capability that simultaneously promises revolutionary advances and poses existential threats to current cryptographic infrastructure. Unlike classical computers, which process information as binary bits, quantum computers leverage quantum mechanical phenomena—superposition and entanglement—to perform calculations that would be intractable for conventional machines.

The implications for cryptography are profound. Modern digital security relies heavily on mathematical problems that are computationally expensive for classical computers to solve. RSA encryption, for instance, depends on the difficulty of factoring large numbers into their prime components. While a classical computer might require millennia to factor a 2048-bit number, theoretical models suggest a sufficiently powerful quantum computer could accomplish this in hours or even minutes using Shor's algorithm.

This vulnerability extends beyond RSA to elliptic curve cryptography and other widely deployed security protocols. The confidentiality of virtually all internet communications, financial transactions, and classified government information rests on cryptographic systems that quantum computers could potentially compromise. Security experts refer to this anticipated capability as "Q-day"—the point at which quantum computers become powerful enough to break current encryption standards.

However, the threat timeline remains uncertain. Building a quantum computer capable of breaking real-world encryption requires overcoming formidable technical challenges. Quantum states are extraordinarily fragile, easily disrupted by environmental factors in a phenomenon called decoherence. Current quantum computers operate with dozens or hundreds of qubits (quantum bits), but cryptographically relevant calculations would require millions of stable, error-corrected qubits—a goal that may take decades to achieve.

Nevertheless, the potential consequences demand preemptive action. Intelligence agencies and criminal organizations could be harvesting encrypted data now, anticipating the future ability to decrypt it once quantum computers become available. This "harvest now, decrypt later" strategy means that information encrypted today may not remain secure indefinitely, even if current quantum technology cannot yet break it.

In response, cryptographers have developed "post-quantum" or "quantum-resistant" algorithms designed to be secure against both classical and quantum attacks. These algorithms rely on mathematical problems that appear difficult for quantum computers to solve, such as lattice-based cryptography, which involves finding short vectors in high-dimensional lattices. Unlike factoring, for which efficient quantum algorithms exist, no known quantum algorithm provides substantial advantages for these problems.

The transition to post-quantum cryptography presents its own challenges. Implementing new cryptographic standards across the global digital infrastructure is an enormously complex undertaking. Every encrypted communication system, from email servers to banking applications, must be updated. Legacy systems that cannot be upgraded pose persistent vulnerabilities, creating potential entry points for adversaries.

Moreover, standardization efforts must proceed carefully. The algorithms selected must withstand rigorous analysis from the cryptographic community to ensure they contain no subtle flaws. History provides cautionary examples: several initially promising post-quantum algorithms have been broken after deeper examination, sometimes using classical rather than quantum techniques.

International coordination adds another layer of complexity. Different countries may adopt different post-quantum standards, creating interoperability issues. There are also geopolitical considerations; nations may be reluctant to adopt cryptographic standards developed elsewhere, fearing backdoors or other security compromises. This fragmentation could balkanize the internet, with different regions using incompatible security protocols.

The quantum threat has also catalyzed exploration of quantum cryptographic solutions. Quantum key distribution (QKD) uses quantum mechanical properties to detect eavesdropping attempts, offering theoretically perfect security for key exchange. However, QKD requires specialized hardware and is limited to relatively short distances without quantum repeaters—technology still in early development stages.

Ultimately, addressing the quantum cryptographic challenge requires a multi-pronged approach: developing and deploying quantum-resistant algorithms, investing in quantum computing research to better understand both capabilities and limitations, and potentially integrating quantum cryptographic techniques where practical. The race between quantum computing development and cryptographic adaptation will likely define digital security for decades to come, with implications extending far beyond technology into geopolitics, economics, and personal privacy.`,
    },
    difficulty: "hard",
    questions: {
      typeA: {
        instruction: "Do the following statements agree with the information in the passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
        items: [
          {
            number: 1,
            statement: "Quantum computers use binary bits like classical computers.",
            answer: "FALSE",
            evidence: "Unlike classical computers, which process information as binary bits, quantum computers leverage quantum mechanical phenomena",
            explanation: "The passage contrasts quantum computers with classical binary systems.",
          },
          {
            number: 2,
            statement: "A quantum computer could factor a 2048-bit number faster than a classical computer.",
            answer: "TRUE",
            evidence: "While a classical computer might require millennia to factor a 2048-bit number, theoretical models suggest a sufficiently powerful quantum computer could accomplish this in hours",
            explanation: "The passage explicitly compares the timeframes.",
          },
          {
            number: 3,
            statement: "All post-quantum algorithms have proven completely secure.",
            answer: "FALSE",
            evidence: "several initially promising post-quantum algorithms have been broken after deeper examination",
            explanation: "The passage states some algorithms have been broken.",
          },
          {
            number: 4,
            statement: "Quantum key distribution has been successfully implemented globally.",
            answer: "NOT GIVEN",
            evidence: "QKD requires specialized hardware and is limited to relatively short distances",
            explanation: "While limitations are mentioned, global implementation status is not specified.",
          },
          {
            number: 5,
            statement: "Decoherence makes quantum computers unstable.",
            answer: "TRUE",
            evidence: "Quantum states are extraordinarily fragile, easily disrupted by environmental factors in a phenomenon called decoherence",
            explanation: "The passage directly links decoherence to quantum state fragility.",
          },
        ],
      },
      typeB: {
        instruction: "Choose the correct letter, A, B, C or D.",
        items: [
          {
            number: 6,
            question: "What is 'Q-day' according to the passage?",
            options: {
              A: "The invention of quantum computers",
              B: "When quantum computers can break current encryption",
              C: "The standardization of quantum algorithms",
              D: "The discovery of quantum mechanics",
            },
            answer: "B",
            evidence: "Security experts refer to this anticipated capability as 'Q-day'—the point at which quantum computers become powerful enough to break current encryption standards",
            explanation: "Q-day is defined as the point when quantum computers can break encryption.",
          },
          {
            number: 7,
            question: "What is the 'harvest now, decrypt later' strategy?",
            options: {
              A: "Collecting data to decrypt in the future",
              B: "Farming quantum computers",
              C: "Delaying encryption implementation",
              D: "Storing quantum keys",
            },
            answer: "A",
            evidence: "Intelligence agencies and criminal organizations could be harvesting encrypted data now, anticipating the future ability to decrypt it",
            explanation: "The strategy involves collecting data for future decryption.",
          },
          {
            number: 8,
            question: "According to the passage, why is transitioning to post-quantum cryptography difficult?",
            options: {
              A: "The algorithms are too complex to understand",
              B: "Quantum computers are already too powerful",
              C: "It requires updating all encrypted systems globally",
              D: "There are no viable post-quantum algorithms",
            },
            answer: "C",
            evidence: "Implementing new cryptographic standards across the global digital infrastructure is an enormously complex undertaking",
            explanation: "The passage emphasizes the global scale of implementation.",
          },
          {
            number: 9,
            question: "What advantage does quantum key distribution (QKD) offer?",
            options: {
              A: "It works over unlimited distances",
              B: "It can detect eavesdropping attempts",
              C: "It requires no special equipment",
              D: "It is cheaper than traditional methods",
            },
            answer: "B",
            evidence: "Quantum key distribution (QKD) uses quantum mechanical properties to detect eavesdropping attempts",
            explanation: "The passage states QKD can detect eavesdropping.",
          },
        ],
      },
      typeC: {
        instruction: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
        items: [
          {
            number: 10,
            sentence: "Quantum computers use ___ and entanglement to perform calculations.",
            answer: "superposition",
            evidence: "quantum computers leverage quantum mechanical phenomena—superposition and entanglement",
            explanation: "Superposition is listed alongside entanglement as a key quantum phenomenon.",
          },
          {
            number: 11,
            sentence: "___ cryptography is one type of post-quantum algorithm being developed.",
            answer: "Lattice-based",
            evidence: "such as lattice-based cryptography, which involves finding short vectors in high-dimensional lattices",
            explanation: "Lattice-based cryptography is given as an example.",
          },
          {
            number: 12,
            sentence: "Current quantum computers operate with hundreds of ___, not the millions needed.",
            answer: "qubits",
            evidence: "Current quantum computers operate with dozens or hundreds of qubits",
            explanation: "Qubits are mentioned as the unit of quantum computing power.",
          },
          {
            number: 13,
            sentence: "Different national standards could lead to internet ___.",
            answer: "fragmentation/balkanization",
            evidence: "This fragmentation could balkanize the internet",
            explanation: "The passage uses both terms to describe the potential splitting of the internet.",
          },
        ],
      },
    },
    metadata: {
      estimatedTime: "20 minutes",
      skillsFocus: ["Complex argumentation", "Technical vocabulary", "Abstract concepts"],
    },
  },
};

export function getMockReadingTest(difficulty: string): MockReadingTest {
  const normalizedDifficulty = difficulty.toLowerCase();
  return mockTests[normalizedDifficulty] || mockTests.medium;
}
