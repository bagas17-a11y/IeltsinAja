-- ============================================================
-- Seed Listening Test Library with 10 Cambridge-style tests
-- 4 parts × 10 questions each = 40 questions per test
-- Difficulties: 3 easy, 3 medium, 4 hard
-- ============================================================

INSERT INTO public.listening_test_library (title, difficulty, total_questions, duration_minutes, sections, topic_tags, is_active)
VALUES

-- Test 1: "Everyday Encounters" (MEDIUM)
('Everyday Encounters', 'medium', 40, 30, '[
  {
    "part_number": 1,
    "context": "A student calling the accommodation office about university housing",
    "transcript": "OFFICE: University Accommodation Office, good morning.\nSTUDENT: Hi, I''m calling about on-campus housing for next year.\nOFFICE: Of course. Are you looking for single or shared?\nSTUDENT: Single, if possible.\nOFFICE: We have Maple Hall and Cedar Hall. Maple is five minutes from the library, Cedar is near the sports complex.\nSTUDENT: What''s the weekly rent for Maple?\nOFFICE: One hundred twenty pounds per week, including utilities and Wi-Fi.\nSTUDENT: Perfect. Do you have a deposit requirement?\nOFFICE: Yes, two hundred fifty pounds to secure your room.\nOFFICE: The application deadline for September intake is July fifteenth.\nSTUDENT: Thank you. Is there parking?\nOFFICE: Bicycle storage yes, car parking is limited to staff only.",
    "question_groups": [
      {
        "type": "form_completion",
        "title": "ACCOMMODATION APPLICATION FORM",
        "instruction": "Complete the form. Write NO MORE THAN THREE WORDS AND/OR A NUMBER.",
        "question_range": [1, 8],
        "items": [
          { "number": 1, "label": "Preferred hall", "answer": "Maple Hall", "transcript_quote": "We have Maple Hall and Cedar Hall", "explanation": "Student expresses preference for Maple Hall." },
          { "number": 2, "label": "Distance to library", "answer": "five minutes", "transcript_quote": "Maple is five minutes from the library", "explanation": "Maple Hall is five minutes from the library." },
          { "number": 3, "label": "Weekly rent", "answer": "£120 / one hundred twenty pounds", "transcript_quote": "One hundred twenty pounds per week", "explanation": "Weekly rent is 120 pounds." },
          { "number": 4, "label": "What is included", "answer": "utilities and Wi-Fi", "transcript_quote": "including utilities and Wi-Fi", "explanation": "Utilities and Wi-Fi are included." },
          { "number": 5, "label": "Deposit amount", "answer": "£250 / two hundred fifty pounds", "transcript_quote": "two hundred fifty pounds to secure your room", "explanation": "Deposit is 250 pounds." },
          { "number": 6, "label": "Application deadline", "answer": "July fifteenth / 15 July", "transcript_quote": "July fifteenth", "explanation": "Application deadline is July 15th." },
          { "number": 7, "label": "Bicycle storage", "answer": "yes", "transcript_quote": "Bicycle storage yes", "explanation": "Bicycle storage is available." },
          { "number": 8, "label": "Car parking", "answer": "staff only / limited", "transcript_quote": "car parking is limited to staff only", "explanation": "Car parking is limited to staff." }
        ]
      },
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [9, 10],
        "items": [
          { "number": 9, "question": "Which hall is near the sports complex?", "options": {"A": "Maple Hall", "B": "Cedar Hall", "C": "Oak Hall"}, "answer": "B", "transcript_quote": "Cedar is near the sports complex", "explanation": "Cedar Hall is near the sports complex." },
          { "number": 10, "question": "What is NOT offered at the halls?", "options": {"A": "Wi-Fi", "B": "Car parking", "C": "Utilities"}, "answer": "B", "transcript_quote": "car parking is limited to staff only", "explanation": "Car parking is limited to staff only, not available to students." }
        ]
      }
    ]
  },
  {
    "part_number": 2,
    "context": "A tour guide talking about a community centre",
    "transcript": "Welcome to the Riverside Community Centre. I''m Sarah, and I''ll be showing you around today. We opened in 2015 and serve about three thousand members. The centre has a swimming pool, gymnasium, dance studios, and a climbing wall. Our swimming pool is Olympic-sized, making it one of the largest in the region. The gym has over two hundred pieces of equipment. Most members renew their membership annually, and we offer family discounts. We run about forty classes per week, from yoga to boxing. The pool operates from six in the morning until nine at night on weekdays, and seven to eight on weekends. Membership fees start at thirty pounds monthly for students, sixty for adults, and ninety for families. We also host weekend tournaments for various sports.",
    "question_groups": [
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [11, 13],
        "items": [
          { "number": 11, "question": "When was the centre opened?", "options": {"A": "2010", "B": "2013", "C": "2015"}, "answer": "C", "transcript_quote": "We opened in 2015", "explanation": "The centre opened in 2015." },
          { "number": 12, "question": "How many classes per week are offered?", "options": {"A": "Thirty", "B": "Forty", "C": "Fifty"}, "answer": "B", "transcript_quote": "We run about forty classes per week", "explanation": "About forty classes per week." },
          { "number": 13, "question": "What is the family membership fee?", "options": {"A": "Thirty pounds", "B": "Sixty pounds", "C": "Ninety pounds"}, "answer": "C", "transcript_quote": "ninety for families", "explanation": "Family membership is ninety pounds monthly." }
        ]
      },
      {
        "type": "note_completion",
        "title": "COMMUNITY CENTRE FACILITIES",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [14, 20],
        "items": [
          { "number": 14, "label": "Established", "answer": "2015", "transcript_quote": "We opened in 2015", "explanation": "The centre opened in 2015." },
          { "number": 15, "label": "Total members", "answer": "three thousand", "transcript_quote": "about three thousand members", "explanation": "About three thousand members." },
          { "number": 16, "label": "Pool type", "answer": "Olympic-sized", "transcript_quote": "Our swimming pool is Olympic-sized", "explanation": "The pool is Olympic-sized." },
          { "number": 17, "label": "Equipment in gym", "answer": "200 / two hundred pieces", "transcript_quote": "over two hundred pieces of equipment", "explanation": "Over 200 pieces of gym equipment." },
          { "number": 18, "label": "Classes per week", "answer": "40 / forty", "transcript_quote": "We run about forty classes per week", "explanation": "About 40 classes per week." },
          { "number": 19, "label": "Pool hours (weekdays)", "answer": "6am to 9pm / six to nine", "transcript_quote": "six in the morning until nine at night on weekdays", "explanation": "Pool opens 6am to 9pm on weekdays." },
          { "number": 20, "label": "Student membership", "answer": "£30 / thirty pounds", "transcript_quote": "thirty pounds monthly for students", "explanation": "Student membership is thirty pounds per month." }
        ]
      }
    ]
  },
  {
    "part_number": 3,
    "context": "Two students discussing their research project",
    "transcript": "MAYA: Hi Josh, how''s the climate research project going?\nJOSH: Pretty well. I''ve been reading about the urban heat island effect. I think it''s really interesting.\nMAYA: Yes, that''s what I chose too. It''s about how cities are warmer than surrounding areas.\nJOSH: Exactly. I read that it''s caused by less vegetation and more concrete.\nMAYA: Right, and car emissions too. I was thinking we could focus on solutions—like green roofs.\nJOSH: Good idea. I found some data on cooling systems in cities. Maybe we could compare different approaches.\nMAYA: That sounds perfect. When should we meet to discuss more?\nJOSH: How about Wednesday afternoon?\nMAYA: Wednesday works for me. Let''s also include Sarah in the discussion.\nJOSH: Yes, she has good ideas about data visualization.",
    "question_groups": [
      {
        "type": "matching",
        "title": "MATCHING RESEARCH FOCUS",
        "instruction": "Match each person with their research interest.",
        "question_range": [21, 25],
        "options_pool": {
          "A": "cooling systems data",
          "B": "urban heat island effect",
          "C": "car emissions",
          "D": "green roof solutions",
          "E": "less vegetation and more concrete",
          "F": "data visualization"
        },
        "items": [
          { "number": 21, "label": "Josh''s main topic", "answer": "B", "transcript_quote": "I''ve been reading about the urban heat island effect", "explanation": "Josh is focusing on the urban heat island effect." },
          { "number": 22, "label": "Maya''s focus area", "answer": "D", "transcript_quote": "I was thinking we could focus on solutions—like green roofs", "explanation": "Maya wants to focus on solutions like green roofs." },
          { "number": 23, "label": "Causes mentioned by Josh", "answer": "E", "transcript_quote": "less vegetation and more concrete", "explanation": "Josh mentions vegetation and concrete as causes." },
          { "number": 24, "label": "Data Maya mentions", "answer": "A", "transcript_quote": "I found some data on cooling systems in cities", "explanation": "Research on cooling systems data." },
          { "number": 25, "label": "Sarah''s strength", "answer": "F", "transcript_quote": "She has good ideas about data visualization", "explanation": "Sarah excels at data visualization." }
        ]
      },
      {
        "type": "sentence_completion",
        "instruction": "Complete the sentences with NO MORE THAN TWO WORDS.",
        "question_range": [26, 30],
        "items": [
          { "number": 26, "sentence": "The urban heat island effect means cities are _______ than surrounding areas.", "answer": "warmer", "transcript_quote": "cities are warmer than surrounding areas", "explanation": "Cities are warmer than surrounding areas." },
          { "number": 27, "sentence": "The effect is caused by less vegetation and more _______.", "answer": "concrete", "transcript_quote": "less vegetation and more concrete", "explanation": "Concrete is mentioned as a cause." },
          { "number": 28, "sentence": "Maya suggests using _______ as a solution.", "answer": "green roofs", "transcript_quote": "like green roofs", "explanation": "Green roofs are suggested as a solution." },
          { "number": 29, "sentence": "The students agree to meet on _______.", "answer": "Wednesday afternoon", "transcript_quote": "How about Wednesday afternoon?", "explanation": "They plan to meet Wednesday afternoon." },
          { "number": 30, "sentence": "_______ will be included in the discussion.", "answer": "Sarah", "transcript_quote": "Let''s also include Sarah in the discussion", "explanation": "Sarah is included in the discussion." }
        ]
      }
    ]
  },
  {
    "part_number": 4,
    "context": "Academic lecture on urban heat islands",
    "transcript": "The phenomenon of urban heat islands is one of the most significant environmental challenges in modern cities. Urban areas typically experience temperatures five to seven degrees Celsius higher than surrounding rural areas. This difference is most pronounced during nighttime hours. The primary causes include the replacement of vegetation with concrete and asphalt, reduced water bodies, and increased human activity. Buildings and roads absorb solar radiation and re-emit it as heat. Additionally, air pollution contributes to the warming effect. The consequences are severe: increased energy consumption for cooling, health risks during heat waves, and negative impacts on local ecosystems. Studies show that cities experience up to twenty percent more rainfall than surrounding areas due to this effect. Solutions include increasing green spaces, installing reflective roofs, improving water management, and promoting sustainable urban planning. Some cities have already implemented these measures with encouraging results. Copenhagen, for example, has reduced urban heat through extensive green corridors and water features. The key to mitigation is understanding that urban design directly influences climate at the local level.",
    "question_groups": [
      {
        "type": "note_completion",
        "title": "URBAN HEAT ISLAND EFFECT — KEY POINTS",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [31, 40],
        "items": [
          { "number": 31, "label": "Temperature difference", "answer": "5-7°C / five to seven degrees", "transcript_quote": "five to seven degrees Celsius higher", "explanation": "Urban areas are 5-7°C warmer." },
          { "number": 32, "label": "Time most pronounced", "answer": "nighttime / at night", "transcript_quote": "most pronounced during nighttime hours", "explanation": "The difference is most pronounced at night." },
          { "number": 33, "label": "Primary cause", "answer": "concrete and asphalt", "transcript_quote": "replacement of vegetation with concrete and asphalt", "explanation": "Concrete and asphalt replace vegetation." },
          { "number": 34, "label": "How buildings contribute", "answer": "absorb solar radiation", "transcript_quote": "Buildings and roads absorb solar radiation and re-emit it as heat", "explanation": "Buildings absorb and re-emit solar radiation as heat." },
          { "number": 35, "label": "Extra rainfall percentage", "answer": "20% / twenty percent", "transcript_quote": "up to twenty percent more rainfall", "explanation": "Cities get up to 20% more rainfall." },
          { "number": 36, "label": "One solution", "answer": "green spaces / green corridors", "transcript_quote": "increasing green spaces", "explanation": "Increasing green spaces is a solution." },
          { "number": 37, "label": "Roof modification", "answer": "reflective roofs / install reflective", "transcript_quote": "installing reflective roofs", "explanation": "Installing reflective roofs helps." },
          { "number": 38, "label": "Example city", "answer": "Copenhagen", "transcript_quote": "Copenhagen, for example, has reduced urban heat", "explanation": "Copenhagen has successfully implemented solutions." },
          { "number": 39, "label": "Copenhagen strategy", "answer": "green corridors and water features", "transcript_quote": "green corridors and water features", "explanation": "Copenhagen uses green corridors and water features." },
          { "number": 40, "label": "Key factor for mitigation", "answer": "urban design", "transcript_quote": "urban design directly influences climate", "explanation": "Urban design is key to mitigation." }
        ]
      }
    ]
  }
]', ARRAY['accommodation', 'community', 'research', 'urban', 'environment'], true),

