-- ============================================================
-- Seed Migration: Past Paper Question Patterns
-- Content extracted from official IELTS 2023 sample task PDFs
-- (IDP / British Council / Cambridge University Press)
-- ============================================================

-- ============================================================
-- Insert past paper records (one per module)
-- ============================================================
INSERT INTO public.past_papers (id, module, title, filename, description, year, is_active)
VALUES
  ('aaaaaaaa-0001-0001-0001-000000000001', 'listening', 'IELTS Listening Sample Tasks 2023',
   'ielts-listening-sample-tasks-2023.pdf',
   'Official IELTS Listening sample tasks covering all question types: Form Completion, Multiple Choice, Short-answer, Sentence Completion, Matching, Plan/Map/Diagram Labelling, Note Completion.',
   2023, true),
  ('aaaaaaaa-0002-0002-0002-000000000002', 'reading',  'IELTS Academic Reading Sample Tasks 2023',
   'ielts-academic-reading-sample-tasks-2023.pdf',
   'Official IELTS Academic Reading sample tasks covering Matching Features, Summary Completion, True/False/Not Given, Matching Headings, Multiple Choice, Diagram Labelling.',
   2023, true),
  ('aaaaaaaa-0003-0003-0003-000000000003', 'writing',  'IELTS Academic Writing Sample Tasks 2023',
   'ielts-academic-writing-sample-tasks-2023.pdf',
   'Official IELTS Academic Writing sample tasks: Task 1 (bar chart, line graph, process diagram) and Task 2 (opinion essay, discussion essay).',
   2023, true),
  ('aaaaaaaa-0004-0004-0004-000000000004', 'speaking', 'IELTS Speaking Sample Tasks 2023',
   'ielts-speaking-sample-tasks-2023.pdf',
   'Official IELTS Speaking sample tasks: Part 1 (interview), Part 2 (individual long turn / cue card), Part 3 (two-way discussion).',
   2023, true);

-- ============================================================
-- LISTENING question patterns
-- ============================================================
INSERT INTO public.past_paper_questions (past_paper_id, module, question_type, part, content, difficulty)
VALUES
-- Form Completion (Part 1) - Packham's Shipping Agency
('aaaaaaaa-0001-0001-0001-000000000001', 'listening', 'form_completion', 'Part 1', '{
  "description": "Form Completion — customer fills in a shipping quotation form while listening to a phone conversation",
  "instruction": "Complete the form below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.",
  "context": "A customer phones a shipping agency to enquire about sending a large container overseas (Kenya). The agent asks for name, address, postcode, container dimensions, and contents.",
  "question_count": 8,
  "answer_types": ["name", "street_name", "postcode", "measurement", "measurement", "item_list", "item_list", "currency_amount"],
  "sample_answers": ["Mkere", "Westall", "BS8 9PU", "0.75m wide", "0.5m high", "books", "toys", "1700"],
  "generation_hints": "Create a real-life service transaction (hotel booking, gym membership, doctor appointment, library card, job application). Include name spelling, address, numeric fields, and 2-3 items from a list."
}'::jsonb, 'easy'),

-- Multiple Choice (Part 1) - Insurance type & delivery preference
('aaaaaaaa-0001-0001-0001-000000000001', 'listening', 'multiple_choice', 'Part 1', '{
  "description": "Multiple Choice — 2 questions at end of the shipping conversation about insurance and delivery",
  "instruction": "Choose the correct letter, A, B or C.",
  "context": "The shipping agent describes three insurance tiers (Economy, Standard, Premium). The customer chooses Premium. The customer also chooses port delivery.",
  "question_count": 2,
  "sample_questions": [
    {"question": "Type of insurance chosen", "options": {"A": "Economy", "B": "Standard", "C": "Premium"}, "answer": "C"},
    {"question": "Customer wants goods delivered to", "options": {"A": "port", "B": "home", "C": "depot"}, "answer": "A"}
  ],
  "generation_hints": "Create 2-3 multiple-choice questions about preferences, selections, or factual details from a phone/service conversation. Options should be plausible distractors."
}'::jsonb, 'easy'),

