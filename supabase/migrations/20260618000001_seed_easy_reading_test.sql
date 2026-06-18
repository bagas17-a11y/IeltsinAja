-- ============================================================
-- Seed Reading Test: "Everyday Discoveries" (EASY)
-- 3 passages, 40 questions, Cambridge-style Academic Reading
-- Topics: Food Science (Chocolate History), Biology (Sleep),
--         Urban Studies (Community Gardens)
-- ============================================================

INSERT INTO public.reading_test_library (title, difficulty, topic_tags, sections) VALUES (
  'Everyday Discoveries — Academic Reading Test (Easy)',
  'easy',
  ARRAY['Food Science', 'Biology', 'Urban Studies'],
  $JSON${
    "sections": [
      {
        "section_number": 1,
        "passage": {
          "title": "The History of Chocolate",
          "topic": "Food Science",
          "wordCount": 560,
          "content": "A Cacao trees are native to the tropical regions of Central and South America. Long before chocolate became the sweet treat familiar to modern consumers, it was consumed as a bitter drink by the Maya and Aztec civilisations. Cacao beans were so highly valued in these societies that they were used as a form of currency and offered as tribute to rulers. The traditional Aztec drink, mixed with chilli, vanilla and water, was believed to convey strength and vitality.\n\nB When Spanish conquistadors arrived in Central America in the early sixteenth century, they encountered cacao and brought it back to Europe. European tastes differed from those of the Aztecs. The bitter flavour was softened by adding sugar and sometimes cinnamon, and the drink was served warm. By the mid-seventeenth century, chocolate houses had appeared in London, where wealthy merchants and politicians gathered to drink chocolate and conduct business.\n\nC Chocolate remained an expensive luxury for nearly two more centuries. Until the nineteenth century it was available only as a beverage. Then, in 1847, the British firm J.S. Fry and Sons discovered that by adding extra cocoa butter — a fat extracted from the cacao bean — to the mixture, they could create a paste that set firm when cooled. This produced the world's first solid chocolate bar, a form made to be eaten rather than sipped.\n\nD Other companies quickly followed. Cadbury in the United Kingdom and Nestlé in Switzerland developed their own methods for creating smoother, creamier chocolate. In the early twentieth century, the American manufacturer Milton Hershey introduced mass production techniques that brought the cost down sharply, making chocolate affordable for ordinary consumers for the first time.\n\nE Chocolate contains compounds called flavanols, which some researchers have linked to cardiovascular health. Studies suggest that a moderate intake of dark chocolate may help maintain healthy blood pressure and improve blood flow. However, most commercial chocolate is highly processed, which reduces the flavanol content considerably. Its high sugar and fat levels mean that any health benefits are often outweighed by other risks.\n\nF The global appetite for chocolate has raised serious environmental and social concerns. Cacao farming has been a significant cause of deforestation in West Africa and Southeast Asia, as farmers clear forest to plant more trees. Child labour has been documented on cocoa farms in Ivory Coast and Ghana, which together supply roughly two thirds of the world's cacao. Fair-trade certification aims to ensure that farmers receive a more equitable share of the profits, though coverage remains incomplete.\n\nG For many people, chocolate is associated with pleasure and celebration, from birthday gifts to holiday treats. Yet behind the enjoyment of a chocolate bar lies a complex history stretching back more than three thousand years, and an industry still grappling with questions of sustainability and fair reward for the farmers at its base."
        },
        "question_groups": [
          {
            "type": "tfng",
            "instruction": "Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
            "question_range": [1, 6],
            "items": [
              {"number": 1, "statement": "The Aztecs prepared their cacao drink by mixing it with sugar.", "answer": "FALSE", "evidence": "mixed with chilli, vanilla and water", "explanation": "Paragraph A states the drink was mixed with chilli, vanilla and water — not sugar."},
              {"number": 2, "statement": "Cacao beans served as a form of currency in ancient civilisations.", "answer": "TRUE", "evidence": "they were used as a form of currency and offered as tribute to rulers", "explanation": "Paragraph A."},
              {"number": 3, "statement": "The first solid chocolate bar was created by a British company.", "answer": "TRUE", "evidence": "the British firm J.S. Fry and Sons discovered that... they could create a paste that set firm", "explanation": "Paragraph C identifies Fry and Sons as British."},
              {"number": 4, "statement": "All processed chocolate retains high levels of flavanols.", "answer": "FALSE", "evidence": "highly processed, which reduces the flavanol content considerably", "explanation": "Paragraph E states processing reduces flavanol content."},
              {"number": 5, "statement": "Child labour has been documented on cacao farms in West Africa.", "answer": "TRUE", "evidence": "Child labour has been documented on cocoa farms in Ivory Coast and Ghana", "explanation": "Paragraph F; Ivory Coast and Ghana are in West Africa."},
              {"number": 6, "statement": "Fair-trade chocolate is now the most widely sold type of chocolate in the world.", "answer": "NOT GIVEN", "evidence": "", "explanation": "Paragraph F only says coverage remains incomplete; it makes no claim about global sales rankings."}
            ]
          },
          {
            "type": "sentence_completion",
            "instruction": "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
            "question_range": [7, 10],
            "items": [
              {"number": 7, "sentence": "In ancient Aztec society, cacao beans were used as a form of ______.", "answer": "currency", "evidence": "they were used as a form of currency", "explanation": "Paragraph A."},
              {"number": 8, "sentence": "Europeans made chocolate less bitter by adding ______.", "answer": "sugar", "evidence": "The bitter flavour was softened by adding sugar", "explanation": "Paragraph B."},
              {"number": 9, "sentence": "The ingredient that allowed chocolate to become solid was ______.", "answer": "cocoa butter", "evidence": "by adding extra cocoa butter... they could create a paste that set firm", "explanation": "Paragraph C."},
              {"number": 10, "sentence": "Milton Hershey used ______ techniques to lower the price of chocolate.", "answer": "mass production", "evidence": "Milton Hershey introduced mass production techniques that brought the cost down sharply", "explanation": "Paragraph D."}
            ]
          },
          {
            "type": "matching_information",
            "instruction": "Reading Passage 1 has seven paragraphs A–G. Which paragraph contains the following information?",
            "question_range": [11, 13],
            "items": [
              {"number": 11, "statement": "an example of how chocolate became affordable for ordinary consumers", "answer": "D", "evidence": "mass production techniques that brought the cost down sharply, making chocolate affordable for ordinary consumers for the first time", "explanation": "Paragraph D describes Hershey's mass production."},
              {"number": 12, "statement": "a reference to environmental damage caused by cacao farming", "answer": "F", "evidence": "Cacao farming has been a significant cause of deforestation in West Africa and Southeast Asia", "explanation": "Paragraph F."},
              {"number": 13, "statement": "details of what was added to the original Aztec cacao drink", "answer": "A", "evidence": "mixed with chilli, vanilla and water", "explanation": "Paragraph A."}
            ]
          }
        ]
      },
      {
        "section_number": 2,
        "passage": {
          "title": "The Human Sleep Cycle",
          "topic": "Biology",
          "wordCount": 560,
          "content": "A Sleep is not a single continuous state but a series of distinct stages that repeat throughout the night. Scientists who study sleep distinguish between two main types: rapid eye movement sleep, known as REM sleep, and non-REM sleep, which includes three separate stages. A full cycle of all stages typically takes between ninety and one hundred and ten minutes, and a healthy adult may complete four or five such cycles in a single night.\n\nB Non-REM sleep begins the night. In its first stage, the brain slows down and muscles relax; people in this stage are easily woken and may experience brief jerking movements. In the second stage, body temperature falls slightly, the heartbeat slows, and bursts of electrical activity called sleep spindles appear in the brain. This stage occupies the largest share of total sleep time. The third stage, often called deep sleep or slow-wave sleep, is the hardest from which to rouse someone; during this phase the body repairs tissue, builds bone and muscle, and strengthens the immune system.\n\nC After deep sleep, the brain moves into REM sleep, usually about ninety minutes after falling asleep. The eyes move rapidly behind closed lids, breathing becomes irregular, and the body is almost entirely still. Dreams occur most vividly during REM sleep, and the brain appears to process emotional memories and consolidate learning during this stage. Newborn babies spend about half their total sleep time in REM, while adults average roughly twenty per cent.\n\nD Sleep deprivation, even of a modest kind, has well-documented effects on the body. Concentration, reaction time and mood all deteriorate after a single night of poor sleep. Over weeks, chronic poor sleep is linked to higher risks of obesity, type 2 diabetes and cardiovascular disease. The mechanism is partly hormonal: sleep regulates cortisol, the stress hormone, and the hormones that control appetite.\n\nE The amount of sleep needed varies considerably with age. Newborns require fourteen to seventeen hours a day, school-age children nine to eleven, and adults seven to nine. Individual differences also exist; some people report functioning well on six hours. However, research suggests that claiming to function well on very little sleep is often self-deception: tests of cognitive performance generally reveal a deficit even when the person does not feel tired.\n\nF Artificial light has altered human sleep patterns significantly. Before electric lighting, people in most cultures went to sleep soon after dark and woke at or before dawn. Screens that emit blue light suppress melatonin production, delaying the onset of sleep. Many sleep researchers now recommend reducing exposure to screens in the hour before bedtime as a simple and effective intervention."
        },
        "question_groups": [
          {
            "type": "matching_headings",
            "instruction": "Reading Passage 2 has six paragraphs A–F. Choose the correct heading for paragraphs B–F from the list of headings below.",
            "question_range": [14, 18],
            "headings_pool": [
              "i. The stages of non-REM sleep",
              "ii. What happens during REM sleep",
              "iii. The physical consequences of not sleeping enough",
              "iv. How sleep requirements change over a lifetime",
              "v. The effect of artificial light on sleep",
              "vi. The link between dreaming and creativity",
              "vii. How exercise helps people fall asleep"
            ],
            "items": [
              {"number": 14, "paragraph": "B", "answer": "i", "evidence": "Non-REM sleep begins the night... sleep spindles... deep sleep", "explanation": "Paragraph B describes the three non-REM stages."},
              {"number": 15, "paragraph": "C", "answer": "ii", "evidence": "the brain moves into REM sleep... Dreams occur most vividly during REM sleep", "explanation": "Paragraph C covers what happens in REM."},
              {"number": 16, "paragraph": "D", "answer": "iii", "evidence": "Sleep deprivation... linked to higher risks of obesity, type 2 diabetes and cardiovascular disease", "explanation": "Paragraph D covers physical effects of sleep deprivation."},
              {"number": 17, "paragraph": "E", "answer": "iv", "evidence": "The amount of sleep needed varies considerably with age", "explanation": "Paragraph E discusses age-related differences."},
              {"number": 18, "paragraph": "F", "answer": "v", "evidence": "Artificial light has altered human sleep patterns... blue light suppress melatonin", "explanation": "Paragraph F is about light and its effect on sleep."}
            ]
          },
          {
            "type": "multiple_choice",
            "instruction": "Choose the correct letter, A, B, C or D.",
            "question_range": [19, 22],
            "items": [
              {"number": 19, "question": "Which stage of sleep takes up the largest proportion of total sleep time?", "options": {"A": "Stage 1 non-REM", "B": "Stage 2 non-REM", "C": "Stage 3 (deep sleep)", "D": "REM sleep"}, "answer": "B", "evidence": "This stage occupies the largest share of total sleep time", "explanation": "Paragraph B states Stage 2 occupies the largest share."},
              {"number": 20, "question": "What approximate percentage of adult sleep is spent in REM?", "options": {"A": "Fifty per cent", "B": "About one third", "C": "About twenty per cent", "D": "Less than five per cent"}, "answer": "C", "evidence": "adults average roughly twenty per cent", "explanation": "Paragraph C."},
              {"number": 21, "question": "What does research show about people who claim to need very little sleep?", "options": {"A": "They are likely to be naturally healthier", "B": "Their cognitive tests usually show impairment", "C": "They tend to be older adults", "D": "They have higher melatonin levels"}, "answer": "B", "evidence": "tests of cognitive performance generally reveal a deficit even when the person does not feel tired", "explanation": "Paragraph E."},
              {"number": 22, "question": "What do sleep researchers recommend to improve the onset of sleep?", "options": {"A": "Exercising in the final hour before bed", "B": "Sleeping in a colder room", "C": "Reducing screen use before bedtime", "D": "Taking a melatonin supplement"}, "answer": "C", "evidence": "reducing exposure to screens in the hour before bedtime as a simple and effective intervention", "explanation": "Paragraph F."}
            ]
          },
          {
            "type": "summary_completion",
            "instruction": "Complete the summary below. Choose NO MORE THAN ONE WORD from the box for each answer.",
            "question_range": [23, 26],
            "word_bank": ["spindles", "deep", "immune", "REM", "melatonin", "cortisol", "cycle"],
            "summary": "Non-REM sleep has three stages. During the second stage, bursts of brain activity called sleep ___23___ appear. The third stage is known as ___24___ sleep and helps repair the body and strengthen the ___25___ system. After these non-REM stages, the brain enters ___26___ sleep, during which vivid dreaming occurs.",
            "items": [
              {"number": 23, "answer": "spindles", "evidence": "bursts of electrical activity called sleep spindles appear", "explanation": "Paragraph B."},
              {"number": 24, "answer": "deep", "evidence": "The third stage, often called deep sleep or slow-wave sleep", "explanation": "Paragraph B."},
              {"number": 25, "answer": "immune", "evidence": "strengthens the immune system", "explanation": "Paragraph B."},
              {"number": 26, "answer": "REM", "evidence": "the brain moves into REM sleep... Dreams occur most vividly during REM sleep", "explanation": "Paragraph C."}
            ]
          }
        ]
      },
      {
        "section_number": 3,
        "passage": {
          "title": "Community Gardens in Cities",
          "topic": "Urban Studies",
          "wordCount": 580,
          "content": "A Community gardens are shared spaces where groups of people grow vegetables, fruit, flowers and herbs together. They have existed in various forms for centuries, but they became especially prominent in western cities during both World Wars, when governments encouraged citizens to grow food to support the war effort. In the United States these were called Victory Gardens; similar initiatives ran across Britain and continental Europe.\n\nB After the wars, community gardening declined as supermarkets expanded and land was given over to new housing. From the 1970s onwards, however, city residents in deprived areas began reclaiming unused plots of land in cities such as New York, Berlin and London. What started as informal acts of land occupation gradually evolved into recognised programmes with waiting lists, plot fees and formal rules.\n\nC Today, community gardens exist in many different forms. Allotment gardens in Europe divide land into individual plots, each managed by one family or person who pays an annual rent to the local authority. Community orchard schemes share the entire harvest collectively among members. School gardens involve pupils in growing food as part of the curriculum. Some gardens are specifically designed for older residents or people with disabilities, providing raised beds that can be tended from a wheelchair.\n\nD Research shows that community gardens deliver benefits beyond food production. Gardeners report improved mental health, reduced feelings of loneliness and higher levels of physical activity compared with non-gardeners. In low-income neighbourhoods, the gardens can also contribute modestly to food security. Studies in several American cities have found that properties close to established community gardens rise in value, suggesting that the spaces benefit the wider neighbourhood.\n\nE The gardens also serve an important social function. They bring together residents who might otherwise rarely meet, crossing barriers of language, age and culture. In multicultural cities, gardens often feature plants from many parts of the world, reflecting the diverse backgrounds of the gardeners. Festivals and events held at community gardens strengthen neighbourhood identity and give residents shared ownership of public space.\n\nF Despite their benefits, community gardens face pressures. In cities where land values are rising, local authorities and private developers often prefer to build housing or commercial space on the land that gardens occupy. Waiting lists for plots in cities such as London and Berlin can stretch to several years. Funding for maintenance, tools and water supply often depends on small grants that may be withdrawn at short notice, leaving gardens in a vulnerable position.\n\nG Some campaigners argue that community gardens should receive legal protection as urban green spaces, with the same status as parks. Others maintain that flexibility is important: a garden that has lost its active membership is better relocated than preserved. What is not disputed is that community gardens, once established, become deeply valued by those who use them — and that their loss is felt sharply by the communities they serve."
        },
        "question_groups": [
          {
            "type": "ynng",
            "instruction": "Do the following statements agree with the views of the writer in Reading Passage 3? Write YES if the statement agrees with the views of the writer, NO if the statement contradicts the views of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.",
            "question_range": [27, 31],
            "items": [
              {"number": 27, "statement": "Community gardens first became prominent in western cities during wartime.", "answer": "YES", "evidence": "they became especially prominent in western cities during both World Wars", "explanation": "Paragraph A directly supports this."},
              {"number": 28, "statement": "The decline of community gardening after the wars was caused by government restrictions.", "answer": "NOT GIVEN", "evidence": "", "explanation": "Paragraph B mentions supermarkets and housing, but does not attribute the decline to government restrictions specifically."},
              {"number": 29, "statement": "Research confirms that gardening can improve the mental health of participants.", "answer": "YES", "evidence": "Gardeners report improved mental health", "explanation": "Paragraph D."},
              {"number": 30, "statement": "All community gardens in Europe require members to manage an individual plot.", "answer": "NO", "evidence": "Community orchard schemes share the entire harvest collectively among members", "explanation": "Paragraph C describes multiple forms; orchards are managed collectively, not individually."},
              {"number": 31, "statement": "Properties located near community gardens tend to become more valuable.", "answer": "YES", "evidence": "properties close to established community gardens rise in value", "explanation": "Paragraph D."}
            ]
          },
          {
            "type": "matching_information",
            "instruction": "Reading Passage 3 has seven paragraphs A–G. Which paragraph contains the following information? You may use any letter more than once.",
            "question_range": [32, 36],
            "items": [
              {"number": 32, "statement": "a description of gardens specifically designed for people with mobility difficulties", "answer": "C", "evidence": "raised beds that can be tended from a wheelchair", "explanation": "Paragraph C."},
              {"number": 33, "statement": "an account of how informal gardens became official programmes over time", "answer": "B", "evidence": "What started as informal acts of land occupation gradually evolved into recognised programmes", "explanation": "Paragraph B."},
              {"number": 34, "statement": "evidence that community gardens can raise house prices nearby", "answer": "D", "evidence": "properties close to established community gardens rise in value", "explanation": "Paragraph D."},
              {"number": 35, "statement": "an example of plants from different cultures being grown in one garden", "answer": "E", "evidence": "gardens often feature plants from many parts of the world, reflecting the diverse backgrounds of the gardeners", "explanation": "Paragraph E."},
              {"number": 36, "statement": "a reference to the financial insecurity faced by garden organisers", "answer": "F", "evidence": "Funding... depends on small grants that may be withdrawn at short notice", "explanation": "Paragraph F."}
            ]
          },
          {
            "type": "matching_sentence_endings",
            "instruction": "Complete each sentence with the correct ending A–F from the box below.",
            "question_range": [37, 40],
            "endings_pool": {
              "A": "are given raised beds designed for wheelchair users.",
              "B": "pay an annual rent to the local authority.",
              "C": "bring together people from different cultural backgrounds.",
              "D": "can stretch to several years in popular cities.",
              "E": "may be closed when grant funding is removed.",
              "F": "began as informal acts of land occupation by residents."
            },
            "items": [
              {"number": 37, "sentence_start": "Early community gardens in cities like New York and Berlin", "answer": "F", "evidence": "What started as informal acts of land occupation gradually evolved into recognised programmes", "explanation": "Paragraph B."},
              {"number": 38, "sentence_start": "In Europe, tenants of individual allotment plots", "answer": "B", "evidence": "each managed by one family or person who pays an annual rent to the local authority", "explanation": "Paragraph C."},
              {"number": 39, "sentence_start": "Waiting lists for community garden plots", "answer": "D", "evidence": "Waiting lists for plots... can stretch to several years", "explanation": "Paragraph F."},
              {"number": 40, "sentence_start": "Community gardens in multicultural cities", "answer": "C", "evidence": "They bring together residents who might otherwise rarely meet, crossing barriers of language, age and culture", "explanation": "Paragraph E."}
            ]
          }
        ]
      }
    ]
  }$JSON$::jsonb
);