-- Test 2: "Student Life" (MEDIUM)
('Student Life', 'medium', 40, 30, '[
  {
    "part_number": 1,
    "context": "A student registering at a university library",
    "transcript": "LIBRARIAN: Good morning. Welcome to our library. May I take your name?\nSTUDENT: It''s Alex Chen.\nLIBRARIAN: How do you spell your surname?\nSTUDENT: C-H-E-N.\nLIBRARIAN: Thank you. And your student number?\nSTUDENT: It''s 4729185.\nLIBRARIAN: Are you a first-year student?\nSTUDENT: Yes, starting this September.\nLIBRARIAN: Excellent. We''re open from eight in the morning until midnight, seven days a week. You can borrow up to twenty books at a time, and they''re due back in three weeks.\nSTUDENT: Can I renew books online?\nLIBRARIAN: Yes, you can renew them if there are no other requests.\nSTUDENT: What about the computer labs?\nLIBRARIAN: The labs are available from nine until eleven at night. We have three hundred computers across six floors.",
    "question_groups": [
      {
        "type": "form_completion",
        "title": "LIBRARY REGISTRATION",
        "instruction": "Complete the form. Write NO MORE THAN THREE WORDS AND/OR A NUMBER.",
        "question_range": [1, 8],
        "items": [
          { "number": 1, "label": "Student name", "answer": "Alex Chen", "transcript_quote": "It''s Alex Chen", "explanation": "Student''s name is Alex Chen." },
          { "number": 2, "label": "Student number", "answer": "4729185", "transcript_quote": "It''s 4729185", "explanation": "Student ID is 4729185." },
          { "number": 3, "label": "Year of study", "answer": "first-year / 1st year", "transcript_quote": "Are you a first-year student? Yes", "explanation": "Alex is a first-year student." },
          { "number": 4, "label": "Library opening time", "answer": "8am / eight in the morning", "transcript_quote": "from eight in the morning", "explanation": "Library opens at 8am." },
          { "number": 5, "label": "Library closing time", "answer": "midnight / 12am", "transcript_quote": "until midnight", "explanation": "Library closes at midnight." },
          { "number": 6, "label": "Maximum books to borrow", "answer": "20 / twenty", "transcript_quote": "borrow up to twenty books at a time", "explanation": "Can borrow up to 20 books." },
          { "number": 7, "label": "Return period", "answer": "3 weeks / three weeks", "transcript_quote": "due back in three weeks", "explanation": "Books are due back in 3 weeks." },
          { "number": 8, "label": "Computer lab closing time", "answer": "11pm / eleven at night", "transcript_quote": "from nine until eleven at night", "explanation": "Labs close at 11pm." }
        ]
      },
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [9, 10],
        "items": [
          { "number": 9, "question": "How many computers are in the labs?", "options": {"A": "100", "B": "200", "C": "300"}, "answer": "C", "transcript_quote": "We have three hundred computers", "explanation": "There are 300 computers total." },
          { "number": 10, "question": "What condition must be met to renew a book?", "options": {"A": "No outstanding fees", "B": "No other requests", "C": "Less than 1 week old"}, "answer": "B", "transcript_quote": "you can renew them if there are no other requests", "explanation": "Books can be renewed if there are no other requests." }
        ]
      }
    ]
  },
  {
    "part_number": 2,
    "context": "A campus tour guide showing around the university",
    "transcript": "Welcome everyone to the University of Riverside. I''m your tour guide today. We have over eighteen thousand students here from eighty-five different countries. The university was founded in nineteen eighty-two and has grown significantly. We have five academic buildings, each specializing in different disciplines. The Science Complex is the newest, built just two years ago and features state-of-the-art laboratories. Our library contains over two million books and provides digital access to thousands of journals. The student union building, which we''re heading to now, is the heart of campus social life. We have more than one hundred and fifty student clubs and societies. Sports facilities include a stadium with five thousand capacity, indoor and outdoor pools, and tennis courts. Student accommodation is available on-campus for first and second-year students. The campus has excellent transport links with buses arriving every ten minutes. We''re also committed to sustainability—fifty percent of our energy comes from renewable sources. The campus grounds cover approximately two hundred acres.",
    "question_groups": [
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [11, 13],
        "items": [
          { "number": 11, "question": "How many students attend the university?", "options": {"A": "8,000", "B": "18,000", "C": "25,000"}, "answer": "B", "transcript_quote": "over eighteen thousand students", "explanation": "Over 18,000 students." },
          { "number": 12, "question": "When was the Science Complex built?", "options": {"A": "Two years ago", "B": "Five years ago", "C": "Ten years ago"}, "answer": "A", "transcript_quote": "built just two years ago", "explanation": "The Science Complex was built two years ago." },
          { "number": 13, "question": "How many student clubs exist?", "options": {"A": "Over 100", "B": "Over 150", "C": "Over 200"}, "answer": "B", "transcript_quote": "more than one hundred and fifty student clubs", "explanation": "More than 150 clubs and societies." }
        ]
      },
      {
        "type": "note_completion",
        "title": "UNIVERSITY CAMPUS INFORMATION",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [14, 20],
        "items": [
          { "number": 14, "label": "Founded year", "answer": "1982 / nineteen eighty-two", "transcript_quote": "founded in nineteen eighty-two", "explanation": "University was founded in 1982." },
          { "number": 15, "label": "Number of countries represented", "answer": "85 / eighty-five", "transcript_quote": "eighty-five different countries", "explanation": "Students from 85 countries." },
          { "number": 16, "label": "Books in library", "answer": "2 million / two million", "transcript_quote": "over two million books", "explanation": "Library has over 2 million books." },
          { "number": 17, "label": "Stadium capacity", "answer": "5,000 / five thousand", "transcript_quote": "stadium with five thousand capacity", "explanation": "Stadium capacity is 5,000." },
          { "number": 18, "label": "Bus frequency", "answer": "10 minutes / every ten minutes", "transcript_quote": "buses arriving every ten minutes", "explanation": "Buses arrive every 10 minutes." },
          { "number": 19, "label": "Renewable energy percentage", "answer": "50% / fifty percent", "transcript_quote": "fifty percent of our energy comes from renewable sources", "explanation": "50% of energy from renewable sources." },
          { "number": 20, "label": "Campus size", "answer": "200 acres / approximately 200", "transcript_quote": "approximately two hundred acres", "explanation": "Campus is about 200 acres." }
        ]
      }
    ]
  },
  {
    "part_number": 3,
    "context": "Students discussing their research methods",
    "transcript": "EMMA: Hi Tom, how''s your literature review going?\nTOM: It''s challenging. I''m trying to find recent sources on climate change and agriculture.\nEMMA: That''s an interesting combination. I''m doing something similar—combining economics with environmental studies.\nTOM: The problem is there''s so much conflicting information out there.\nEMMA: I know. I''ve been using different databases to compare sources. Google Scholar is helpful, but JSTOR gives more academic articles.\nTOM: Right. Do you check the publication dates?\nEMMA: Absolutely. I only use sources from the last five years mostly, especially for science topics.\nTOM: Smart. I''ve also been looking at government reports—they often have reliable data.\nEMMA: Good point. I hadn''t considered those. What about methodology—how do you evaluate the quality?\nTOM: I look at the sample size and whether the research is peer-reviewed.\nEMMA: That''s useful. We should share our findings sometime.",
    "question_groups": [
      {
        "type": "matching",
        "title": "MATCHING RESEARCH METHODS",
        "instruction": "Match the topic with the resource or method mentioned.",
        "question_range": [21, 25],
        "options_pool": {
          "A": "Google Scholar",
          "B": "climate change and agriculture",
          "C": "economics and environmental studies",
          "D": "JSTOR",
          "E": "government reports",
          "F": "peer-review status"
        },
        "items": [
          { "number": 21, "label": "Tom''s research focus", "answer": "B", "transcript_quote": "I''m trying to find recent sources on climate change and agriculture", "explanation": "Tom is researching climate change and agriculture." },
          { "number": 22, "label": "Emma''s field combination", "answer": "C", "transcript_quote": "I''m doing something similar—combining economics with environmental studies", "explanation": "Emma combines economics and environmental studies." },
          { "number": 23, "label": "Better for academic articles", "answer": "D", "transcript_quote": "JSTOR gives more academic articles", "explanation": "JSTOR provides more academic articles." },
          { "number": 24, "label": "Sources for reliable data", "answer": "E", "transcript_quote": "government reports—they often have reliable data", "explanation": "Government reports provide reliable data." },
          { "number": 25, "label": "Quality evaluation criterion", "answer": "F", "transcript_quote": "whether the research is peer-reviewed", "explanation": "Peer-review status indicates quality." }
        ]
      },
      {
        "type": "sentence_completion",
        "instruction": "Complete the sentences with NO MORE THAN TWO WORDS.",
        "question_range": [26, 30],
        "items": [
          { "number": 26, "sentence": "Tom finds _______ in the available sources.", "answer": "conflicting information", "transcript_quote": "conflicting information out there", "explanation": "Tom mentions conflicting information in sources." },
          { "number": 27, "sentence": "Emma mainly uses sources from _______ or more recent.", "answer": "last five years", "transcript_quote": "from the last five years mostly", "explanation": "Emma uses recent sources, primarily from last 5 years." },
          { "number": 28, "sentence": "Tom checks _______ when selecting sources.", "answer": "publication dates", "transcript_quote": "Do you check the publication dates?", "explanation": "Publication date is an important check." },
          { "number": 29, "sentence": "Emma considers _______ as an indicator of quality.", "answer": "sample size", "transcript_quote": "I look at the sample size", "explanation": "Sample size indicates research quality." },
          { "number": 30, "sentence": "Both students agree to _______ later.", "answer": "share findings", "transcript_quote": "We should share our findings sometime", "explanation": "They plan to share findings." }
        ]
      }
    ]
  },
  {
    "part_number": 4,
    "context": "Biology lecture on migration patterns",
    "transcript": "Today I want to discuss one of nature''s most remarkable phenomena: animal migration. Migration is the seasonal movement of animals from one location to another. While some animals migrate short distances, others travel thousands of kilometers. The Arctic tern, for example, completes the longest migration on Earth, traveling approximately forty-four thousand kilometers annually between Arctic and Antarctic regions. Birds migrate primarily due to seasonal changes in food availability and climate. Many birds use the sun''s position to navigate, while others rely on magnetic fields. Magnetic navigation is particularly useful for nocturnal migrants that cannot use visual cues. Land mammals also migrate, though usually over shorter distances. The wildebeest migration in East Africa involves up to two million animals moving between Tanzania and Kenya annually. Marine species like whales and sea turtles undertake long ocean migrations spanning thousands of miles. Recent research suggests that climate change is disrupting traditional migration patterns, causing timing mismatches between arrival and food availability. This phenomenon threatens many species with declining populations. Conservation efforts focus on protecting migration corridors and stopover habitats. Understanding migration is crucial for species preservation and ecosystem health.",
    "question_groups": [
      {
        "type": "note_completion",
        "title": "ANIMAL MIGRATION — LECTURE NOTES",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [31, 40],
        "items": [
          { "number": 31, "label": "Definition of migration", "answer": "seasonal movement", "transcript_quote": "Migration is the seasonal movement of animals", "explanation": "Migration is seasonal movement." },
          { "number": 32, "label": "Arctic tern distance", "answer": "44,000 km / forty-four thousand", "transcript_quote": "traveling approximately forty-four thousand kilometers annually", "explanation": "Arctic tern travels 44,000 km per year." },
          { "number": 33, "label": "Reason birds migrate", "answer": "food availability and climate", "transcript_quote": "seasonal changes in food availability and climate", "explanation": "Birds migrate due to food and climate changes." },
          { "number": 34, "label": "Navigation method in darkness", "answer": "magnetic fields / magnetic navigation", "transcript_quote": "Magnetic navigation is particularly useful for nocturnal migrants", "explanation": "Nocturnal birds use magnetic navigation." },
          { "number": 35, "label": "Wildebeest migration number", "answer": "2 million / two million", "transcript_quote": "up to two million animals", "explanation": "Up to 2 million wildebeest migrate." },
          { "number": 36, "label": "Wildebeest migration countries", "answer": "Tanzania and Kenya", "transcript_quote": "moving between Tanzania and Kenya", "explanation": "Wildebeest migrate between Tanzania and Kenya." },
          { "number": 37, "label": "Marine species mentioned", "answer": "whales and sea turtles", "transcript_quote": "whales and sea turtles undertake long ocean migrations", "explanation": "Whales and turtles migrate oceanic routes." },
          { "number": 38, "label": "Migration problem from climate", "answer": "timing mismatches", "transcript_quote": "timing mismatches between arrival and food availability", "explanation": "Climate change causes timing mismatches." },
          { "number": 39, "label": "Protected areas for migration", "answer": "migration corridors", "transcript_quote": "protecting migration corridors and stopover habitats", "explanation": "Migration corridors are protected." },
          { "number": 40, "label": "Reason for understanding migration", "answer": "species preservation", "transcript_quote": "crucial for species preservation and ecosystem health", "explanation": "Understanding migration is crucial for preservation." }
        ]
      }
    ]
  }
]', ARRAY['accommodation', 'campus', 'library', 'research', 'migration'], true),

