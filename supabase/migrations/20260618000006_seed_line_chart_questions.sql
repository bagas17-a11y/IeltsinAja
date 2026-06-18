-- ============================================================
-- Seed Migration: 4 New Line Graph Writing Task 1 Questions
-- Topics: Tourist Arrivals, Unemployment Rates,
--         Internet Usage, CO2 Emissions per Capita
-- ============================================================

INSERT INTO public.ielts_library
  (task_type, title, question_prompt, model_answer_band9, ai_secret_context, target_keywords, difficulty)
VALUES

-- ============================================================
-- LINE GRAPH 1 (EASY): International Tourist Arrivals (2000–2018)
-- ============================================================
(
$$Task 1 Academic$$,
$$International Tourist Arrivals in Three Countries (2000–2018)$$,
$$The line graph below shows the number of international tourists who visited France, the USA and Spain between 2000 and 2018.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.

DATA — International tourist arrivals (millions):
Year     France    USA    Spain
2000        77      51       47
2005        75      50       56
2010        77      60       53
2015        84      77       68
2018        89      80       83$$,

$$The line graph shows the number of international tourists who visited France, the USA and Spain between 2000 and 2018, measured in millions.

Overall, all three countries experienced growth in tourist arrivals over the period, with France remaining the most popular destination throughout. The most notable development was Spain's dramatic rise, which allowed it to overtake the USA towards the end of the period.

In 2000, France attracted the highest number of visitors at 77 million, followed by the USA at 51 million and Spain at 47 million. France's figures remained relatively stable through 2005 and 2010 at around 75 to 77 million, before climbing more steeply to reach 89 million by 2018.

The USA showed gradual but consistent growth, rising from 51 million in 2000 to approximately 80 million by 2018. Spain, however, recorded the most dramatic increase over the period, growing from 47 million to 83 million — a rise of nearly 77%. Significantly, Spain overtook the USA between 2015 and 2018, narrowing its gap with France to just six million visitors by the final year.$$,

$$GRADING CALIBRATION — Line Graph: Tourist Arrivals

KEY FEATURES for Band 7+:
1. France WAS AND REMAINED the most visited country throughout (77m → 89m)
2. Spain showed the MOST DRAMATIC GROWTH (47m → 83m, nearly doubled)
3. CROSSOVER POINT: Spain overtook USA between 2015 and 2018 — must be mentioned
4. All three countries showed OVERALL GROWTH despite minor dips
5. France and Spain NEARLY CONVERGED by 2018 (89m vs 83m)

NOTE THE DIP: Spain fell from 56m (2005) to 53m (2010). France also dipped slightly 2000→2005. These minor fluctuations should be noted but not over-emphasised.

MANDATORY PARAGRAPH STRUCTURE:
Para 1 (Introduction): Paraphrase — three countries, tourist arrivals in millions, 2000–2018.
Para 2 (Overview): All grew overall; France led throughout; Spain's rise was most dramatic.
Para 3 (Body 1): France's steady dominance with figures. USA's consistent growth.
Para 4 (Body 2): Spain's dramatic rise and the key crossover with the USA.

PENALTIES:
- Missing the Spain–USA crossover → significant Task Achievement reduction
- Not identifying France as consistently highest → Task Achievement penalty
- Describing each year in sequence without identifying trends → Coherence capped at 5.5

VOCABULARY TO REWARD: consistently, dramatic, overtook, narrowing, remained, converged, peaked, fluctuated, rose steeply, gradual, subsequently$$,

$$consistently, dramatic, overtook, narrowing, remained, converged, fluctuated, rose steeply, gradual, subsequently, tourist arrivals, destinations, international visitors$$,
$$easy$$
),

