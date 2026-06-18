-- Strip the unit from y_axis labels in visual_data for new bar/line chart questions.
-- The chart title already contains the unit in brackets, so the y-axis label
-- should just describe what is being measured without repeating the unit.

UPDATE public.ielts_library
SET visual_data = visual_data || '{"y_axis": "Vehicles sold"}'::jsonb
WHERE title = 'Sales of Electric Vehicles in Five Countries (2015 and 2022)';

UPDATE public.ielts_library
SET visual_data = visual_data || '{"y_axis": "Workers (%)"}'::jsonb
WHERE title = 'Transport Used to Travel to Work in Three Cities (2010)';

UPDATE public.ielts_library
SET visual_data = visual_data || '{"y_axis": "Weekly spending (USD)"}'::jsonb
WHERE title = 'Average Weekly Household Spending by Region (2019)';

UPDATE public.ielts_library
SET visual_data = visual_data || '{"y_axis": "Participation (%)"}'::jsonb
WHERE title = 'Participation in Leisure Activities by Age Group in the UK (2018)';

UPDATE public.ielts_library
SET visual_data = visual_data || '{"y_axis": "Tourist arrivals (millions)"}'::jsonb
WHERE title = 'International Tourist Arrivals in Three Countries (2000–2018)';

UPDATE public.ielts_library
SET visual_data = visual_data || '{"y_axis": "Unemployment rate (%)"}'::jsonb
WHERE title = 'Unemployment Rates in Four Countries (2001–2016)';

UPDATE public.ielts_library
SET visual_data = visual_data || '{"y_axis": "Internet users (%)"}'::jsonb
WHERE title = 'Percentage of Population Using the Internet in Five Countries (2000–2020)';

UPDATE public.ielts_library
SET visual_data = visual_data || '{"y_axis": "CO2 per capita (tonnes)"}'::jsonb
WHERE title = 'CO2 Emissions per Capita in Four Countries (1990–2020)';
