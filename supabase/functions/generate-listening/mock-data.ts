/**
 * Mock Listening Test Data — 4-part complete test (fallback only)
 * Primary source is listening_test_library table. This mock ensures
 * the UI still renders if the library is unreachable.
 */

interface QuestionItem {
  number: number;
  label?: string;
  question?: string;
  statement?: string;
  options?: Record<string, string>;
  answer: string;
  transcript_quote: string;
  explanation: string;
}

interface QuestionGroup {
  type: string;
  title?: string;
  instruction: string;
  question_range: [number, number];
  items: QuestionItem[];
}

interface Part {
  part_number: number;
  context: string;
  transcript: string;
  question_groups: QuestionGroup[];
}

interface MockListeningTest {
  title: string;
  difficulty: string;
  totalQuestions: number;
  durationMinutes: number;
  topicTags: string[];
  sections: Part[];
}

function buildMockTest(difficulty: string): MockListeningTest {
  return {
    title: `Sample Test (${difficulty}) — fallback`,
    difficulty,
    totalQuestions: 40,
    durationMinutes: 30,
    topicTags: ["Sample", "Fallback"],
    sections: [
      {
        part_number: 1,
        context: "A student calling the accommodation office about university housing",
        transcript: `OFFICE: University Accommodation Office, good morning.
STUDENT: Hi, I'm calling about on-campus housing for next year.
OFFICE: Of course. Are you looking for single or shared?
STUDENT: Single, if possible.
OFFICE: We have Maple Hall and Cedar Hall. Maple is five minutes from the library, Cedar is near the sports complex.
STUDENT: What's the weekly rent for Maple?
OFFICE: One hundred twenty pounds per week, including utilities and Wi-Fi.
STUDENT: Perfect. Do you have a deposit requirement?
OFFICE: Yes, two hundred fifty pounds to secure your room.
OFFICE: The application deadline for September intake is July fifteenth.
STUDENT: Thank you. Is there parking?
OFFICE: Bicycle storage yes, car parking is limited to staff only.`,
        question_groups: [
          {
            type: "form_completion",
            title: "ACCOMMODATION APPLICATION FORM",
            instruction: "Complete the form. Write NO MORE THAN THREE WORDS AND/OR A NUMBER.",
            question_range: [1, 8],
            items: [
              { number: 1, label: "Preferred hall", answer: "Maple Hall", transcript_quote: "We have Maple Hall and Cedar Hall", explanation: "Student expresses preference for Maple Hall." },
              { number: 2, label: "Distance to library", answer: "five minutes", transcript_quote: "Maple is five minutes from the library", explanation: "Maple Hall is five minutes from the library." },
              { number: 3, label: "Weekly rent", answer: "£120", transcript_quote: "One hundred twenty pounds per week", explanation: "Weekly rent is 120 pounds." },
              { number: 4, label: "What is included", answer: "utilities and Wi-Fi", transcript_quote: "including utilities and Wi-Fi", explanation: "Utilities and Wi-Fi are included." },
              { number: 5, label: "Deposit amount", answer: "£250", transcript_quote: "two hundred fifty pounds to secure your room", explanation: "Deposit is 250 pounds." },
              { number: 6, label: "Application deadline", answer: "July fifteenth", transcript_quote: "July fifteenth", explanation: "Application deadline is July 15th." },
              { number: 7, label: "Bicycle storage", answer: "yes", transcript_quote: "Bicycle storage yes", explanation: "Bicycle storage is available." },
              { number: 8, label: "Car parking", answer: "staff only", transcript_quote: "car parking is limited to staff only", explanation: "Car parking is limited to staff." }
            ]
          },
          {
            type: "multiple_choice",
            instruction: "Choose the correct letter, A, B or C.",
            question_range: [9, 10],
            items: [
              { number: 9, question: "Which hall is near the sports complex?", options: {"A": "Maple Hall", "B": "Cedar Hall", "C": "Oak Hall"}, answer: "B", transcript_quote: "Cedar is near the sports complex", explanation: "Cedar Hall is near the sports complex." },
              { number: 10, question: "What is NOT offered at the halls?", options: {"A": "Wi-Fi", "B": "Car parking", "C": "Utilities"}, answer: "B", transcript_quote: "car parking is limited to staff only", explanation: "Car parking is limited to staff only." }
            ]
          }
        ]
      },
      {
        part_number: 2,
        context: "A tour guide talking about a community centre",
        transcript: `Welcome to the Riverside Community Centre. I'm Sarah, and I'll be showing you around today. We opened in 2015 and serve about three thousand members. The centre has a swimming pool, gymnasium, dance studios, and a climbing wall. Our swimming pool is Olympic-sized, making it one of the largest in the region. The gym has over two hundred pieces of equipment. Most members renew their membership annually, and we offer family discounts. We run about forty classes per week, from yoga to boxing. The pool operates from six in the morning until nine at night on weekdays, and seven to eight on weekends. Membership fees start at thirty pounds monthly for students, sixty for adults, and ninety for families. We also host weekend tournaments for various sports.`,
        question_groups: [
          {
            type: "multiple_choice",
            instruction: "Choose the correct letter, A, B or C.",
            question_range: [11, 13],
            items: [
              { number: 11, question: "When was the centre opened?", options: {"A": "2010", "B": "2013", "C": "2015"}, answer: "C", transcript_quote: "We opened in 2015", explanation: "The centre opened in 2015." },
              { number: 12, question: "How many classes per week are offered?", options: {"A": "Thirty", "B": "Forty", "C": "Fifty"}, answer: "B", transcript_quote: "We run about forty classes per week", explanation: "About forty classes per week." },
              { number: 13, question: "What is the family membership fee?", options: {"A": "Thirty pounds", "B": "Sixty pounds", "C": "Ninety pounds"}, answer: "C", transcript_quote: "ninety for families", explanation: "Family membership is ninety pounds monthly." }
            ]
          },
          {
            type: "note_completion",
            title: "COMMUNITY CENTRE FACILITIES",
            instruction: "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
            question_range: [14, 20],
            items: [
              { number: 14, label: "Established", answer: "2015", transcript_quote: "We opened in 2015", explanation: "The centre opened in 2015." },
              { number: 15, label: "Total members", answer: "three thousand", transcript_quote: "about three thousand members", explanation: "About three thousand members." },
              { number: 16, label: "Pool type", answer: "Olympic-sized", transcript_quote: "Our swimming pool is Olympic-sized", explanation: "The pool is Olympic-sized." },
              { number: 17, label: "Equipment in gym", answer: "200 pieces", transcript_quote: "over two hundred pieces of equipment", explanation: "Over 200 pieces of gym equipment." },
              { number: 18, label: "Classes per week", answer: "40", transcript_quote: "We run about forty classes per week", explanation: "About 40 classes per week." },
              { number: 19, label: "Pool hours (weekdays)", answer: "6am to 9pm", transcript_quote: "six in the morning until nine at night on weekdays", explanation: "Pool opens 6am to 9pm on weekdays." },
              { number: 20, label: "Student membership", answer: "£30", transcript_quote: "thirty pounds monthly for students", explanation: "Student membership is thirty pounds per month." }
            ]
          }
        ]
      },
      {
        part_number: 3,
        context: "Two students discussing their research project",
        transcript: `MAYA: Hi Josh, how's the climate research project going?
JOSH: Pretty well. I've been reading about the urban heat island effect. I think it's really interesting.
MAYA: Yes, that's what I chose too. It's about how cities are warmer than surrounding areas.
JOSH: Exactly. I read that it's caused by less vegetation and more concrete.
MAYA: Right, and car emissions too. I was thinking we could focus on solutions—like green roofs.
JOSH: Good idea. I found some data on cooling systems in cities. Maybe we could compare different approaches.
MAYA: That sounds perfect. When should we meet to discuss more?
JOSH: How about Wednesday afternoon?
MAYA: Wednesday works for me. Let's also include Sarah in the discussion.
JOSH: Yes, she has good ideas about data visualization.`,
        question_groups: [
          {
            type: "matching",
            title: "MATCHING RESEARCH FOCUS",
            instruction: "Match each aspect to its description.",
            question_range: [21, 25],
            items: [
              { number: 21, label: "Josh's main topic", answer: "A", transcript_quote: "I've been reading about the urban heat island effect", explanation: "Josh is focusing on the urban heat island effect." },
              { number: 22, label: "Maya's focus area", answer: "B", transcript_quote: "I was thinking we could focus on solutions—like green roofs", explanation: "Maya wants to focus on solutions like green roofs." },
              { number: 23, label: "Causes mentioned by Josh", answer: "C", transcript_quote: "less vegetation and more concrete", explanation: "Josh mentions vegetation and concrete as causes." },
              { number: 24, label: "Data Maya mentions", answer: "D", transcript_quote: "I found some data on cooling systems in cities", explanation: "Research on cooling systems data." },
              { number: 25, label: "Sarah's strength", answer: "E", transcript_quote: "She has good ideas about data visualization", explanation: "Sarah excels at data visualization." }
            ]
          },
          {
            type: "sentence_completion",
            instruction: "Complete the sentences with NO MORE THAN TWO WORDS.",
            question_range: [26, 30],
            items: [
              { number: 26, sentence: "The urban heat island effect means cities are _______ than surrounding areas.", answer: "warmer", transcript_quote: "cities are warmer than surrounding areas", explanation: "Cities are warmer than surrounding areas." },
              { number: 27, sentence: "The effect is caused by less vegetation and more _______.", answer: "concrete", transcript_quote: "less vegetation and more concrete", explanation: "Concrete is mentioned as a cause." },
              { number: 28, sentence: "Maya suggests using _______ as a solution.", answer: "green roofs", transcript_quote: "like green roofs", explanation: "Green roofs are suggested as a solution." },
              { number: 29, sentence: "The students agree to meet on _______.", answer: "Wednesday afternoon", transcript_quote: "How about Wednesday afternoon?", explanation: "They plan to meet Wednesday afternoon." },
              { number: 30, sentence: "_______ will be included in the discussion.", answer: "Sarah", transcript_quote: "Let's also include Sarah in the discussion", explanation: "Sarah is included in the discussion." }
            ]
          }
        ]
      },
      {
        part_number: 4,
        context: "Academic lecture on urban heat islands",
        transcript: `The phenomenon of urban heat islands is one of the most significant environmental challenges in modern cities. Urban areas typically experience temperatures five to seven degrees Celsius higher than surrounding rural areas. This difference is most pronounced during nighttime hours. The primary causes include the replacement of vegetation with concrete and asphalt, reduced water bodies, and increased human activity. Buildings and roads absorb solar radiation and re-emit it as heat. Additionally, air pollution contributes to the warming effect. The consequences are severe: increased energy consumption for cooling, health risks during heat waves, and negative impacts on local ecosystems. Studies show that cities experience up to twenty percent more rainfall than surrounding areas due to this effect. Solutions include increasing green spaces, installing reflective roofs, improving water management, and promoting sustainable urban planning. Some cities have already implemented these measures with encouraging results. Copenhagen, for example, has reduced urban heat through extensive green corridors and water features. The key to mitigation is understanding that urban design directly influences climate at the local level.`,
        question_groups: [
          {
            type: "note_completion",
            title: "URBAN HEAT ISLAND EFFECT — KEY POINTS",
            instruction: "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
            question_range: [31, 40],
            items: [
              { number: 31, label: "Temperature difference", answer: "5-7°C", transcript_quote: "five to seven degrees Celsius higher", explanation: "Urban areas are 5-7°C warmer." },
              { number: 32, label: "Time most pronounced", answer: "nighttime", transcript_quote: "most pronounced during nighttime hours", explanation: "The difference is most pronounced at night." },
              { number: 33, label: "Primary cause", answer: "concrete and asphalt", transcript_quote: "replacement of vegetation with concrete and asphalt", explanation: "Concrete and asphalt replace vegetation." },
              { number: 34, label: "How buildings contribute", answer: "absorb solar radiation", transcript_quote: "Buildings and roads absorb solar radiation and re-emit it as heat", explanation: "Buildings absorb and re-emit solar radiation as heat." },
              { number: 35, label: "Extra rainfall percentage", answer: "20%", transcript_quote: "up to twenty percent more rainfall", explanation: "Cities get up to 20% more rainfall." },
              { number: 36, label: "One solution", answer: "green spaces", transcript_quote: "increasing green spaces", explanation: "Increasing green spaces is a solution." },
              { number: 37, label: "Roof modification", answer: "reflective roofs", transcript_quote: "installing reflective roofs", explanation: "Installing reflective roofs helps." },
              { number: 38, label: "Example city", answer: "Copenhagen", transcript_quote: "Copenhagen, for example, has reduced urban heat", explanation: "Copenhagen has successfully implemented solutions." },
              { number: 39, label: "Copenhagen strategy", answer: "green corridors and water", transcript_quote: "green corridors and water features", explanation: "Copenhagen uses green corridors and water features." },
              { number: 40, label: "Key factor for mitigation", answer: "urban design", transcript_quote: "urban design directly influences climate", explanation: "Urban design is key to mitigation." }
            ]
          }
        ]
      }
    ]
  };
}

export function getMockListeningTest(part: string, difficulty: string): MockListeningTest {
  return buildMockTest(difficulty);
}

export type { MockListeningTest };