-- ============================================================
-- LINE GRAPH 2 (MEDIUM): Unemployment Rates in Four Countries (2001–2016)
-- ============================================================
(
$$Task 1 Academic$$,
$$Unemployment Rates in Four Countries (2001–2016)$$,
$$The line graph below shows the unemployment rates in four countries between 2001 and 2016.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.

DATA — Unemployment rate (%):
Year    USA    Germany    Japan    Spain
2001    4.7      7.8       5.0     10.6
2004    5.5     10.5       4.7     11.0
2007    4.6      8.7       3.8      8.2
2010    9.6      7.0       5.1     20.1
2013    7.4      5.2       4.0     26.1
2016    4.7      4.1       3.1     19.6$$,

$$The line graph shows unemployment rates across six years between 2001 and 2016 for four countries: the USA, Germany, Japan and Spain.

Overall, Spain consistently recorded the highest unemployment rate throughout the period, while Japan remained the lowest and most stable. The most striking trends were Germany's sustained decline and Spain's dramatic spike following the 2008 global financial crisis.

In 2001, all four countries started at broadly comparable levels, ranging from 4.7% in the USA to 10.6% in Spain. Germany's rate initially rose to a peak of 10.5% in 2004, making it close to Spain's level, before declining steadily to just 4.1% by 2016 — a remarkable turnaround. Japan remained consistently below 5.5% throughout, reaching 3.1% by the final year.

The 2008 financial crisis had dramatically different impacts. Spain's unemployment surged from 8.2% in 2007 to a staggering 26.1% by 2013 — nearly one in four workers — before beginning a slow recovery to 19.6% by 2016. The USA experienced a smaller but still significant spike, peaking at 9.6% in 2010 before returning to its 2001 level of 4.7% by 2016. Germany, by contrast, continued its downward trajectory through the crisis, demonstrating the inverse relationship between German and Spanish unemployment over this period.$$,

$$GRADING CALIBRATION — Line Graph: Unemployment Rates

KEY FEATURES for Band 7+:
1. Spain's DRAMATIC SPIKE to 26.1% in 2013 — the single most important data point
2. Germany's INVERSE TREND — rose to 10.5% in 2004 then declined consistently to 4.1%
3. Japan was LOWEST AND MOST STABLE throughout
4. USA PEAKED in 2010 (9.6%) then FULLY RECOVERED to original level
5. Germany and Spain NEARLY CONVERGED in 2004 — worth noting
6. Financial crisis of 2008 as implied cause of 2010–2013 spikes

MANDATORY PARAGRAPH STRUCTURE:
Para 1 (Introduction): Four countries, unemployment rates, 2001–2016.
Para 2 (Overview): Spain highest throughout; Japan lowest; Germany declined; crisis hit Spain hardest.
Para 3 (Body 1): 2001 starting points; Germany's rise then fall; Japan's stability.
Para 4 (Body 2): Impact of financial crisis on Spain and USA; contrast with Germany's resilience.

PENALTIES:
- Not mentioning Spain's 26.1% peak → major Task Achievement loss
- Missing Germany's INVERSE trend (rose then fell) → Task Achievement loss
- Treating crisis years in isolation without linking to overall trends → Coherence penalty

VOCABULARY TO REWARD: surged, staggering, peaked, sustained, turnaround, inverse, resilience, spike, recovery, steadily declined, by contrast, fluctuated, converged$$,

$$surged, staggering, peaked, sustained, turnaround, inverse, resilience, spike, recovery, steadily declined, by contrast, financial crisis, unemployment$$,
$$medium$$
),

