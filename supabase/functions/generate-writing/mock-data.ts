/**
 * Mock Writing Prompt Data
 * Returns realistic IELTS-style writing prompts without using AI
 */

export interface MockWritingPrompt {
  task_type: string;
  topic: string;
  instruction: string;
  time_limit: string;
  word_limit: number;
  model_answer_guide: Record<string, unknown>;
  // Task 1 fields
  visual_type?: string;
  data?: Record<string, unknown>;
  // Task 2 fields
  essay_type?: string;
  statement?: string;
}

// ─── Task 1 Mock Prompts ────────────────────────────────────────────────────

const mockTask1BarChart: MockWritingPrompt = {
  task_type: "Task 1",
  visual_type: "bar_chart",
  topic: "Household spending on food, transport and leisure in four countries",
  instruction: "The chart below shows the percentage of household income spent on food, transport and leisure in four countries in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  data: {
    title: "Household expenditure by category in four countries (2020)",
    x_axis: "Country",
    y_axis: "Percentage of household income (%)",
    series: [
      {
        label: "Food",
        values: { "UK": 12, "Germany": 15, "Japan": 16, "Brazil": 25 }
      },
      {
        label: "Transport",
        values: { "UK": 14, "Germany": 13, "Japan": 9, "Brazil": 11 }
      },
      {
        label: "Leisure",
        values: { "UK": 18, "Germany": 16, "Japan": 12, "Brazil": 8 }
      }
    ],
    unit: "percentage",
    key_features: [
      "Brazilian households spent the most on food (25%)",
      "UK and Germany residents devoted more to leisure than food",
      "Japan spent the least on transport among the four countries"
    ]
  },
  time_limit: "20 minutes",
  word_limit: 150,
  model_answer_guide: {
    overview: "Overall, expenditure patterns varied considerably across the four countries, with food spending highest in Brazil and leisure spending highest in the UK.",
    key_points: [
      "Compare the highest and lowest values for each category",
      "Note the contrast between developed and developing economies",
      "Highlight that leisure > food in UK/Germany but the reverse is true in Brazil"
    ],
    language_focus: ["Comparative language", "Superlatives", "Contrast phrases", "Data-specific vocabulary"]
  }
};

const mockTask1LineGraph: MockWritingPrompt = {
  task_type: "Task 1",
  visual_type: "line_graph",
  topic: "Sales of electric and petrol cars from 2015 to 2023",
  instruction: "The graph below shows the number of electric and petrol cars sold in a European country between 2015 and 2023. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  data: {
    title: "Annual car sales: electric vs petrol (2015–2023)",
    x_axis: "Year",
    y_axis: "Number of cars sold (thousands)",
    series: [
      {
        label: "Electric cars",
        values: {
          "2015": 20, "2016": 30, "2017": 45, "2018": 65,
          "2019": 90, "2020": 95, "2021": 130, "2022": 185, "2023": 240
        }
      },
      {
        label: "Petrol cars",
        values: {
          "2015": 380, "2016": 370, "2017": 360, "2018": 340,
          "2019": 310, "2020": 270, "2021": 250, "2022": 220, "2023": 190
        }
      }
    ],
    unit: "thousands",
    key_features: [
      "Electric car sales grew twelvefold from 20,000 to 240,000",
      "Petrol car sales declined steadily from 380,000 to 190,000",
      "The two lines crossed approximately in 2022"
    ]
  },
  time_limit: "20 minutes",
  word_limit: 150,
  model_answer_guide: {
    overview: "Overall, electric car sales rose dramatically over the period while petrol car sales fell consistently, with the two trends converging by 2022–2023.",
    key_points: [
      "Describe the overall upward trend for electric and downward trend for petrol",
      "Quantify the changes (e.g. from X to Y)",
      "Note the crossover point",
      "Use appropriate trend vocabulary"
    ],
    language_focus: ["Trend verbs (rose, fell, peaked)", "Approximation language", "Time phrases", "Contrast structures"]
  }
};

const mockTask1PieChart: MockWritingPrompt = {
  task_type: "Task 1",
  visual_type: "pie_chart",
  topic: "Global water usage by sector",
  instruction: "The pie chart below shows the proportion of water used by different sectors worldwide. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  data: {
    title: "Global freshwater withdrawal by sector",
    segments: [
      { label: "Agriculture", percentage: 70 },
      { label: "Industry", percentage: 19 },
      { label: "Municipal/Domestic", percentage: 11 }
    ],
    unit: "percentage",
    key_features: [
      "Agriculture accounts for nearly three-quarters of all water usage",
      "Industry uses roughly one fifth",
      "Domestic use is the smallest sector at just 11%"
    ]
  },
  time_limit: "20 minutes",
  word_limit: 150,
  model_answer_guide: {
    overview: "Overall, agriculture dominates global freshwater consumption, accounting for more than two-thirds of total usage, while domestic use represents only a small fraction.",
    key_points: [
      "State the largest category clearly in the overview",
      "Use fractions and percentages to describe proportions",
      "Make direct comparisons between sectors"
    ],
    language_focus: ["Proportion language (accounts for, represents)", "Fractions", "Comparison structures"]
  }
};

