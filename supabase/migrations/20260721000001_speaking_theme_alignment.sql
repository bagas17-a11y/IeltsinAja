-- Speaking Part 2 and Part 3 content was paired purely by array/alphabetical
-- position in the app, which is coincidental, not intentional. This adds an
-- explicit theme_group so Part 3 discussion topics are reliably drawn from
-- the same broad category as the Part 2 cue card in the same test, per real
-- IELTS format (Part 3 extends Part 2's topic area, not a direct follow-up).
alter table public.speaking_library add column if not exists theme_group text;

-- Part 3 rows — theme_group mirrors their existing broad topic.
update public.speaking_library set theme_group = 'culture-tradition'    where part = 3 and topic = 'Culture & Tradition';
update public.speaking_library set theme_group = 'decision-making'      where part = 3 and topic = 'Decision Making & Life Choices';
update public.speaking_library set theme_group = 'education-learning'   where part = 3 and topic = 'Education & Learning';
update public.speaking_library set theme_group = 'health-wellbeing'     where part = 3 and topic = 'Health & Wellbeing';
update public.speaking_library set theme_group = 'influence-role-models' where part = 3 and topic = 'Influence & Role Models';
update public.speaking_library set theme_group = 'society-community'    where part = 3 and topic = 'Society & Community';
update public.speaking_library set theme_group = 'technology-society'   where part = 3 and topic = 'Technology & Society';
update public.speaking_library set theme_group = 'environment'          where part = 3 and topic = 'The Environment';
update public.speaking_library set theme_group = 'travel-tourism'       where part = 3 and topic = 'Travel & Tourism';
update public.speaking_library set theme_group = 'work-career'          where part = 3 and topic = 'Work & Career';

-- New Part 3 topic — no existing category covered media/books/film, which
-- is a common Part 2 cue card with no matching broad discussion topic.
insert into public.speaking_library (part, topic, question, follow_up_questions, is_active, theme_group)
values (
  3,
  'Media & Communication',
  'Discussion: Media, communication, and how people engage with stories and information',
  '[
    "How has the way people consume stories (books, films, series) changed in recent years?",
    "Do you think traditional media like books and cinema will remain popular as technology develops?",
    "What role does fiction play in helping people understand real-world issues?",
    "Should schools spend more time teaching students to critically evaluate what they watch or read?",
    "Do you think it is easier or harder today for people to find content that truly impresses them?"
  ]'::jsonb,
  true,
  'media-communication'
);

-- Part 2 rows — each mapped to the broad category its cue card most
-- naturally leads into for Part 3 discussion.
update public.speaking_library set theme_group = 'media-communication'   where part = 2 and topic = 'A Book or Film That Impressed You';
update public.speaking_library set theme_group = 'decision-making'       where part = 2 and topic = 'A Difficult Problem You Solved';
update public.speaking_library set theme_group = 'work-career'           where part = 2 and topic = 'A Goal You Want to Achieve';
update public.speaking_library set theme_group = 'travel-tourism'        where part = 2 and topic = 'A Memorable Trip';
update public.speaking_library set theme_group = 'influence-role-models' where part = 2 and topic = 'A Person Who Influenced You';
update public.speaking_library set theme_group = 'decision-making'       where part = 2 and topic = 'A Piece of Advice That Changed You';
update public.speaking_library set theme_group = 'technology-society'    where part = 2 and topic = 'A Piece of Technology You Rely On';
update public.speaking_library set theme_group = 'environment'           where part = 2 and topic = 'A Place You Enjoy Visiting';
update public.speaking_library set theme_group = 'education-learning'    where part = 2 and topic = 'A Skill You Want to Learn';
update public.speaking_library set theme_group = 'work-career'           where part = 2 and topic = 'A Time You Felt Very Proud';
update public.speaking_library set theme_group = 'society-community'     where part = 2 and topic = 'A Time You Helped Someone';
update public.speaking_library set theme_group = 'work-career'           where part = 2 and topic = 'A Time You Were Very Busy';
update public.speaking_library set theme_group = 'culture-tradition'     where part = 2 and topic = 'A Traditional Festival or Celebration';
update public.speaking_library set theme_group = 'decision-making'       where part = 2 and topic = 'An Important Decision You Made';
update public.speaking_library set theme_group = 'influence-role-models' where part = 2 and topic = 'Someone You Admire';