-- Test 3: "Working World" (HARD)
('Working World', 'hard', 40, 30, '[
  {
    "part_number": 1,
    "context": "A job candidate having a telephone interview for a managerial position",
    "transcript": "INTERVIEWER: Thank you for calling in today. We appreciate your interest in the Operations Manager position.\nCANDIDATE: Thank you for the opportunity. I''m excited about this role.\nINTERVIEWER: Can you tell me about your current position?\nCANDIDATE: I''m currently a Senior Logistics Coordinator at Transport Solutions. I''ve been there for three years.\nINTERVIEWER: What are your key responsibilities?\nCANDIDATE: I oversee a team of eight people, manage supply chain logistics, and coordinate with international partners.\nINTERVIEWER: Have you handled budget responsibilities?\nCANDIDATE: Yes, I manage a budget of approximately two million pounds annually.\nINTERVIEWER: That''s impressive. What''s your availability if offered the position?\nCANDIDATE: I could start in four weeks, after completing my current projects.\nINTERVIEWER: Excellent. We need someone to start by September fifteenth. Would that work?\nCANDIDATE: Yes, September fifteenth works perfectly.",
    "question_groups": [
      {
        "type": "form_completion",
        "title": "JOB INTERVIEW RECORD — CANDIDATE DETAILS",
        "instruction": "Complete the form. Write NO MORE THAN THREE WORDS AND/OR A NUMBER.",
        "question_range": [1, 8],
        "items": [
          { "number": 1, "label": "Position applied for", "answer": "Operations Manager", "transcript_quote": "Operations Manager position", "explanation": "Candidate is interviewing for Operations Manager role." },
          { "number": 2, "label": "Current job title", "answer": "Senior Logistics Coordinator", "transcript_quote": "Senior Logistics Coordinator at Transport Solutions", "explanation": "Currently a Senior Logistics Coordinator." },
          { "number": 3, "label": "Current employer", "answer": "Transport Solutions", "transcript_quote": "Transport Solutions", "explanation": "Works at Transport Solutions." },
          { "number": 4, "label": "Time in current role", "answer": "3 years / three years", "transcript_quote": "been there for three years", "explanation": "Been in current role for 3 years." },
          { "number": 5, "label": "Team size managed", "answer": "8 / eight people", "transcript_quote": "oversee a team of eight people", "explanation": "Manages a team of 8 people." },
          { "number": 6, "label": "Annual budget managed", "answer": "£2 million / two million pounds", "transcript_quote": "a budget of approximately two million pounds annually", "explanation": "Manages a 2 million pound budget." },
          { "number": 7, "label": "Notice period", "answer": "4 weeks / four weeks", "transcript_quote": "start in four weeks", "explanation": "Requires 4 weeks notice." },
          { "number": 8, "label": "Earliest start date", "answer": "September fifteenth / 15 September", "transcript_quote": "start by September fifteenth", "explanation": "Can start September 15th." }
        ]
      },
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [9, 10],
        "items": [
          { "number": 9, "question": "What is a key responsibility of the candidate?", "options": {"A": "International partner coordination", "B": "Sales management", "C": "Customer service"}, "answer": "A", "transcript_quote": "coordinate with international partners", "explanation": "International coordination is a key responsibility." },
          { "number": 10, "question": "Why does the candidate need four weeks?", "options": {"A": "Vacation time", "B": "Complete current projects", "C": "Training period"}, "answer": "B", "transcript_quote": "after completing my current projects", "explanation": "Needs time to complete current projects." }
        ]
      }
    ]
  },
  {
    "part_number": 2,
    "context": "HR manager conducting workplace induction for new employees",
    "transcript": "Welcome to Horizon Industries. I''m Richard from Human Resources. Our company was established in nineteen ninety-eight and now employs over four thousand people across twelve different countries. We operate in the technology and manufacturing sectors. Our mission is to provide innovative solutions while maintaining ethical business practices. Regarding employment benefits, you''ll receive twenty-three days of annual leave, plus public holidays. We offer comprehensive health insurance covering dental and vision care. The company pension scheme starts contribution matching at three percent of your salary after six months of employment. Our workplace wellness program includes subsidized gym membership, mental health support, and nutrition counseling. Work-life balance is a priority—flexible working arrangements are available subject to manager approval. The company offers professional development through in-house training and conference attendance budgets of up to fifteen hundred pounds annually. We have zero-tolerance policies regarding discrimination and harassment. Performance reviews occur biannually. The staff canteen provides meals at subsidized rates, with most dishes under five pounds.",
    "question_groups": [
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [11, 13],
        "items": [
          { "number": 11, "question": "When was the company established?", "options": {"A": "1988", "B": "1998", "C": "2008"}, "answer": "B", "transcript_quote": "established in nineteen ninety-eight", "explanation": "Company was established in 1998." },
          { "number": 12, "question": "How many countries does the company operate in?", "options": {"A": "Eight", "B": "Ten", "C": "Twelve"}, "answer": "C", "transcript_quote": "across twelve different countries", "explanation": "Company operates in 12 countries." },
          { "number": 13, "question": "What is covered by health insurance?", "options": {"A": "Dental only", "B": "Dental and vision", "C": "Vision only"}, "answer": "B", "transcript_quote": "covering dental and vision care", "explanation": "Insurance covers dental and vision care." }
        ]
      },
      {
        "type": "note_completion",
        "title": "WORKPLACE BENEFITS AND POLICIES",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [14, 20],
        "items": [
          { "number": 14, "label": "Annual leave entitlement", "answer": "23 days / twenty-three days", "transcript_quote": "twenty-three days of annual leave", "explanation": "Employees receive 23 days annual leave." },
          { "number": 15, "label": "Pension contribution matching", "answer": "3% / three percent", "transcript_quote": "three percent of your salary", "explanation": "Company matches 3% pension contribution." },
          { "number": 16, "label": "When pension matching starts", "answer": "6 months / after six months", "transcript_quote": "after six months of employment", "explanation": "Pension matching begins after 6 months." },
          { "number": 17, "label": "Mental health support provided", "answer": "yes / mental health support", "transcript_quote": "mental health support", "explanation": "Mental health support is provided." },
          { "number": 18, "label": "Conference budget annually", "answer": "£1500 / fifteen hundred pounds", "transcript_quote": "conference attendance budgets of up to fifteen hundred pounds annually", "explanation": "Annual conference budget is up to 1500 pounds." },
          { "number": 19, "label": "Review frequency", "answer": "biannually / twice yearly", "transcript_quote": "Performance reviews occur biannually", "explanation": "Performance reviews happen biannually." },
          { "number": 20, "label": "Typical canteen meal price", "answer": "under £5 / under five pounds", "transcript_quote": "most dishes under five pounds", "explanation": "Most canteen meals cost under 5 pounds." }
        ]
      }
    ]
  },
  {
    "part_number": 3,
    "context": "Engineers discussing a challenging manufacturing project",
    "transcript": "JAMES: The prototype has some issues we need to address before the client presentation.\nSARAH: What problems have you identified?\nJAMES: The vibration levels are too high. We''ve exceeded the acceptable tolerance by about fifteen percent.\nSARAH: That''s significant. Is it a design issue or manufacturing?\nJAMES: Could be both. I suspect the bearing alignment is off, but the material grade might also contribute.\nSARAH: Have you run stress tests?\nJAMES: Preliminary ones, yes. The aluminum frames show stress concentrations at the corners.\nSARAH: We need to reinforce those areas. What about the cost implications?\nJAMES: That''s the tricky part. Redesigning the frame would add about ten percent to production costs.\nSARAH: But if we don''t fix it, we''ll lose the contract. What''s the timeline?\nJAMES: The presentation is in three weeks. We could have a revised prototype in two weeks if we prioritize the engineering.\nSARAH: I''ll discuss this with management. We should also verify durability.\nJAMES: Agreed. I''ll schedule extended testing.",
    "question_groups": [
      {
        "type": "matching",
        "title": "MATCHING TECHNICAL ISSUES AND CAUSES",
        "instruction": "Match the issue with the potential cause identified.",
        "question_range": [21, 25],
        "options_pool": {
          "A": "excessive vibration levels",
          "B": "bearing misalignment",
          "C": "inferior material grade",
          "D": "stress at frame corners",
          "E": "ten percent cost increase",
          "F": "three-week deadline pressure"
        },
        "items": [
          { "number": 21, "label": "Main problem identified", "answer": "A", "transcript_quote": "The vibration levels are too high", "explanation": "Vibration levels exceed acceptable tolerance." },
          { "number": 22, "label": "Possible mechanical cause", "answer": "B", "transcript_quote": "bearing alignment is off", "explanation": "Bearing alignment may be misaligned." },
          { "number": 23, "label": "Possible material factor", "answer": "C", "transcript_quote": "material grade might also contribute", "explanation": "Material grade could be a factor." },
          { "number": 24, "label": "Structural weakness location", "answer": "D", "transcript_quote": "stress concentrations at the corners", "explanation": "Stress concentrations at frame corners." },
          { "number": 25, "label": "Cost increase for redesign", "answer": "E", "transcript_quote": "add about ten percent to production costs", "explanation": "Redesign would increase costs by 10%." }
        ]
      },
      {
        "type": "sentence_completion",
        "instruction": "Complete the sentences with NO MORE THAN TWO WORDS.",
        "question_range": [26, 30],
        "items": [
          { "number": 26, "sentence": "The vibration levels exceed acceptable tolerance by _______.", "answer": "15% / fifteen percent", "transcript_quote": "by about fifteen percent", "explanation": "Vibration exceeds tolerance by 15%." },
          { "number": 27, "sentence": "The material used is _______.", "answer": "aluminum", "transcript_quote": "The aluminum frames", "explanation": "Frames are made of aluminum." },
          { "number": 28, "sentence": "James needs to perform _______ testing to verify durability.", "answer": "extended / extended testing", "transcript_quote": "I''ll schedule extended testing", "explanation": "Extended testing is needed." },
          { "number": 29, "sentence": "The client presentation is in _______.", "answer": "3 weeks / three weeks", "transcript_quote": "The presentation is in three weeks", "explanation": "Presentation is 3 weeks away." },
          { "number": 30, "sentence": "The revised prototype could be ready in _______.", "answer": "2 weeks / two weeks", "transcript_quote": "revised prototype in two weeks", "explanation": "Revised prototype can be ready in 2 weeks." }
        ]
      }
    ]
  },
  {
    "part_number": 4,
    "context": "Lecture on renewable energy innovations",
    "transcript": "The transition to renewable energy is one of the most pressing challenges of the twenty-first century. Global energy demand continues to increase, with electricity consumption growing at approximately three percent annually. Currently, fossil fuels account for eighty-two percent of global energy generation, despite their environmental costs. The renewable energy sector, however, is expanding rapidly. Solar energy is the fastest-growing segment, with photovoltaic costs declining by almost eighty-five percent over the past decade. Wind power, both onshore and offshore, now contributes approximately nine percent of global electricity. Battery storage technology is crucial for renewable energy adoption, as it addresses intermittency issues—the main limitation of solar and wind. Lithium-ion battery costs have dropped seventy percent in the last eight years. Emerging technologies like green hydrogen and advanced geothermal show promise for energy-intensive industries. The International Energy Agency projects that renewables will constitute thirty percent of global electricity by twenty thirty. However, significant infrastructure investment is needed—approximately two trillion dollars annually through twenty thirty. Policy support through subsidies, carbon pricing, and regulatory frameworks is essential. Many countries have adopted net-zero targets, though implementation varies considerably. Education and workforce development are critical for scaling renewable technologies.",
    "question_groups": [
      {
        "type": "note_completion",
        "title": "RENEWABLE ENERGY TRANSITION — KEY STATISTICS",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [31, 40],
        "items": [
          { "number": 31, "label": "Annual electricity consumption growth", "answer": "3% / three percent", "transcript_quote": "approximately three percent annually", "explanation": "Electricity consumption grows 3% annually." },
          { "number": 32, "label": "Current fossil fuel percentage", "answer": "82% / eighty-two percent", "transcript_quote": "eighty-two percent of global energy", "explanation": "Fossil fuels provide 82% of energy." },
          { "number": 33, "label": "Fastest-growing renewable source", "answer": "solar energy / solar", "transcript_quote": "Solar energy is the fastest-growing segment", "explanation": "Solar is the fastest-growing renewable." },
          { "number": 34, "label": "Photovoltaic cost reduction", "answer": "85% / eighty-five percent", "transcript_quote": "declined by almost eighty-five percent", "explanation": "Solar costs dropped 85%." },
          { "number": 35, "label": "Wind power contribution percentage", "answer": "9% / approximately 9 percent", "transcript_quote": "now contributes approximately nine percent", "explanation": "Wind provides approximately 9% of electricity." },
          { "number": 36, "label": "Battery storage technology improvement", "answer": "70% / seventy percent cost drop", "transcript_quote": "dropped seventy percent in the last eight years", "explanation": "Battery costs dropped 70% in 8 years." },
          { "number": 37, "label": "Projected renewable percentage by 2030", "answer": "30% / thirty percent", "transcript_quote": "thirty percent of global electricity by twenty thirty", "explanation": "Renewables projected at 30% by 2030." },
          { "number": 38, "label": "Annual infrastructure investment needed", "answer": "$2 trillion / two trillion dollars", "transcript_quote": "approximately two trillion dollars annually", "explanation": "Annual investment of 2 trillion dollars needed." },
          { "number": 39, "label": "Emerging hydrogen technology", "answer": "green hydrogen", "transcript_quote": "green hydrogen", "explanation": "Green hydrogen is emerging." },
          { "number": 40, "label": "Critical for scaling technologies", "answer": "education and workforce", "transcript_quote": "Education and workforce development are critical", "explanation": "Workforce development is essential for scaling." }
        ]
      }
    ]
  }
]', ARRAY['job', 'interview', 'workplace', 'engineering', 'energy'], true),

-- Test 4: "Community Matters" (EASY)
('Community Matters', 'easy', 40, 30, '[
  {
    "part_number": 1,
    "context": "A customer inquiring about gym membership options",
    "transcript": "STAFF: Hi, welcome to FitZone Gym. How can I help you today?\nCUSTOMER: I''d like to know about membership options.\nSTAFF: Sure. We have three membership levels. There''s the Basic plan at thirty pounds per month.\nCUSTOMER: What''s included in that?\nSTAFF: Basic includes access to the gym during off-peak hours, which is weekdays before 5 PM and weekends before 2 PM.\nCUSTOMER: And the other plans?\nSTAFF: The Standard plan is fifty pounds per month and includes anytime access. The Premium plan is eighty pounds per month and adds personal training sessions and a swimming pool.\nCUSTOMER: Does it include classes?\nSTAFF: Classes are included in Standard and Premium. You''d need to pay an extra ten pounds per month for Basic.\nCUSTOMER: What about a contract?\nSTAFF: All plans require a one-month notice to cancel. Are you interested in signing up?",
    "question_groups": [
      {
        "type": "form_completion",
        "title": "GYM MEMBERSHIP INFORMATION",
        "instruction": "Complete the form. Write NO MORE THAN THREE WORDS AND/OR A NUMBER.",
        "question_range": [1, 8],
        "items": [
          { "number": 1, "label": "Basic plan cost", "answer": "£30 / thirty pounds", "transcript_quote": "thirty pounds per month", "explanation": "Basic membership is 30 pounds monthly." },
          { "number": 2, "label": "Basic peak hours", "answer": "before 5 PM / before 5pm", "transcript_quote": "weekdays before 5 PM", "explanation": "Basic access available before 5pm weekdays." },
          { "number": 3, "label": "Standard plan cost", "answer": "£50 / fifty pounds", "transcript_quote": "fifty pounds per month", "explanation": "Standard membership is 50 pounds." },
          { "number": 4, "label": "Premium plan cost", "answer": "£80 / eighty pounds", "transcript_quote": "eighty pounds per month", "explanation": "Premium membership is 80 pounds." },
          { "number": 5, "label": "Premium includes", "answer": "personal training / swimming pool", "transcript_quote": "personal training sessions and a swimming pool", "explanation": "Premium adds training and pool." },
          { "number": 6, "label": "Classes cost for Basic", "answer": "£10 / ten pounds", "transcript_quote": "extra ten pounds per month", "explanation": "Classes cost 10 pounds extra for Basic." },
          { "number": 7, "label": "Classes included in", "answer": "Standard and Premium", "transcript_quote": "included in Standard and Premium", "explanation": "Classes included in Standard and Premium." },
          { "number": 8, "label": "Cancellation notice required", "answer": "1 month / one month", "transcript_quote": "one-month notice to cancel", "explanation": "One month notice required to cancel." }
        ]
      },
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [9, 10],
        "items": [
          { "number": 9, "question": "What is NOT included in the Basic plan?", "options": {"A": "Gym access", "B": "Classes", "C": "Off-peak hours"}, "answer": "B", "transcript_quote": "You''d need to pay an extra ten pounds per month for Basic", "explanation": "Classes are not included in Basic plan." },
          { "number": 10, "question": "When can Basic members use the gym on weekends?", "options": {"A": "Before 2 PM", "B": "After 5 PM", "C": "Anytime"}, "answer": "A", "transcript_quote": "weekends before 2 PM", "explanation": "Basic members can access before 2pm on weekends." }
        ]
      }
    ]
  },
  {
    "part_number": 2,
    "context": "A neighborhood safety coordinator speaking about local crime prevention",
    "transcript": "Good evening, everyone. Thank you for coming to this community meeting. I''m Sarah, the neighborhood safety coordinator. I''m here to discuss recent developments and how we can work together to keep our neighborhood safe. Over the past year, we''ve seen a slight increase in property crimes, particularly car break-ins. However, these incidents are mostly preventable with simple precautions. First, always lock your car and remove valuables. Second, improve lighting in your area—well-lit streets deter crime. Third, be aware of suspicious activity and report it to police. We also recommend a neighborhood watch program. Volunteers are needed to patrol the streets in groups. The best time is evening hours, between 6 and 10 PM. Another important initiative is our community alert system. You can subscribe via email or text to receive real-time crime alerts. This is completely free and takes just two minutes to set up. We also have neighborhood security cameras. If you''re interested in installing one, we offer a thirty percent discount through a local company. Finally, please attend our monthly meetings, held on the second Tuesday of every month at 7 PM.",
    "question_groups": [
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [11, 13],
        "items": [
          { "number": 11, "question": "What crime has increased recently?", "options": {"A": "Robbery", "B": "Car break-ins", "C": "Vandalism"}, "answer": "B", "transcript_quote": "car break-ins", "explanation": "Property crimes, particularly car break-ins have increased." },
          { "number": 12, "question": "What is the best time for neighborhood watch patrols?", "options": {"A": "6-10 PM", "B": "10 PM-midnight", "C": "Early morning"}, "answer": "A", "transcript_quote": "between 6 and 10 PM", "explanation": "Best patrol time is 6-10 PM." },
          { "number": 13, "question": "How much discount is offered for security cameras?", "options": {"A": "20%", "B": "30%", "C": "50%"}, "answer": "B", "transcript_quote": "thirty percent discount", "explanation": "30% discount on security cameras." }
        ]
      },
      {
        "type": "note_completion",
        "title": "NEIGHBORHOOD SAFETY INITIATIVES",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [14, 20],
        "items": [
          { "number": 14, "label": "Main property crime type", "answer": "car break-ins", "transcript_quote": "particularly car break-ins", "explanation": "Car break-ins are the main property crime." },
          { "number": 15, "label": "First prevention method", "answer": "lock car / remove valuables", "transcript_quote": "always lock your car and remove valuables", "explanation": "Lock cars and remove valuables." },
          { "number": 16, "label": "Lighting effect on crime", "answer": "deters crime", "transcript_quote": "well-lit streets deter crime", "explanation": "Lighting deters crime." },
          { "number": 17, "label": "Watch program patrol time", "answer": "6-10 PM / evening hours", "transcript_quote": "between 6 and 10 PM", "explanation": "Neighborhood watch patrols between 6-10 PM." },
          { "number": 18, "label": "Alert system setup time", "answer": "2 minutes / two minutes", "transcript_quote": "takes just two minutes to set up", "explanation": "Alert system takes 2 minutes to set up." },
          { "number": 19, "label": "Alert system cost", "answer": "free / completely free", "transcript_quote": "This is completely free", "explanation": "Community alert system is free." },
          { "number": 20, "label": "Monthly meeting day", "answer": "2nd Tuesday / second Tuesday", "transcript_quote": "second Tuesday of every month", "explanation": "Meetings held on the second Tuesday." }
        ]
      }
    ]
  },
  {
    "part_number": 3,
    "context": "Students planning a school science project",
    "transcript": "ALEX: We need to decide on a topic for our science project. Any ideas?\nMIKE: How about something on animal behavior? Like how animals communicate.\nJEN: That''s interesting. Or we could do something on plants—maybe how plants grow in different light conditions.\nALEX: Both sound good. What about the time requirement?\nMIKE: Communication project would need several weeks of observation.\nJEN: The plant project is quicker. We could grow plants under different lights and measure them weekly.\nALEX: How long would that take?\nJEN: About four weeks, plus one week for the report.\nMIKE: I prefer the faster option. We don''t have much time before the deadline.\nALEX: Agreed. Let''s do plants. Should we use different colored lights?\nJEN: Yes, and control the amount of light too. Red, blue, and white light, plus a control with no extra light.\nMIKE: That''s a good experimental design. Who''ll measure the plants?\nALEX: Let''s rotate—we''ll each do weekly measurements.",
    "question_groups": [
      {
        "type": "matching",
        "title": "MATCHING PROJECT DETAILS",
        "instruction": "Match the project aspect with the description.",
        "question_range": [21, 25],
        "options_pool": {
          "A": "animal behaviour and communication",
          "B": "plant growth under different light",
          "C": "the plant project",
          "D": "around four weeks plus a week",
          "E": "red, blue, and white light",
          "F": "weekly rotating measurements"
        },
        "items": [
          { "number": 21, "label": "First project idea", "answer": "A", "transcript_quote": "animal behavior", "explanation": "Animal communication was first suggestion." },
          { "number": 22, "label": "Second project idea", "answer": "B", "transcript_quote": "how plants grow in different light", "explanation": "Plant growth under different light." },
          { "number": 23, "label": "Chosen project", "answer": "C", "transcript_quote": "Let''s do plants", "explanation": "Students chose the plant project." },
          { "number": 24, "label": "Experiment duration", "answer": "D", "transcript_quote": "About four weeks", "explanation": "Plant experiment takes 4 weeks." },
          { "number": 25, "label": "Variables tested", "answer": "E", "transcript_quote": "Red, blue, and white light", "explanation": "Testing different colored lights." }
        ]
      },
      {
        "type": "sentence_completion",
        "instruction": "Complete the sentences with NO MORE THAN TWO WORDS.",
        "question_range": [26, 30],
        "items": [
          { "number": 26, "sentence": "Animal project requires _______ observation.", "answer": "several weeks", "transcript_quote": "several weeks of observation", "explanation": "Animal project needs weeks of observation." },
          { "number": 27, "sentence": "The plant project takes _______ plus the report.", "answer": "4 weeks / four weeks", "transcript_quote": "About four weeks", "explanation": "Plant project is 4 weeks." },
          { "number": 28, "sentence": "Plants will be measured _______.", "answer": "weekly", "transcript_quote": "measure them weekly", "explanation": "Plants measured weekly." },
          { "number": 29, "sentence": "The experiment includes a _______ group.", "answer": "control", "transcript_quote": "control with no extra light", "explanation": "Control group with no extra light." },
          { "number": 30, "sentence": "The students will _______ the measurements.", "answer": "rotate", "transcript_quote": "Let''s rotate", "explanation": "Students take turns measuring." }
        ]
      }
    ]
  },
  {
    "part_number": 4,
    "context": "Nature lecture about animal behavior",
    "transcript": "Today I want to talk about animal behavior and how animals interact with their environment. Let me start with animal communication. Many animals use sounds to communicate. Birds sing to establish territory and attract mates. Whales produce complex songs that travel long distances underwater. Dolphins use clicks and whistles to communicate and navigate. Some animals use body language. Bees perform a special dance to communicate the location of food sources to other bees. Dogs use tail wagging and body posture to show emotion. Animals also use chemical signals, called pheromones. Ants leave pheromone trails to guide other ants to food. Many insects and mammals use pheromones to find mates. Another important behavior is hunting strategies. Some animals hunt alone, like leopards and eagles. Other animals hunt in groups, such as wolves and lions. Pack hunting allows them to catch larger prey. Migration is another fascinating behavior. Some birds migrate thousands of kilometers seasonally. Monarch butterflies travel from Mexico to Canada. Fish also migrate to breeding grounds. This incredible behavior is driven by instinct, not learned behavior. Understanding animal behavior helps us appreciate wildlife and develop conservation strategies.",
    "question_groups": [
      {
        "type": "note_completion",
        "title": "ANIMAL COMMUNICATION AND BEHAVIOR",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [31, 40],
        "items": [
          { "number": 31, "label": "Reason birds sing", "answer": "establish territory / attract mates", "transcript_quote": "Birds sing to establish territory and attract mates", "explanation": "Birds sing for territory and mating." },
          { "number": 32, "label": "Whale communication type", "answer": "complex songs", "transcript_quote": "produce complex songs", "explanation": "Whales produce complex songs." },
          { "number": 33, "label": "Dolphin communication sounds", "answer": "clicks and whistles", "transcript_quote": "clicks and whistles", "explanation": "Dolphins use clicks and whistles." },
          { "number": 34, "label": "Bee communication method", "answer": "special dance / dancing", "transcript_quote": "perform a special dance", "explanation": "Bees communicate by dancing." },
          { "number": 35, "label": "Chemical signal name", "answer": "pheromones", "transcript_quote": "called pheromones", "explanation": "Chemical signals are pheromones." },
          { "number": 36, "label": "Solitary hunters example", "answer": "leopards and eagles", "transcript_quote": "leopards and eagles", "explanation": "Leopards and eagles hunt alone." },
          { "number": 37, "label": "Pack hunting animals", "answer": "wolves and lions", "transcript_quote": "wolves and lions", "explanation": "Wolves and lions hunt in groups." },
          { "number": 38, "label": "Advantage of pack hunting", "answer": "catch larger prey", "transcript_quote": "catch larger prey", "explanation": "Pack hunting enables catching larger prey." },
          { "number": 39, "label": "Monarch butterfly migration route", "answer": "Mexico to Canada", "transcript_quote": "Mexico to Canada", "explanation": "Monarchs travel Mexico to Canada." },
          { "number": 40, "label": "What drives migration", "answer": "instinct / not learned", "transcript_quote": "driven by instinct, not learned behavior", "explanation": "Migration is driven by instinct." }
        ]
      }
    ]
  }
]', ARRAY['gym', 'safety', 'project', 'animal', 'behavior'], true),

