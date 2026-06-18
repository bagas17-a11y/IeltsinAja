-- ============================================================
-- Seed Reading Test: "Planet and People" (EASY)
-- 3 passages, 40 questions, Cambridge-style Academic Reading
-- Topics: Environmental Science (Amazon Rainforest),
--         Social History (Coffee), Biology (Dog Domestication)
-- ============================================================

INSERT INTO public.reading_test_library (title, difficulty, topic_tags, sections) VALUES (
  'Planet and People — Academic Reading Test (Easy)',
  'easy',
  ARRAY['Environmental Science', 'Social History', 'Biology'],
  $JSON${
    "sections": [
      {
        "section_number": 1,
        "passage": {
          "title": "The Amazon Rainforest",
          "topic": "Environmental Science",
          "wordCount": 560,
          "content": "A The Amazon basin contains the largest tropical rainforest on Earth, covering approximately 5.5 million square kilometres across nine countries in South America. Brazil holds the greatest share, around sixty per cent of the total. The forest is sometimes called the lungs of the Earth because it absorbs vast quantities of carbon dioxide and releases oxygen. It also holds around ten per cent of all the species on our planet.\n\nB The Amazon's biodiversity is extraordinary by any measure. Researchers have identified more than forty thousand plant species within its borders, along with roughly one million insect species. Remarkably, the Amazon river system contains more species of fish than the entire Atlantic Ocean. New species continue to be discovered every year, and scientists believe many more remain unnamed.\n\nC Hundreds of indigenous groups have lived in the Amazon for thousands of years. Estimates suggest there are between three hundred and four hundred distinct peoples, some of whom have had no confirmed contact with the outside world. These communities possess detailed knowledge of the forest's plants and animals, knowledge that has proved valuable to researchers studying potential medicines and ecological relationships.\n\nD Despite its ecological importance, the Amazon has suffered severe deforestation. Since 1970, roughly seventeen per cent of the original forest has been cleared, primarily to make way for cattle ranching and soy farming. Illegal logging is also a significant factor. In dry seasons, fires are deliberately set to clear land, and these can spread beyond their intended boundaries.\n\nE The forest plays a role in the climate far beyond South America. Trees draw water from the soil and release it as vapour through their leaves, a process that generates what scientists call flying rivers — invisible streams of airborne moisture that travel across the continent and produce rainfall as far away as Argentina and southern Brazil. Deforestation disrupts these atmospheric flows, threatening agriculture and water supplies across the region.\n\nF Efforts to protect the Amazon include establishing national parks and indigenous territories, which together cover a substantial portion of the forest. Some governments have introduced payment schemes that reward landowners financially for keeping their land forested rather than clearing it. International pressure, including trade agreements that require proof of sustainable land use, has also played a role.\n\nG Scientists warn that the Amazon may be approaching a tipping point. If enough forest is lost, the surviving trees may no longer generate sufficient moisture to sustain themselves, causing large areas to dry out and transform into savanna-like vegetation. Some researchers believe this could happen before the end of the century if current rates of loss continue. The urgency of protecting the remaining forest has rarely been greater."
        },
        "question_groups": [
          {
            "type": "tfng",
            "instruction": "Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
            "question_range": [1, 6],
            "items": [
              {"number": 1, "statement": "The Amazon rainforest covers approximately 5.5 million square kilometres.", "answer": "TRUE", "evidence": "covering approximately 5.5 million square kilometres across nine countries", "explanation": "Paragraph A."},
              {"number": 2, "statement": "The Amazon rainforest is entirely contained within Brazil.", "answer": "FALSE", "evidence": "across nine countries in South America. Brazil holds the greatest share, around sixty per cent", "explanation": "Paragraph A states the forest spans nine countries, not just Brazil."},
              {"number": 3, "statement": "The Amazon river system contains more fish species than the Atlantic Ocean.", "answer": "TRUE", "evidence": "the Amazon river system contains more species of fish than the entire Atlantic Ocean", "explanation": "Paragraph B."},
              {"number": 4, "statement": "All indigenous groups living in the Amazon have regular contact with outsiders.", "answer": "FALSE", "evidence": "some of whom have had no confirmed contact with the outside world", "explanation": "Paragraph C states some groups have had no outside contact."},
              {"number": 5, "statement": "Cattle ranching is one of the main causes of Amazon deforestation.", "answer": "TRUE", "evidence": "primarily to make way for cattle ranching and soy farming", "explanation": "Paragraph D."},
              {"number": 6, "statement": "The Amazon rainforest is protected by an international legal treaty.", "answer": "NOT GIVEN", "evidence": "", "explanation": "The passage mentions international pressure but not a specific legal treaty."}
            ]
          },
          {
            "type": "sentence_completion",
            "instruction": "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
            "question_range": [7, 10],
            "items": [
              {"number": 7, "sentence": "The Amazon is sometimes called the lungs of the ______ because of its role in absorbing carbon dioxide.", "answer": "Earth", "evidence": "called the lungs of the Earth because it absorbs vast quantities of carbon dioxide", "explanation": "Paragraph A."},
              {"number": 8, "sentence": "Researchers have identified more than 40,000 ______ species within the Amazon.", "answer": "plant", "evidence": "more than forty thousand plant species", "explanation": "Paragraph B."},
              {"number": 9, "sentence": "Streams of airborne moisture generated by Amazon trees are known as flying ______.", "answer": "rivers", "evidence": "what scientists call flying rivers — invisible streams of airborne moisture", "explanation": "Paragraph E."},
              {"number": 10, "sentence": "If deforestation continues, scientists warn that large areas of the Amazon could transform into ______.", "answer": "savanna", "evidence": "causing large areas to dry out and transform into savanna-like vegetation", "explanation": "Paragraph G."}
            ]
          },
          {
            "type": "matching_information",
            "instruction": "Reading Passage 1 has seven paragraphs A–G. Which paragraph contains the following information?",
            "question_range": [11, 13],
            "items": [
              {"number": 11, "statement": "a description of how Amazon moisture affects rainfall in distant regions", "answer": "E", "evidence": "produce rainfall as far away as Argentina and southern Brazil", "explanation": "Paragraph E describes the flying rivers and their distant effects."},
              {"number": 12, "statement": "a reference to ecological and medical knowledge held by forest communities", "answer": "C", "evidence": "knowledge of the forest's plants and animals, knowledge that has proved valuable to researchers studying potential medicines", "explanation": "Paragraph C."},
              {"number": 13, "statement": "details of what proportion of the Amazon has been destroyed since 1970", "answer": "D", "evidence": "roughly seventeen per cent of the original forest has been cleared", "explanation": "Paragraph D."}
            ]
          }
        ]
      },
      {
        "section_number": 2,
        "passage": {
          "title": "The History of Coffee",
          "topic": "Social History",
          "wordCount": 555,
          "content": "A Coffee is one of the most widely consumed beverages in the world, but its origins stretch back many centuries. According to a popular legend, the energising effects of the coffee plant were first noticed in Ethiopia by a goatherd named Kaldi, who observed his goats behaving with unusual energy after eating berries from a certain shrub. Whether or not the story is true, the earliest confirmed cultivation of coffee as a beverage took place in Yemen in the fifteenth century, where Sufi monks used it to stay awake during long nights of prayer.\n\nB By the sixteenth century, coffee had spread throughout the Arab world, and coffee houses had opened in Cairo, Mecca and Istanbul. These establishments served not only as places to drink but as centres of social and intellectual life. In cities across the Ottoman Empire, people gathered in coffee houses to play chess, listen to music and discuss politics. European travellers who encountered coffee there brought it back to their home countries.\n\nC Coffee arrived in Europe in the seventeenth century and quickly became popular. Coffee houses opened across London, Paris and Vienna. In London they were sometimes called penny universities, because for the price of a penny — the cost of a cup — anyone could sit and join in conversations with merchants, politicians and writers. Edward Lloyd's coffee house in London eventually became Lloyd's of London, one of the world's most famous insurance markets.\n\nD The Dutch were among the first Europeans to establish coffee plantations outside the Arab world, introducing coffee plants to their colony on the island of Java in the late seventeenth century. This is the origin of the word java as a term for coffee. The French later brought coffee to the Caribbean, and from there it spread throughout Latin America. Brazil eventually became the world's largest coffee producer, a position it still holds today.\n\nE The twentieth century brought rapid innovation in coffee preparation. In 1901, an Italian inventor developed the first espresso machine, which forced hot water through compressed grounds to produce a concentrated brew. Instant coffee, which dissolves in water without any equipment, was also developed in the early twentieth century and became widely sold after Nescafé was launched in 1938. These inventions made coffee faster and more convenient for millions of consumers.\n\nF In the late twentieth and early twenty-first centuries, so-called specialty coffee culture emerged. Independent coffee shops began to highlight the origin of their beans, the altitude at which they were grown and the method of roasting. This brought greater attention to the conditions faced by coffee farmers, many of whom earn very little. Fair-trade schemes and direct-trade relationships aim to give farmers a fairer share of the price paid by consumers, though the impact of these programmes varies widely."
        },
        "question_groups": [
          {
            "type": "matching_headings",
            "instruction": "Reading Passage 2 has six paragraphs A–F. Choose the correct heading for paragraphs B–F from the list of headings below.",
            "question_range": [14, 18],
            "headings_pool": [
              "i. Coffee houses as social and intellectual spaces in Europe",
              "ii. How coffee spread from the Arab world to the rest of the world",
              "iii. Modern innovations in brewing and packaging",
              "iv. Questions of fairness and sustainability in the industry",
              "v. The role of coffee houses in European business",
              "vi. How coffee was introduced to plantation agriculture",
              "vii. The medicinal use of coffee in early Islamic medicine"
            ],
            "items": [
              {"number": 14, "paragraph": "B", "answer": "ii", "evidence": "coffee had spread throughout the Arab world... European travellers who encountered coffee there brought it back", "explanation": "Paragraph B covers coffee's spread from the Arab world."},
              {"number": 15, "paragraph": "C", "answer": "i", "evidence": "Coffee houses opened across London, Paris and Vienna... penny universities", "explanation": "Paragraph C describes European coffee houses as intellectual centres."},
              {"number": 16, "paragraph": "D", "answer": "vi", "evidence": "the Dutch were among the first Europeans to establish coffee plantations... Brazil eventually became the world's largest coffee producer", "explanation": "Paragraph D covers the introduction of coffee farming to new regions."},
              {"number": 17, "paragraph": "E", "answer": "iii", "evidence": "first espresso machine... Instant coffee... Nescafé was launched", "explanation": "Paragraph E describes brewing and packaging innovations."},
              {"number": 18, "paragraph": "F", "answer": "iv", "evidence": "Fair-trade schemes... give farmers a fairer share", "explanation": "Paragraph F discusses sustainability and fairness for farmers."}
            ]
          },
          {
            "type": "multiple_choice",
            "instruction": "Choose the correct letter, A, B, C or D.",
            "question_range": [19, 22],
            "items": [
              {"number": 19, "question": "Where did the earliest confirmed cultivation of coffee as a beverage take place?", "options": {"A": "Ethiopia", "B": "Yemen", "C": "Egypt", "D": "Istanbul"}, "answer": "B", "evidence": "the earliest confirmed cultivation of coffee as a beverage took place in Yemen in the fifteenth century", "explanation": "Paragraph A."},
              {"number": 20, "question": "Why were London coffee houses nicknamed penny universities?", "options": {"A": "They offered free education to poor students.", "B": "Anyone could join conversations for the price of a cup.", "C": "They were located near university campuses.", "D": "They were funded by university scholars."}, "answer": "B", "evidence": "for the price of a penny — the cost of a cup — anyone could sit and join in conversations", "explanation": "Paragraph C."},
              {"number": 21, "question": "Which country is currently the world's largest coffee producer?", "options": {"A": "Colombia", "B": "Vietnam", "C": "Ethiopia", "D": "Brazil"}, "answer": "D", "evidence": "Brazil eventually became the world's largest coffee producer, a position it still holds today", "explanation": "Paragraph D."},
              {"number": 22, "question": "When was Nescafé launched?", "options": {"A": "1901", "B": "1920", "C": "1938", "D": "1971"}, "answer": "C", "evidence": "Nescafé was launched in 1938", "explanation": "Paragraph E."}
            ]
          },
          {
            "type": "summary_completion",
            "instruction": "Complete the summary below. Choose NO MORE THAN ONE WORD from the box for each answer.",
            "question_range": [23, 26],
            "word_bank": ["Yemen", "Java", "Brazil", "instant", "espresso", "Ethiopia", "Caribbean"],
            "summary": "Coffee was first cultivated as a drink in ___23___. The Dutch introduced coffee plants to their colony on the island of ___24___. Eventually, ___25___ became the world's largest producing nation. In the twentieth century, ___26___ coffee became popular because it required no special equipment to prepare.",
            "items": [
              {"number": 23, "answer": "Yemen", "evidence": "the earliest confirmed cultivation of coffee as a beverage took place in Yemen", "explanation": "Paragraph A."},
              {"number": 24, "answer": "Java", "evidence": "introducing coffee plants to their colony on the island of Java", "explanation": "Paragraph D."},
              {"number": 25, "answer": "Brazil", "evidence": "Brazil eventually became the world's largest coffee producer", "explanation": "Paragraph D."},
              {"number": 26, "answer": "instant", "evidence": "Instant coffee, which dissolves in water without any equipment", "explanation": "Paragraph E."}
            ]
          }
        ]
      },
      {
        "section_number": 3,
        "passage": {
          "title": "How Dogs Were Domesticated",
          "topic": "Biology",
          "wordCount": 575,
          "content": "A The domestic dog is almost certainly the oldest animal to have been tamed by humans. Genetic studies suggest that dogs began to diverge from grey wolves at least fifteen thousand years ago, and some researchers argue the process may have started as far back as forty thousand years. Today, despite the enormous variety of shapes and sizes in which they appear, all domestic dogs belong to the same species and share a common ancestry with the grey wolf.\n\nB Scientists continue to debate where domestication first occurred. Some analyses of dog DNA point to East Asia as the most likely origin; others suggest Central Asia or the Middle East; yet others indicate that domestication may have happened independently in more than one region at approximately the same time. The question is complicated by the fact that early domestic dogs probably continued to interbreed with wild wolves, mixing their genetic material further.\n\nC Two main theories attempt to explain the process by which wolves became dogs. The first is that wolves began to approach human campsites to scavenge food scraps, and that over generations the boldest and least fearful individuals became more comfortable with people. The second is that humans actively captured wolf pups and raised them, selecting for tameness and usefulness in tasks such as hunting. Most researchers today believe a combination of both processes was involved.\n\nD One of the most striking features of domestic dogs is their ability to understand human communication. Experiments have shown that dogs can follow a human pointing gesture to locate hidden food, a task that wolves raised alongside humans consistently fail. Dogs also appear to read human facial expressions and adjust their behaviour accordingly. These abilities suggest that domestication shaped not only dogs' bodies but their social and cognitive relationship with people.\n\nE Throughout human history, dogs have been working partners as well as companions. Ancient Egyptian wall paintings show dogs hunting alongside humans. Roman armies used dogs in warfare. In cold climates, dogs pulled sleds across ice for thousands of years before engine-powered vehicles existed. Herding dogs became essential to pastoral farming, and guard dogs have protected settlements since before recorded history.\n\nF Modern selective breeding has produced more than three hundred and fifty recognised breeds. The vast majority of these were developed in the nineteenth and twentieth centuries, as breeders selected for specific physical traits. Some extreme forms of selective breeding have caused health problems, including breathing difficulties in short-nosed breeds and joint disorders in very large or very small dogs. These concerns have prompted some kennel clubs to revise their breed standards.\n\nG Today, dogs serve a remarkable range of roles in human society. Guide dogs assist people with visual impairments. Police and military dogs detect explosives and track suspects. Medical detection dogs have demonstrated an ability to identify certain cancers and warn their owners of coming seizures. Therapy dogs reduce anxiety in hospitals and schools. The global dog population is estimated at around nine hundred million, making dogs the most numerous large carnivore on Earth."
        },
        "question_groups": [
          {
            "type": "ynng",
            "instruction": "Do the following statements agree with the views of the writer in Reading Passage 3? Write YES if the statement agrees with the views of the writer, NO if the statement contradicts the views of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.",
            "question_range": [27, 31],
            "items": [
              {"number": 27, "statement": "The domestic dog is likely the first animal ever tamed by humans.", "answer": "YES", "evidence": "The domestic dog is almost certainly the oldest animal to have been tamed by humans", "explanation": "Paragraph A."},
              {"number": 28, "statement": "Scientists have reached a firm agreement on where dogs were first domesticated.", "answer": "NO", "evidence": "Scientists continue to debate where domestication first occurred", "explanation": "Paragraph B states the debate is ongoing."},
              {"number": 29, "statement": "Dogs are better than wolves at following human pointing gestures.", "answer": "YES", "evidence": "dogs can follow a human pointing gesture to locate hidden food, a task that wolves raised alongside humans consistently fail", "explanation": "Paragraph D."},
              {"number": 30, "statement": "Most recognised dog breeds were developed before the nineteenth century.", "answer": "NO", "evidence": "The vast majority of these were developed in the nineteenth and twentieth centuries", "explanation": "Paragraph F states most breeds are relatively recent."},
              {"number": 31, "statement": "The global dog population has declined sharply in recent decades.", "answer": "NOT GIVEN", "evidence": "", "explanation": "The passage gives the current population but says nothing about recent trends."}
            ]
          },
          {
            "type": "matching_information",
            "instruction": "Reading Passage 3 has seven paragraphs A–G. Which paragraph contains the following information?",
            "question_range": [32, 36],
            "items": [
              {"number": 32, "statement": "evidence of dogs being used alongside humans in ancient civilisations", "answer": "E", "evidence": "Ancient Egyptian wall paintings show dogs hunting alongside humans", "explanation": "Paragraph E."},
              {"number": 33, "statement": "a description of how wolves may first have begun approaching human settlements", "answer": "C", "evidence": "wolves began to approach human campsites to scavenge food scraps", "explanation": "Paragraph C."},
              {"number": 34, "statement": "a reference to health problems caused by extreme selective breeding", "answer": "F", "evidence": "Some extreme forms of selective breeding have caused health problems, including breathing difficulties", "explanation": "Paragraph F."},
              {"number": 35, "statement": "the estimated total number of dogs currently alive worldwide", "answer": "G", "evidence": "The global dog population is estimated at around nine hundred million", "explanation": "Paragraph G."},
              {"number": 36, "statement": "a description of experiments testing the cognitive abilities of dogs", "answer": "D", "evidence": "Experiments have shown that dogs can follow a human pointing gesture", "explanation": "Paragraph D."}
            ]
          },
          {
            "type": "matching_sentence_endings",
            "instruction": "Complete each sentence with the correct ending A–F from the box below.",
            "question_range": [37, 40],
            "endings_pool": {
              "A": "can follow human pointing gestures that wolves are unable to perform.",
              "B": "suggest that domestication may have occurred in more than one location simultaneously.",
              "C": "were largely developed through selective breeding in the past two centuries.",
              "D": "are used today in roles such as guiding people and detecting explosives.",
              "E": "approached human camps in search of discarded food.",
              "F": "have been estimated at approximately nine hundred million worldwide."
            },
            "items": [
              {"number": 37, "sentence_start": "DNA analyses of dog ancestry", "answer": "B", "evidence": "domestication may have happened independently in more than one region at approximately the same time", "explanation": "Paragraph B."},
              {"number": 38, "sentence_start": "Most of today's recognised dog breeds", "answer": "C", "evidence": "The vast majority of these were developed in the nineteenth and twentieth centuries", "explanation": "Paragraph F."},
              {"number": 39, "sentence_start": "Unlike wolves, domestic dogs", "answer": "A", "evidence": "dogs can follow a human pointing gesture to locate hidden food, a task that wolves... consistently fail", "explanation": "Paragraph D."},
              {"number": 40, "sentence_start": "Numbers of dogs alive on Earth", "answer": "F", "evidence": "The global dog population is estimated at around nine hundred million", "explanation": "Paragraph G."}
            ]
          }
        ]
      }
    ]
  }$JSON$::jsonb
);