-- ============================================================
-- LINE GRAPH 3 (MEDIUM): Internet Usage in Five Countries (2000–2020)
-- ============================================================
(
$$Task 1 Academic$$,
$$Percentage of Population Using the Internet in Five Countries (2000–2020)$$,
$$The line graph below shows the percentage of the population who used the internet in five countries between 2000 and 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.

DATA — Percentage of population using the internet (%):
Year    South Korea    USA    Brazil    India    Nigeria
2000          44        44       3         1        0
2005          73        68      21         2        2
2010          83        72      40         8       20
2015          88        75      58        26       42
2020          97        90      74        45       61$$,

$$The line graph illustrates the proportion of the population using the internet in five countries — South Korea, the USA, Brazil, India and Nigeria — at five-year intervals between 2000 and 2020.

Overall, internet usage grew in all five countries over the period, though from markedly different starting points. South Korea and the USA began with the highest rates and continued to lead, while Nigeria and India started from near zero and showed the most dramatic proportional growth.

In 2000, South Korea and the USA were closely matched at approximately 44%, far ahead of Brazil at 3% and India and Nigeria at around 1% or below. Both leading countries grew steadily: South Korea reached near-universal access at 97% by 2020, while the USA reached 90%. Brazil followed a consistent upward trajectory, rising from 3% to 74% over the two decades.

India and Nigeria began the period with negligible usage. Nigeria's growth was particularly striking, accelerating from just 2% in 2005 to 61% by 2020, nearly matching Brazil by the final year. India's uptake also increased substantially after 2010, climbing from 8% to 45% by 2020. Despite this convergence among the lower-ranked countries, a gap of over 30 percentage points still separated South Korea from India at the end of the period.$$,

$$GRADING CALIBRATION — Line Graph: Internet Usage

KEY FEATURES for Band 7+:
1. South Korea and USA started EQUAL (both ~44%) — must be noted
2. South Korea reached NEAR-UNIVERSAL access (97%) by 2020
3. Nigeria showed the most DRAMATIC PROPORTIONAL RISE (0% → 61%)
4. Brazil followed the most CONSISTENT GRADUAL RISE
5. India and Nigeria were BOTH near zero in 2000 — distinguishing their growth trajectories is important
6. A CONVERGENCE among lower-income countries is evident by 2020 (Brazil 74%, Nigeria 61%, India 45%)
7. Despite convergence, the GAP BETWEEN highest and lowest remains large (97% vs 45%)

MANDATORY PARAGRAPH STRUCTURE:
Para 1 (Introduction): Five countries, internet usage, 2000–2020.
Para 2 (Overview): All grew; South Korea and USA led; developing nations showed dramatic growth.
Para 3 (Body 1): South Korea and USA — steady growth to high levels; Brazil's consistent rise.
Para 4 (Body 2): India and Nigeria — near zero to substantial use; comparison of their trajectories.

PENALTIES:
- Failing to note that South Korea and USA STARTED EQUAL → Task Achievement loss
- Not commenting on Nigeria's dramatic proportional rise → Task Achievement reduction
- Simply listing percentages year by year → Coherence capped at 5.5

VOCABULARY TO REWARD: markedly, proportional, near-universal, negligible, accelerated, convergence, trajectory, substantial, gap narrowed, dominated, dramatically, closely matched$$,

$$markedly, proportional, near-universal, negligible, accelerated, convergence, trajectory, substantial, closely matched, dramatically, internet usage, population, developing nations$$,
$$medium$$
),