-- Test 5: "Travel and Discovery" (MEDIUM)
('Travel and Discovery', 'medium', 40, 30, '[
  {
    "part_number": 1,
    "context": "A customer booking a tour package at a travel agency",
    "transcript": "AGENT: Welcome to Globe Tours. How can I help you today?\nCUSTOMER: I''m interested in a tour to Vietnam. Do you have packages?\nAGENT: Yes, we have several Vietnam options. The most popular is our fourteen-day Hanoi to Ho Chi Minh City tour.\nCUSTOMER: How much does that cost?\nAGENT: The price is two thousand four hundred pounds per person.\nCUSTOMER: What''s included?\nAGENT: Accommodation in four-star hotels, most meals, and guided tours of major sites.\nCUSTOMER: What about flights?\nAGENT: Flights are not included. We recommend booking through an airline of your choice.\nCUSTOMER: When do tours depart?\nAGENT: We have departures monthly, usually on the first Monday.\nCUSTOMER: I''d like to join the March departure. Are there spaces available?\nAGENT: Yes, March 4th has availability. Shall I proceed with booking?",
    "question_groups": [
      {
        "type": "form_completion",
        "title": "TOUR BOOKING FORM",
        "instruction": "Complete the form. Write NO MORE THAN THREE WORDS AND/OR A NUMBER.",
        "question_range": [1, 8],
        "items": [
          { "number": 1, "label": "Destination", "answer": "Vietnam", "transcript_quote": "tour to Vietnam", "explanation": "Destination is Vietnam." },
          { "number": 2, "label": "Tour duration", "answer": "14 days / fourteen days", "transcript_quote": "fourteen-day tour", "explanation": "Tour lasts 14 days." },
          { "number": 3, "label": "Tour cost per person", "answer": "£2400 / two thousand four hundred", "transcript_quote": "two thousand four hundred pounds per person", "explanation": "Cost is 2400 pounds per person." },
          { "number": 4, "label": "Accommodation type", "answer": "four-star hotels", "transcript_quote": "four-star hotels", "explanation": "Four-star hotel accommodation included." },
          { "number": 5, "label": "Flights included", "answer": "no", "transcript_quote": "Flights are not included", "explanation": "Flights are not included." },
          { "number": 6, "label": "Typical departure day", "answer": "first Monday", "transcript_quote": "usually on the first Monday", "explanation": "Departures on first Monday." },
          { "number": 7, "label": "Preferred departure month", "answer": "March", "transcript_quote": "March departure", "explanation": "Customer wants March." },
          { "number": 8, "label": "March departure date", "answer": "March 4th / 4 March", "transcript_quote": "March 4th", "explanation": "March departure is March 4th." }
        ]
      },
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [9, 10],
        "items": [
          { "number": 9, "question": "What is included in the tour?", "options": {"A": "Flights and accommodation", "B": "Flights and meals", "C": "Accommodation and meals"}, "answer": "C", "transcript_quote": "Accommodation in four-star hotels, most meals, and guided tours", "explanation": "Accommodation and meals are included." },
          { "number": 10, "question": "What should the customer book separately?", "options": {"A": "Hotels", "B": "Flights", "C": "Tours"}, "answer": "B", "transcript_quote": "Flights are not included", "explanation": "Customer must book flights separately." }
        ]
      }
    ]
  },
  {
    "part_number": 2,
    "context": "A presenter at a cultural festival describing a traditional celebration",
    "transcript": "Good afternoon. Thank you for attending our cultural festival. Today I''ll tell you about Lantern Festival, celebrated in many East Asian countries, particularly China, Vietnam, and Korea. The festival marks the fifteenth day of the lunar new year. Traditionally, people light lanterns and release them into the sky. The lanterns symbolize the release of bad luck and welcoming of new beginnings. The festival also features colorful parades and dragon dances. These dances require teams of twenty or more performers. The dragon costume can be as long as thirty meters. Another important tradition is eating glutinous rice balls called tangyuan. These sweet balls symbolize family unity and togetherness. The festival lasts for several days, typically three to five days. Many cities host lantern competitions where artists create elaborate designs. Some lanterns are shaped like famous landmarks or animals. Restaurants offer special festival menus with traditional dishes. This year''s festival will run from February eight to February twelve, with events occurring throughout the city. Admission to most events is free.",
    "question_groups": [
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [11, 13],
        "items": [
          { "number": 11, "question": "Which lunar day is the Lantern Festival celebrated?", "options": {"A": "Tenth day", "B": "Fifteenth day", "C": "Twenty-first day"}, "answer": "B", "transcript_quote": "fifteenth day of the lunar new year", "explanation": "Fifteenth day of lunar new year." },
          { "number": 12, "question": "How many people are typically in a dragon dance team?", "options": {"A": "10 or more", "B": "15 or more", "C": "20 or more"}, "answer": "C", "transcript_quote": "teams of twenty or more", "explanation": "Dragon dance teams have 20+ performers." },
          { "number": 13, "question": "What is the typical festival duration?", "options": {"A": "1-2 days", "B": "3-5 days", "C": "7-10 days"}, "answer": "B", "transcript_quote": "typically three to five days", "explanation": "Festival lasts 3-5 days." }
        ]
      },
      {
        "type": "note_completion",
        "title": "LANTERN FESTIVAL INFORMATION",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [14, 20],
        "items": [
          { "number": 14, "label": "Festival name", "answer": "Lantern Festival", "transcript_quote": "Lantern Festival", "explanation": "Festival is Lantern Festival." },
          { "number": 15, "label": "Lantern symbolism", "answer": "release bad luck / new beginnings", "transcript_quote": "symbolize the release of bad luck", "explanation": "Lanterns symbolize renewal." },
          { "number": 16, "label": "Dragon costume length", "answer": "30 metres / thirty meters", "transcript_quote": "as long as thirty meters", "explanation": "Dragon costume up to 30 meters." },
          { "number": 17, "label": "Rice balls called", "answer": "tangyuan", "transcript_quote": "glutinous rice balls called tangyuan", "explanation": "Rice balls called tangyuan." },
          { "number": 18, "label": "Rice balls symbolize", "answer": "family unity / togetherness", "transcript_quote": "symbolize family unity and togetherness", "explanation": "Tangyuan symbolize family unity." },
          { "number": 19, "label": "Festival event cost", "answer": "free", "transcript_quote": "free", "explanation": "Most events are free." },
          { "number": 20, "label": "Festival dates this year", "answer": "Feb 8-12 / February 8 to 12", "transcript_quote": "February eight to February twelve", "explanation": "Festival runs Feb 8-12." }
        ]
      }
    ]
  },
  {
    "part_number": 3,
    "context": "Two students discussing a field study experience",
    "transcript": "SARA: How was your field study trip to the rainforest?\nJACK: Amazing! We spent five days there studying biodiversity.\nSARA: What did you research specifically?\nJACK: We focused on insect species and their ecological roles. We collected specimens and recorded behaviors.\nSARA: That sounds intensive. Did you encounter any difficulties?\nJACK: Yes, the weather was challenging. Heavy rain made some areas inaccessible. We had to reschedule some field work.\nSARA: How did your team handle it?\nJACK: We adapted by doing laboratory analysis of our collected samples.\nSARA: Did you identify any new species?\nJACK: Not quite new, but we found interesting behavioral patterns. One ant species showed unusual nesting patterns.\nSARA: Did you document everything?\nJACK: Yes, we photographed and recorded detailed notes. The data will be analyzed for our research project.",
    "question_groups": [
      {
        "type": "matching",
        "title": "MATCHING FIELDWORK DETAILS",
        "instruction": "Match the aspect with its description.",
        "question_range": [21, 25],
        "options_pool": {
          "A": "five days in the rainforest",
          "B": "insect species and ecological roles",
          "C": "heavy rain and inaccessible areas",
          "D": "laboratory analysis of samples",
          "E": "unusual ant nesting patterns",
          "F": "photographic documentation"
        },
        "items": [
          { "number": 21, "label": "Research duration", "answer": "A", "transcript_quote": "five days", "explanation": "Field study lasted 5 days." },
          { "number": 22, "label": "Research focus", "answer": "B", "transcript_quote": "insect species and their ecological roles", "explanation": "Studied insects and ecology." },
          { "number": 23, "label": "Challenge encountered", "answer": "C", "transcript_quote": "Heavy rain", "explanation": "Weather was a challenge." },
          { "number": 24, "label": "Adaptation strategy", "answer": "D", "transcript_quote": "laboratory analysis", "explanation": "Lab analysis used as alternative." },
          { "number": 25, "label": "Interesting finding", "answer": "E", "transcript_quote": "unusual nesting patterns", "explanation": "Found unusual ant nesting." }
        ]
      },
      {
        "type": "sentence_completion",
        "instruction": "Complete the sentences with NO MORE THAN TWO WORDS.",
        "question_range": [26, 30],
        "items": [
          { "number": 26, "sentence": "The team collected _______ during the trip.", "answer": "specimens", "transcript_quote": "collected specimens", "explanation": "Specimens were collected." },
          { "number": 27, "sentence": "Some field work was _______ due to weather.", "answer": "rescheduled", "transcript_quote": "reschedule some field work", "explanation": "Work was rescheduled." },
          { "number": 28, "sentence": "The team found _______ patterns in ant behavior.", "answer": "unusual nesting", "transcript_quote": "unusual nesting patterns", "explanation": "Unusual patterns were observed." },
          { "number": 29, "sentence": "Jack recorded _______ of the field observations.", "answer": "detailed notes", "transcript_quote": "detailed notes", "explanation": "Notes were recorded." },
          { "number": 30, "sentence": "The data will be _______ for the research project.", "answer": "analyzed", "transcript_quote": "data will be analyzed", "explanation": "Data will be analyzed." }
        ]
      }
    ]
  },
  {
    "part_number": 4,
    "context": "Art history lecture about the Renaissance period",
    "transcript": "The Renaissance was a pivotal period in art history, spanning from the fourteenth to the seventeenth centuries. It began in Italy and later spread throughout Europe. Renaissance means ''rebirth,'' referring to the revival of classical Greek and Roman ideas. Artists during this period began to develop new techniques, particularly in perspective and anatomy. Leonardo da Vinci was one of the most influential artists, known for works like the Mona Lisa and The Last Supper. His detailed anatomical studies advanced human figure representation. Michelangelo created the magnificent ceiling of the Sistine Chapel, which took four years to complete. Raphael was known for his harmonious compositions and use of color. The Renaissance saw the development of oil painting, which allowed for more detailed and layered artwork. Before this, tempera was the dominant medium. Oil painting enabled artists to create richer colors and subtle shading. Religious themes dominated Renaissance art, but secular subjects also emerged. The printing press, invented by Gutenberg, facilitated the spread of Renaissance ideas and artistic techniques throughout Europe. Patronage from wealthy families, particularly the Medici family, supported many Renaissance artists. This patronage system was crucial for the development of Renaissance art.",
    "question_groups": [
      {
        "type": "note_completion",
        "title": "RENAISSANCE ART PERIOD",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [31, 40],
        "items": [
          { "number": 31, "label": "Period timespan", "answer": "14th to 17th centuries", "transcript_quote": "from the fourteenth to the seventeenth centuries", "explanation": "Renaissance spanned 14th-17th centuries." },
          { "number": 32, "label": "''Renaissance'' means", "answer": "rebirth", "transcript_quote": "rebirth", "explanation": "Renaissance means rebirth." },
          { "number": 33, "label": "Origin region", "answer": "Italy", "transcript_quote": "began in Italy", "explanation": "Renaissance began in Italy." },
          { "number": 34, "label": "Leonardo''s famous works", "answer": "Mona Lisa / Last Supper", "transcript_quote": "Mona Lisa and The Last Supper", "explanation": "Leonardo created these works." },
          { "number": 35, "label": "Sistine Chapel ceiling artist", "answer": "Michelangelo", "transcript_quote": "Michelangelo created the magnificent ceiling", "explanation": "Michelangelo painted Sistine Chapel." },
          { "number": 36, "label": "Sistine Chapel completion time", "answer": "4 years / four years", "transcript_quote": "took four years to complete", "explanation": "Ceiling took 4 years." },
          { "number": 37, "label": "New painting medium", "answer": "oil painting", "transcript_quote": "oil painting", "explanation": "Oil painting was developed." },
          { "number": 38, "label": "Previous dominant medium", "answer": "tempera", "transcript_quote": "tempera was the dominant medium", "explanation": "Tempera was used before oil." },
          { "number": 39, "label": "Key family patrons", "answer": "Medici family", "transcript_quote": "Medici family", "explanation": "Medici family were patrons." },
          { "number": 40, "label": "Technology spreading Renaissance ideas", "answer": "printing press / Gutenberg", "transcript_quote": "printing press, invented by Gutenberg", "explanation": "Printing press spread Renaissance ideas." }
        ]
      }
    ]
  }
]', ARRAY['travel', 'culture', 'fieldwork', 'art'], true),