-- Short-answer Questions (Part 2) - Social contacts in UK talk
('aaaaaaaa-0001-0001-0001-000000000001', 'listening', 'short_answer', 'Part 2', '{
  "description": "Short-answer Questions — talk to people going to live in the UK, about making social contacts",
  "instruction": "Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.",
  "context": "A speaker at the British Council gives a talk about social life in the UK. Topics: why social contact is harder abroad (language, customs), types of community groups (theatre, music, local history), where to find info (town hall, public library).",
  "question_count": 6,
  "pair_structure": "Questions come in logical pairs: TWO factors, TWO types of group, TWO places",
  "sample_answers": ["language", "customs", "music (groups)", "local history (groups)", "(the) (public) library", "(the) town hall"],
  "generation_hints": "Create a monologue or talk (6-8 questions). Questions ask for 2-3 specific items in the same category. Use a talk about community, health, safety, or study advice."
}'::jsonb, 'medium'),

-- Sentence Completion (Part 3) - Open University discussion
('aaaaaaaa-0001-0001-0001-000000000001', 'listening', 'sentence_completion', 'Part 3', '{
  "description": "Sentence Completion — two students discuss studying with the Open University",
  "instruction": "Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.",
  "context": "Rachel (who studied with Open University) talks to Paul. Key points: demanded self-discipline, improved time-management skills, structured in modules, enjoyed summer schools.",
  "question_count": 4,
  "sample_items": [
    {"sentence": "Studying with the Open University demanded a great deal of _____.", "answer": "self-discipline"},
    {"sentence": "Studying and working at the same time improved Rachel's _____ skills.", "answer": "time-management"},
    {"sentence": "It was helpful that the course was structured in _____.", "answer": "modules"},
    {"sentence": "She enjoyed meeting other students at _____.", "answer": "summer schools"}
  ],
  "generation_hints": "Create 4 sentence-completion items from a discussion between two people (students, colleagues, friends). Answers are 1-2 words from the audio. Sentences should paraphrase the audio, not copy it."
}'::jsonb, 'medium'),

-- Matching (Part 3/4) - Speaker matching
('aaaaaaaa-0001-0001-0001-000000000001', 'listening', 'matching', 'Part 3', '{
  "description": "Matching — match speakers to opinions or statements",
  "instruction": "What does each speaker say about the topic? Choose the correct letter from the box.",
  "context": "Multiple speakers discuss a topic; each holds a different opinion. Students must match speaker to opinion.",
  "question_count": 5,
  "options_pool_size": 7,
  "generation_hints": "Create 5 speakers and a pool of 7 options (opinions, views, or actions). Each speaker matches exactly one option; 2 options are distractors. Topics: study habits, environmental opinions, job preferences, technology views."
}'::jsonb, 'hard'),

-- Plan/Map/Diagram Labelling (Part 2/3)
('aaaaaaaa-0001-0001-0001-000000000001', 'listening', 'diagram_labelling', 'Part 2', '{
  "description": "Plan/Map/Diagram Labelling — label parts of a described layout",
  "instruction": "Label the diagram below. Write NO MORE THAN TWO WORDS for each answer.",
  "context": "A speaker describes the layout of a building, campus, or process. Students hear directional/spatial language and label the diagram.",
  "question_count": 5,
  "generation_hints": "Describe a building floor plan, town map, or scientific diagram. Use spatial language (opposite, next to, on the left, beyond, adjacent to). Labels are nouns/noun phrases 1-2 words. Include a description of the layout in the transcript."
}'::jsonb, 'hard'),