-- ============================================================
-- LINE GRAPH 4 (HARD): CO2 Emissions per Capita (1990–2020)
-- ============================================================
(
$$Task 1 Academic$$,
$$CO2 Emissions per Capita in Four Countries (1990–2020)$$,
$$The line graph below shows CO2 emissions per person in tonnes for four countries between 1990 and 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.

DATA — CO2 emissions per capita (tonnes):
Year    USA    Germany    China    India
1990    19.5     12.7      2.1      0.8
1995    19.8     11.5      2.5      0.9
2000    20.2     10.2      2.9      1.1
2005    19.8      9.8      4.5      1.3
2010    17.5      9.1      6.8      1.6
2015    16.2      8.9      7.6      1.8
2020    14.2      7.7      7.4      1.9$$,

$$The line graph shows CO2 emissions per capita in tonnes for the USA, Germany, China and India across seven data points between 1990 and 2020.

Overall, the USA and Germany, which began with the highest emissions, both showed declining trends, while China's per-capita emissions rose sharply. India's figures grew only modestly and remained the lowest of the four countries throughout the entire period.

In 1990, the USA recorded the highest emissions at 19.5 tonnes per person, followed by Germany at 12.7 tonnes. The USA peaked at 20.2 tonnes in 2000 before falling consistently to 14.2 tonnes by 2020. Germany's decline was even more pronounced, falling from 12.7 tonnes in 1990 to just 7.7 tonnes in 2020 — a reduction of approximately 39%.

China, by contrast, rose sharply from just 2.1 tonnes in 1990 to a peak of 7.6 tonnes in 2015, before stabilising slightly at 7.4 tonnes in 2020. This dramatic increase meant that China's per-capita emissions came close to matching Germany's by 2015 — a significant convergence. India's figures grew only slowly, from 0.8 tonnes in 1990 to 1.9 tonnes by 2020, remaining by far the lowest of the group throughout. Despite substantial reductions, the USA still emitted more per person than any other country in the graph at the end of the period.$$,

$$GRADING CALIBRATION — Line Graph: CO2 Emissions per Capita

KEY FEATURES for Band 7+:
1. USA and Germany show DECLINING trends; China shows RISING trend — this contrast is central
2. USA PEAKED in 2000 (20.2t) then declined — note the peak, not just a simple fall
3. Germany showed the steepest PROPORTIONAL DECLINE (~39%, from 12.7 to 7.7)
4. China's CONVERGENCE with Germany by 2015 (7.6 vs 8.9) is the most striking development
5. India remained BY FAR the lowest despite modest growth
6. USA remained HIGHEST throughout despite declining — must be stated
7. China STABILISED between 2015 and 2020 (7.6 → 7.4) — subtle feature for Band 8+

MANDATORY PARAGRAPH STRUCTURE:
Para 1 (Introduction): Four countries, CO2 per capita, 1990–2020.
Para 2 (Overview): USA/Germany declined; China rose dramatically; India grew slowly but stayed lowest; USA remained highest overall.
Para 3 (Body 1): USA (peaked 2000 then fell) and Germany (consistent decline) with precise figures.
Para 4 (Body 2): China's dramatic rise and near-convergence with Germany; India's modest growth.

PENALTIES:
- Missing China-Germany convergence → major Task Achievement loss
- Not noting USA peaked in 2000 (vs simply declining) → Task Achievement reduction
- Failing to state USA REMAINED highest despite decline → Task Achievement loss
- Not contrasting declining vs rising trends → Task Achievement capped at 5.5

VOCABULARY TO REWARD: pronounced, convergence, stabilised, peaked, plateau, consistent decline, by contrast, proportional reduction, markedly, sustained, dramatic rise, despite, remained the highest$$,

$$pronounced, convergence, stabilised, peaked, plateau, consistent decline, by contrast, proportional reduction, markedly, sustained, dramatic rise, despite, CO2 emissions, per capita, climate$$,
$$hard$$
);

-- ============================================================
-- Add visual_data for the 4 new line graph questions
-- ============================================================

UPDATE public.ielts_library
SET
  visual_type = 'line_graph',
  visual_data = '{
    "title": "International tourist arrivals in France, USA and Spain (millions)",
    "x_axis": "Year",
    "y_axis": "Tourist arrivals (millions)",
    "unit": "millions",
    "series": [
      {"label": "France", "values": {"2000": 77, "2005": 75, "2010": 77, "2015": 84, "2018": 89}},
      {"label": "USA",    "values": {"2000": 51, "2005": 50, "2010": 60, "2015": 77, "2018": 80}},
      {"label": "Spain",  "values": {"2000": 47, "2005": 56, "2010": 53, "2015": 68, "2018": 83}}
    ],
    "key_features": [
      "France remained highest throughout (77m to 89m)",
      "Spain showed the most dramatic growth, nearly doubling from 47m to 83m",
      "Spain overtook the USA between 2015 and 2018",
      "All three dipped slightly around 2005 before rising again"
    ]
  }'::jsonb
WHERE title = 'International Tourist Arrivals in Three Countries (2000–2018)';