-- Test 6: "Health and Wellbeing" (MEDIUM)
('Health and Wellbeing', 'medium', 40, 30, '[
  {
    "part_number": 1,
    "context": "A patient calling a health clinic to book an appointment",
    "transcript": "CLINIC: Riverside Health Clinic, good morning.\nPATIENT: Hi, I''d like to make an appointment with the doctor.\nCLINIC: Of course. Are you a new patient?\nPATIENT: Yes, I am.\nCLINIC: I''ll need some details. What''s your name?\nPATIENT: It''s James Mitchell.\nCLINIC: And your date of birth?\nPATIENT: Seventh of March, nineteen ninety-five.\nCLINIC: Thank you. What''s the reason for your visit?\nPATIENT: I''ve had a persistent cough for two weeks.\nCLINIC: We have appointments available. Would Wednesday at two thirty PM suit you?\nPATIENT: Yes, that works.\nCLINIC: The appointment is with Dr. Chen. Please arrive fifteen minutes early to complete the registration form.",
    "question_groups": [
      {
        "type": "form_completion",
        "title": "PATIENT REGISTRATION",
        "instruction": "Complete the form. Write NO MORE THAN THREE WORDS AND/OR A NUMBER.",
        "question_range": [1, 8],
        "items": [
          { "number": 1, "label": "Patient status", "answer": "new patient", "transcript_quote": "Are you a new patient? Yes", "explanation": "Patient is new." },
          { "number": 2, "label": "Patient name", "answer": "James Mitchell", "transcript_quote": "James Mitchell", "explanation": "Patient name is James Mitchell." },
          { "number": 3, "label": "Date of birth", "answer": "7 March 1995", "transcript_quote": "Seventh of March, nineteen ninety-five", "explanation": "DOB is 7 March 1995." },
          { "number": 4, "label": "Reason for visit", "answer": "persistent cough", "transcript_quote": "persistent cough for two weeks", "explanation": "Reason is persistent cough." },
          { "number": 5, "label": "Symptom duration", "answer": "2 weeks / two weeks", "transcript_quote": "for two weeks", "explanation": "Cough for 2 weeks." },
          { "number": 6, "label": "Appointment day", "answer": "Wednesday", "transcript_quote": "Wednesday", "explanation": "Appointment on Wednesday." },
          { "number": 7, "label": "Appointment time", "answer": "2:30 PM / 14:30", "transcript_quote": "two thirty PM", "explanation": "Appointment at 2:30 PM." },
          { "number": 8, "label": "Assigned doctor", "answer": "Dr. Chen", "transcript_quote": "with Dr. Chen", "explanation": "Doctor is Dr. Chen." }
        ]
      },
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [9, 10],
        "items": [
          { "number": 9, "question": "When should the patient arrive?", "options": {"A": "On time", "B": "5 minutes early", "C": "15 minutes early"}, "answer": "C", "transcript_quote": "arrive fifteen minutes early", "explanation": "Should arrive 15 minutes early." },
          { "number": 10, "question": "What should the patient complete?", "options": {"A": "Medical history form", "B": "Registration form", "C": "Insurance form"}, "answer": "B", "transcript_quote": "registration form", "explanation": "Complete registration form." }
        ]
      }
    ]
  },
  {
    "part_number": 2,
    "context": "A nutritionist giving a talk about healthy eating",
    "transcript": "Good afternoon everyone. I''m Dr. Sarah Edwards, a registered dietitian. Today I want to discuss healthy eating habits that can improve your overall wellbeing. The recommended daily intake is two thousand calories for the average adult. This varies by age, gender, and activity level. A balanced diet should include fruits, vegetables, whole grains, and lean proteins. The food plate model divides your plate into four sections: vegetables, proteins, grains, and fruit. Vegetables should make up about forty percent of your plate. Proteins should be about twenty-five percent. Grains should be about thirty percent. Fruits should be about five percent. Hydration is equally important—drink at least eight glasses of water daily. Sugar consumption should be limited. The recommended limit is about fifty grams per day for adults. Many processed foods contain hidden sugars. Reading nutrition labels is essential. Fiber intake is important too—aim for at least thirty grams daily. Regular physical activity combined with healthy eating creates sustainable results.",
    "question_groups": [
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [11, 13],
        "items": [
          { "number": 11, "question": "What is the recommended daily calorie intake?", "options": {"A": "1500 calories", "B": "2000 calories", "C": "2500 calories"}, "answer": "B", "transcript_quote": "two thousand calories", "explanation": "2000 calories recommended." },
          { "number": 12, "question": "What percentage of the plate should be vegetables?", "options": {"A": "30%", "B": "40%", "C": "50%"}, "answer": "B", "transcript_quote": "about forty percent", "explanation": "40% vegetables." },
          { "number": 13, "question": "What is the daily sugar limit?", "options": {"A": "30g", "B": "40g", "C": "50g"}, "answer": "C", "transcript_quote": "about fifty grams per day", "explanation": "50 grams sugar limit." }
        ]
      },
      {
        "type": "note_completion",
        "title": "NUTRITION GUIDELINES",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [14, 20],
        "items": [
          { "number": 14, "label": "Speaker profession", "answer": "registered dietitian", "transcript_quote": "registered dietitian", "explanation": "Dr. Edwards is a dietitian." },
          { "number": 15, "label": "Protein percentage on plate", "answer": "25% / twenty-five percent", "transcript_quote": "twenty-five percent", "explanation": "Protein is 25%." },
          { "number": 16, "label": "Grains percentage on plate", "answer": "30% / thirty percent", "transcript_quote": "thirty percent", "explanation": "Grains are 30%." },
          { "number": 17, "label": "Fruit percentage on plate", "answer": "5% / five percent", "transcript_quote": "five percent", "explanation": "Fruit is 5%." },
          { "number": 18, "label": "Daily water glasses", "answer": "8 / eight glasses", "transcript_quote": "at least eight glasses", "explanation": "8 glasses water daily." },
          { "number": 19, "label": "Daily fiber intake", "answer": "30 grams / thirty grams", "transcript_quote": "at least thirty grams", "explanation": "30 grams fiber recommended." },
          { "number": 20, "label": "Health approach", "answer": "balanced diet and exercise", "transcript_quote": "Regular physical activity combined with healthy eating", "explanation": "Combination of diet and activity." }
        ]
      }
    ]
  },
  {
    "part_number": 3,
    "context": "University students discussing mental health and stress management",
    "transcript": "EMMA: Hey Tom, how are you managing with exam stress?\nTOM: Honestly, it''s been tough. I''ve been studying late into the night every day.\nEMMA: That''s not ideal. Sleep is really important for mental health. I read that insufficient sleep worsens anxiety.\nTOM: I know, but there''s so much to cover.\nEMMA: Have you tried any stress management techniques?\nTOM: Like what?\nEMMA: Meditation and exercise really help me. I also try to maintain a regular schedule.\nTOM: I''ve never tried meditation. Is it difficult?\nEMMA: Not at all. There are apps with guided meditations—just ten or fifteen minutes daily helps.\nTOM: That sounds manageable. What about exercise?\nEMMA: Even a thirty-minute walk clears my head. And I make sure to eat regularly and healthily.\nTOM: You sound very organized. Maybe I should try these strategies.\nEMMA: I recommend starting with one thing—maybe the meditation app. Build from there.",
    "question_groups": [
      {
        "type": "matching",
        "title": "MATCHING WELLNESS STRATEGIES",
        "instruction": "Match the strategy with its benefit.",
        "question_range": [21, 25],
        "options_pool": {
          "A": "exam-related anxiety",
          "B": "insufficient sleep worsens anxiety",
          "C": "ten to fifteen minutes daily",
          "D": "a thirty-minute walk",
          "E": "starting with a meditation app",
          "F": "eating regularly and healthily"
        },
        "items": [
          { "number": 21, "label": "Tom''s main stress", "answer": "A", "transcript_quote": "exam stress", "explanation": "Tom is stressed about exams." },
          { "number": 22, "label": "Emma''s sleep advice", "answer": "B", "transcript_quote": "insufficient sleep worsens anxiety", "explanation": "Sleep affects anxiety." },
          { "number": 23, "label": "Meditation duration", "answer": "C", "transcript_quote": "ten or fifteen minutes daily", "explanation": "10-15 minutes daily." },
          { "number": 24, "label": "Emma''s exercise routine", "answer": "D", "transcript_quote": "thirty-minute walk", "explanation": "30-minute walks." },
          { "number": 25, "label": "Starting strategy", "answer": "E", "transcript_quote": "meditation app", "explanation": "Begin with meditation app." }
        ]
      },
      {
        "type": "sentence_completion",
        "instruction": "Complete the sentences with NO MORE THAN TWO WORDS.",
        "question_range": [26, 30],
        "items": [
          { "number": 26, "sentence": "Tom has been studying _______ each day.", "answer": "late into night / until late", "transcript_quote": "studying late into the night", "explanation": "Tom studies very late." },
          { "number": 27, "sentence": "Emma uses _______ for guided meditation.", "answer": "apps / meditation apps", "transcript_quote": "apps with guided meditations", "explanation": "Apps provide meditation guidance." },
          { "number": 28, "sentence": "Emma maintains _______ to help manage stress.", "answer": "regular schedule", "transcript_quote": "regular schedule", "explanation": "Routine is helpful." },
          { "number": 29, "sentence": "Emma believes starting _______ is best.", "answer": "with one / one thing", "transcript_quote": "starting with one thing", "explanation": "Start with one strategy." },
          { "number": 30, "sentence": "Emma exercises by taking _______.", "answer": "30-minute walks / walks", "transcript_quote": "thirty-minute walk", "explanation": "Walking is her exercise." }
        ]
      }
    ]
  },
  {
    "part_number": 4,
    "context": "Psychology lecture on emotion regulation and mental health",
    "transcript": "Today I want to discuss emotion regulation, which is the ability to manage and respond to emotional experiences effectively. Our emotions are influenced by our thoughts, behaviors, and environment. When emotions become overwhelming, they can affect our mental health, physical health, and relationships. There are several strategies for emotion regulation. One important technique is mindfulness—paying attention to the present moment without judgment. Research shows mindfulness reduces anxiety by approximately thirty percent. Another technique is cognitive reframing, which involves changing how we interpret situations. Instead of thinking ''I failed,'' reframe it as ''I learned something.'' Physical activity is highly effective—thirty minutes of moderate exercise releases endorphins, natural mood-elevating chemicals. Social support is crucial; talking to friends or professionals helps process emotions. Sleep quality significantly impacts emotional regulation. The recommended amount is seven to nine hours per night. Stress management techniques include deep breathing and progressive muscle relaxation. These techniques can be learned and practiced. Regular practice improves emotional resilience over time. Professional help through therapy is valuable when emotions feel unmanageable. Therapy provides tools and support for developing healthy coping mechanisms.",
    "question_groups": [
      {
        "type": "note_completion",
        "title": "EMOTION REGULATION STRATEGIES",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [31, 40],
        "items": [
          { "number": 31, "label": "Definition of emotion regulation", "answer": "manage emotional experiences", "transcript_quote": "manage and respond to emotional experiences", "explanation": "Regulation means managing emotions." },
          { "number": 32, "label": "Emotion factors", "answer": "thoughts / behaviors / environment", "transcript_quote": "thoughts, behaviors, and environment", "explanation": "Three factors influence emotions." },
          { "number": 33, "label": "Mindfulness definition", "answer": "present moment awareness", "transcript_quote": "paying attention to the present moment", "explanation": "Mindfulness is present awareness." },
          { "number": 34, "label": "Mindfulness anxiety reduction", "answer": "30% / approximately 30 percent", "transcript_quote": "approximately thirty percent", "explanation": "Mindfulness reduces anxiety 30%." },
          { "number": 35, "label": "Cognitive reframing example", "answer": "''I learned something''", "transcript_quote": "I learned something", "explanation": "Reframe failure as learning." },
          { "number": 36, "label": "Exercise mood benefit", "answer": "releases endorphins", "transcript_quote": "releases endorphins", "explanation": "Exercise releases endorphins." },
          { "number": 37, "label": "Recommended sleep hours", "answer": "7-9 hours / seven to nine", "transcript_quote": "seven to nine hours", "explanation": "7-9 hours per night." },
          { "number": 38, "label": "Breathing technique", "answer": "deep breathing", "transcript_quote": "deep breathing", "explanation": "Deep breathing is a technique." },
          { "number": 39, "label": "Muscle relaxation technique", "answer": "progressive muscle relaxation", "transcript_quote": "progressive muscle relaxation", "explanation": "Progressive relaxation technique." },
          { "number": 40, "label": "Professional emotion support", "answer": "therapy / professional help", "transcript_quote": "Professional help through therapy", "explanation": "Therapy provides professional support." }
        ]
      }
    ]
  }
]', ARRAY['health', 'clinic', 'nutrition', 'stress', 'mental'], true),