-- Note Completion (Part 4) - Academic lecture
('aaaaaaaa-0001-0001-0001-000000000001', 'listening', 'note_completion', 'Part 4', '{
  "description": "Note Completion — complete lecture notes with key facts",
  "instruction": "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
  "context": "An academic lecture on a topic (e.g. animal behaviour, history, geography). Students complete a structured set of notes with missing facts, figures, and key terms.",
  "question_count": 10,
  "generation_hints": "Write a 300-400 word lecture transcript on an academic topic. Create a note/outline framework with 10 gaps. Answers are single words or numbers. Topics: climate change, migration patterns, ancient civilisations, renewable energy, psychology experiments."
}'::jsonb, 'hard');

-- ============================================================
-- READING question patterns
-- ============================================================
INSERT INTO public.past_paper_questions (past_paper_id, module, question_type, part, content, difficulty)
VALUES
('aaaaaaaa-0002-0002-0002-000000000002', 'reading', 'true_false_not_given', 'Passage 1', '{
  "description": "True / False / Not Given — 5 statements about the passage",
  "instruction": "Do the following statements agree with the information given in the Reading Passage? TRUE if the statement agrees, FALSE if it contradicts, NOT GIVEN if there is no information.",
  "question_count": 5,
  "at_least_one_not_given": true,
  "generation_hints": "Write 5 statements about the passage. At least 1 must be NOT GIVEN (information absent from the passage). Avoid simple word-matching; statements should paraphrase passage content."
}'::jsonb, 'medium'),

('aaaaaaaa-0002-0002-0002-000000000002', 'reading', 'multiple_choice', 'Passage 1', '{
  "description": "Multiple Choice — 4 questions with A/B/C/D options",
  "instruction": "Choose the correct letter, A, B, C or D.",
  "question_count": 4,
  "includes_main_idea": true,
  "generation_hints": "Include 1 question about the author''s purpose or main idea of a paragraph. Other questions test specific detail and inference. Each question has exactly 4 options; only one is correct."
}'::jsonb, 'medium'),

('aaaaaaaa-0002-0002-0002-000000000002', 'reading', 'sentence_completion', 'Passage 1', '{
  "description": "Sentence / Summary Completion — fill blanks using words from the passage",
  "instruction": "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
  "question_count": 4,
  "word_limit": "TWO WORDS",
  "generation_hints": "Create 4 sentence-completion items. Answers must be exact words from the passage (not paraphrases). Sentences should rephrase the passage content, not copy it."
}'::jsonb, 'medium'),

('aaaaaaaa-0002-0002-0002-000000000002', 'reading', 'matching_features', 'Passage 2', '{
  "description": "Matching Features — match statements to sources/categories listed in a box",
  "instruction": "Look at the following statements and the list of researchers/groups. Match each statement to the correct researcher/group.",
  "question_count": 6,
  "options_pool_size": 4,
  "options_can_be_used_multiple_times": true,
  "generation_hints": "Create 6 statements and a box with 4 names/categories (researchers, countries, time periods, organisations). Options can be used more than once. Tests ability to scan and locate specific attributes."
}'::jsonb, 'hard'),

('aaaaaaaa-0002-0002-0002-000000000002', 'reading', 'matching_headings', 'Passage 2', '{
  "description": "Matching Headings — match a heading to each paragraph",
  "instruction": "The Reading Passage has several paragraphs A–G. Choose the correct heading for each paragraph from the list of headings.",
  "question_count": 7,
  "headings_pool_size": 10,
  "generation_hints": "Provide 10 possible headings for 7 paragraphs (3 distractors). Headings are concise noun phrases. Some headings are close in meaning to test careful reading."
}'::jsonb, 'hard'),

('aaaaaaaa-0002-0002-0002-000000000002', 'reading', 'summary_completion', 'Passage 3', '{
  "description": "Summary / Note / Flow-chart Completion — fill gaps from a box of words or from the passage",
  "instruction": "Complete the summary using words from the box. You will not need all the words.",
  "question_count": 5,
  "word_bank_size": 8,
  "generation_hints": "Create a 5-gap summary paragraph about the passage. Provide a box of 8 words (3 distractors). Words are from the passage but the summary paraphrases it."
}'::jsonb, 'medium'),

