-- ============================================================
-- Seed Reading Test: "Science in Everyday Life" (EASY)
-- 3 passages, 40 questions, Cambridge-style Academic Reading
-- Topics: Technology History (Bicycle), Environmental Science
--         (Light Pollution), Geography (Urban Heat Islands)
-- ============================================================

INSERT INTO public.reading_test_library (title, difficulty, topic_tags, sections) VALUES (
  'Science in Everyday Life — Academic Reading Test (Easy)',
  'easy',
  ARRAY['Technology History', 'Environmental Science', 'Geography'],
  $JSON${
    "sections": [
      {
        "section_number": 1,
        "passage": {
          "title": "The History of the Bicycle",
          "topic": "Technology History",
          "wordCount": 560,
          "content": "A The bicycle has a history of roughly two hundred years, yet it remains one of the most widely used forms of transport in the world. The first device resembling a bicycle was the Laufmaschine, or running machine, invented by the German engineer Karl von Drais in 1817. It had two wheels and a seat but no pedals; riders pushed it along with their feet. Von Drais intended it as a substitute for horses, which were scarce and expensive after a volcanic eruption had destroyed many harvests across Europe.\n\nB The addition of pedals came in the 1860s, when French craftsmen attached them to the front wheel of a two-wheeled vehicle. This machine, soon known as the velocipede or boneshaker because of its uncomfortable ride on iron-rimmed wheels, became briefly popular in Europe and North America. It was followed by the high-wheeled Penny-farthing, which had a very large front wheel and a tiny rear wheel. Although faster than the boneshaker, the Penny-farthing was difficult to balance and dangerous to ride.\n\nC The modern bicycle emerged in 1885, when the British engineer John Kemp Starley introduced the Rover safety bicycle. It featured two wheels of equal size, a chain connecting the pedals to the rear wheel, and a more comfortable seating position. Because it was much safer and easier to ride than its predecessors, it appealed to a far wider audience, including women, who had previously been discouraged from cycling by the difficulty and the immodesty associated with mounting a Penny-farthing.\n\nD The 1890s saw an extraordinary boom in cycling. In Europe and North America, bicycles became a symbol of freedom and modernity. Two brothers named Orville and Wilbur Wright, who later became famous for building the first powered aircraft, ran a bicycle repair and sales shop in Ohio. The bicycle also played a significant role in the early stages of the women's movement, as it gave women an unprecedented degree of independent mobility.\n\nE During the twentieth century, the rise of the motor car led to a decline in cycling in many western countries, as roads were redesigned around vehicles and cycling came to be seen as a mode of transport for those who could not afford a car. In Asia, however, particularly in China and the Netherlands, bicycles remained central to daily life for millions of people, who continued to rely on them for commuting, shopping and delivering goods.\n\nF In recent decades, cycling has experienced a revival in many cities. Governments have invested in dedicated cycling lanes, traffic-free zones and public bike-sharing schemes. The development of electric bicycles, which use a battery-powered motor to assist the rider, has extended cycling's appeal to older people and those who live in hilly areas. Environmental concerns about motor vehicles have strengthened the case for cycling as a sustainable mode of urban transport.\n\nG Urban planners increasingly regard cycling as an essential part of the future transport system. Several cities, including Amsterdam, Copenhagen and Bogotá, have shown that well-designed cycling infrastructure can shift large proportions of journeys away from private cars. As cities continue to grapple with air pollution, congestion and carbon emissions, the two-wheeled invention of Karl von Drais may prove more relevant than ever."
        },
        "question_groups": [
          {
            "type": "tfng",
            "instruction": "Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
            "question_range": [1, 6],
            "items": [
              {"number": 1, "statement": "The first bicycle-like device was invented in 1817.", "answer": "TRUE", "evidence": "the Laufmaschine, or running machine, invented by the German engineer Karl von Drais in 1817", "explanation": "Paragraph A."},
              {"number": 2, "statement": "The Laufmaschine was powered by pedals attached to the front wheel.", "answer": "FALSE", "evidence": "It had two wheels and a seat but no pedals; riders pushed it along with their feet", "explanation": "Paragraph A states the Laufmaschine had no pedals."},
              {"number": 3, "statement": "The safety bicycle made cycling accessible to more people, including women.", "answer": "TRUE", "evidence": "it appealed to a far wider audience, including women", "explanation": "Paragraph C."},
              {"number": 4, "statement": "The Wright brothers worked in the bicycle industry before building aircraft.", "answer": "TRUE", "evidence": "Two brothers named Orville and Wilbur Wright... ran a bicycle repair and sales shop", "explanation": "Paragraph D."},
              {"number": 5, "statement": "Cycling remained equally popular across all western countries during the twentieth century.", "answer": "FALSE", "evidence": "the rise of the motor car led to a decline in cycling in many western countries", "explanation": "Paragraph E states cycling declined in western countries."},
              {"number": 6, "statement": "Electric bicycles are now banned in several major cities.", "answer": "NOT GIVEN", "evidence": "", "explanation": "The passage describes electric bicycles positively but mentions no bans."}
            ]
          },
          {
            "type": "sentence_completion",
            "instruction": "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
            "question_range": [7, 10],
            "items": [
              {"number": 7, "sentence": "The velocipede was sometimes called the ______ because of its uncomfortable ride on iron-rimmed wheels.", "answer": "boneshaker", "evidence": "known as the velocipede or boneshaker because of its uncomfortable ride", "explanation": "Paragraph B."},
              {"number": 8, "sentence": "The safety bicycle was invented by John Kemp ______.", "answer": "Starley", "evidence": "John Kemp Starley introduced the Rover safety bicycle", "explanation": "Paragraph C."},
              {"number": 9, "sentence": "In the 1890s, the sudden popularity of bicycles was known as the bicycle ______.", "answer": "boom", "evidence": "The 1890s saw an extraordinary boom in cycling", "explanation": "Paragraph D."},
              {"number": 10, "sentence": "Electric bicycles use a battery-powered motor to ______ the rider.", "answer": "assist", "evidence": "use a battery-powered motor to assist the rider", "explanation": "Paragraph F."}
            ]
          },
          {
            "type": "matching_information",
            "instruction": "Reading Passage 1 has seven paragraphs A–G. Which paragraph contains the following information?",
            "question_range": [11, 13],
            "items": [
              {"number": 11, "statement": "an example of how cycling helped transform the role of women in society", "answer": "D", "evidence": "The bicycle also played a significant role in the early stages of the women's movement, as it gave women an unprecedented degree of independent mobility", "explanation": "Paragraph D."},
              {"number": 12, "statement": "a description of the very first device that resembled a bicycle", "answer": "A", "evidence": "The first device resembling a bicycle was the Laufmaschine... invented by the German engineer Karl von Drais", "explanation": "Paragraph A."},
              {"number": 13, "statement": "a reference to cities that have successfully moved many journeys away from cars", "answer": "G", "evidence": "Amsterdam, Copenhagen and Bogotá, have shown that well-designed cycling infrastructure can shift large proportions of journeys away from private cars", "explanation": "Paragraph G."}
            ]
          }
        ]
      },
      {
        "section_number": 2,
        "passage": {
          "title": "Light Pollution and Its Effects",
          "topic": "Environmental Science",
          "wordCount": 555,
          "content": "A At night, from a dark hillside far from any city, the sky is filled with thousands of stars, the band of the Milky Way and the slow movement of satellites. For most people living today, however, this view is impossible. Scientists estimate that around eighty per cent of the world's population lives under skies so bright with artificial light that the Milky Way is no longer visible. Light pollution — the brightening of the night sky by artificial sources — has grown steadily since the introduction of electric lighting and continues to spread.\n\nB The effects on wildlife are widespread and severe. Sea turtles lay their eggs on beaches at night and hatchlings instinctively move towards the brightest horizon, which in natural conditions means the sea. Artificial lights on nearby roads or buildings lead hatchlings away from the water, where they die from exhaustion or are taken by predators. Migrating birds, many of which navigate by the stars, are drawn off course by brightly lit buildings and communication towers. Insects such as moths are attracted to artificial lights and spend energy circling them instead of feeding or reproducing.\n\nC Artificial light also affects human health. Light that contains a high proportion of blue wavelengths — including light from many LED screens and modern streetlights — suppresses the production of melatonin, the hormone that signals to the body that it is time to sleep. Disruption of the body's circadian rhythm, the internal clock that regulates sleep, appetite and cell repair, has been linked in multiple studies to higher rates of obesity, cardiovascular disease and certain cancers.\n\nD Astronomers have long recognised the problem. Professional observatories have been forced to relocate to remote mountain sites far from cities, and even there, the glow on the horizon continues to grow. Amateur astronomers find that the faint objects they once tracked through city telescopes are now washed out. Measurements show that the brightness of the night sky is increasing by approximately two per cent each year as new sources of light are added.\n\nE Engineers and planners have developed a range of solutions. Modern LED streetlights can be designed to direct their beams downward rather than outward or upward, reducing the amount of light that escapes into the sky. Motion sensors allow lights to switch off when no one is present. Using warm-coloured lights, which have fewer blue wavelengths, reduces the biological harm for both humans and wildlife. Many of these changes also save energy and reduce costs.\n\nF A global movement to protect dark skies has grown alongside these technical improvements. The International Dark-Sky Association, founded in 1988, works with local authorities, businesses and communities to reduce unnecessary outdoor lighting. More than two hundred places worldwide have been certified as International Dark Sky Parks or Reserves, where strict lighting controls are enforced. Communities that achieve this certification often attract visitors interested in stargazing, creating a source of income known as astrotourism."
        },
        "question_groups": [
          {
            "type": "matching_headings",
            "instruction": "Reading Passage 2 has six paragraphs A–F. Choose the correct heading for paragraphs B–F from the list of headings below.",
            "question_range": [14, 18],
            "headings_pool": [
              "i. How artificial light harms animals and their behaviour",
              "ii. The impact of light pollution on human health",
              "iii. How light pollution affects science and observation",
              "iv. Technical and design solutions to reduce light escape",
              "v. A worldwide effort to preserve natural darkness",
              "vi. The economic benefits of streetlighting for businesses",
              "vii. New research into the link between light and productivity"
            ],
            "items": [
              {"number": 14, "paragraph": "B", "answer": "i", "evidence": "Sea turtles... Migrating birds... Insects such as moths", "explanation": "Paragraph B describes harm to wildlife."},
              {"number": 15, "paragraph": "C", "answer": "ii", "evidence": "Artificial light also affects human health... melatonin... circadian rhythm", "explanation": "Paragraph C covers human health effects."},
              {"number": 16, "paragraph": "D", "answer": "iii", "evidence": "Astronomers have long recognised the problem. Professional observatories have been forced to relocate", "explanation": "Paragraph D discusses light pollution's effect on astronomy."},
              {"number": 17, "paragraph": "E", "answer": "iv", "evidence": "LED streetlights can be designed to direct their beams downward... Motion sensors... warm-coloured lights", "explanation": "Paragraph E outlines technical solutions."},
              {"number": 18, "paragraph": "F", "answer": "v", "evidence": "The International Dark-Sky Association... More than two hundred places worldwide have been certified", "explanation": "Paragraph F is about the dark sky movement."}
            ]
          },
          {
            "type": "multiple_choice",
            "instruction": "Choose the correct letter, A, B, C or D.",
            "question_range": [19, 22],
            "items": [
              {"number": 19, "question": "What proportion of the world's population cannot see the Milky Way?", "options": {"A": "About half", "B": "About sixty per cent", "C": "About eighty per cent", "D": "Nearly all"}, "answer": "C", "evidence": "around eighty per cent of the world's population lives under skies so bright... that the Milky Way is no longer visible", "explanation": "Paragraph A."},
              {"number": 20, "question": "How does light pollution harm sea turtle hatchlings?", "options": {"A": "It prevents females from reaching the beach to lay eggs.", "B": "It leads hatchlings away from the sea towards artificial lights.", "C": "It changes the temperature of sand where eggs are buried.", "D": "It attracts predators to nesting beaches."}, "answer": "B", "evidence": "Artificial lights on nearby roads or buildings lead hatchlings away from the water", "explanation": "Paragraph B."},
              {"number": 21, "question": "By approximately how much does the brightness of the night sky increase each year?", "options": {"A": "Less than one per cent", "B": "Two per cent", "C": "Five per cent", "D": "Ten per cent"}, "answer": "B", "evidence": "the brightness of the night sky is increasing by approximately two per cent each year", "explanation": "Paragraph D."},
              {"number": 22, "question": "How many places have been certified as International Dark Sky Parks or Reserves?", "options": {"A": "Fewer than fifty", "B": "About one hundred", "C": "More than two hundred", "D": "Over five hundred"}, "answer": "C", "evidence": "More than two hundred places worldwide have been certified", "explanation": "Paragraph F."}
            ]
          },
          {
            "type": "summary_completion",
            "instruction": "Complete the summary below. Choose NO MORE THAN ONE WORD from the box for each answer.",
            "question_range": [23, 26],
            "word_bank": ["blue", "melatonin", "circadian", "cancer", "downward", "motion", "warm"],
            "summary": "Lights that emit ___23___ wavelengths reduce production of the hormone ___24___, disrupting the body's ___25___ rhythm. To limit this harm, new LED streetlights can be directed ___26___, so that less light escapes into the sky.",
            "items": [
              {"number": 23, "answer": "blue", "evidence": "Light that contains a high proportion of blue wavelengths... suppresses the production of melatonin", "explanation": "Paragraph C."},
              {"number": 24, "answer": "melatonin", "evidence": "suppresses the production of melatonin, the hormone that signals to the body that it is time to sleep", "explanation": "Paragraph C."},
              {"number": 25, "answer": "circadian", "evidence": "Disruption of the body's circadian rhythm", "explanation": "Paragraph C."},
              {"number": 26, "answer": "downward", "evidence": "LED streetlights can be designed to direct their beams downward", "explanation": "Paragraph E."}
            ]
          }
        ]
      },
      {
        "section_number": 3,
        "passage": {
          "title": "Urban Heat Islands",
          "topic": "Geography",
          "wordCount": 580,
          "content": "A Cities are consistently warmer than the surrounding countryside. This difference, which can range from two to ten degrees Celsius, was first systematically described by the British meteorologist Luke Howard in 1810, when he compared temperature records from central London with those from rural areas nearby. Howard noticed that the city retained heat at night long after the countryside had cooled. The phenomenon he identified is now known as the urban heat island effect.\n\nB The causes are well understood. Dark surfaces such as asphalt roads and flat rooftops absorb large quantities of solar radiation during the day and release it as heat at night, keeping city temperatures elevated long after sunset. Cities also contain very little vegetation, which in natural settings cools the air through evaporation. Additionally, human activity generates enormous amounts of waste heat: engines, air conditioning units, industrial processes and the body heat of millions of people all contribute to warming the urban environment.\n\nC The health consequences can be severe. During the 2003 European heatwave, more than seventy thousand people died from heat-related illness, the majority of them in cities. Elderly people, young children and those without access to air conditioning or adequate housing are at greatest risk. As global temperatures rise due to climate change, the combined effect of background warming and the urban heat island means that extreme heat events in cities will become more frequent and more dangerous.\n\nD The heat island effect also has economic consequences. Higher summer temperatures lead to greater use of air conditioning, raising electricity demand and costs. Buildings in cities may require less heating during winter than equivalent buildings in the countryside, but studies suggest that the net effect on annual energy use is almost always an increase. In periods of peak demand, the electricity grid may struggle to cope, with consequences for businesses and households alike.\n\nE Green infrastructure is among the most effective responses. Urban trees and parks reduce the temperature of the air around them through shade and evaporation, with studies showing that well-planted urban green spaces can lower local temperatures by between two and eight degrees Celsius. Green roofs, covered in plants rather than conventional materials, insulate buildings and cool the air above them. Water features such as urban ponds and fountains provide additional cooling through evaporation.\n\nF Engineers have also proposed physical solutions based on the principle that light-coloured surfaces reflect more solar radiation than dark ones. Reflective or cool rooftops, painted white or coated with light-coloured materials, can significantly reduce the heat absorbed by buildings. Light-coloured pavements are being trialled in several cities. The proportion of solar energy a surface reflects rather than absorbs is called its albedo, and increasing the average albedo of a city is one of the most cost-effective strategies available.\n\nG Urban planners are increasingly required to address heat in the design of new developments. Several cities have appointed dedicated heat officers, senior officials responsible for coordinating responses across transport, housing, health and emergency services. Cities such as Barcelona, Melbourne and Medellín are recognised as leaders in this area, having combined green infrastructure, reflective surfaces and community cooling centres to reduce the risks faced by their residents. As the urban population worldwide continues to grow, managing heat in cities will become one of the defining challenges of twenty-first century planning."
        },
        "question_groups": [
          {
            "type": "ynng",
            "instruction": "Do the following statements agree with the views of the writer in Reading Passage 3? Write YES if the statement agrees with the views of the writer, NO if the statement contradicts the views of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.",
            "question_range": [27, 31],
            "items": [
              {"number": 27, "statement": "The urban heat island effect was first identified in the nineteenth century.", "answer": "YES", "evidence": "first systematically described by the British meteorologist Luke Howard in 1810", "explanation": "Paragraph A; 1810 is in the nineteenth century."},
              {"number": 28, "statement": "The temperature difference between cities and the countryside is always less than two degrees Celsius.", "answer": "NO", "evidence": "which can range from two to ten degrees Celsius", "explanation": "Paragraph A gives a range up to ten degrees, contradicting the claim of always less than two."},
              {"number": 29, "statement": "Most deaths during the 2003 European heatwave occurred in urban areas.", "answer": "YES", "evidence": "more than seventy thousand people died... the majority of them in cities", "explanation": "Paragraph C."},
              {"number": 30, "statement": "Urban green spaces can reduce local temperatures by up to eight degrees Celsius.", "answer": "YES", "evidence": "can lower local temperatures by between two and eight degrees Celsius", "explanation": "Paragraph E."},
              {"number": 31, "statement": "All major cities now have an official appointed to manage heat risks.", "answer": "NOT GIVEN", "evidence": "", "explanation": "Paragraph G says several cities have appointed heat officers but does not claim all major cities have done so."}
            ]
          },
          {
            "type": "matching_information",
            "instruction": "Reading Passage 3 has seven paragraphs A–G. Which paragraph contains the following information?",
            "question_range": [32, 36],
            "items": [
              {"number": 32, "statement": "an example of a deadly event showing the health risks of urban heat", "answer": "C", "evidence": "During the 2003 European heatwave, more than seventy thousand people died", "explanation": "Paragraph C."},
              {"number": 33, "statement": "an explanation of why dark-coloured surfaces increase urban temperatures", "answer": "B", "evidence": "Dark surfaces such as asphalt roads and flat rooftops absorb large quantities of solar radiation", "explanation": "Paragraph B."},
              {"number": 34, "statement": "the name of the scientist who first documented the urban heat island", "answer": "A", "evidence": "first systematically described by the British meteorologist Luke Howard in 1810", "explanation": "Paragraph A."},
              {"number": 35, "statement": "examples of cities considered leaders in reducing urban heat", "answer": "G", "evidence": "Cities such as Barcelona, Melbourne and Medellín are recognised as leaders in this area", "explanation": "Paragraph G."},
              {"number": 36, "statement": "an explanation of the term albedo and why it is relevant to city planning", "answer": "F", "evidence": "The proportion of solar energy a surface reflects rather than absorbs is called its albedo", "explanation": "Paragraph F."}
            ]
          },
          {
            "type": "matching_sentence_endings",
            "instruction": "Complete each sentence with the correct ending A–F from the box below.",
            "question_range": [37, 40],
            "endings_pool": {
              "A": "can lower surrounding air temperatures by up to eight degrees.",
              "B": "absorb more solar radiation than lighter surfaces and release it as heat at night.",
              "C": "was first documented by a British meteorologist in the early nineteenth century.",
              "D": "has prompted some cities to appoint a senior official to manage the issue.",
              "E": "are at greatest risk from the health effects of urban heat.",
              "F": "can reduce the heat absorbed by buildings significantly."
            },
            "items": [
              {"number": 37, "sentence_start": "The urban heat island effect", "answer": "C", "evidence": "first systematically described by the British meteorologist Luke Howard in 1810", "explanation": "Paragraph A."},
              {"number": 38, "sentence_start": "Urban trees and well-planted green spaces", "answer": "A", "evidence": "can lower local temperatures by between two and eight degrees Celsius", "explanation": "Paragraph E."},
              {"number": 39, "sentence_start": "Dark asphalt roads and rooftops", "answer": "B", "evidence": "Dark surfaces such as asphalt roads and flat rooftops absorb large quantities of solar radiation during the day and release it as heat at night", "explanation": "Paragraph B."},
              {"number": 40, "sentence_start": "Elderly people and those without air conditioning", "answer": "E", "evidence": "Elderly people, young children and those without access to air conditioning... are at greatest risk", "explanation": "Paragraph C."}
            ]
          }
        ]
      }
    ]
  }$JSON$::jsonb
);