// ─── Task 2 Mock Prompts ────────────────────────────────────────────────────

const mockTask2Opinion: MockWritingPrompt = {
  task_type: "Task 2",
  essay_type: "opinion",
  topic: "University education and employment",
  instruction: "Write about the following topic: Some people believe that a university education is essential for career success. Others think that vocational training and work experience are equally or more valuable. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  statement: "A university education is the most important factor in determining career success.",
  time_limit: "40 minutes",
  word_limit: 250,
  model_answer_guide: {
    suggested_structure: "Introduction (paraphrase + nuanced thesis) → Body 1 (case for university: critical thinking, professional networks, credentials) → Body 2 (case for vocational/experiential routes: practical skills, debt avoidance, entrepreneurship) → Conclusion (balanced view: route depends on field and goals)",
    key_arguments: {
      for: [
        "University develops analytical and critical thinking skills",
        "Professional networks formed at university have lifelong value",
        "Many professions legally require degree-level qualifications (medicine, law)"
      ],
      against: [
        "Vocational training produces job-ready skills faster and at lower cost",
        "Work experience is often valued over academic credentials by employers",
        "Many successful entrepreneurs never completed formal degrees"
      ]
    },
    language_focus: ["Hedging language (tend to, can, may)", "Concession phrases (While it is true that...)", "Examples from personal knowledge"]
  }
};

const mockTask2Discussion: MockWritingPrompt = {
  task_type: "Task 2",
  essay_type: "discussion",
  topic: "Social media and interpersonal communication",
  instruction: "Write about the following topic: Some people argue that social media has improved communication and brought people closer together. Others believe it has made people more isolated and reduced the quality of real human interaction. Discuss both views and give your own opinion. Write at least 250 words.",
  statement: "Social media platforms have had a fundamentally negative effect on the way people relate to one another.",
  time_limit: "40 minutes",
  word_limit: 250,
  model_answer_guide: {
    suggested_structure: "Introduction (paraphrase both views + thesis) → Body 1 (positive view: global connection, maintaining long-distance relationships, community support groups) → Body 2 (negative view: superficial connections, comparison culture, displacement of face-to-face interaction) → Conclusion (personal opinion with justification)",
    key_arguments: {
      for_positive: [
        "Enables instant global communication and long-distance relationship maintenance",
        "Creates communities for people with niche interests or rare conditions",
        "Facilitates political organisation and civic engagement"
      ],
      for_negative: [
        "Curated highlight reels promote social comparison and anxiety",
        "Screen time displaces in-person interaction, reducing depth of relationships",
        "Algorithmic bubbles reinforce polarisation and reduce empathy"
      ]
    },
    language_focus: ["Discussing both sides (On the one hand... On the other hand)", "Opinion phrases (In my view, it is evident that)", "Concession (Although proponents argue that...)"]
  }
};

const mockTask2ProblemSolution: MockWritingPrompt = {
  task_type: "Task 2",
  essay_type: "problem_solution",
  topic: "Traffic congestion in cities",
  instruction: "Write about the following topic: Traffic congestion is a major problem in many cities around the world. What are the main causes of this problem? What measures could be taken to address it? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  statement: "Traffic congestion continues to worsen in urban centres despite numerous attempts to address it.",
  time_limit: "40 minutes",
  word_limit: 250,
  model_answer_guide: {
    suggested_structure: "Introduction (contextualise the problem + outline approach) → Body 1 (causes: urban population growth, over-reliance on private cars, inadequate public transport, poor urban planning) → Body 2 (solutions: congestion charging, investment in public transport, cycling infrastructure, flexible working) → Conclusion (summary + outlook)",
    key_arguments: {
      causes: [
        "Rapid urbanisation without corresponding transport infrastructure development",
        "Cultural preference for private vehicles and insufficient public transport",
        "Poor urban planning with residential and commercial zones far apart"
      ],
      solutions: [
        "Congestion charging zones discourage unnecessary car use in city centres",
        "Investment in reliable and affordable public transport as a genuine alternative",
        "Promotion of remote working reduces peak-hour commuter numbers"
      ]
    },
    language_focus: ["Cause-and-effect language (results in, leads to, stems from)", "Solution language (could be addressed by, one measure would be)", "Hedging (while this may not eliminate the problem entirely...)"]
  }
};

// ─── Mock Test Pools ────────────────────────────────────────────────────────

const task1Mocks: MockWritingPrompt[] = [
  mockTask1BarChart,
  mockTask1LineGraph,
  mockTask1PieChart,
];

const task2Mocks: MockWritingPrompt[] = [
  mockTask2Opinion,
  mockTask2Discussion,
  mockTask2ProblemSolution,
];

export function getMockWritingPrompt(taskType: string, _difficulty: string): MockWritingPrompt {
  if (taskType === "Task 1") {
    const idx = Math.floor(Math.random() * task1Mocks.length);
    return task1Mocks[idx];
  }
  const idx = Math.floor(Math.random() * task2Mocks.length);
  return task2Mocks[idx];
}
