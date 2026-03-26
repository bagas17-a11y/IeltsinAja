/**
 * Mock Listening Test Data
 * Returns realistic IELTS-style listening tests without using AI
 */

export interface MockListeningTest {
  part: string;
  context: string;
  transcript: string;
  sections: Array<{
    type: string;
    title?: string;
    instruction: string;
    questions: Array<{
      number: number;
      label?: string;
      question?: string;
      options?: Record<string, string>;
      answer: string;
      transcript_quote: string;
      accept_alternatives?: string[];
      explanation?: string;
    }>;
  }>;
  answer_key: Record<string, string>;
  difficulty: string;
  duration_minutes: number;
  topic: string;
}

const mockPart1: MockListeningTest = {
  part: "Part 1",
  context: "A conversation between a student and a university accommodation office receptionist",
  topic: "University accommodation enquiry",
  difficulty: "medium",
  duration_minutes: 30,
  transcript: `RECEPTIONIST: Good morning, Riverside University Accommodation Office. How can I help you?

STUDENT: Oh, hello. Um, I'm looking for information about on-campus accommodation for next semester. I'm a new student starting in September.

RECEPTIONIST: Of course! Are you looking for single or shared accommodation?

STUDENT: I'd prefer a single room if that's possible.

RECEPTIONIST: Right. We have two main halls for single rooms. There's Maple Hall and Cedar Hall. Maple Hall is closer to the library and the main lecture buildings — it's about a five-minute walk.

STUDENT: That sounds good. What's the weekly rent for Maple Hall?

RECEPTIONIST: Single rooms in Maple Hall are one hundred and twenty pounds per week. That includes all utilities — heating, water and electricity.

STUDENT: Great. And is there internet access?

RECEPTIONIST: Yes, all rooms have a wired connection, and there's also campus Wi-Fi throughout the building.

STUDENT: I see. What about meals? Is there a canteen?

RECEPTIONIST: There's a shared kitchen on each floor, but no canteen in the hall itself. However, the university cafeteria is just across the road and it opens at seven thirty in the morning.

STUDENT: OK, and how do I apply? Is there a form online?

RECEPTIONIST: Yes. You go to the university website and click on the Accommodation tab. You'll need to fill in an application form and pay a deposit of two hundred and fifty pounds to secure your place.

STUDENT: And what's the closing date for applications?

RECEPTIONIST: For September intake, the deadline is the fifteenth of July. After that, we can't guarantee a room will be available.

STUDENT: Perfect. Could I ask — is there a laundry room in the hall?

RECEPTIONIST: Yes, it's on the ground floor. The machines take a card, not coins. You can top up your laundry card at the reception desk.

STUDENT: That's really helpful. One more thing — I have a bicycle. Is there somewhere secure to store it?

RECEPTIONIST: There's a locked bicycle shed at the back of the building. You'll need to register your bike at reception and collect a key.

STUDENT: Wonderful. Thank you very much.

RECEPTIONIST: You're welcome. Good luck with your application!`,
  sections: [
    {
      type: "form_completion",
      title: "RIVERSIDE UNIVERSITY — ACCOMMODATION ENQUIRY FORM",
      instruction: "Complete the form below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.",
      questions: [
        {
          number: 1,
          label: "Room type requested",
          answer: "single room",
          transcript_quote: "I'd prefer a single room if that's possible.",
          accept_alternatives: ["single"]
        },
        {
          number: 2,
          label: "Preferred hall",
          answer: "Maple Hall",
          transcript_quote: "There's Maple Hall and Cedar Hall. Maple Hall is closer to the library.",
          accept_alternatives: ["maple hall"]
        },
        {
          number: 3,
          label: "Weekly rent",
          answer: "120",
          transcript_quote: "Single rooms in Maple Hall are one hundred and twenty pounds per week.",
          accept_alternatives: ["£120", "one hundred and twenty"]
        },
        {
          number: 4,
          label: "Internet provision",
          answer: "wired connection",
          transcript_quote: "all rooms have a wired connection, and there's also campus Wi-Fi",
          accept_alternatives: ["wired"]
        },
        {
          number: 5,
          label: "Cafeteria opening time",
          answer: "7:30",
          transcript_quote: "the university cafeteria is just across the road and it opens at seven thirty in the morning.",
          accept_alternatives: ["7.30", "seven thirty"]
        },
        {
          number: 6,
          label: "Deposit amount",
          answer: "250",
          transcript_quote: "pay a deposit of two hundred and fifty pounds to secure your place.",
          accept_alternatives: ["£250", "two hundred and fifty"]
        },
        {
          number: 7,
          label: "Application deadline",
          answer: "15 July",
          transcript_quote: "the deadline is the fifteenth of July.",
          accept_alternatives: ["July 15", "15th July"]
        },
        {
          number: 8,
          label: "Laundry payment method",
          answer: "card",
          transcript_quote: "The machines take a card, not coins.",
          accept_alternatives: ["a card", "laundry card"]
        }
      ]
    },
    {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      questions: [
        {
          number: 9,
          question: "Where is the laundry room located?",
          options: { A: "On the top floor", B: "On the ground floor", C: "In the basement" },
          answer: "B",
          transcript_quote: "it's on the ground floor.",
          explanation: "The receptionist states the laundry room is on the ground floor."
        },
        {
          number: 10,
          question: "What does the student need to do to use the bicycle shed?",
          options: { A: "Pay a monthly fee", B: "Bring their own lock", C: "Register the bike at reception" },
          answer: "C",
          transcript_quote: "You'll need to register your bike at reception and collect a key.",
          explanation: "The student must register the bicycle and collect a key from reception."
        }
      ]
    }
  ],
  answer_key: {
    "1": "single room",
    "2": "Maple Hall",
    "3": "120",
    "4": "wired connection",
    "5": "7:30",
    "6": "250",
    "7": "15 July",
    "8": "card",
    "9": "B",
    "10": "C"
  }
};

