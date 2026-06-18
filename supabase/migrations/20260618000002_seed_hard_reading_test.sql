-- ============================================================
-- Seed Reading Test: "Frontiers of Knowledge" (HARD)
-- 3 passages, 40 questions, Cambridge-style Academic Reading
-- Topics: Psychology (Persuasion), Environmental Science (Rewilding),
--         Linguistics (Global Rise of English)
-- ============================================================

INSERT INTO public.reading_test_library (title, difficulty, topic_tags, sections) VALUES (
  'Frontiers of Knowledge — Academic Reading Test (Hard)',
  'hard',
  ARRAY['Psychology', 'Environmental Science', 'Linguistics'],
  $JSON${
    "sections": [
      {
        "section_number": 1,
        "passage": {
          "title": "The Psychology of Persuasion",
          "topic": "Psychology",
          "wordCount": 580,
          "content": "A The question of what causes people to change their minds has occupied philosophers and rhetoricians since antiquity, but it became the subject of systematic scientific inquiry only in the twentieth century. The American psychologist Robert Cialdini, drawing on years of fieldwork in sales and marketing environments, identified six principles that he claimed explain the majority of successful persuasion attempts. These were reciprocity, commitment, social proof, authority, liking and scarcity.\n\nB Reciprocity refers to the human tendency to feel obligated to return favours. When a stranger hands someone a gift — even an unsolicited and unwanted one — the recipient tends to feel discomfort until something is given in return. Charities have exploited this by including small gifts such as personalised address labels with donation requests, consistently raising response rates. The commercial world has replicated the strategy with free samples, trial subscriptions and preview periods.\n\nC Social proof operates through a different mechanism. People look to the behaviour of others when they are uncertain what to do. Reviews, testimonials and labels such as most popular all function as social proof, implying that the best choice is the one most others have already made. The effect is strongest in ambiguous situations, and weakest when an individual feels confident and well-informed. Marketers routinely manufacture social proof through review manipulation, a practice that regulators in several countries have begun to restrict.\n\nD The principle of authority is based on the observation that people defer to perceived experts, often without scrutinising the actual quality of the expertise. White coats, official titles and confident speech all elevate perceived authority regardless of whether the underlying knowledge merits the deference. Advertisers have long exploited this by featuring people dressed as scientists or doctors to promote health products. Digital influencers exploit the same tendency, though their authority derives from follower counts rather than formal credentials.\n\nE Cialdini's framework has been widely applied in public health contexts. Framing vaccination as what most members of a community have already chosen increases uptake through social proof. Sending personalised letters from a respected local doctor increases compliance with screening programmes through authority. Both interventions are classified by some researchers as nudges — changes to the choice environment that steer people towards preferred behaviours without forbidding alternatives.\n\nF Critics of persuasion science have raised both empirical and ethical objections. On empirical grounds, several of Cialdini's original experiments have proven difficult to replicate at the effect sizes he reported. The replication crisis that affected social psychology more broadly in the 2010s cast a shadow on findings that had been taught as established fact. On ethical grounds, critics argue that understanding what makes people change their minds and deliberately engineering those conditions constitutes a form of manipulation that undermines rational autonomy.\n\nG Defenders of the field counter that understanding persuasion is no different from understanding nutrition or exercise. People already live in a world saturated with persuasive messages; teaching them to recognise the mechanisms involved is a form of protection rather than exploitation. Whether used to sell luxury goods or encourage hand-washing during a pandemic, the same cognitive mechanisms are at work. The only meaningful question, they argue, is whose interests the persuasion is designed to serve."
        },
        "question_groups": [
          {
            "type": "tfng",
            "instruction": "Do the following statements agree with the information given in Reading Passage 1? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.",
            "question_range": [1, 5],
            "items": [
              {"number": 1, "statement": "Cialdini identified exactly four principles of persuasion.", "answer": "FALSE", "evidence": "identified six principles", "explanation": "Paragraph A states there were six principles, not four."},
              {"number": 2, "statement": "Charities have raised donation rates by sending out small unsolicited gifts.", "answer": "TRUE", "evidence": "Charities have exploited this by including small gifts... consistently raising response rates", "explanation": "Paragraph B."},
              {"number": 3, "statement": "Social proof is most powerful when people already feel confident about a decision.", "answer": "FALSE", "evidence": "weakest when an individual feels confident and well-informed", "explanation": "Paragraph C states the opposite — social proof is weakest for confident individuals."},
              {"number": 4, "statement": "All of Cialdini's original experiments have been successfully replicated.", "answer": "FALSE", "evidence": "several of Cialdini's original experiments have proven difficult to replicate", "explanation": "Paragraph F."},
              {"number": 5, "statement": "Persuasion principles have been used to improve public health outcomes.", "answer": "TRUE", "evidence": "Cialdini's framework has been widely applied in public health contexts", "explanation": "Paragraph E."}
            ]
          },
          {
            "type": "sentence_completion",
            "instruction": "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
            "question_range": [6, 9],
            "items": [
              {"number": 6, "sentence": "Cialdini conducted fieldwork in ______ and marketing environments to develop his theory.", "answer": "sales", "evidence": "fieldwork in sales and marketing environments", "explanation": "Paragraph A."},
              {"number": 7, "sentence": "The social proof effect is at its weakest when a person feels ______ and well-informed.", "answer": "confident", "evidence": "weakest when an individual feels confident and well-informed", "explanation": "Paragraph C."},
              {"number": 8, "sentence": "Interventions that guide choices without banning options are classified by some researchers as ______.", "answer": "nudges", "evidence": "classified by some researchers as nudges", "explanation": "Paragraph E."},
              {"number": 9, "sentence": "Critics argue that engineering persuasion conditions undermines individuals' rational ______.", "answer": "autonomy", "evidence": "constitutes a form of manipulation that undermines rational autonomy", "explanation": "Paragraph F."}
            ]
          },
          {
            "type": "matching_information",
            "instruction": "Reading Passage 1 has seven paragraphs A–G. Which paragraph contains the following information?",
            "question_range": [10, 13],
            "items": [
              {"number": 10, "statement": "a reference to regulatory action being taken against a persuasion technique", "answer": "C", "evidence": "a practice that regulators in several countries have begun to restrict", "explanation": "Paragraph C mentions regulators restricting review manipulation."},
              {"number": 11, "statement": "a reason why digital content creators are perceived as authoritative", "answer": "D", "evidence": "their authority derives from follower counts rather than formal credentials", "explanation": "Paragraph D."},
              {"number": 12, "statement": "an argument that studying persuasion is a way of protecting people rather than manipulating them", "answer": "G", "evidence": "teaching them to recognise the mechanisms involved is a form of protection rather than exploitation", "explanation": "Paragraph G."},
              {"number": 13, "statement": "a description of problems with reproducing findings from social psychology research", "answer": "F", "evidence": "The replication crisis that affected social psychology more broadly in the 2010s", "explanation": "Paragraph F."}
            ]
          }
        ]
      },
      {
        "section_number": 2,
        "passage": {
          "title": "Rewilding and Its Controversies",
          "topic": "Environmental Science",
          "wordCount": 600,
          "content": "A Rewilding is an approach to conservation that focuses not on managing nature in a carefully controlled way, but on restoring ecosystems to a state in which they can largely manage themselves. It typically involves removing some human interventions — overgrazing by domestic livestock, for instance, or flood defences that prevent natural inundation — and reintroducing species that once lived in an area and were lost through hunting, habitat destruction or persecution.\n\nB The term was popularised in the 1990s by American conservationists Michael Soulé and Reed Noss, who argued that protecting large core areas connected by wildlife corridors would allow top predators to return and regulate prey populations, triggering a cascade of ecological change. Their model drew on observations from Yellowstone National Park after wolves were reintroduced in 1995. Elk herds changed their grazing patterns to avoid zones where wolves could ambush them; this allowed riverside vegetation to recover, which in turn stabilised stream banks and changed water temperatures in ways that benefited fish and beaver.\n\nC This cascade, often called a trophic cascade, became the founding example of rewilding advocacy. But subsequent research has shown that the Yellowstone story is more complicated than it was initially presented. Some ecologists argue that vegetation recovery was also influenced by drought conditions and changes in hunting pressure that had nothing to do with wolves, and that extrapolating the Yellowstone model to other landscapes is ecologically unjustified.\n\nD In Europe, rewilding has taken a different form. Large land areas are less available than in North America, and the range of native megafauna is more limited. Most European rewilding projects rely on large herbivores — particularly cattle and horses bred to approximate the ecological role of extinct wild species — to create varied habitats through grazing, wallowing and scrub disturbance. The Knepp Estate in England, where conventional farming was abandoned in 2001, has attracted national attention as a site where populations of rare birds, insects and plants have recovered substantially.\n\nE The reintroduction of apex predators remains highly contentious. Sheep and cattle farmers strongly oppose the return of wolves and lynx to areas of Scotland and northern England where they were exterminated centuries ago. Proponents argue that a compensation scheme for livestock losses, paired with non-lethal deterrents such as guarding dogs, can reduce conflicts to manageable levels. Opponents counter that even well-funded compensation schemes create chronic uncertainty for farming families and that rural communities were not adequately consulted.\n\nF Rewilding also intersects with debates about land use and food production. Critics, including some farming unions and rural economists, argue that rewilding large areas of productive farmland reduces food security and exports the environmental cost of food production to other countries with lower environmental standards. Supporters respond that degraded farmland in areas of marginal productivity contributes more carbon through agricultural soil disturbance than it gains in food output, and that returning it to mixed habitat delivers a net environmental benefit.\n\nG The debate is partly scientific, partly philosophical. It involves questions about what a natural ecosystem actually is, whether the ecological past can or should serve as a template for the ecological future, and who has the right to decide what a piece of land should look like. Rewilding's greatest advocates tend to view it as an urgent response to a biodiversity crisis; its greatest critics tend to view it as a romantic vision that privileges the preferences of urban conservationists over the practical realities of those who live and work in the landscapes in question."
        },
        "question_groups": [
          {
            "type": "matching_features",
            "instruction": "Look at the following statements and the list of people and groups below. Match each statement with the correct group, A–D. NB You may use any letter more than once.",
            "question_range": [14, 18],
            "options_pool": {"A": "Soulé and Noss", "B": "Ecologists critical of the Yellowstone model", "C": "European rewilding practitioners", "D": "Farmers and rural communities"},
            "note": "NB You may use any letter more than once.",
            "items": [
              {"number": 14, "statement": "Vegetation recovery at Yellowstone may have been influenced by factors unrelated to wolves.", "answer": "B", "evidence": "vegetation recovery was also influenced by drought conditions and changes in hunting pressure that had nothing to do with wolves", "explanation": "Paragraph C; these are critics of the Yellowstone model."},
              {"number": 15, "statement": "Large herbivores can fulfil the ecological role once played by extinct wild species.", "answer": "C", "evidence": "cattle and horses bred to approximate the ecological role of extinct wild species", "explanation": "Paragraph D describes European rewilding practitioners' approach."},
              {"number": 16, "statement": "Protecting large core areas connected by corridors allows top predators to return.", "answer": "A", "evidence": "protecting large core areas connected by wildlife corridors would allow top predators to return", "explanation": "Paragraph B — this is Soulé and Noss's original argument."},
              {"number": 17, "statement": "Compensation schemes for livestock losses create unacceptable uncertainty for farming families.", "answer": "D", "evidence": "even well-funded compensation schemes create chronic uncertainty for farming families", "explanation": "Paragraph E — the view of opponents of predator reintroduction."},
              {"number": 18, "statement": "The Yellowstone model should not automatically be applied to other landscapes.", "answer": "B", "evidence": "extrapolating the Yellowstone model to other landscapes is ecologically unjustified", "explanation": "Paragraph C — critics of the Yellowstone model."}
            ]
          },
          {
            "type": "multiple_choice",
            "instruction": "Choose the correct letter, A, B, C or D.",
            "question_range": [19, 22],
            "items": [
              {"number": 19, "question": "What effect did the return of wolves have on riverside vegetation at Yellowstone?", "options": {"A": "It was damaged because wolves drove elk into river zones.", "B": "It recovered because elk avoided areas where wolves could ambush them.", "C": "It was replanted by conservation volunteers.", "D": "It was unaffected because elk behaviour did not change."}, "answer": "B", "evidence": "Elk herds changed their grazing patterns to avoid zones where wolves could ambush them; this allowed riverside vegetation to recover", "explanation": "Paragraph B."},
              {"number": 20, "question": "How does European rewilding differ from the original North American model?", "options": {"A": "European projects focus entirely on reintroducing wolves and lynx.", "B": "European rewilding relies on herbivores to replace the ecological role of extinct megafauna.", "C": "European governments have banned rewilding on all farmland.", "D": "European rewilding does not involve any large animals."}, "answer": "B", "evidence": "Most European rewilding projects rely on large herbivores — particularly cattle and horses bred to approximate the ecological role of extinct wild species", "explanation": "Paragraph D."},
              {"number": 21, "question": "What do critics of rewilding farmland argue?", "options": {"A": "That it will directly improve food security in rural areas.", "B": "That it will eliminate carbon emissions from agriculture.", "C": "That the environmental cost of food production may shift to countries with weaker standards.", "D": "That it damages the quality of rivers and streams."}, "answer": "C", "evidence": "exports the environmental cost of food production to other countries with lower environmental standards", "explanation": "Paragraph F."},
              {"number": 22, "question": "How does the writer characterise rewilding's strongest critics?", "options": {"A": "They reject all scientific evidence about biodiversity loss.", "B": "They argue that rewilding is a vision that imposes urban preferences on rural communities.", "C": "They believe rewilding will succeed but only in very small areas.", "D": "They think wolves should be reintroduced everywhere immediately."}, "answer": "B", "evidence": "a romantic vision that privileges the preferences of urban conservationists over the practical realities of those who live and work in the landscapes in question", "explanation": "Paragraph G."}
            ]
          },
          {
            "type": "sentence_completion",
            "instruction": "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
            "question_range": [23, 26],
            "items": [
              {"number": 23, "sentence": "The trophic cascade first documented at Yellowstone was triggered by the return of ______.", "answer": "wolves", "evidence": "wolves were reintroduced in 1995", "explanation": "Paragraph B."},
              {"number": 24, "sentence": "The Knepp Estate in England abandoned conventional ______ in 2001.", "answer": "farming", "evidence": "where conventional farming was abandoned in 2001", "explanation": "Paragraph D."},
              {"number": 25, "sentence": "Supporters argue that a ______ scheme and guarding dogs could reduce conflict over livestock losses.", "answer": "compensation", "evidence": "a compensation scheme for livestock losses, paired with non-lethal deterrents such as guarding dogs", "explanation": "Paragraph E."},
              {"number": 26, "sentence": "Critics claim that rewilding marginal farmland transfers the environmental cost of food to countries with lower ______.", "answer": "environmental standards", "evidence": "exports the environmental cost of food production to other countries with lower environmental standards", "explanation": "Paragraph F."}
            ]
          }
        ]
      },
      {
        "section_number": 3,
        "passage": {
          "title": "The Global Rise of English",
          "topic": "Linguistics",
          "wordCount": 620,
          "content": "A English is used as a first language by roughly four hundred million people and as an official or widely used second language by at least a further billion. It is the primary language of international aviation, scientific publishing, global finance and the internet. No language in recorded history has achieved anything quite like this distribution in so short a time, and no prior empire left its language in daily use across so many nations after it withdrew.\n\nB Linguists distinguish between different types of English speaker: those for whom it is a native language from birth, those who acquire it as a second language within their own country, and those who learn it as a foreign language in a context where it has no special official status. The second category — speakers in countries such as India, Nigeria and Singapore where English serves as a medium of education or government alongside local languages — is by far the largest and continues to grow fastest. Scholars such as Braj Kachru have proposed that these varieties of English should be studied on their own terms rather than measured against a British or American standard.\n\nC This view remains controversial. Some applied linguists argue that the existence of a shared global English standard, though imperfect, serves as a common medium for international communication in a way that no regional variety could replicate. Others contend that privileging any single variety, however neutrally it is described, reproduces colonial hierarchies of language. The debate touches on questions not only of communication efficiency but of identity, power and the right of communities to define their own linguistic norms.\n\nD One measurable consequence of English's rise is language attrition: the gradual loss of other languages as speakers shift to English for education, trade and social mobility. Linguists estimate that of the approximately seven thousand languages spoken today, roughly half are severely endangered. The primary driver of this shift is not direct suppression but the perceived economic advantage of English. Parents may choose to raise children in English even when a different language is more expressive of their cultural identity, because they perceive English as essential for economic participation.\n\nE At the same time, English's spread has not silenced other languages uniformly. French, Spanish and Mandarin continue to grow in absolute numbers of speakers. Arabic is expanding through demographic growth in North Africa and the Middle East. Regional lingua francas such as Swahili in East Africa and Hindi across South Asia serve populations of hundreds of millions without English serving as the default. The picture is therefore not one of simple English domination but of a complex multilingual ecology.\n\nF Technology has reinforced English's global position. The internet was built predominantly in English; early protocols, domain-name systems and programming languages all used English as their base. Although content in other languages now constitutes the majority of the web, technical documentation and the platforms themselves remain largely English-centred. Machine translation tools make non-English content more accessible, but critics note that such software still performs better for high-resource languages — those with large amounts of online text — which are disproportionately European.\n\nG The future of global English is uncertain. Some demographers project that the share of English speakers as a proportion of the world population will fall during the coming century as populations in Asia and Africa grow rapidly. Others suggest that the spread of education and digital communication will produce more English speakers than ever before, though at varying levels of proficiency. What does appear clear is that global English is unlikely to remain a single uniform standard; the varieties used in Lagos, Mumbai and Singapore are already diverging from each other and from the model once taught as correct."
        },
        "question_groups": [
          {
            "type": "matching_headings",
            "instruction": "Reading Passage 3 has seven paragraphs A–G. Choose the correct heading for paragraphs B–F from the list of headings below.",
            "question_range": [27, 31],
            "headings_pool": [
              "i. The different categories of English speaker worldwide",
              "ii. Debate over which variety of English should be the standard",
              "iii. Why parents may prefer English over their native language",
              "iv. Evidence that other major languages continue to expand",
              "v. How technology reinforced English's online dominance",
              "vi. Projections for the decline of English in coming decades",
              "vii. How colonial history determined which languages survived"
            ],
            "items": [
              {"number": 27, "paragraph": "B", "answer": "i", "evidence": "Linguists distinguish between different types of English speaker", "explanation": "Paragraph B classifies the different categories of English speaker."},
              {"number": 28, "paragraph": "C", "answer": "ii", "evidence": "Some applied linguists argue... Others contend that privileging any single variety", "explanation": "Paragraph C debates which variety of English should serve as a standard."},
              {"number": 29, "paragraph": "D", "answer": "iii", "evidence": "Parents may choose to raise children in English... because they perceive English as essential for economic participation", "explanation": "Paragraph D explains why families shift to English."},
              {"number": 30, "paragraph": "E", "answer": "iv", "evidence": "French, Spanish and Mandarin continue to grow in absolute numbers of speakers", "explanation": "Paragraph E shows other languages are still expanding."},
              {"number": 31, "paragraph": "F", "answer": "v", "evidence": "Technology has reinforced English's global position. The internet was built predominantly in English", "explanation": "Paragraph F is about technology and English's online role."}
            ]
          },
          {
            "type": "ynng",
            "instruction": "Do the following statements agree with the views of the writer in Reading Passage 3? Write YES if the statement agrees, NO if the statement contradicts, NOT GIVEN if it is impossible to say what the writer thinks about this.",
            "question_range": [32, 36],
            "items": [
              {"number": 32, "statement": "English is used as a first language by more than a billion people.", "answer": "NO", "evidence": "English is used as a first language by roughly four hundred million people", "explanation": "Paragraph A gives the figure as four hundred million, not a billion."},
              {"number": 33, "statement": "Kachru argued that non-native varieties of English should be evaluated by their own standards.", "answer": "YES", "evidence": "these varieties of English should be studied on their own terms rather than measured against a British or American standard", "explanation": "Paragraph B."},
              {"number": 34, "statement": "The primary cause of language shift towards English is direct government suppression of local languages.", "answer": "NO", "evidence": "The primary driver of this shift is not direct suppression but the perceived economic advantage of English", "explanation": "Paragraph D explicitly contradicts this."},
              {"number": 35, "statement": "Non-English content now forms the majority of material available on the web.", "answer": "YES", "evidence": "content in other languages now constitutes the majority of the web", "explanation": "Paragraph F."},
              {"number": 36, "statement": "English is likely to remain a single, uniform global standard throughout the twenty-first century.", "answer": "NO", "evidence": "global English is unlikely to remain a single uniform standard; the varieties... are already diverging", "explanation": "Paragraph G contradicts this view."}
            ]
          },
          {
            "type": "matching_sentence_endings",
            "instruction": "Complete each sentence with the correct ending A–F from the box below.",
            "question_range": [37, 40],
            "endings_pool": {
              "A": "is perceived by many families as essential for economic participation.",
              "B": "perform better for languages with more online text available.",
              "C": "continue to grow in absolute numbers of speakers.",
              "D": "were established through formal international agreements.",
              "E": "will converge on a single global standard within fifty years.",
              "F": "remain largely centred on the English language."
            },
            "items": [
              {"number": 37, "sentence_start": "Machine translation tools", "answer": "B", "evidence": "software still performs better for high-resource languages — those with large amounts of online text", "explanation": "Paragraph F."},
              {"number": 38, "sentence_start": "World languages such as French, Spanish and Mandarin", "answer": "C", "evidence": "French, Spanish and Mandarin continue to grow in absolute numbers of speakers", "explanation": "Paragraph E."},
              {"number": 39, "sentence_start": "For many parents around the world, learning English", "answer": "A", "evidence": "they perceive English as essential for economic participation", "explanation": "Paragraph D."},
              {"number": 40, "sentence_start": "The technical foundations of the internet", "answer": "F", "evidence": "technical documentation and the platforms themselves remain largely English-centred", "explanation": "Paragraph F."}
            ]
          }
        ]
      }
    ]
  }$JSON$::jsonb
);