-- Test 7: "Science and Technology" (HARD)
('Science and Technology', 'hard', 40, 30, '[
  {
    "part_number": 1,
    "context": "A laboratory researcher arranging equipment rental for an experiment",
    "transcript": "LAB MANAGER: Science Equipment Solutions. How can we help?\nRESEARCHER: Hi, I need to rent some specialized lab equipment for a three-month project.\nLAB MANAGER: Excellent. What equipment are you looking for?\nRESEARCHER: We need a high-precision spectrophotometer and a controlled-temperature incubator.\nLAB MANAGER: The spectrophotometer rents at four hundred pounds monthly, and the incubator at three hundred fifty pounds.\nRESEARCHER: That''s within budget. When could we take delivery?\nLAB MANAGER: We have stock available for immediate delivery this week. Our delivery fee is seventy-five pounds.\nRESEARCHER: Perfect. We also need technical support during setup.\nLAB MANAGER: We provide two hours of free training included with rental. Additional support is thirty pounds per hour.\nRESEARCHER: That works. Should I provide a damage deposit?\nLAB MANAGER: Yes, we require a deposit of eight hundred pounds. This is fully refundable upon return in good condition.",
    "question_groups": [
      {
        "type": "form_completion",
        "title": "EQUIPMENT RENTAL AGREEMENT",
        "instruction": "Complete the form. Write NO MORE THAN THREE WORDS AND/OR A NUMBER.",
        "question_range": [1, 8],
        "items": [
          { "number": 1, "label": "Rental duration", "answer": "3 months / three months", "transcript_quote": "three-month project", "explanation": "Project lasts 3 months." },
          { "number": 2, "label": "Equipment 1", "answer": "spectrophotometer", "transcript_quote": "spectrophotometer", "explanation": "First equipment needed." },
          { "number": 3, "label": "Equipment 2", "answer": "incubator", "transcript_quote": "incubator", "explanation": "Second equipment needed." },
          { "number": 4, "label": "Spectrophotometer monthly cost", "answer": "£400 / four hundred pounds", "transcript_quote": "four hundred pounds monthly", "explanation": "Monthly cost 400 pounds." },
          { "number": 5, "label": "Incubator monthly cost", "answer": "£350 / three hundred fifty", "transcript_quote": "three hundred fifty pounds", "explanation": "Monthly cost 350 pounds." },
          { "number": 6, "label": "Delivery fee", "answer": "£75 / seventy-five pounds", "transcript_quote": "seventy-five pounds", "explanation": "Delivery fee 75 pounds." },
          { "number": 7, "label": "Included training hours", "answer": "2 hours / two hours", "transcript_quote": "two hours of free training", "explanation": "2 free training hours." },
          { "number": 8, "label": "Required deposit", "answer": "£800 / eight hundred pounds", "transcript_quote": "eight hundred pounds", "explanation": "Deposit amount 800 pounds." }
        ]
      },
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [9, 10],
        "items": [
          { "number": 9, "question": "When is delivery available?", "options": {"A": "Next month", "B": "This week", "C": "Within two weeks"}, "answer": "B", "transcript_quote": "immediate delivery this week", "explanation": "Delivery this week." },
          { "number": 10, "question": "What is the cost of additional technical support?", "options": {"A": "£25 per hour", "B": "£30 per hour", "C": "£40 per hour"}, "answer": "B", "transcript_quote": "thirty pounds per hour", "explanation": "£30 per hour additional support." }
        ]
      }
    ]
  },
  {
    "part_number": 2,
    "context": "A technology exhibition curator explaining quantum computing advances",
    "transcript": "Welcome to our Technology in Tomorrow exhibition. Today I''m highlighting recent advances in quantum computing. Quantum computers operate on principles completely different from classical computers. Classical computers use bits—either zero or one. Quantum computers use quantum bits, or qubits, which can exist in multiple states simultaneously. This property is called superposition. A quantum computer with just fifty qubits can process more possibilities than a classical computer with billions of transistors. Another key principle is entanglement, where qubits become correlated and influence each other. These principles allow quantum computers to solve certain problems exponentially faster. Current quantum computers from major companies like IBM and Google have between fifty and seventy qubits. However, they still face significant challenges. Quantum decoherence—where qubits lose their quantum state—limits computation time. Most current quantum computers can only maintain coherence for microseconds. Error rates in quantum computing are still high, around one percent per operation. Industry experts predict practical quantum advantages in cryptography and drug discovery within five to ten years. Investment in quantum computing has exceeded five billion dollars globally in the last three years.",
    "question_groups": [
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [11, 13],
        "items": [
          { "number": 11, "question": "What is the fundamental unit in quantum computing?", "options": {"A": "Bit", "B": "Qubit", "C": "Transistor"}, "answer": "B", "transcript_quote": "quantum bits, or qubits", "explanation": "Qubits are fundamental units." },
          { "number": 12, "question": "How many qubits do current leading quantum computers have?", "options": {"A": "30-40", "B": "50-70", "C": "100-120"}, "answer": "B", "transcript_quote": "between fifty and seventy qubits", "explanation": "50-70 qubits current capacity." },
          { "number": 13, "question": "What is the typical error rate per operation?", "options": {"A": "0.5%", "B": "1%", "C": "2%"}, "answer": "B", "transcript_quote": "around one percent per operation", "explanation": "Error rate approximately 1%." }
        ]
      },
      {
        "type": "note_completion",
        "title": "QUANTUM COMPUTING OVERVIEW",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [14, 20],
        "items": [
          { "number": 14, "label": "Classical computer unit", "answer": "bits", "transcript_quote": "use bits", "explanation": "Bits in classical computers." },
          { "number": 15, "label": "Qubit key property", "answer": "superposition", "transcript_quote": "This property is called superposition", "explanation": "Superposition is key property." },
          { "number": 16, "label": "Qubit correlation principle", "answer": "entanglement", "transcript_quote": "entanglement", "explanation": "Entanglement links qubits." },
          { "number": 17, "label": "Quantum decoherence limit", "answer": "microseconds / loss of state", "transcript_quote": "only maintain coherence for microseconds", "explanation": "Coherence lasts microseconds." },
          { "number": 18, "label": "Problem quantum solves faster", "answer": "certain problems / exponentially", "transcript_quote": "solve certain problems exponentially faster", "explanation": "Exponential speed advantage." },
          { "number": 19, "label": "Timeline for practical advantage", "answer": "5-10 years / five to ten", "transcript_quote": "five to ten years", "explanation": "Practical use in 5-10 years." },
          { "number": 20, "label": "Global investment amount", "answer": "$5 billion / five billion", "transcript_quote": "exceeded five billion dollars", "explanation": "5 billion invested globally." }
        ]
      }
    ]
  },
  {
    "part_number": 3,
    "context": "Researchers collaborating on a laboratory investigation",
    "transcript": "DR. JAMES: How are the preliminary results looking?\nDR. PATEL: Promising, but unexpected. The compound shows antibiotic properties we didn''t initially anticipate.\nDR. JAMES: Interesting. What dosage level did you test?\nDR. PATEL: We''ve tested dosages from one milligram to fifty milligrams per kilogram of body weight.\nDR. JAMES: And the effectiveness plateaued?\nDR. PATEL: Exactly. Beyond twenty-five milligrams, effectiveness stopped increasing. Side effects increased significantly beyond that threshold.\nDR. JAMES: Did you examine cellular mechanisms?\nDR. PATEL: We started—preliminary microscopy shows the compound disrupts bacterial cell walls. The mechanism appears similar to penicillin but more effective.\nDR. JAMES: Have you documented this?\nDR. PATEL: Yes, comprehensive data is ready. We need to run animal trials before human trials.\nDR. JAMES: What''s our timeline?\nDR. PATEL: Animal trials will take approximately eighteen months. If successful, human trials could begin within three years.",
    "question_groups": [
      {
        "type": "matching",
        "title": "MATCHING RESEARCH FINDINGS",
        "instruction": "Match the aspect with its characteristic.",
        "question_range": [21, 25],
        "options_pool": {
          "A": "antibiotic properties",
          "B": "twenty-five milligrams per kg",
          "C": "disrupts bacterial cell walls",
          "D": "similar to penicillin",
          "E": "eighteen months (animal trials)",
          "F": "three years (human trials)"
        },
        "items": [
          { "number": 21, "label": "Unexpected property found", "answer": "A", "transcript_quote": "antibiotic properties", "explanation": "Antibiotic effect discovered." },
          { "number": 22, "label": "Optimal dosage level", "answer": "B", "transcript_quote": "twenty-five milligrams", "explanation": "25mg is optimal." },
          { "number": 23, "label": "Mechanism of action", "answer": "C", "transcript_quote": "disrupts bacterial cell walls", "explanation": "Cell wall disruption." },
          { "number": 24, "label": "Similar compound comparison", "answer": "D", "transcript_quote": "similar to penicillin", "explanation": "Works like penicillin." },
          { "number": 25, "label": "Testing timeline phase", "answer": "E", "transcript_quote": "eighteen months", "explanation": "Animal trials duration." }
        ]
      },
      {
        "type": "sentence_completion",
        "instruction": "Complete the sentences with NO MORE THAN TWO WORDS.",
        "question_range": [26, 30],
        "items": [
          { "number": 26, "sentence": "The compound''s _______ were not initially anticipated.", "answer": "antibiotic properties", "transcript_quote": "antibiotic properties we didn''t initially anticipate", "explanation": "Properties were unexpected." },
          { "number": 27, "sentence": "Side effects increased beyond _______ dosage.", "answer": "25mg / twenty-five milligrams", "transcript_quote": "beyond twenty-five milligrams", "explanation": "Threshold at 25mg." },
          { "number": 28, "sentence": "Preliminary microscopy shows cell _______ disruption.", "answer": "wall", "transcript_quote": "disrupts bacterial cell walls", "explanation": "Cell walls affected." },
          { "number": 29, "sentence": "Animal trials will take _______.", "answer": "18 months / approximately 18", "transcript_quote": "approximately eighteen months", "explanation": "18 months for animal trials." },
          { "number": 30, "sentence": "Human trials could begin within _______.", "answer": "3 years / three years", "transcript_quote": "within three years", "explanation": "3 years timeline for human trials." }
        ]
      }
    ]
  },
  {
    "part_number": 4,
    "context": "Physics lecture on quantum entanglement and its implications",
    "transcript": "Quantum entanglement is one of the most fascinating and counterintuitive phenomena in physics. When two quantum particles become entangled, they form a system where measuring one particle instantaneously affects the other, regardless of distance. Einstein famously called this ''spooky action at a distance'' because it seemed to violate locality principles. Experimental evidence consistently confirms entanglement occurs. In nineteen eighty-two, physicist Alain Aspect conducted experiments proving entanglement exists. His work used polarized photons and demonstrated correlations that could not be explained by hidden variables. Subsequent experiments have extended the range of entanglement measurements. In two thousand seventeen, scientists entangled photons separated by over one hundred kilometers. This distance is significant enough to rule out local hidden variable theories. Entanglement has profound implications for quantum computing, as mentioned earlier. Each entangled qubit exponentially increases processing power. Another application is quantum cryptography, where entangled photons enable theoretically unhackable communication. The principle behind this is that any measurement attempt changes the quantum state, revealing eavesdropping. Quantum teleportation, another theoretical application, could transfer quantum states instantaneously. However, this does not violate relativity because classical information still cannot travel faster than light. Understanding entanglement remains an active research frontier with potential revolutionary applications.",
    "question_groups": [
      {
        "type": "note_completion",
        "title": "QUANTUM ENTANGLEMENT — KEY CONCEPTS",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [31, 40],
        "items": [
          { "number": 31, "label": "Einstein''s description phrase", "answer": "spooky action / at a distance", "transcript_quote": "spooky action at a distance", "explanation": "Einstein''s famous phrase." },
          { "number": 32, "label": "Historical proving experiment year", "answer": "1982 / nineteen eighty-two", "transcript_quote": "nineteen eighty-two", "explanation": "Aspect''s experiment in 1982." },
          { "number": 33, "label": "Experiment equipment used", "answer": "polarized photons", "transcript_quote": "polarized photons", "explanation": "Photons used in experiment." },
          { "number": 34, "label": "Theory ruled out", "answer": "hidden variables", "transcript_quote": "could not be explained by hidden variables", "explanation": "Hidden variables theory ruled out." },
          { "number": 35, "label": "Distance of recent entanglement", "answer": "100 kilometres / 100+ km", "transcript_quote": "over one hundred kilometers", "explanation": "Over 100 km separation." },
          { "number": 36, "label": "Cryptography application benefit", "answer": "unhackable communication", "transcript_quote": "theoretically unhackable communication", "explanation": "Unhackable communication enabled." },
          { "number": 37, "label": "Eavesdropping detection method", "answer": "measurement changes state", "transcript_quote": "any measurement attempt changes the quantum state", "explanation": "State change reveals eavesdropping." },
          { "number": 38, "label": "Teleportation capability", "answer": "transfer quantum states", "transcript_quote": "transfer quantum states instantaneously", "explanation": "Quantum state transfer." },
          { "number": 39, "label": "Does teleportation violate", "answer": "relativity", "transcript_quote": "does not violate relativity", "explanation": "Relativity not violated." },
          { "number": 40, "label": "Information speed limit", "answer": "classical information / speed of light", "transcript_quote": "classical information still cannot travel faster than light", "explanation": "Speed of light limit applies." }
        ]
      }
    ]
  }
]', ARRAY['lab', 'equipment', 'quantum', 'research', 'technology'], true),

-- Test 8: "Environment and Nature" (EASY)
('Environment and Nature', 'easy', 40, 30, '[
  {
    "part_number": 1,
    "context": "A visitor booking a guided tour at a national park",
    "transcript": "PARK OFFICE: Welcome to Wildflower National Park. How can I help?\nVISITOR: I''d like information about guided nature tours.\nPARK OFFICE: Great! We offer daily guided walks at different times. There''s a morning tour at nine AM and an afternoon tour at two PM.\nVISITOR: What''s the duration?\nPARK OFFICE: Both tours are three hours long.\nVISITOR: Perfect. How much are they?\nPARK OFFICE: The cost is twenty pounds per adult and ten pounds for children.\nVISITOR: Are there group discounts?\nPARK OFFICE: Yes, groups of ten or more receive a fifteen percent discount.\nVISITOR: What should we bring?\nPARK OFFICE: We recommend bringing water, a hat, and comfortable walking shoes. The weather can be unpredictable, so bring a light jacket.\nVISITOR: Can we book online?\nPARK OFFICE: Yes, our website has an online booking system. Or you can call us at 01234 567890.",
    "question_groups": [
      {
        "type": "form_completion",
        "title": "PARK TOUR BOOKING",
        "instruction": "Complete the form. Write NO MORE THAN THREE WORDS AND/OR A NUMBER.",
        "question_range": [1, 8],
        "items": [
          { "number": 1, "label": "Morning tour time", "answer": "9 AM / nine AM", "transcript_quote": "nine AM", "explanation": "Morning tour at 9 AM." },
          { "number": 2, "label": "Afternoon tour time", "answer": "2 PM / two PM", "transcript_quote": "two PM", "explanation": "Afternoon tour at 2 PM." },
          { "number": 3, "label": "Tour duration", "answer": "3 hours / three hours", "transcript_quote": "three hours long", "explanation": "Tours last 3 hours." },
          { "number": 4, "label": "Adult ticket price", "answer": "£20 / twenty pounds", "transcript_quote": "twenty pounds per adult", "explanation": "Adult cost 20 pounds." },
          { "number": 5, "label": "Child ticket price", "answer": "£10 / ten pounds", "transcript_quote": "ten pounds for children", "explanation": "Child cost 10 pounds." },
          { "number": 6, "label": "Group discount threshold", "answer": "10 or more", "transcript_quote": "groups of ten or more", "explanation": "Discount for 10+ people." },
          { "number": 7, "label": "Group discount percentage", "answer": "15% / fifteen percent", "transcript_quote": "fifteen percent discount", "explanation": "15% group discount." },
          { "number": 8, "label": "Contact phone number", "answer": "01234 567890", "transcript_quote": "01234 567890", "explanation": "Park phone number." }
        ]
      },
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [9, 10],
        "items": [
          { "number": 9, "question": "What is NOT recommended to bring?", "options": {"A": "Water", "B": "Hat", "C": "Heavy coat"}, "answer": "C", "transcript_quote": "bring a light jacket", "explanation": "Light jacket recommended, not heavy coat." },
          { "number": 10, "question": "How can you book a tour?", "options": {"A": "Phone only", "B": "Online only", "C": "Online or phone"}, "answer": "C", "transcript_quote": "online booking system. Or you can call us", "explanation": "Both online and phone available." }
        ]
      }
    ]
  },
  {
    "part_number": 2,
    "context": "A community talk about local recycling scheme",
    "transcript": "Hello everyone. My name is Michael, and I work for the city environmental department. Today I''d like to introduce our new comprehensive recycling program. The program began six months ago and has already diverted five hundred tons of waste from landfills. Our goal is to reduce landfill waste by fifty percent within the next five years. The program has three categories: paper, plastic, and metal. We provide separate colored bins for each category. Blue bins are for paper and cardboard. Yellow bins are for plastic bottles and containers. Red bins are for metal cans and aluminum. Glass should not be placed in these bins—there''s a separate glass collection point at the town center. Pickup occurs every two weeks on Friday mornings. Households can also drop materials at our recycling center, open Tuesday through Saturday from eight AM to five PM. We offer community education workshops on reducing consumption, which reduces waste at the source. Participation has exceeded our expectations—over seventy percent of households now participate.",
    "question_groups": [
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [11, 13],
        "items": [
          { "number": 11, "question": "How long has the program been running?", "options": {"A": "3 months", "B": "6 months", "C": "9 months"}, "answer": "B", "transcript_quote": "six months ago", "explanation": "Program running 6 months." },
          { "number": 12, "question": "How much waste has been diverted?", "options": {"A": "250 tons", "B": "400 tons", "C": "500 tons"}, "answer": "C", "transcript_quote": "five hundred tons", "explanation": "500 tons diverted." },
          { "number": 13, "question": "When is the recycling center open?", "options": {"A": "Monday to Friday", "B": "Tuesday to Saturday", "C": "Daily"}, "answer": "B", "transcript_quote": "Tuesday through Saturday", "explanation": "Open Tuesday-Saturday." }
        ]
      },
      {
        "type": "note_completion",
        "title": "RECYCLING PROGRAM DETAILS",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [14, 20],
        "items": [
          { "number": 14, "label": "Waste reduction goal", "answer": "50% / fifty percent", "transcript_quote": "reduce landfill waste by fifty percent", "explanation": "50% reduction goal." },
          { "number": 15, "label": "Goal timeframe", "answer": "5 years / next five", "transcript_quote": "within the next five years", "explanation": "Goal within 5 years." },
          { "number": 16, "label": "Paper bin color", "answer": "blue", "transcript_quote": "Blue bins are for paper", "explanation": "Paper goes in blue." },
          { "number": 17, "label": "Plastic bin color", "answer": "yellow", "transcript_quote": "Yellow bins are for plastic", "explanation": "Plastic in yellow." },
          { "number": 18, "label": "Metal bin color", "answer": "red", "transcript_quote": "Red bins are for metal", "explanation": "Metal in red." },
          { "number": 19, "label": "Pickup frequency", "answer": "every 2 weeks / fortnightly", "transcript_quote": "every two weeks", "explanation": "Pickup every 2 weeks." },
          { "number": 20, "label": "Household participation rate", "answer": "70% / over seventy percent", "transcript_quote": "over seventy percent", "explanation": "70%+ participation." }
        ]
      }
    ]
  },
  {
    "part_number": 3,
    "context": "Students discussing an ecology field study",
    "transcript": "LISA: How did your ecology field study go?\nMARC: Really interesting! We spent a week studying a coastal ecosystem.\nLISA: What did you focus on?\nMARC: We examined tidal zones and the organisms that live there.\nLISA: Did you make any discoveries?\nMARC: Yes! We found three new species of crabs and documented their behavior.\nLISA: That''s impressive! What was most challenging?\nMARC: The weather. It rained constantly, making observations difficult.\nLISA: How did your team adapt?\nMARC: We wore protective gear and continued observations. We documented everything thoroughly.\nLISA: Did you test water quality?\nMARC: We did. The water was cleaner than expected, which was good news.\nLISA: Will you publish your findings?\nMARC: Yes, we''re preparing a report for our university. It might be submitted to a journal.",
    "question_groups": [
      {
        "type": "matching",
        "title": "MATCHING FIELDWORK ASPECTS",
        "instruction": "Match the aspect with its description.",
        "question_range": [21, 25],
        "options_pool": {
          "A": "a coastal ecosystem",
          "B": "one week",
          "C": "three new crab species",
          "D": "constant rain",
          "E": "cleaner water than expected",
          "F": "a journal submission"
        },
        "items": [
          { "number": 21, "label": "Study location", "answer": "A", "transcript_quote": "coastal ecosystem", "explanation": "Coastal area studied." },
          { "number": 22, "label": "Study duration", "answer": "B", "transcript_quote": "a week", "explanation": "One week duration." },
          { "number": 23, "label": "Organisms discovered", "answer": "C", "transcript_quote": "three new species of crabs", "explanation": "New crab species found." },
          { "number": 24, "label": "Main challenge", "answer": "D", "transcript_quote": "rain constantly", "explanation": "Rain was main problem." },
          { "number": 25, "label": "Positive finding", "answer": "E", "transcript_quote": "water was cleaner", "explanation": "Good water quality." }
        ]
      },
      {
        "type": "sentence_completion",
        "instruction": "Complete the sentences with NO MORE THAN TWO WORDS.",
        "question_range": [26, 30],
        "items": [
          { "number": 26, "sentence": "The study focused on _______ zones.", "answer": "tidal", "transcript_quote": "tidal zones", "explanation": "Tidal zone focus." },
          { "number": 27, "sentence": "The team discovered _______ of crabs.", "answer": "3 species / three species", "transcript_quote": "three new species of crabs", "explanation": "3 new species." },
          { "number": 28, "sentence": "The team wore _______ during rainy conditions.", "answer": "protective gear", "transcript_quote": "wore protective gear", "explanation": "Protective equipment worn." },
          { "number": 29, "sentence": "Water quality was _______ expected.", "answer": "cleaner than", "transcript_quote": "cleaner than expected", "explanation": "Water cleaner than expected." },
          { "number": 30, "sentence": "Results will be _______ in a report.", "answer": "documented / published", "transcript_quote": "preparing a report", "explanation": "Report to be prepared." }
        ]
      }
    ]
  },
  {
    "part_number": 4,
    "context": "Environmental science lecture on climate adaptation",
    "transcript": "Climate change requires nations to develop adaptation strategies alongside mitigation efforts. Adaptation means adjusting our practices to cope with climate impacts. Coastal regions face rising sea levels. Some countries are building sea walls and restoring mangrove forests, which act as natural barriers. Mangroves absorb wave energy and provide wildlife habitat. In Bangladesh, mangrove restoration has reduced cyclone damage by thirty percent. Agriculture is adapting through crop diversification and drought-resistant varieties. Israel has pioneered advanced irrigation techniques, reducing water use by forty percent while maintaining yields. Water management is critical; cities are investing in rainwater harvesting and wastewater recycling. Some regions face desertification. Planting native vegetation helps stabilize soil. Mali has planted sixty million trees in the past twenty years to combat desertification. Forests play a crucial role—they store carbon and provide ecosystem services. Reforestation initiatives are expanding globally. Urban areas are creating green spaces to reduce heat island effects. Green roofs reduce building temperatures and improve insulation. Education is vital for long-term adaptation. Young people understanding climate science will drive future innovation. International cooperation through agreements like the Paris Agreement provides frameworks for coordinated action.",
    "question_groups": [
      {
        "type": "note_completion",
        "title": "CLIMATE ADAPTATION STRATEGIES",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [31, 40],
        "items": [
          { "number": 31, "label": "Adaptation definition", "answer": "adjusting practices / coping with impacts", "transcript_quote": "adjusting our practices to cope", "explanation": "Adaptation is adjustment." },
          { "number": 32, "label": "Coastal protection method", "answer": "mangrove restoration / sea walls", "transcript_quote": "building sea walls and restoring mangrove", "explanation": "Coastal protection strategies." },
          { "number": 33, "label": "Mangrove benefit in Bangladesh", "answer": "30% damage reduction", "transcript_quote": "reduced cyclone damage by thirty percent", "explanation": "30% cyclone damage reduction." },
          { "number": 34, "label": "Agriculture adaptation approach", "answer": "crop diversification / drought-resistant", "transcript_quote": "crop diversification and drought-resistant", "explanation": "Crop adaptation strategy." },
          { "number": 35, "label": "Israel irrigation improvement", "answer": "40% water reduction", "transcript_quote": "reducing water use by forty percent", "explanation": "40% water use reduction." },
          { "number": 36, "label": "Trees planted by Mali", "answer": "60 million / sixty million", "transcript_quote": "sixty million trees", "explanation": "60 million trees planted." },
          { "number": 37, "label": "Tree planting timeframe", "answer": "20 years / past 20", "transcript_quote": "past twenty years", "explanation": "Over 20 years." },
          { "number": 38, "label": "Urban heat solution", "answer": "green spaces / green roofs", "transcript_quote": "green spaces", "explanation": "Urban cooling strategy." },
          { "number": 39, "label": "Green roof benefit", "answer": "reduce temperature / insulation", "transcript_quote": "reduce building temperatures and improve insulation", "explanation": "Temperature and insulation improvements." },
          { "number": 40, "label": "International climate framework", "answer": "Paris Agreement", "transcript_quote": "Paris Agreement", "explanation": "International climate agreement." }
        ]
      }
    ]
  }
]', ARRAY['environment', 'park', 'recycling', 'ecology', 'climate'], true),