const mockPart2: MockListeningTest = {
  part: "Part 2",
  context: "A radio broadcast about a new community recycling programme",
  topic: "Community recycling scheme",
  difficulty: "medium",
  duration_minutes: 30,
  transcript: `PRESENTER: Good afternoon, listeners. I'm joined today by Sarah Chen from Greenfield Borough Council to tell us about the exciting new recycling scheme launching next month. Sarah, welcome to the programme.

SARAH: Thank you. Yes, we're very excited about this. The scheme is called RecycleRight and it aims to reduce household waste by thirty percent over the next three years.

PRESENTER: So what's changing for residents?

SARAH: Well, the biggest change is that we're introducing three separate bins instead of just one recycling bin. Each household will receive a blue bin for paper and cardboard, a green bin for glass and tins, and a yellow bin for plastic bottles and cartons.

PRESENTER: And what happens to food waste?

SARAH: Food waste should still go into the brown caddy that most residents already have. If you haven't received one yet, contact the council and we'll arrange delivery.

PRESENTER: When does the scheme begin?

SARAH: Collection under the new system starts on the fourth of April. Before then, residents should attend one of our information sessions — the dates are on the council website.

PRESENTER: I understand there are some items that still cause confusion — what can't go in the recycling bins?

SARAH: That's a great question. People often put in items that actually contaminate the whole load. Things like black plastic trays, coffee cups — those are lined with a plastic film so they can't be recycled — and food-soiled containers. Those should all go in the general waste bin.

PRESENTER: What about electronic items?

SARAH: Electronics should be taken to the Household Waste and Recycling Centre on Park Road. We also have two drop-off points in the town centre — one near the library and one in the supermarket car park.

PRESENTER: Finally, are there any incentives for households that participate well?

SARAH: Yes! We're running a points-based reward programme. Households that sort their recycling correctly can earn points that are redeemable against council tax discounts. We think that's a really powerful motivator.

PRESENTER: Fantastic. Thank you, Sarah. Residents can find out more at greenfield.gov.uk/recycleright.`,
  sections: [
    {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      questions: [
        {
          number: 11,
          question: "What is the council's recycling target?",
          options: { A: "Reduce waste by 30% in 3 years", B: "Recycle 30% of all waste by next year", C: "Cut landfill use by 30% permanently" },
          answer: "A",
          transcript_quote: "aims to reduce household waste by thirty percent over the next three years.",
          explanation: "The scheme aims for a 30% reduction over three years."
        },
        {
          number: 12,
          question: "What should go in the yellow bin?",
          options: { A: "Paper and cardboard", B: "Glass and tins", C: "Plastic bottles and cartons" },
          answer: "C",
          transcript_quote: "a yellow bin for plastic bottles and cartons.",
          explanation: "The yellow bin is designated for plastic bottles and cartons."
        },
        {
          number: 13,
          question: "Why can coffee cups NOT go in recycling bins?",
          options: { A: "They are too large", B: "They have a plastic film lining", C: "They contain food residue" },
          answer: "B",
          transcript_quote: "coffee cups — those are lined with a plastic film so they can't be recycled",
          explanation: "Coffee cups have a plastic film lining that prevents recycling."
        }
      ]
    },
    {
      type: "note_completion",
      instruction: "Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
      questions: [
        {
          number: 14,
          label: "New collection system start date",
          answer: "4 April",
          transcript_quote: "Collection under the new system starts on the fourth of April.",
          accept_alternatives: ["April 4", "fourth of April"]
        },
        {
          number: 15,
          label: "Recycling centre location",
          answer: "Park Road",
          transcript_quote: "taken to the Household Waste and Recycling Centre on Park Road.",
          accept_alternatives: ["park road"]
        },
        {
          number: 16,
          label: "Town centre drop-off point 1",
          answer: "library",
          transcript_quote: "one near the library",
          accept_alternatives: ["near the library"]
        },
        {
          number: 17,
          label: "Town centre drop-off point 2",
          answer: "supermarket car park",
          transcript_quote: "one in the supermarket car park.",
          accept_alternatives: ["supermarket"]
        },
        {
          number: 18,
          label: "Reward redeemable against",
          answer: "council tax",
          transcript_quote: "points that are redeemable against council tax discounts.",
          accept_alternatives: ["council tax discounts"]
        },
        {
          number: 19,
          label: "Council website address",
          answer: "greenfield.gov.uk/recycleright",
          transcript_quote: "greenfield.gov.uk/recycleright",
          accept_alternatives: []
        },
        {
          number: 20,
          label: "Food waste container",
          answer: "brown caddy",
          transcript_quote: "Food waste should still go into the brown caddy",
          accept_alternatives: ["caddy", "brown"]
        }
      ]
    }
  ],
  answer_key: {
    "11": "A",
    "12": "C",
    "13": "B",
    "14": "4 April",
    "15": "Park Road",
    "16": "library",
    "17": "supermarket car park",
    "18": "council tax",
    "19": "greenfield.gov.uk/recycleright",
    "20": "brown caddy"
  }
};

