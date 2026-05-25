-- ============================================================
-- Speaking question bank
-- ============================================================

CREATE TABLE IF NOT EXISTS public.speaking_library (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  part          text        NOT NULL CHECK (part IN ('part1', 'part2', 'part3')),
  topic         text        NOT NULL,
  question      text        NOT NULL,
  follow_up_questions jsonb DEFAULT '[]'::jsonb,
  prep_time     text,
  speak_time    text,
  difficulty    text        DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_active     boolean     DEFAULT true,
  created_by    uuid        REFERENCES auth.users(id),
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE public.speaking_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage speaking_library"
  ON public.speaking_library FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Anyone authenticated can read active speaking questions"
  ON public.speaking_library FOR SELECT
  USING (is_active = true AND auth.uid() IS NOT NULL);

-- ============================================================
-- PART 1 — Introduction & Interview questions
-- ============================================================

INSERT INTO public.speaking_library (part, topic, question, difficulty) VALUES

-- Hometown & Home
('part1', 'Hometown', 'Where are you from? What is your hometown like?', 'easy'),
('part1', 'Hometown', 'What do you like most about living in your hometown?', 'easy'),
('part1', 'Hometown', 'Has your hometown changed much since you were a child?', 'medium'),

-- Accommodation
('part1', 'Accommodation', 'Do you live in a house or an apartment?', 'easy'),
('part1', 'Accommodation', 'What is your favourite room in your home and why?', 'easy'),
('part1', 'Accommodation', 'Would you prefer to live in a city or in the countryside?', 'medium'),

-- Work & Studies
('part1', 'Work & Studies', 'Are you currently working or studying?', 'easy'),
('part1', 'Work & Studies', 'What do you enjoy most about your job or studies?', 'easy'),
('part1', 'Work & Studies', 'What kind of work would you like to do in the future?', 'medium'),

-- Family
('part1', 'Family', 'Do you have a large or small family?', 'easy'),
('part1', 'Family', 'How much time do you spend with your family?', 'easy'),
('part1', 'Family', 'What is your favourite thing to do together as a family?', 'medium'),

-- Hobbies & Free Time
('part1', 'Hobbies', 'What do you enjoy doing in your free time?', 'easy'),
('part1', 'Hobbies', 'Did you have different hobbies when you were a child?', 'easy'),
('part1', 'Hobbies', 'Is there a hobby you have always wanted to try?', 'medium'),

-- Music
('part1', 'Music', 'What kind of music do you enjoy listening to?', 'easy'),
('part1', 'Music', 'Do you play any musical instruments?', 'easy'),
('part1', 'Music', 'Do you prefer listening to music alone or with other people?', 'medium'),

-- Sports & Exercise
('part1', 'Sports & Exercise', 'Do you enjoy playing or watching sports?', 'easy'),
('part1', 'Sports & Exercise', 'How often do you exercise?', 'easy'),
('part1', 'Sports & Exercise', 'What sports are popular in your country?', 'medium'),

-- Food & Cooking
('part1', 'Food & Cooking', 'What is your favourite type of food?', 'easy'),
('part1', 'Food & Cooking', 'Do you prefer eating at home or at restaurants?', 'easy'),
('part1', 'Food & Cooking', 'Do you know how to cook? What can you make?', 'medium'),

-- Travel
('part1', 'Travel', 'Do you enjoy travelling? Where have you been?', 'easy'),
('part1', 'Travel', 'What is your favourite way to travel — by plane, train, or car?', 'medium'),
('part1', 'Travel', 'Is there a place you would really like to visit someday?', 'easy'),

-- Technology
('part1', 'Technology', 'How important is technology in your daily life?', 'easy'),
('part1', 'Technology', 'What device do you use the most?', 'easy'),
('part1', 'Technology', 'Do you think people rely too much on technology these days?', 'medium'),

-- Social Media
('part1', 'Social Media', 'Do you use social media? Which platforms?', 'easy'),
('part1', 'Social Media', 'How much time do you spend on social media each day?', 'easy'),
('part1', 'Social Media', 'Do you think social media brings people closer together or further apart?', 'medium'),

-- Reading & Books
('part1', 'Reading', 'Do you enjoy reading? What do you usually read?', 'easy'),
('part1', 'Reading', 'Do you prefer reading physical books or digital ones?', 'medium'),
('part1', 'Reading', 'Did you read a lot when you were a child?', 'easy'),

-- Shopping
('part1', 'Shopping', 'Do you enjoy shopping? What do you like to shop for?', 'easy'),
('part1', 'Shopping', 'Do you prefer shopping online or in stores? Why?', 'medium'),
('part1', 'Shopping', 'Has the way you shop changed compared to when you were younger?', 'medium'),

-- Weather & Seasons
('part1', 'Weather & Seasons', 'What is the weather like in your country?', 'easy'),
('part1', 'Weather & Seasons', 'What is your favourite season and why?', 'easy'),
('part1', 'Weather & Seasons', 'Does the weather affect your mood?', 'medium'),

-- Daily Routine
('part1', 'Daily Routine', 'Can you describe your typical daily routine?', 'easy'),
('part1', 'Daily Routine', 'Are you more productive in the morning or in the evening?', 'easy'),
('part1', 'Daily Routine', 'Has your daily routine changed much in recent years?', 'medium'),

-- Sleep & Rest
('part1', 'Sleep', 'How many hours of sleep do you usually get each night?', 'easy'),
('part1', 'Sleep', 'Do you think people in your country get enough sleep?', 'medium'),

-- Friends & Social Life
('part1', 'Friends', 'Do you have a large group of friends or just a few close ones?', 'easy'),
('part1', 'Friends', 'How do you usually spend time with your friends?', 'easy'),
('part1', 'Friends', 'Has social media changed the way you keep in touch with friends?', 'medium'),

-- Art & Culture
('part1', 'Art & Culture', 'Do you enjoy visiting museums or art galleries?', 'easy'),
('part1', 'Art & Culture', 'Is art important to you? Why or why not?', 'medium'),

-- Environment & Nature
('part1', 'Nature & Environment', 'Do you enjoy spending time in nature?', 'easy'),
('part1', 'Nature & Environment', 'What do you do to help protect the environment?', 'medium'),

-- Transport
('part1', 'Transport', 'How do you usually get around your city?', 'easy'),
('part1', 'Transport', 'What do you think of public transport in your country?', 'medium');

-- ============================================================
-- PART 2 — Long Turn (Cue Cards)
-- ============================================================

INSERT INTO public.speaking_library (part, topic, question, follow_up_questions, prep_time, speak_time, difficulty) VALUES

('part2', 'A Memorable Trip',
$$Describe a memorable trip you took.

You should say:
• Where you went
• Who you went with
• What you did there

And explain why this trip was so memorable to you.$$,
'["What do you think makes a trip truly unforgettable?", "How has the way people travel changed in recent years?"]'::jsonb,
'1 minute', '1-2 minutes', 'medium'),

('part2', 'A Person Who Influenced You',
$$Describe a person who has had a significant influence on your life.

You should say:
• Who this person is
• How you know them
• What they did or said that influenced you

And explain in what ways they have changed how you think or act.$$,
'["What qualities do you think the most influential people share?", "Do you think famous people have too much influence on society?"]'::jsonb,
'1 minute', '1-2 minutes', 'medium'),

('part2', 'A Skill You Want to Learn',
$$Describe a skill you would like to learn in the future.

You should say:
• What the skill is
• Why you want to learn it
• How you plan to learn it

And explain how this skill would benefit your life.$$,
'["Why do some people find it harder to learn new skills as they get older?", "Do you think natural talent or hard work is more important in developing a skill?"]'::jsonb,
'1 minute', '1-2 minutes', 'easy'),

('part2', 'A Book or Film That Impressed You',
$$Describe a book or film that made a strong impression on you.

You should say:
• What it is about
• When you first read or watched it
• What you liked or disliked about it

And explain why it left such a strong impression on you.$$,
'["How do films and books reflect the values of a society?", "Do you think reading is becoming less popular among young people?"]'::jsonb,
'1 minute', '1-2 minutes', 'medium'),

('part2', 'A Time You Felt Very Proud',
$$Describe a time when you felt very proud of something you achieved.

You should say:
• What the achievement was
• How long it took you to reach it
• Who you shared the news with

And explain why this achievement made you feel so proud.$$,
'["Should parents always praise their children for their achievements?", "Is pride always a positive emotion, or can it be harmful?"]'::jsonb,
'1 minute', '1-2 minutes', 'medium'),

('part2', 'A Piece of Technology You Rely On',
$$Describe a piece of technology that you use regularly and could not live without.

You should say:
• What it is
• How long you have been using it
• What you mainly use it for

And explain why you feel you could not live without it.$$,
'["In what ways has technology made our lives more complicated?", "Do you think younger generations are too dependent on technology?"]'::jsonb,
'1 minute', '1-2 minutes', 'easy'),

('part2', 'A Place You Enjoy Visiting',
$$Describe a place in your city or country that you enjoy visiting.

You should say:
• Where this place is
• How often you go there
• What you do or see there

And explain why you enjoy visiting this place.$$,
'["Why is it important for cities to maintain public spaces?", "How do local landmarks contribute to a city''s identity?"]'::jsonb,
'1 minute', '1-2 minutes', 'easy'),

('part2', 'A Time You Helped Someone',
$$Describe a time when you helped someone in need.

You should say:
• Who you helped
• What the situation was
• How you helped them

And explain how you felt about helping this person.$$,
'["Why do some people find it difficult to ask for help?", "How can communities be encouraged to support one another more?"]'::jsonb,
'1 minute', '1-2 minutes', 'easy'),

('part2', 'An Important Decision You Made',
$$Describe an important decision you made at some point in your life.

You should say:
• What the decision was
• When and why you had to make it
• What happened as a result

And explain how this decision has affected your life.$$,
'["To what extent should family or friends influence someone''s major decisions?", "Why is decision-making considered an important life skill?"]'::jsonb,
'1 minute', '1-2 minutes', 'medium'),

('part2', 'A Traditional Festival or Celebration',
$$Describe a traditional festival or celebration in your country.

You should say:
• What the festival is called and when it takes place
• How it is typically celebrated
• What role you personally play in it

And explain why this festival is meaningful to you or your culture.$$,
'["How have traditional celebrations changed over the past few generations?", "Do you think it is important for young people to participate in cultural traditions?"]'::jsonb,
'1 minute', '1-2 minutes', 'medium'),

('part2', 'A Difficult Problem You Solved',
$$Describe a time when you had to deal with a difficult problem.

You should say:
• What the problem was
• How you discovered or encountered it
• What steps you took to solve it

And explain what you learned from this experience.$$,
'["Do you think problem-solving skills can be taught, or are they innate?", "How has technology changed the way people solve everyday problems?"]'::jsonb,
'1 minute', '1-2 minutes', 'hard'),

('part2', 'Someone You Admire',
$$Describe someone you admire very much.

You should say:
• Who this person is
• How you know about or know this person
• What qualities they possess

And explain why you admire them so much.$$,
'["What is the difference between admiring someone and idolising them?", "Do you think it is healthy for young people to have heroes?"]'::jsonb,
'1 minute', '1-2 minutes', 'easy'),

('part2', 'A Time You Were Very Busy',
$$Describe a time when you were extremely busy.

You should say:
• When this happened
• Why you were so busy
• How you managed your time

And explain how you felt during and after this busy period.$$,
'["Do you think modern life is more stressful than it was in the past?", "What strategies do you think help people manage stress effectively?"]'::jsonb,
'1 minute', '1-2 minutes', 'medium'),

('part2', 'A Goal You Want to Achieve',
$$Describe an important goal you would like to achieve in the future.

You should say:
• What the goal is
• Why it is important to you
• What steps you are taking or plan to take to achieve it

And explain what achieving this goal would mean to you.$$,
'["Why do some people find it difficult to set and pursue long-term goals?", "Do you think society puts too much pressure on people to be successful?"]'::jsonb,
'1 minute', '1-2 minutes', 'medium'),

('part2', 'A Piece of Advice That Changed You',
$$Describe a piece of advice you received that was very helpful.

You should say:
• Who gave you the advice
• What the advice was
• When you received it

And explain why this advice was so valuable to you.$$,
'["Do you think people today seek advice less often than they used to?", "Should parents give their children advice, or let them learn from their own mistakes?"]'::jsonb,
'1 minute', '1-2 minutes', 'medium');

-- ============================================================
-- PART 3 — Two-way Discussion questions
-- ============================================================

INSERT INTO public.speaking_library (part, topic, question, follow_up_questions, difficulty) VALUES

('part3', 'Travel & Tourism',
'Discussion: Travel and tourism in the modern world',
'["How has international travel changed over the past few decades?", "What are the advantages and disadvantages of mass tourism?", "How does tourism affect the local culture and environment of a destination?", "Do you think ecotourism can be a sustainable alternative to mass tourism?", "What responsibilities do tourists have when visiting other countries?"]'::jsonb,
'medium'),

('part3', 'Influence & Role Models',
'Discussion: The role of influence and role models in society',
'["Why do people — especially young people — need role models?", "In what ways can celebrities or influencers have a negative effect on society?", "Do you think parents or social media figures have a greater influence on children today?", "How has social media changed the way people become well-known and influential?", "Should governments regulate what kind of content public figures can promote online?"]'::jsonb,
'hard'),

('part3', 'Education & Learning',
'Discussion: Education and the way people learn',
'["How has the rise of technology changed the way people learn?", "Do you think formal education is still necessary in the digital age?", "What are the benefits of learning a skill independently compared to in a classroom?", "Should practical life skills be taught more in schools?", "How important is lifelong learning in today''s rapidly changing world?"]'::jsonb,
'medium'),

('part3', 'Technology & Society',
'Discussion: The impact of technology on modern society',
'["How has technology fundamentally changed the nature of work?", "Do you think artificial intelligence will have a more positive or negative impact on society?", "Should children''s use of technology be more strictly limited?", "In what ways has technology affected how people form and maintain relationships?", "Do you think automation will create more jobs than it destroys?"]'::jsonb,
'hard'),

('part3', 'Culture & Tradition',
'Discussion: Preserving culture and tradition in a globalised world',
'["Why is it important for societies to preserve their cultural traditions?", "How can globalisation threaten local cultures and identities?", "Do you think young people today value their cultural heritage?", "How do traditional celebrations help to strengthen a sense of community?", "Is it possible to maintain a strong cultural identity while embracing globalisation?"]'::jsonb,
'hard'),

('part3', 'Decision Making & Life Choices',
'Discussion: How people make decisions and navigate life choices',
'["How do people typically approach major life decisions?", "To what extent should family influence an individual''s major decisions?", "Do you think people today have more or fewer meaningful choices than previous generations?", "How does education help prepare young people for important decisions?", "Should society do more to support people who have made poor or harmful decisions?"]'::jsonb,
'medium'),

('part3', 'Health & Wellbeing',
'Discussion: Health, wellbeing, and public responsibility',
'["Why do so many people struggle to maintain a healthy lifestyle despite knowing what is good for them?", "What responsibility do governments have in promoting and protecting public health?", "How has awareness of mental health issues changed in recent years?", "Do you think healthcare should be free for all citizens?", "How has modern life affected people''s physical and mental wellbeing?"]'::jsonb,
'medium'),

('part3', 'The Environment',
'Discussion: Environmental challenges and responsibility',
'["What do you consider the most serious environmental problems facing the world today?", "Who should bear primary responsibility for solving environmental issues — individuals, corporations, or governments?", "How has public awareness of environmental issues changed over the last generation?", "Do you think economic development and environmental protection can coexist?", "What changes in individual behaviour are most needed to address climate change?"]'::jsonb,
'hard'),

('part3', 'Work & Career',
'Discussion: Work, careers, and the changing workplace',
'["How have people''s attitudes towards work changed over the past few decades?", "Do you think work-life balance is more difficult to achieve today than in the past?", "What impact does job satisfaction have on a person''s overall wellbeing?", "Should companies be legally required to offer remote work options?", "How will artificial intelligence change the kinds of jobs that exist in the future?"]'::jsonb,
'medium'),

('part3', 'Society & Community',
'Discussion: Social connections and community life',
'["Do you think people in modern societies feel a strong sense of community?", "How has urbanisation affected the way people interact with their neighbours?", "What can governments do to encourage stronger community bonds?", "Do you think volunteering should be compulsory for young people?", "How important is it for individuals to contribute to their local community?"]'::jsonb,
'medium');