-- Test 9: "Urban Life" (MEDIUM)
('Urban Life', 'medium', 40, 30, '[
  {
    "part_number": 1,
    "context": "A tenant inquiring about a rental property",
    "transcript": "LANDLORD: Hello, thank you for your interest in the flat.\nTENANT: Yes, I''d like to know more about it. What''s the monthly rent?\nLANDLORD: The rent is eight hundred fifty pounds per month.\nTENANT: Is that inclusive of utilities?\nLANDLORD: No, utilities are separate. Electricity, water, and gas typically cost around one hundred twenty pounds monthly.\nTENANT: What about maintenance?\nLANDLORD: I handle major repairs. Tenants are responsible for minor repairs up to fifty pounds.\nTENANT: How long is the lease?\nLANDLORD: Standard lease is twelve months, but we can negotiate shorter terms.\nTENANT: What''s the deposit requirement?\nLANDLORD: We require one month''s rent as deposit, which is returned at lease end if no damage occurs.\nTENANT: When can I move in?\nLANDLORD: The flat is available from the fifteenth of next month.",
    "question_groups": [
      {
        "type": "form_completion",
        "title": "RENTAL PROPERTY DETAILS",
        "instruction": "Complete the form. Write NO MORE THAN THREE WORDS AND/OR A NUMBER.",
        "question_range": [1, 8],
        "items": [
          { "number": 1, "label": "Monthly rent", "answer": "£850 / eight hundred fifty", "transcript_quote": "eight hundred fifty pounds", "explanation": "Rent is 850 pounds." },
          { "number": 2, "label": "Utilities inclusion", "answer": "no / not inclusive", "transcript_quote": "No, utilities are separate", "explanation": "Utilities not included." },
          { "number": 3, "label": "Typical utilities cost", "answer": "£120 / approximately 120", "transcript_quote": "around one hundred twenty pounds", "explanation": "Utilities about 120 pounds." },
          { "number": 4, "label": "Minor repair limit", "answer": "£50 / fifty pounds", "transcript_quote": "up to fifty pounds", "explanation": "Tenant responsible for 50 pounds." },
          { "number": 5, "label": "Standard lease duration", "answer": "12 months / one year", "transcript_quote": "twelve months", "explanation": "Standard lease 12 months." },
          { "number": 6, "label": "Deposit amount", "answer": "1 month''s rent", "transcript_quote": "one month''s rent", "explanation": "Deposit equals one month rent." },
          { "number": 7, "label": "Deposit return condition", "answer": "no damage", "transcript_quote": "if no damage occurs", "explanation": "Returned if no damage." },
          { "number": 8, "label": "Move-in date", "answer": "15th next month", "transcript_quote": "fifteenth of next month", "explanation": "Available 15th of next month." }
        ]
      },
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [9, 10],
        "items": [
          { "number": 9, "question": "Who handles major repairs?", "options": {"A": "Tenant", "B": "Landlord", "C": "Both share costs"}, "answer": "B", "transcript_quote": "I handle major repairs", "explanation": "Landlord handles major repairs." },
          { "number": 10, "question": "Is the 12-month lease negotiable?", "options": {"A": "No, fixed", "B": "Yes, shorter terms available", "C": "Yes, longer terms only"}, "answer": "B", "transcript_quote": "we can negotiate shorter terms", "explanation": "Shorter terms can be negotiated." }
        ]
      }
    ]
  },
  {
    "part_number": 2,
    "context": "A city transport official discussing new bus system",
    "transcript": "Good afternoon. I''m here to announce improvements to our city bus system. Starting next month, we''re introducing rapid bus lanes on four major routes. These dedicated lanes reduce journey times by approximately thirty percent. The four routes are the North-South corridor, East-West line, the Airport route, and the Downtown circuit. Bus frequency on rapid routes will increase to every eight minutes during peak hours, compared to the current fifteen-minute intervals. Fares will decrease for frequent users. A new contactless card system launches in two weeks. Monthly passes will cost thirty-two pounds and provide unlimited travel. Previously, passengers paid per journey. The average commuter saving is estimated at eight pounds monthly. We''re also improving safety with security cameras on all buses. Additionally, real-time tracking via smartphone app helps passengers monitor bus locations. The app will be free. We''ve invested eight million pounds in these improvements over the past eighteen months. These changes make public transport more efficient, affordable, and accessible.",
    "question_groups": [
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [11, 13],
        "items": [
          { "number": 11, "question": "How many rapid bus routes are there?", "options": {"A": "Two", "B": "Three", "C": "Four"}, "answer": "C", "transcript_quote": "four major routes", "explanation": "Four rapid routes." },
          { "number": 12, "question": "What is the new peak hour frequency?", "options": {"A": "Every 5 minutes", "B": "Every 8 minutes", "C": "Every 10 minutes"}, "answer": "B", "transcript_quote": "every eight minutes", "explanation": "8 minute frequency." },
          { "number": 13, "question": "What is the monthly pass cost?", "options": {"A": "£28", "B": "£32", "C": "£40"}, "answer": "B", "transcript_quote": "thirty-two pounds", "explanation": "£32 monthly pass." }
        ]
      },
      {
        "type": "note_completion",
        "title": "CITY BUS SYSTEM IMPROVEMENTS",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [14, 20],
        "items": [
          { "number": 14, "label": "Journey time improvement", "answer": "30% reduction", "transcript_quote": "reduce journey times by approximately thirty percent", "explanation": "30% time reduction." },
          { "number": 15, "label": "New payment system", "answer": "contactless card", "transcript_quote": "contactless card system", "explanation": "Contactless card launching." },
          { "number": 16, "label": "System launch timeline", "answer": "2 weeks / two weeks", "transcript_quote": "launches in two weeks", "explanation": "Launching in 2 weeks." },
          { "number": 17, "label": "Estimated user saving", "answer": "£8 monthly", "transcript_quote": "eight pounds monthly", "explanation": "8 pounds monthly saving." },
          { "number": 18, "label": "Current peak frequency", "answer": "15 minutes / fifteen minute", "transcript_quote": "current fifteen-minute intervals", "explanation": "Currently 15 minute intervals." },
          { "number": 19, "label": "Safety feature added", "answer": "security cameras", "transcript_quote": "security cameras on all buses", "explanation": "Cameras for safety." },
          { "number": 20, "label": "Total investment amount", "answer": "£8 million / eight million", "transcript_quote": "eight million pounds", "explanation": "8 million pound investment." }
        ]
      }
    ]
  },
  {
    "part_number": 3,
    "context": "Urban planners discussing city development project",
    "transcript": "SARAH: We need to finalize the downtown redevelopment plans.\nTOM: Agreed. What are the main objectives?\nSARAH: Mixed-use development with residential, commercial, and green spaces. We''re aiming for fifty percent green space.\nTOM: That''s ambitious. What about transportation access?\nSARAH: The site is adjacent to the metro station, which is ideal.\nTOM: Environmental impact?\nSARAH: We''ve completed an environmental impact assessment. Solar panels will power thirty percent of the complex.\nTOM: What about community concerns?\nSARAH: We''ve held consultation meetings. Most concerns were about parking and traffic.\nTOM: How are we addressing that?\nSARAH: We''re designing an underground parking facility for one thousand five hundred cars.\nTOM: That should help. What''s the timeline?\nSARAH: Construction begins next year. Completion is targeted for five years from start.",
    "question_groups": [
      {
        "type": "matching",
        "title": "MATCHING PROJECT ASPECTS",
        "instruction": "Match the aspect with its characteristic.",
        "question_range": [21, 25],
        "options_pool": {
          "A": "mixed-use development",
          "B": "fifty percent green space",
          "C": "adjacent to the metro station",
          "D": "solar panels",
          "E": "underground parking",
          "F": "a five-year completion target"
        },
        "items": [
          { "number": 21, "label": "Development type", "answer": "A", "transcript_quote": "Mixed-use development", "explanation": "Mixed-use is the type." },
          { "number": 22, "label": "Green space target", "answer": "B", "transcript_quote": "fifty percent green space", "explanation": "50% green space goal." },
          { "number": 23, "label": "Transport proximity", "answer": "C", "transcript_quote": "adjacent to the metro station", "explanation": "Metro station nearby." },
          { "number": 24, "label": "Energy source used", "answer": "D", "transcript_quote": "Solar panels", "explanation": "Solar energy used." },
          { "number": 25, "label": "Community concern addressed", "answer": "E", "transcript_quote": "parking facility", "explanation": "Parking solution provided." }
        ]
      },
      {
        "type": "sentence_completion",
        "instruction": "Complete the sentences with NO MORE THAN TWO WORDS.",
        "question_range": [26, 30],
        "items": [
          { "number": 26, "sentence": "Solar panels will power _______ of the complex.", "answer": "30% / thirty percent", "transcript_quote": "thirty percent of the complex", "explanation": "30% powered by solar." },
          { "number": 27, "sentence": "Parking facility will accommodate _______ cars.", "answer": "1500 / 1,500 cars", "transcript_quote": "one thousand five hundred cars", "explanation": "1500 parking spaces." },
          { "number": 28, "sentence": "Environmental _______ has been completed.", "answer": "impact assessment", "transcript_quote": "environmental impact assessment", "explanation": "Assessment completed." },
          { "number": 29, "sentence": "Construction begins _______.", "answer": "next year", "transcript_quote": "Construction begins next year", "explanation": "Next year start date." },
          { "number": 30, "sentence": "Project completion targeted for _______ from start.", "answer": "5 years / five years", "transcript_quote": "five years from start", "explanation": "5 year duration." }
        ]
      }
    ]
  },
  {
    "part_number": 4,
    "context": "Archaeology lecture on ancient civilizations",
    "transcript": "Urban archaeology reveals how ancient peoples organized cities. The earliest known cities emerged in Mesopotamia around forty-five hundred years ago. Ur was one of the first major cities, with a population estimated at sixty-five thousand people. Cities required infrastructure—defensive walls, streets, and drainage systems. Many ancient cities were built near rivers for water access and agriculture. The Nile River enabled Egyptian city development. Indus Valley cities demonstrate advanced urban planning. Mohenjo-daro, excavated in nineteen twenty-two, shows grid-like street patterns remarkably similar to modern planning. Buildings had standardized brick sizes. Sewage systems were underground, indicating sophisticated engineering. Archaeological evidence suggests residential and commercial districts were separated. Temples and administrative buildings occupied central plazas. Artifact analysis reveals trade networks extended across vast distances. Seals found in the Indus Valley match those in Mesopotamia, indicating commerce across regions separated by thousands of kilometers. Understanding ancient urban planning informs modern sustainable city development. Ancient cities often incorporated green spaces and water management. These principles remain relevant as modern cities face density and sustainability challenges. Archaeology provides insights into how successful urban societies functioned.",
    "question_groups": [
      {
        "type": "note_completion",
        "title": "ANCIENT CITIES AND URBAN ARCHAEOLOGY",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [31, 40],
        "items": [
          { "number": 31, "label": "Earliest city emergence", "answer": "Mesopotamia / 4500 years ago", "transcript_quote": "emerged in Mesopotamia around forty-five hundred years ago", "explanation": "Mesopotamian cities emerged 4500 years ago." },
          { "number": 32, "label": "Ur population estimate", "answer": "65,000 / sixty-five thousand", "transcript_quote": "estimated at sixty-five thousand", "explanation": "Ur population 65,000." },
          { "number": 33, "label": "City infrastructure requirement", "answer": "walls / streets / drainage", "transcript_quote": "defensive walls, streets, and drainage", "explanation": "Infrastructure included walls and drainage." },
          { "number": 34, "label": "Mohenjo-daro excavation year", "answer": "1922 / nineteen twenty-two", "transcript_quote": "nineteen twenty-two", "explanation": "Excavated in 1922." },
          { "number": 35, "label": "Street pattern description", "answer": "grid-like", "transcript_quote": "grid-like street patterns", "explanation": "Grid-like layout used." },
          { "number": 36, "label": "Sewage system location", "answer": "underground", "transcript_quote": "sewage systems were underground", "explanation": "Underground sewage system." },
          { "number": 37, "label": "Central plaza occupants", "answer": "temples and administrative buildings", "transcript_quote": "Temples and administrative buildings", "explanation": "Important buildings in center." },
          { "number": 38, "label": "Indus Valley trade evidence", "answer": "seals / matching seals", "transcript_quote": "Seals found in the Indus Valley", "explanation": "Seals show trade." },
          { "number": 39, "label": "Trade distance span", "answer": "thousands of kilometres", "transcript_quote": "thousands of kilometers", "explanation": "Vast distances traded." },
          { "number": 40, "label": "Ancient city planning relevance", "answer": "sustainable development / modern planning", "transcript_quote": "sustainable city development", "explanation": "Lessons for modern cities." }
        ]
      }
    ]
  }
]', ARRAY['urban', 'property', 'transport', 'development', 'archaeology'], true),