const mockPart3: MockListeningTest = {
  part: "Part 3",
  context: "Two students discussing their research project on urban green spaces",
  topic: "Urban green spaces research project",
  difficulty: "medium",
  duration_minutes: 30,
  transcript: `JAKE: So, Maya — we need to finalise our presentation on urban green spaces. Have you had a chance to look at the studies I sent?

MAYA: Yes, I did. I found Professor Hartley's 2019 paper the most useful. The way she categorised the psychological benefits was really clear — she separated immediate stress reduction from long-term well-being improvements.

JAKE: Right. I preferred the longitudinal study by Torres, though — the one that tracked residents over five years. It gave more convincing evidence because it showed consistent benefits over time, not just short-term responses.

MAYA: Fair point. Actually, I think we should include both but lead with Torres since reviewers seem to value longitudinal data.

JAKE: Agreed. Now, what about the methodology for our own data collection? I was thinking a questionnaire would be the quickest option.

MAYA: I'm not sure. Questionnaires are easy to administer, but the response rate is usually low and people don't always give honest answers to health-related questions. I'd rather do semi-structured interviews — they take longer but the data is much richer.

JAKE: OK, but we only have two weeks. Can we realistically do interviews?

MAYA: If we limit it to fifteen participants, yes. We could recruit through the university noticeboard and the local community centre.

JAKE: That sounds reasonable. What angle should we take for the analysis? I thought about focusing on economic benefits — like how green spaces increase property values and reduce healthcare costs.

MAYA: Hmm. The economic angle is interesting, but I think it's been done to death. Why don't we look at the social equity angle instead? There's a real gap in research about how green space access differs across income groups in the same city.

JAKE: Actually, I like that. It ties into what we've been reading about environmental justice. We could compare two neighbourhoods — one high income and one lower income — and measure access to quality green spaces.

MAYA: Exactly. And we could use GIS mapping to visualise the distribution. I know someone in the Geography department who could help us with that.

JAKE: Perfect. So for structure — introduction with literature review, methodology, findings, and then a discussion linking to policy implications?

MAYA: Yes, and I think we should end with a strong recommendation. Something like a call for mandatory green space quotas in urban planning applications.

JAKE: I like that. It gives the project a practical edge.`,
  sections: [
    {
      type: "matching",
      instruction: "What does each student think about the following research sources? Choose your answers from the box and write the correct letter, A–G, next to questions 21–25.",
      questions: [
        {
          number: 21,
          label: "Hartley (2019) — Jake's view",
          answer: "D",
          transcript_quote: "I preferred the longitudinal study by Torres",
          explanation: "Jake prefers Torres over Hartley, implying Hartley was less convincing to him (less useful for evidence)."
        },
        {
          number: 22,
          label: "Hartley (2019) — Maya's view",
          answer: "A",
          transcript_quote: "I found Professor Hartley's 2019 paper the most useful. The way she categorised the psychological benefits was really clear.",
          explanation: "Maya finds Hartley's categorisation clear and most useful."
        },
        {
          number: 23,
          label: "Torres longitudinal study — Jake's view",
          answer: "B",
          transcript_quote: "It gave more convincing evidence because it showed consistent benefits over time.",
          explanation: "Jake finds Torres more convincing due to consistent longitudinal data."
        },
        {
          number: 24,
          label: "Torres longitudinal study — Maya's view",
          answer: "C",
          transcript_quote: "I think we should include both but lead with Torres since reviewers seem to value longitudinal data.",
          explanation: "Maya agrees Torres should be prioritised for reviewer credibility."
        },
        {
          number: 25,
          label: "Questionnaire approach — Maya's view",
          answer: "E",
          transcript_quote: "the response rate is usually low and people don't always give honest answers to health-related questions.",
          explanation: "Maya considers questionnaires unreliable for health data."
        }
      ]
    },
    {
      type: "sentence_completion",
      instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
      questions: [
        {
          number: 26,
          label: "They plan to recruit participants through the university noticeboard and the local ___.",
          answer: "community centre",
          transcript_quote: "We could recruit through the university noticeboard and the local community centre.",
          accept_alternatives: ["community center"]
        },
        {
          number: 27,
          label: "The pair reject the economic angle because it has been ___.",
          answer: "done to death",
          transcript_quote: "I think it's been done to death.",
          accept_alternatives: []
        },
        {
          number: 28,
          label: "Their research will compare green space access across different ___ groups.",
          answer: "income",
          transcript_quote: "how green space access differs across income groups in the same city.",
          accept_alternatives: ["income groups"]
        },
        {
          number: 29,
          label: "They plan to use ___ mapping to show the distribution of green spaces.",
          answer: "GIS",
          transcript_quote: "we could use GIS mapping to visualise the distribution.",
          accept_alternatives: ["GIS mapping"]
        },
        {
          number: 30,
          label: "Their final recommendation will call for mandatory green space ___ in planning.",
          answer: "quotas",
          transcript_quote: "a call for mandatory green space quotas in urban planning applications.",
          accept_alternatives: ["green space quotas"]
        }
      ]
    }
  ],
  answer_key: {
    "21": "D",
    "22": "A",
    "23": "B",
    "24": "C",
    "25": "E",
    "26": "community centre",
    "27": "done to death",
    "28": "income",
    "29": "GIS",
    "30": "quotas"
  }
};