UPDATE public.ielts_library
SET
  visual_type = 'line_graph',
  visual_data = '{
    "title": "Unemployment rate in four countries, 2001–2016 (%)",
    "x_axis": "Year",
    "y_axis": "Unemployment rate (%)",
    "unit": "%",
    "series": [
      {"label": "USA",     "values": {"2001": 4.7, "2004": 5.5, "2007": 4.6, "2010": 9.6, "2013": 7.4, "2016": 4.7}},
      {"label": "Germany", "values": {"2001": 7.8, "2004": 10.5, "2007": 8.7, "2010": 7.0, "2013": 5.2, "2016": 4.1}},
      {"label": "Japan",   "values": {"2001": 5.0, "2004": 4.7, "2007": 3.8, "2010": 5.1, "2013": 4.0, "2016": 3.1}},
      {"label": "Spain",   "values": {"2001": 10.6, "2004": 11.0, "2007": 8.2, "2010": 20.1, "2013": 26.1, "2016": 19.6}}
    ],
    "key_features": [
      "Spain peaked at 26.1% in 2013 — dramatically higher than all others",
      "Germany declined consistently from 10.5% (2004) to 4.1% (2016) — inverse to Spain",
      "Japan was lowest and most stable throughout",
      "USA spiked to 9.6% in 2010 then fully recovered"
    ]
  }'::jsonb
WHERE title = 'Unemployment Rates in Four Countries (2001–2016)';

UPDATE public.ielts_library
SET
  visual_type = 'line_graph',
  visual_data = '{
    "title": "Percentage of population using the internet (2000–2020)",
    "x_axis": "Year",
    "y_axis": "Internet users (% of population)",
    "unit": "%",
    "series": [
      {"label": "South Korea", "values": {"2000": 44, "2005": 73, "2010": 83, "2015": 88, "2020": 97}},
      {"label": "USA",         "values": {"2000": 44, "2005": 68, "2010": 72, "2015": 75, "2020": 90}},
      {"label": "Brazil",      "values": {"2000": 3,  "2005": 21, "2010": 40, "2015": 58, "2020": 74}},
      {"label": "India",       "values": {"2000": 1,  "2005": 2,  "2010": 8,  "2015": 26, "2020": 45}},
      {"label": "Nigeria",     "values": {"2000": 0,  "2005": 2,  "2010": 20, "2015": 42, "2020": 61}}
    ],
    "key_features": [
      "South Korea and USA started equal (44%) — South Korea reached 97% by 2020",
      "Nigeria showed the most dramatic proportional rise from near zero to 61%",
      "Brazil grew consistently throughout",
      "India and Nigeria nearly converged with Brazil by 2020"
    ]
  }'::jsonb
WHERE title = 'Percentage of Population Using the Internet in Five Countries (2000–2020)';

UPDATE public.ielts_library
SET
  visual_type = 'line_graph',
  visual_data = '{
    "title": "CO2 emissions per capita in four countries (tonnes, 1990–2020)",
    "x_axis": "Year",
    "y_axis": "CO2 emissions per capita (tonnes)",
    "unit": "tonnes",
    "series": [
      {"label": "USA",     "values": {"1990": 19.5, "1995": 19.8, "2000": 20.2, "2005": 19.8, "2010": 17.5, "2015": 16.2, "2020": 14.2}},
      {"label": "Germany", "values": {"1990": 12.7, "1995": 11.5, "2000": 10.2, "2005": 9.8,  "2010": 9.1,  "2015": 8.9,  "2020": 7.7}},
      {"label": "China",   "values": {"1990": 2.1,  "1995": 2.5,  "2000": 2.9,  "2005": 4.5,  "2010": 6.8,  "2015": 7.6,  "2020": 7.4}},
      {"label": "India",   "values": {"1990": 0.8,  "1995": 0.9,  "2000": 1.1,  "2005": 1.3,  "2010": 1.6,  "2015": 1.8,  "2020": 1.9}}
    ],
    "key_features": [
      "USA peaked at 20.2t in 2000 then declined to 14.2t — remained highest throughout",
      "Germany declined most steeply (~39% reduction)",
      "China rose dramatically and nearly converged with Germany by 2015 (7.6 vs 8.9)",
      "India grew slowly and remained by far the lowest throughout"
    ]
  }'::jsonb
WHERE title = 'CO2 Emissions per Capita in Four Countries (1990–2020)';