('aaaaaaaa-0002-0002-0002-000000000002', 'reading', 'matching_sentence_endings', 'Passage 3', '{
  "description": "Matching Sentence Endings — complete sentence beginnings by choosing the correct ending",
  "instruction": "Complete each sentence with the correct ending A–H from the box.",
  "question_count": 6,
  "endings_pool_size": 8,
  "generation_hints": "Write 6 sentence beginnings from the passage. Provide 8 possible endings (2 distractors). Correct endings must accurately complete the meaning of the sentence as found in the passage."
}'::jsonb, 'hard');

-- ============================================================
-- WRITING question patterns
-- ============================================================
INSERT INTO public.past_paper_questions (past_paper_id, module, question_type, part, content, difficulty)
VALUES
('aaaaaaaa-0003-0003-0003-000000000003', 'writing', 'task1_bar_chart', 'Task 1', '{
  "description": "Task 1 — Bar Chart: Men and Women in Further Education (full-time vs part-time, 3 periods)",
  "instruction": "The chart below shows the number of men and women in further education in Britain in three periods and whether they were studying full-time or part-time. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  "visual_type": "bar_chart",
  "variables": ["gender", "study_mode", "time_period"],
  "assessment_criteria": ["Task Achievement", "Coherence and Cohesion", "Lexical Resource", "Grammatical Range and Accuracy"],
  "generation_hints": "Generate a bar chart Task 1 prompt. Provide: (1) a data description (6-8 data points), (2) the task instruction above. Topics: employment statistics, education enrollment, production figures, transport usage, energy consumption."
}'::jsonb, 'medium'),

('aaaaaaaa-0003-0003-0003-000000000003', 'writing', 'task1_line_graph', 'Task 1', '{
  "description": "Task 1 — Line Graph: Radio and Television Audiences Throughout the Day (1992)",
  "instruction": "The graph below shows radio and television audiences throughout the day in 1992. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  "visual_type": "line_graph",
  "variables": ["media_type", "time_of_day", "audience_percentage"],
  "generation_hints": "Generate a line graph Task 1 prompt. Provide hourly data points for 2 competing variables (e.g. two transport modes, two products, two countries). Describe trends: peaks, troughs, crossover points."
}'::jsonb, 'medium'),

('aaaaaaaa-0003-0003-0003-000000000003', 'writing', 'task1_process_diagram', 'Task 1', '{
  "description": "Task 1 — Process Diagram: Brick Manufacturing Process",
  "instruction": "The diagram below shows the process by which bricks are manufactured for the building industry. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  "visual_type": "process_diagram",
  "stages": ["clay digging", "sorting/cutting", "moulding", "drying", "kiln firing", "cooling", "packaging/delivery"],
  "generation_hints": "Generate a process diagram Task 1 prompt. Describe 6-8 sequential stages of a manufacturing or natural process (e.g. paper recycling, cement production, water treatment, wine making). Use passive voice and sequence language."
}'::jsonb, 'medium'),

('aaaaaaaa-0003-0003-0003-000000000003', 'writing', 'task2_opinion_essay', 'Task 2', '{
  "description": "Task 2 — Opinion Essay: Children from poor families are better prepared for adult life",
  "instruction": "Write about the following topic: Children who are brought up in families that do not have large amounts of money are better prepared to deal with the problems of adult life than children brought up by wealthy parents. To what extent do you agree or disagree with this opinion? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  "essay_type": "opinion",
  "band_descriptors": {
    "task_response": "Formulate and develop a position with relevant, extended support",
    "coherence_cohesion": "Logical sequencing; varied cohesive devices",
    "lexical_resource": "Wide range; precise word choice; rare errors",
    "grammatical_range": "Wide range of structures; rare errors"
  },
  "generation_hints": "Generate an opinion essay prompt ('To what extent do you agree or disagree?'). Topics: education, society, technology, environment, health, globalisation. Avoid yes/no answers — require nuanced position."
}'::jsonb, 'hard'),