const mockPart4: MockListeningTest = {
  part: "Part 4",
  context: "An academic lecture on the history and impact of the printing press",
  topic: "History of the printing press",
  difficulty: "medium",
  duration_minutes: 30,
  transcript: `LECTURER: Good morning, everyone. Today we're going to look at one of the most transformative inventions in human history: the printing press. While earlier forms of printing existed in China and Korea — using woodblock and movable type techniques — it was Johannes Gutenberg's press in Europe around 1440 that triggered the information revolution we associate with the modern world.

Gutenberg's key innovation was the use of a metal alloy for the movable type. Previous wooden type wore down quickly and produced inconsistent impressions. The metal type could be reused thousands of times, dramatically reducing the cost per page. Gutenberg's first major project was the famous Bible that bears his name — the Gutenberg Bible — completed around 1455.

The speed of adoption was remarkable. By 1500 — just fifty years later — there were over a thousand printing presses operating across Europe, and it's estimated that around twenty million books had been produced. Before Gutenberg, producing a single manuscript by hand took a scribe several months. A press could produce hundreds of copies in the same time.

Now, what were the social consequences? The most immediate effect was a dramatic fall in the price of books. This made literacy both more achievable and more desirable — if you could read, you could actually access reading material. Within two generations of Gutenberg's press, literacy rates in Western Europe had increased significantly.

The second major consequence was the standardisation of language. Printers needed to choose a consistent spelling and grammar for each edition. This helped stabilise national languages and, in England for example, contributed to the decline of regional dialects.

Thirdly, the press was instrumental in spreading new ideas — both scientific and religious. The Protestant Reformation of the early sixteenth century was, in many historians' views, impossible without the printing press. Martin Luther's Ninety-Five Theses were printed and distributed across Germany within weeks of being written.

However, the technology was not universally welcomed. Authorities in many states attempted to control printing through licensing systems and censorship. In England, the Stationers' Company was granted a royal monopoly on printing in 1557, allowing the crown to regulate what could be published.

To summarise: Gutenberg's press created a feedback loop — cheaper books led to more readers, more readers created demand for more books, and more books led to the spread of new knowledge that ultimately fuelled the Renaissance and the Scientific Revolution. It is difficult to overstate its importance.`,
  sections: [
    {
      type: "note_completion",
      instruction: "Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
      questions: [
        {
          number: 31,
          label: "Gutenberg's press developed around",
          answer: "1440",
          transcript_quote: "it was Johannes Gutenberg's press in Europe around 1440",
          accept_alternatives: []
        },
        {
          number: 32,
          label: "Key material used for movable type",
          answer: "metal alloy",
          transcript_quote: "Gutenberg's key innovation was the use of a metal alloy for the movable type.",
          accept_alternatives: ["metal"]
        },
        {
          number: 33,
          label: "Gutenberg Bible completed around",
          answer: "1455",
          transcript_quote: "the Gutenberg Bible — completed around 1455.",
          accept_alternatives: []
        },
        {
          number: 34,
          label: "Number of presses in Europe by 1500",
          answer: "over a thousand",
          transcript_quote: "there were over a thousand printing presses operating across Europe",
          accept_alternatives: ["1000", "a thousand"]
        },
        {
          number: 35,
          label: "Estimated books produced by 1500",
          answer: "twenty million",
          transcript_quote: "around twenty million books had been produced.",
          accept_alternatives: ["20 million"]
        },
        {
          number: 36,
          label: "Immediate social effect: fall in price of",
          answer: "books",
          transcript_quote: "The most immediate effect was a dramatic fall in the price of books.",
          accept_alternatives: []
        },
        {
          number: 37,
          label: "Second consequence: standardisation of",
          answer: "language",
          transcript_quote: "the second major consequence was the standardisation of language.",
          accept_alternatives: ["languages", "national language"]
        },
        {
          number: 38,
          label: "Luther's Theses spread across Germany within",
          answer: "weeks",
          transcript_quote: "printed and distributed across Germany within weeks of being written.",
          accept_alternatives: []
        },
        {
          number: 39,
          label: "English printing monopoly held by",
          answer: "Stationers' Company",
          transcript_quote: "the Stationers' Company was granted a royal monopoly on printing in 1557",
          accept_alternatives: ["Stationers Company"]
        },
        {
          number: 40,
          label: "Press helped fuel the Renaissance and the",
          answer: "Scientific Revolution",
          transcript_quote: "fuelled the Renaissance and the Scientific Revolution.",
          accept_alternatives: []
        }
      ]
    }
  ],
  answer_key: {
    "31": "1440",
    "32": "metal alloy",
    "33": "1455",
    "34": "over a thousand",
    "35": "twenty million",
    "36": "books",
    "37": "language",
    "38": "weeks",
    "39": "Stationers' Company",
    "40": "Scientific Revolution"
  }
};

const mockTests: Record<string, MockListeningTest> = {
  "Part 1": mockPart1,
  "Part 2": mockPart2,
  "Part 3": mockPart3,
  "Part 4": mockPart4,
};

export function getMockListeningTest(part: string, difficulty: string): MockListeningTest {
  const test = mockTests[part] ?? mockPart1;
  return { ...test, difficulty };
}
