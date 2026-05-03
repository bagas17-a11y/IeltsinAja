-- Add visual_data and visual_type columns to ielts_library
-- These enable the VisualDataRenderer in WritingModule to display
-- charts, tables, process diagrams and maps for library questions.

ALTER TABLE public.ielts_library
  ADD COLUMN IF NOT EXISTS visual_type TEXT,
  ADD COLUMN IF NOT EXISTS visual_data JSONB;

-- ============================================================
-- Populate visual data for all seeded Task 1 questions
-- ============================================================

-- 1. Bar Chart: Further Education in Britain by Gender (1970–1990)
UPDATE public.ielts_library
SET
  visual_type = 'bar_chart',
  visual_data = '{
    "title": "Full-time and part-time students in UK further education (thousands)",
    "x_axis": "Time Period",
    "y_axis": "Number of students (thousands)",
    "unit": "thousands",
    "series": [
      {"label": "Male full-time",   "values": {"1970/71": 1500, "1980/81": 2100, "1990/91": 1800}},
      {"label": "Female full-time", "values": {"1970/71": 800,  "1980/81": 1400, "1990/91": 1700}},
      {"label": "Male part-time",   "values": {"1970/71": 2200, "1980/81": 2400, "1990/91": 2600}},
      {"label": "Female part-time", "values": {"1970/71": 700,  "1980/81": 1200, "1990/91": 2200}}
    ],
    "key_features": [
      "Female part-time enrolment more than tripled (700k → 2,200k)",
      "Gender gap in part-time study narrowed sharply (1,500k → 400k gap)",
      "Male full-time peaked in 1980/81 then declined slightly"
    ]
  }'::jsonb
WHERE title = 'Further Education in Britain by Gender (1970–1990)';

-- 2. Line Graph: Radio and Television Audiences Throughout the Day (1992)
UPDATE public.ielts_library
SET
  visual_type = 'line_graph',
  visual_data = '{
    "title": "Percentage of UK population watching TV or listening to radio throughout the day (1992)",
    "x_axis": "Time of day",
    "y_axis": "Percentage of population (%)",
    "unit": "%",
    "series": [
      {"label": "Radio",      "values": {"00:00":1,"06:00":5,"08:00":25,"10:00":15,"12:00":12,"14:00":11,"16:00":9,"18:00":10,"20:00":8,"22:00":5,"24:00":2}},
      {"label": "Television", "values": {"00:00":1,"06:00":2,"08:00":3,"10:00":8,"12:00":14,"14:00":15,"16:00":20,"18:00":35,"20:00":42,"22:00":28,"24:00":5}}
    ],
    "key_features": [
      "Radio peaks at 8:00 am (~25%) — morning commute",
      "Television peaks at 8:00–9:00 pm (~42%) — prime time",
      "Lines cross approximately at midday and again at 2:00 pm",
      "Both audiences are negligible between midnight and 6:00 am"
    ]
  }'::jsonb
WHERE title = 'Radio and Television Audiences Throughout the Day (1992)';

-- 3. Process Diagram: The Brick Manufacturing Process
UPDATE public.ielts_library
SET
  visual_type = 'process_diagram',
  visual_data = '{
    "title": "The process of brick manufacturing for the building industry",
    "stages": [
      {"stage": 1, "description": "Clay digging (heavy machinery)"},
      {"stage": 2, "description": "Sorting on metal grid; rolled and cut"},
      {"stage": 3, "description": "Mixed with sand and water"},
      {"stage": 4, "description": "Shaped by mould or wire cutter"},
      {"stage": 5, "description": "Drying oven (24–48 hours)"},
      {"stage": 6, "description": "Kiln firing (200–1,300°C)"},
      {"stage": 7, "description": "Cooling chamber (24–48 hours)"},
      {"stage": 8, "description": "Packaged and delivered"}
    ]
  }'::jsonb
WHERE title = 'The Brick Manufacturing Process';