('aaaaaaaa-0003-0003-0003-000000000003', 'writing', 'task2_discussion_essay', 'Task 2', '{
  "description": "Task 2 — Discussion Essay: International Tourism advantages vs disadvantages",
  "instruction": "Write about the following topic: International tourism has brought enormous benefit to many places. At the same time, there is concern about its impact on local inhabitants and the environment. Do the disadvantages of international tourism outweigh the advantages? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  "essay_type": "discussion",
  "generation_hints": "Generate a discussion essay prompt ('Do the disadvantages outweigh the advantages?' or 'Discuss both views and give your own opinion'). Topics: urbanisation, social media, remote work, AI in education, processed food, space exploration."
}'::jsonb, 'hard');

-- ============================================================
-- SPEAKING question patterns
-- ============================================================
INSERT INTO public.past_paper_questions (past_paper_id, module, question_type, part, content, difficulty)
VALUES
('aaaaaaaa-0004-0004-0004-000000000004', 'speaking', 'part1_interview', 'Part 1', '{
  "description": "Part 1 — Introduction and Interview: Hometown and Accommodation",
  "duration": "4-5 minutes",
  "topics": ["Hometown", "Accommodation"],
  "sample_questions": [
    "What kind of place is it?",
    "What is the most interesting part of your town/village?",
    "What kind of jobs do the people in your town/village do?",
    "Would you say it is a good place to live? (Why?)",
    "Tell me about the kind of accommodation you live in.",
    "How long have you lived there?",
    "What do you like about living there?",
    "What sort of accommodation would you most like to live in?"
  ],
  "topic_pool": ["Hometown", "Accommodation", "Work", "Studies", "Family", "Hobbies", "Daily Routine", "Food", "Weather", "Transport", "Shopping", "Technology", "Health", "Music", "Sport", "Reading", "TV/Films", "Cooking", "Nature"],
  "generation_hints": "Generate 2 Part 1 topics with 4 questions each. Questions are personal and conversational. Avoid hypothetical or abstract topics (save for Part 3). Questions should flow naturally from one to the next."
}'::jsonb, 'easy'),

('aaaaaaaa-0004-0004-0004-000000000004', 'speaking', 'part2_long_turn', 'Part 2', '{
  "description": "Part 2 — Individual Long Turn: Cue Card (1 min prep, 1-2 min response)",
  "duration": "3-4 minutes",
  "sample_cue_card": {
    "prompt": "Describe something you own which is very important to you.",
    "bullet_points": ["where you got it from", "how long you have had it", "what you use it for"],
    "final_instruction": "and explain why it is important to you."
  },
  "rounding_off_questions": ["Is it valuable in terms of money?", "Would it be easy to replace?"],
  "cue_card_categories": ["possession", "person", "place", "event", "activity", "achievement", "book/film/song", "experience", "change", "time period"],
  "generation_hints": "Generate a Part 2 cue card. Structure: 'Describe a [noun phrase].' Then 3 bullet points starting with 'where/when/who/what/why/how'. Final instruction: 'and explain [why/how/what impact]'. Add 1-2 rounding-off questions."
}'::jsonb, 'medium'),

('aaaaaaaa-0004-0004-0004-000000000004', 'speaking', 'part3_discussion', 'Part 3', '{
  "description": "Part 3 — Two-way Discussion: Values, Status, and Advertising",
  "duration": "4-5 minutes",
  "themes": ["Values and status symbols", "How values have changed", "Role of advertising"],
  "sample_questions": [
    "What kind of things give status to people in your country?",
    "Have things changed since your parents'' time?",
    "Do you think advertising influences what people buy?"
  ],
  "question_types": ["comparison", "opinion", "speculation", "cause-effect", "advantage-disadvantage"],
  "generation_hints": "Generate 4-6 Part 3 questions that link thematically to the Part 2 cue card but become more abstract and societal. Include at least 1 comparison question (past vs present / country A vs B) and 1 speculative question (future trends)."
}'::jsonb, 'hard');
