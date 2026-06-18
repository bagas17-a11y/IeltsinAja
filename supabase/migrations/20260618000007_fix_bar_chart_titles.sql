-- Fix visual_data titles for the 4 new bar chart questions.
-- The renderer appends "(unit)" itself, so the title must not already contain it.

UPDATE public.ielts_library
SET visual_data = visual_data || '{"title": "Electric vehicles sold in five countries"}'::jsonb
WHERE title = 'Sales of Electric Vehicles in Five Countries (2015 and 2022)';

UPDATE public.ielts_library
SET visual_data = visual_data || '{"title": "Workers using each transport mode to commute (2010)"}'::jsonb
WHERE title = 'Transport Used to Travel to Work in Three Cities (2010)';

UPDATE public.ielts_library
SET visual_data = visual_data || '{"title": "Average weekly household spending by region (2019)"}'::jsonb
WHERE title = 'Average Weekly Household Spending by Region (2019)';

UPDATE public.ielts_library
SET visual_data = visual_data || '{"title": "Leisure activity participation by age group, UK (2018)"}'::jsonb
WHERE title = 'Participation in Leisure Activities by Age Group in the UK (2018)';