-- Test 10: "Knowledge and Culture" (HARD)
('Knowledge and Culture', 'hard', 40, 30, '[
  {
    "part_number": 1,
    "context": "A student enrolling in a specialized university course",
    "transcript": "REGISTRAR: Good morning. You''re interested in the Advanced Neuroscience course?\nSTUDENT: Yes, I''ve been accepted and need to finalize enrollment.\nREGISTRAR: Excellent. This is an advanced course at the fourth-year level. Prerequisites require a Neuroscience 201 grade of at least seventy percent and Organic Chemistry completion.\nSTUDENT: I''ve completed both with higher grades.\nREGISTRAR: Perfect. The course runs for one semester, fourteen weeks. Meeting times are Tuesday and Thursday afternoons from two to four PM.\nSTUDENT: Are there lab components?\nREGISTRAR: Yes, mandatory Friday labs from one to five PM for eight weeks, starting week three.\nSTUDENT: What about fees?\nREGISTRAR: The tuition is three thousand two hundred pounds per semester. Lab materials cost two hundred fifty pounds, due at the first meeting.\nSTUDENT: What''s the grading structure?\nREGISTRAR: Midterm exam counts as thirty percent, final exam as forty percent, and lab reports as thirty percent.\nSTUDENT: When does the course start?\nREGISTRAR: Instruction begins on September eighth, right after the university orientation.",
    "question_groups": [
      {
        "type": "form_completion",
        "title": "COURSE ENROLLMENT FORM",
        "instruction": "Complete the form. Write NO MORE THAN THREE WORDS AND/OR A NUMBER.",
        "question_range": [1, 8],
        "items": [
          { "number": 1, "label": "Course level", "answer": "fourth-year / advanced", "transcript_quote": "fourth-year level", "explanation": "Advanced fourth-year course." },
          { "number": 2, "label": "Course duration", "answer": "1 semester / 14 weeks", "transcript_quote": "one semester, fourteen weeks", "explanation": "One semester, 14 weeks." },
          { "number": 3, "label": "Lecture meeting days", "answer": "Tuesday and Thursday", "transcript_quote": "Tuesday and Thursday", "explanation": "Meetings on Tuesdays and Thursdays." },
          { "number": 4, "label": "Lecture time", "answer": "2-4 PM / 14:00-16:00", "transcript_quote": "two to four PM", "explanation": "Afternoon sessions 2-4 PM." },
          { "number": 5, "label": "Lab day", "answer": "Friday", "transcript_quote": "Friday labs", "explanation": "Lab on Fridays." },
          { "number": 6, "label": "Lab duration (weekly)", "answer": "4 hours / 1-5 PM", "transcript_quote": "one to five PM", "explanation": "Friday 1-5 PM labs." },
          { "number": 7, "label": "Tuition cost", "answer": "£3,200 / three thousand two hundred", "transcript_quote": "three thousand two hundred pounds", "explanation": "Tuition £3,200." },
          { "number": 8, "label": "Lab materials fee", "answer": "£250 / two hundred fifty", "transcript_quote": "two hundred fifty pounds", "explanation": "Materials £250." }
        ]
      },
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [9, 10],
        "items": [
          { "number": 9, "question": "What percentage is the final exam worth?", "options": {"A": "30%", "B": "35%", "C": "40%"}, "answer": "C", "transcript_quote": "final exam as forty percent", "explanation": "Final exam 40%." },
          { "number": 10, "question": "When do Friday labs begin?", "options": {"A": "Week 1", "B": "Week 3", "C": "Week 5"}, "answer": "B", "transcript_quote": "starting week three", "explanation": "Labs start week 3." }
        ]
      }
    ]
  },
  {
    "part_number": 2,
    "context": "A museum audio guide discussing an exhibition",
    "transcript": "Welcome to the Classical Civilizations Exhibition. I''m your audio guide. This exhibition showcases artifacts from ancient Greece, Rome, and Mesopotamia spanning three thousand years of history. The exhibit opened six months ago and has attracted over two hundred thousand visitors. We''ll begin with the Greek section. Ancient Greece flourished between the eighth and fourth centuries BC. The civilization produced remarkable achievements in philosophy, drama, and democracy. This marble statue, carved around four hundred forty BC, depicts an athlete competing in ancient Olympic Games. Notice the anatomical accuracy—revolutionary for its time. The next section covers the Roman Empire, which lasted approximately five hundred years. Rome conquered territories spanning three million square kilometers at its peak. Roman engineering achievements include aqueducts that transported water over vast distances. This model demonstrates an aqueduct system. The final section showcases Mesopotamia, often called the ''cradle of civilization.'' Writing systems, mathematics, and laws originated here. The Code of Hammurabi, dating to seventeen fifty BC, is one of the oldest legal documents. Most artifacts are displayed in their original condition, though some underwent conservation treatment.",
    "question_groups": [
      {
        "type": "multiple_choice",
        "instruction": "Choose the correct letter, A, B or C.",
        "question_range": [11, 13],
        "items": [
          { "number": 11, "question": "How long has the exhibition been open?", "options": {"A": "3 months", "B": "6 months", "C": "9 months"}, "answer": "B", "transcript_quote": "six months ago", "explanation": "Exhibition open 6 months." },
          { "number": 12, "question": "How many visitors have attended?", "options": {"A": "100,000", "B": "150,000", "C": "200,000+"}, "answer": "C", "transcript_quote": "over two hundred thousand", "explanation": "Over 200,000 visitors." },
          { "number": 13, "question": "How long did the Roman Empire last?", "options": {"A": "300 years", "B": "400 years", "C": "500 years"}, "answer": "C", "transcript_quote": "approximately five hundred years", "explanation": "About 500 years." }
        ]
      },
      {
        "type": "note_completion",
        "title": "CLASSICAL CIVILIZATIONS EXHIBITION",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [14, 20],
        "items": [
          { "number": 14, "label": "Time span covered", "answer": "3000 years / three thousand", "transcript_quote": "spanning three thousand years", "explanation": "3000 years of history." },
          { "number": 15, "label": "Greek flourishing period", "answer": "8th-4th centuries BC", "transcript_quote": "between the eighth and fourth centuries BC", "explanation": "8th-4th centuries BC." },
          { "number": 16, "label": "Statue carving date", "answer": "440 BC / around 440", "transcript_quote": "around four hundred forty BC", "explanation": "Carved 440 BC." },
          { "number": 17, "label": "Roman territory size", "answer": "3 million km / sq km", "transcript_quote": "three million square kilometers", "explanation": "3 million sq km." },
          { "number": 18, "label": "Mesopotamia nickname", "answer": "cradle of civilization", "transcript_quote": "cradle of civilization", "explanation": "Mesopotamia''s nickname." },
          { "number": 19, "label": "Code of Hammurabi date", "answer": "1750 BC / seventeen fifty", "transcript_quote": "seventeen fifty BC", "explanation": "Dated 1750 BC." },
          { "number": 20, "label": "Document type (Code)", "answer": "legal document / laws", "transcript_quote": "oldest legal documents", "explanation": "Ancient legal code." }
        ]
      }
    ]
  },
  {
    "part_number": 3,
    "context": "Literature scholars discussing a famous novel''s interpretation",
    "transcript": "PROFESSOR: Today we''re discussing interpretations of Jane Austen''s ''Pride and Prejudice.''\nSTUDENT 1: I found the character development fascinating. Elizabeth''s transformation from prejudice to self-awareness is compelling.\nPROFESSOR: Excellent observation. How does this relate to the novel''s social context?\nSTUDENT 1: Austen critiques rigid social hierarchies. Elizabeth''s resistance to marriage norms was revolutionary for the era.\nSTUDENT 2: I agree, but I''d add that the economic dimension is crucial. Women had limited options—marriage was survival.\nPROFESSOR: Astute. What about Mr. Darcy''s role?\nSTUDENT 2: He represents class privilege. His initial pride reflects aristocratic arrogance, but he evolves through Elizabeth''s influence.\nSTUDENT 1: The novel demonstrates that both characters must change. Darcy releases class prejudice; Elizabeth releases interpersonal prejudice.\nPROFESSOR: Precisely. These parallel transformations suggest mutual growth, not female subservience. What literary devices support this?\nSTUDENT 2: The letter-writing scenes are crucial. Letters reveal internal thoughts unfiltered.\nPROFESSOR: Excellent insight. Austen uses epistolary elements within a narrative framework.\nSTUDENT 1: And the dialogue—witty exchanges expose character flaws immediately.",
    "question_groups": [
      {
        "type": "matching",
        "title": "MATCHING CHARACTER TRAITS",
        "instruction": "Match the character with their defining trait transformation.",
        "question_range": [21, 25],
        "options_pool": {
          "A": "prejudice",
          "B": "self-awareness",
          "C": "pride",
          "D": "letter-writing scenes",
          "E": "rigid class hierarchies",
          "F": "witty dialogue exchanges"
        },
        "items": [
          { "number": 21, "label": "Elizabeth''s initial fault", "answer": "A", "transcript_quote": "prejudice", "explanation": "Elizabeth begins prejudiced." },
          { "number": 22, "label": "Elizabeth''s achievement", "answer": "B", "transcript_quote": "self-awareness", "explanation": "She gains self-awareness." },
          { "number": 23, "label": "Darcy''s initial fault", "answer": "C", "transcript_quote": "pride", "explanation": "Darcy shows pride." },
          { "number": 24, "label": "Novel''s literary device", "answer": "D", "transcript_quote": "letter-writing", "explanation": "Letters reveal thoughts." },
          { "number": 25, "label": "Social commentary focus", "answer": "E", "transcript_quote": "class hierarchies", "explanation": "Class critique emphasized." }
        ]
      },
      {
        "type": "sentence_completion",
        "instruction": "Complete the sentences with NO MORE THAN TWO WORDS.",
        "question_range": [26, 30],
        "items": [
          { "number": 26, "sentence": "Elizabeth''s resistance to _______ was revolutionary.", "answer": "marriage norms", "transcript_quote": "resistance to marriage norms", "explanation": "Marriage norms resisted." },
          { "number": 27, "sentence": "For women, marriage was a matter of _______.", "answer": "survival / economic necessity", "transcript_quote": "survival", "explanation": "Economic survival factor." },
          { "number": 28, "sentence": "Darcy''s initial _______ reflects class privilege.", "answer": "pride / arrogance", "transcript_quote": "pride reflects aristocratic arrogance", "explanation": "Pride characteristic." },
          { "number": 29, "sentence": "Letters in the novel reveal _______.", "answer": "internal thoughts", "transcript_quote": "internal thoughts unfiltered", "explanation": "Unfiltered thoughts shown." },
          { "number": 30, "sentence": "Austen uses _______ framework with embedded letters.", "answer": "narrative", "transcript_quote": "epistolary elements within a narrative framework", "explanation": "Narrative structure used." }
        ]
      }
    ]
  },
  {
    "part_number": 4,
    "context": "Neuroscience lecture on brain plasticity and learning",
    "transcript": "Neuroplasticity is the brain''s remarkable ability to reorganize itself by forming new neural connections throughout life. This contradicts earlier beliefs that the brain was fixed after childhood. Research by neuroscientist Donald Hebb established fundamental principles in nineteen forty-nine. Hebb''s postulate states: ''Neurons that fire together, wire together.'' This means repeated activation of neural pathways strengthens connections. Learning physically changes brain structure. Brain imaging studies show measurable changes in gray matter density following skill acquisition. Musicians demonstrate enhanced auditory and motor cortex development. Studies reveal that intensive practice increases neural density in relevant brain regions by up to five percent annually. Language learning also triggers significant plasticity. Polyglots—people speaking four or more languages—show increased gray matter in language-processing regions. Recovery from brain injury demonstrates plasticity''s therapeutic potential. Stroke victims can regain lost function through intensive rehabilitation. Neural pathways can be rewired to compensate for damaged areas. Age is not a limiting factor—plasticity continues throughout life, though it decreases with age. Young brains show greater plasticity than older brains, but older individuals retain substantial capacity for change. Educational and enrichment activities enhance plasticity at any age. Understanding neuroplasticity has revolutionized rehabilitation medicine and cognitive enhancement strategies.",
    "question_groups": [
      {
        "type": "note_completion",
        "title": "NEUROPLASTICITY AND BRAIN LEARNING",
        "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER.",
        "question_range": [31, 40],
        "items": [
          { "number": 31, "label": "Neuroplasticity definition", "answer": "brain reorganization / forming connections", "transcript_quote": "reorganize itself by forming new neural connections", "explanation": "Brain adaptation definition." },
          { "number": 32, "label": "Earlier belief", "answer": "brain was fixed", "transcript_quote": "brain was fixed", "explanation": "Fixed brain theory." },
          { "number": 33, "label": "Hebb''s year of discovery", "answer": "1949 / nineteen forty-nine", "transcript_quote": "nineteen forty-nine", "explanation": "Discovery in 1949." },
          { "number": 34, "label": "Hebb''s principle phrase", "answer": "fire together / wire together", "transcript_quote": "Neurons that fire together, wire together", "explanation": "Hebb''s famous principle." },
          { "number": 35, "label": "Musicians'' neural enhancement", "answer": "auditory and motor cortex", "transcript_quote": "enhanced auditory and motor cortex", "explanation": "Brain region changes." },
          { "number": 36, "label": "Annual neural density increase", "answer": "5% / up to 5 percent", "transcript_quote": "up to five percent annually", "explanation": "Density increase rate." },
          { "number": 37, "label": "Polyglot definition", "answer": "4+ languages / four or more", "transcript_quote": "speaking four or more languages", "explanation": "Multilingual definition." },
          { "number": 38, "label": "Stroke recovery mechanism", "answer": "pathway rewiring / compensation", "transcript_quote": "pathways can be rewired", "explanation": "Recovery through rewiring." },
          { "number": 39, "label": "Age factor in plasticity", "answer": "decreases with age", "transcript_quote": "decreases with age", "explanation": "Plasticity changes over lifespan." },
          { "number": 40, "label": "Plasticity enhancement method", "answer": "enrichment activities / education", "transcript_quote": "Educational and enrichment activities enhance", "explanation": "Ways to enhance plasticity." }
        ]
      }
    ]
  }
]', ARRAY['education', 'course', 'museum', 'literature', 'neuroscience'], true);