-- 4. Line Graph: Proportion of Population Aged 65 and Over (1940–2040)
UPDATE public.ielts_library
SET
  visual_type = 'line_graph',
  visual_data = '{
    "title": "Proportion of population aged 65 and over in three countries (1940–2040)",
    "x_axis": "Year",
    "y_axis": "Percentage of population (%)",
    "unit": "%",
    "series": [
      {"label": "Japan",  "values": {"1940":5,"1960":6,"1980":9,"2000":17,"2020":30,"2040":27}},
      {"label": "Sweden", "values": {"1940":7,"1960":9,"1980":15,"2000":17,"2020":22,"2040":25}},
      {"label": "USA",    "values": {"1940":7,"1960":8,"1980":12,"2000":13,"2020":18,"2040":23}}
    ],
    "key_features": [
      "Japan projected to surge dramatically — highest proportion by 2020 (~30%)",
      "Japan and Sweden converge at 17% in 2000 before diverging",
      "USA grows most gradually throughout",
      "Data from 2000 onwards are projections (forecast)"
    ]
  }'::jsonb
WHERE title = 'Proportion of Population Aged 65 and Over (1940–2040)';

-- 5. Pie Charts: Electricity Production from Different Sources (1980 and 2000)
--    Rendered as a bar chart comparing the two years side by side
UPDATE public.ielts_library
SET
  visual_type = 'bar_chart',
  visual_data = '{
    "title": "Electricity production by source in Freedonia (% of total, 1980 vs 2000)",
    "x_axis": "Energy source",
    "y_axis": "Percentage of total electricity (%)",
    "unit": "%",
    "series": [
      {"label": "Coal",         "values": {"1980": 53.6, "2000": 28.5}},
      {"label": "Oil",          "values": {"1980": 20.5, "2000": 0.6}},
      {"label": "Natural Gas",  "values": {"1980": 5.5,  "2000": 28.5}},
      {"label": "Hydropower",   "values": {"1980": 12.5, "2000": 20.7}},
      {"label": "Nuclear",      "values": {"1980": 7.9,  "2000": 19.7}},
      {"label": "Other",        "values": {"1980": 0,    "2000": 2.0}}
    ],
    "key_features": [
      "Coal dominated in 1980 (53.6%) but fell to 28.5% by 2000",
      "Oil virtually disappeared (20.5% → 0.6%)",
      "Natural gas surged to match coal by 2000 (5.5% → 28.5%)",
      "Energy mix became far more diversified by 2000"
    ]
  }'::jsonb
WHERE title = 'Electricity Production from Different Sources (1980 and 2000)';

-- 6. Table: Water Consumption by Country (2000)
UPDATE public.ielts_library
SET
  visual_type = 'table',
  visual_data = '{
    "title": "Water used per person per day by sector (litres, 2000)",
    "unit": "litres/person/day",
    "series": [
      {"label": "Brazil", "values": {"Agricultural": 359, "Industrial": 26,  "Domestic": 59,  "Total": 444}},
      {"label": "Canada", "values": {"Agricultural": 94,  "Industrial": 544, "Domestic": 163, "Total": 801}},
      {"label": "China",  "values": {"Agricultural": 561, "Industrial": 22,  "Domestic": 31,  "Total": 614}},
      {"label": "Egypt",  "values": {"Agricultural": 936, "Industrial": 14,  "Domestic": 68,  "Total": 1018}},
      {"label": "India",  "values": {"Agricultural": 588, "Industrial": 15,  "Domestic": 48,  "Total": 651}},
      {"label": "USA",    "values": {"Agricultural": 697, "Industrial": 512, "Domestic": 266, "Total": 1475}}
    ],
    "key_features": [
      "USA consumes the most overall (1,475 litres/person/day)",
      "Brazil consumes the least overall (444 litres/person/day)",
      "Canada is the anomaly: industrial use (544) exceeds agricultural (94)",
      "Agriculture dominates in all countries except Canada"
    ]
  }'::jsonb
WHERE title = 'Water Consumption by Country (2000)';

-- 7. Map: Changes to Fonton — A Seaside Town (1990 to Present)
UPDATE public.ielts_library
SET
  visual_type = 'map',
  visual_data = '{
    "title": "Changes to the seaside resort of Fonton between 1990 and the present day",
    "key_features": [
      "Small hotel → replaced by large hotel complex with swimming pool",
      "Small cluster of shops → replaced by modern shopping centre",
      "New large car park constructed behind the hotel complex",
      "Farmland (north) → replaced by golf course and tennis courts",
      "New dual carriageway built along the seafront",
      "Cinema added to the town centre (did not exist in 1990)",
      "Beach and fishing harbour (south) remain unchanged"
    ]
  }'::jsonb
WHERE title = 'Changes to Fonton: A Seaside Town (1990 to Present)';
