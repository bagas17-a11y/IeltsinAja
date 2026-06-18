-- ============================================================
-- Seed Migration: 4 New Bar Chart Writing Task 1 Questions
-- Topics: Transport, Electric Vehicles, Household Spending,
--         Leisure Activities by Age
-- ============================================================

INSERT INTO public.ielts_library
  (task_type, title, question_prompt, model_answer_band9, ai_secret_context, target_keywords, difficulty)
VALUES

-- ============================================================
-- BAR CHART 1 (MEDIUM): Transport to Work in Three Cities (2010)
-- ============================================================
(
$$Task 1 Academic$$,
$$Transport Used to Travel to Work in Three Cities (2010)$$,
$$The bar chart below shows the percentage of workers who used different forms of transport to travel to work in Sydney, Tokyo and New York in 2010.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.

DATA — Percentage of workers using each transport mode:
                  Sydney    Tokyo    New York
Car                 58%      19%       29%
Public transport    24%      53%       49%
Cycling              8%      14%        5%
Walking             10%      14%       17%$$,

$$The bar chart compares the main modes of transport used by workers commuting to work in three cities — Sydney, Tokyo and New York — in 2010.

Overall, car use varied considerably between the three cities, with Sydney exhibiting the highest car dependency. Tokyo was notable for its exceptionally high public transport usage, while walking was most prevalent in New York.

Regarding private car use, Sydney recorded the largest proportion at 58%, more than double New York's figure of 29% and over three times Tokyo's share of just 19%. Conversely, public transport was the dominant mode in Tokyo, accounting for 53% of commuters, closely followed by New York at 49%. Sydney's public transport usage was considerably lower, at only 24%.

In terms of active travel, walking was highest in New York at 17%, compared to 14% in Tokyo and 10% in Sydney. Cycling was most common in Tokyo at 14%, followed by Sydney at 8%, while New York had the lowest cycling rate at just 5%. Overall, Sydney was the most car-dependent of the three cities, whereas Tokyo and New York relied far more heavily on public transport.$$,

$$GRADING CALIBRATION — Bar Chart: Transport in Three Cities

KEY FEATURES that MUST appear for Band 7+:
1. Sydney has the HIGHEST car use (58%) — significantly higher than other cities
2. Tokyo has the HIGHEST public transport use (53%)
3. New York has the HIGHEST walking rate (17%)
4. Tokyo has the HIGHEST cycling rate (14%)
5. Overall trend: Sydney = car-dependent; Tokyo/New York = public-transport-oriented

MANDATORY PARAGRAPH STRUCTURE:
Para 1 (Introduction): Paraphrase — three cities, four transport modes, 2010. No data.
Para 2 (Overview): Main contrast without figures — Sydney car-heavy vs Tokyo/NY public-transport-heavy.
Para 3 (Body 1): Car and public transport comparison across three cities with all figures.
Para 4 (Body 2): Cycling and walking comparison across cities.

PENALTIES:
- No clear overview → cap Task Achievement at 5.0
- Listing all values without grouping → cap Coherence at 5.5
- Not comparing cities directly → reduce Task Achievement

VOCABULARY TO REWARD: dominant, car-dependent, considerably, conversely, prevalent, closely followed by, by contrast, proportion, accounted for, notably$$,

$$dominant, car-dependent, considerably, conversely, prevalent, closely followed by, by contrast, proportion, accounted for, notably, transport modes, commuters, active travel$$,
$$medium$$
),

-- ============================================================
-- BAR CHART 2 (EASY): Electric Vehicle Sales in Five Countries (2015 and 2022)
-- ============================================================
(
$$Task 1 Academic$$,
$$Sales of Electric Vehicles in Five Countries (2015 and 2022)$$,
$$The bar chart below shows the number of electric vehicles sold in five countries in 2015 and 2022.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.

DATA — Electric vehicles sold (thousands):
           2015     2022
Norway       25      145
Germany      12      475
USA          69      762
China       186    5,920
Japan        14      120$$,

$$The bar chart illustrates the number of electric vehicles sold in five countries — Norway, Germany, the USA, China and Japan — in 2015 and 2022.

Overall, all five countries experienced considerable growth in electric vehicle sales over the period. China showed by far the most dramatic increase and was the dominant market in both years, particularly by 2022.

In 2015, China already led the group with 186,000 sales, well ahead of the USA at 69,000. The remaining three countries — Norway, Germany and Japan — each sold fewer than 25,000 vehicles, with Germany recording the lowest figure at just 12,000.

By 2022, the differences between countries had widened enormously. China's sales surged to approximately 5,920,000 — more than thirty times its 2015 figure — making it by far the world's largest electric vehicle market. The USA was the second largest at 762,000, followed by Germany at 475,000. Norway and Japan recorded more modest growth, reaching 145,000 and 120,000 respectively. Japan showed the least growth in percentage terms of all five countries.$$,

$$GRADING CALIBRATION — Bar Chart: Electric Vehicle Sales

KEY FEATURES for Band 7+:
1. China's EXTRAORDINARY growth — from 186,000 to 5,920,000 (over 30 times increase) — by far the most important trend
2. ALL five countries grew significantly
3. USA was the second largest market in 2022 (762,000)
4. Japan showed the LEAST growth in relative terms
5. Germany went from the LOWEST to the THIRD largest by 2022

MANDATORY PARAGRAPH STRUCTURE:
Para 1 (Introduction): Paraphrase the chart — five countries, EV sales, two years.
Para 2 (Overview): All countries grew; China dominated and showed the most dramatic rise.
Para 3 (Body 1): 2015 figures — China already ahead, USA second, others small.
Para 4 (Body 2): 2022 figures — China's surge, USA/Germany growth, Japan/Norway modest.

PENALTIES:
- Missing China's 30x growth as the headline trend → significant Task Achievement penalty
- Not grouping 2015 vs 2022 clearly → Coherence penalty

VOCABULARY TO REWARD: surged, dramatically, dominated, more than thirty times, considerably, modest, by far, remarkably, significant growth, widened, lagged behind$$,

$$surged, dramatically, dominated, thirty times, considerably, modest, by far, remarkable, significant growth, widened, electric vehicles, sales figures$$,
$$easy$$
),

-- ============================================================
-- BAR CHART 3 (HARD): Weekly Household Spending by Region (2019)
-- ============================================================
(
$$Task 1 Academic$$,
$$Average Weekly Household Spending by Region (2019)$$,
$$The bar chart below shows average weekly household expenditure in US dollars across five categories in four world regions in 2019.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.

DATA — Average weekly household spending (USD):
              Europe    N. America    Asia    Africa
Food            $95        $115       $62      $38
Housing        $380        $490      $180      $75
Transport      $120        $210       $85      $42
Health          $65        $185       $40      $18
Education       $45         $75       $60      $25$$,

$$The bar chart shows average weekly household spending across five categories — food, housing, transport, health and education — in Europe, North America, Asia and Africa in 2019.

Overall, housing was the largest expenditure category in every region. North America spent the most across all five categories, while Africa consistently recorded the lowest figures.

In terms of housing, North American households allocated approximately $490 per week, considerably more than Europe at $380 and substantially more than Asia ($180) and Africa ($75). Transport followed a similar pattern, with North America at $210, Europe at $120, Asia at $85 and Africa at $42.

The greatest regional disparity was observed in health spending. North American households spent around $185 weekly on healthcare — nearly three times the European figure of $65, more than four times Asia's $40, and over ten times Africa's $18. Food expenditure showed smaller relative differences, with North America spending $115 and Africa $38. Education spending was the most evenly distributed category, with figures ranging narrowly from $25 in Africa to $75 in North America, though Asia's $60 was relatively high compared to its spending in other categories.$$,

$$GRADING CALIBRATION — Bar Chart: Household Spending by Region

KEY FEATURES for Band 7+:
1. Housing is the LARGEST category in ALL regions — must state this in overview
2. North America LEADS in all categories; Africa is LOWEST in all
3. Health spending disparity is the MOST DRAMATIC difference (North America $185 vs Africa $18 — 10:1 ratio)
4. Education is the most CONSISTENT/EVENLY DISTRIBUTED category
5. Asia's education ($60) is relatively high compared to its other spending categories

MANDATORY PARAGRAPH STRUCTURE:
Para 1 (Introduction): Paraphrase — four regions, five spending categories, 2019.
Para 2 (Overview): Housing largest everywhere; North America highest overall; Africa lowest.
Para 3 (Body 1): Housing and transport — clear hierarchical pattern across all four regions.
Para 4 (Body 2): Health (biggest disparity), food (moderate), education (most even).

PENALTIES:
- No overview/failing to identify housing as dominant → Task Achievement capped at 5.5
- Listing all 20 figures without grouping or comparison → Coherence capped at 5.0
- Missing the health disparity as a notable feature → reduce Task Achievement

VOCABULARY TO REWARD: allocated, disparity, consistently, considerably, substantially, by contrast, in terms of, dominated, relatively, proportionally, expenditure, accounted for, evenly distributed$$,

$$allocated, disparity, consistently, considerably, substantially, dominated, relatively, proportionally, expenditure, accounted for, evenly distributed, regional differences, household spending$$,
$$hard$$
),

-- ============================================================
-- BAR CHART 4 (MEDIUM): Leisure Activity Participation by Age Group (UK, 2018)
-- ============================================================
(
$$Task 1 Academic$$,
$$Participation in Leisure Activities by Age Group in the UK (2018)$$,
$$The bar chart below shows the percentage of people in four age groups in the UK who participated in five leisure activities in 2018.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.

DATA — Percentage who participated in the activity in the last month:
                  16–24    25–44    45–64    65+
Sport/exercise      72%      54%      41%    28%
Reading             45%      52%      65%    73%
Gardening            8%      25%      48%    61%
Arts and crafts     22%      28%      32%    35%
Computer games      68%      38%      18%     9%$$,

$$The bar chart shows the proportion of UK residents across four age groups who took part in five leisure activities in 2018.

Overall, participation in sport and computer games declined with age, while reading and gardening became more popular among older age groups. Arts and crafts showed the least variation across age groups.

Sport and exercise was the most widely practised activity among those aged 16–24, with 72% participating. However, participation fell steadily with age, dropping to 54% for 25–44 year olds and reaching only 28% among those aged 65 and over. Computer games followed a similar but more dramatic pattern, declining sharply from 68% in the youngest group to just 9% among the elderly.

Conversely, reading and gardening were most popular among older participants. Reading rose from 45% among 16–24 year olds to 73% in the 65 and over group, while gardening participation increased even more steeply, from just 8% to 61% over the same age range. Arts and crafts was the most consistently practised activity, with participation rising only gradually from 22% to 35% across the four age groups.$$,

$$GRADING CALIBRATION — Bar Chart: Leisure Activities by Age

KEY FEATURES for Band 7+:
1. Sport/exercise DECLINES with age (72% → 28%) — must be mentioned
2. Computer games show the MOST DRAMATIC AGE-RELATED DECLINE (68% → 9%)
3. Reading INCREASES with age (45% → 73%)
4. Gardening shows the MOST DRAMATIC INCREASE with age (8% → 61%)
5. Arts and crafts is the MOST CONSISTENT activity across age groups (22% → 35%)

OVERVIEW REQUIREMENT:
Must contrast young-age activities (sport, computer games) vs older-age activities (reading, gardening), with arts and crafts as the anomaly.

MANDATORY PARAGRAPH STRUCTURE:
Para 1 (Introduction): Paraphrase — four age groups, five activities, UK, 2018.
Para 2 (Overview): Younger = sport/games; older = reading/gardening; arts consistent.
Para 3 (Body 1): Sport and computer games (declining trend with exact figures).
Para 4 (Body 2): Reading and gardening (increasing trend) + arts and crafts (stable).

PENALTIES:
- Treating each activity separately without identifying AGE TRENDS → cap Coherence at 5.5
- No overview identifying the dominant pattern → cap Task Achievement at 5.0
- Missing gardening's dramatic rise (8% → 61%) → reduce Task Achievement

VOCABULARY TO REWARD: declined, dropped, rose, increased, conversely, steeply, steadily, consistently, dramatic, similarly, by contrast, participation, proportion, age groups$$,

$$declined, dropped, rose, increased, conversely, steeply, steadily, consistently, dramatic, similarly, participation, proportion, age groups, leisure activities, elderly$$,
$$medium$$
);

-- ============================================================
-- Add visual_data for the 4 new bar chart questions
-- ============================================================

UPDATE public.ielts_library
SET
  visual_type = 'bar_chart',
  visual_data = '{
    "title": "Percentage of workers using each transport mode to commute (2010)",
    "x_axis": "Transport Mode",
    "y_axis": "Percentage of workers (%)",
    "unit": "%",
    "series": [
      {"label": "Sydney",   "values": {"Car": 58, "Public transport": 24, "Cycling": 8,  "Walking": 10}},
      {"label": "Tokyo",    "values": {"Car": 19, "Public transport": 53, "Cycling": 14, "Walking": 14}},
      {"label": "New York", "values": {"Car": 29, "Public transport": 49, "Cycling": 5,  "Walking": 17}}
    ],
    "key_features": [
      "Sydney has highest car use (58%) — over three times Tokyo",
      "Tokyo has highest public transport use (53%)",
      "New York has highest walking rate (17%)",
      "Tokyo and Sydney share highest cycling rate (14% and 8%)"
    ]
  }'::jsonb
WHERE title = 'Transport Used to Travel to Work in Three Cities (2010)';

UPDATE public.ielts_library
SET
  visual_type = 'bar_chart',
  visual_data = '{
    "title": "Electric vehicles sold in five countries (thousands)",
    "x_axis": "Country",
    "y_axis": "Vehicles sold (thousands)",
    "unit": "thousands",
    "series": [
      {"label": "2015", "values": {"Norway": 25, "Germany": 12, "USA": 69, "China": 186,  "Japan": 14}},
      {"label": "2022", "values": {"Norway": 145, "Germany": 475, "USA": 762, "China": 5920, "Japan": 120}}
    ],
    "key_features": [
      "China surged from 186,000 to 5,920,000 — over 30 times growth",
      "USA was second largest in 2022 at 762,000",
      "Germany grew from the smallest to third largest",
      "Japan showed the least relative growth of all five countries"
    ]
  }'::jsonb
WHERE title = 'Sales of Electric Vehicles in Five Countries (2015 and 2022)';

UPDATE public.ielts_library
SET
  visual_type = 'bar_chart',
  visual_data = '{
    "title": "Average weekly household spending by region (USD, 2019)",
    "x_axis": "Spending Category",
    "y_axis": "Average weekly spending (USD)",
    "unit": "USD",
    "series": [
      {"label": "Europe",      "values": {"Food": 95,  "Housing": 380, "Transport": 120, "Health": 65,  "Education": 45}},
      {"label": "N. America",  "values": {"Food": 115, "Housing": 490, "Transport": 210, "Health": 185, "Education": 75}},
      {"label": "Asia",        "values": {"Food": 62,  "Housing": 180, "Transport": 85,  "Health": 40,  "Education": 60}},
      {"label": "Africa",      "values": {"Food": 38,  "Housing": 75,  "Transport": 42,  "Health": 18,  "Education": 25}}
    ],
    "key_features": [
      "Housing is the largest category in all four regions",
      "North America spends most across all five categories",
      "Health disparity is the most extreme: North America $185 vs Africa $18",
      "Education spending is the most evenly distributed category"
    ]
  }'::jsonb
WHERE title = 'Average Weekly Household Spending by Region (2019)';

UPDATE public.ielts_library
SET
  visual_type = 'bar_chart',
  visual_data = '{
    "title": "Percentage participating in leisure activities by age group (UK, 2018)",
    "x_axis": "Leisure Activity",
    "y_axis": "Percentage participating (%)",
    "unit": "%",
    "series": [
      {"label": "16-24", "values": {"Sport/exercise": 72, "Reading": 45, "Gardening": 8,  "Arts and crafts": 22, "Computer games": 68}},
      {"label": "25-44", "values": {"Sport/exercise": 54, "Reading": 52, "Gardening": 25, "Arts and crafts": 28, "Computer games": 38}},
      {"label": "45-64", "values": {"Sport/exercise": 41, "Reading": 65, "Gardening": 48, "Arts and crafts": 32, "Computer games": 18}},
      {"label": "65+",   "values": {"Sport/exercise": 28, "Reading": 73, "Gardening": 61, "Arts and crafts": 35, "Computer games": 9}}
    ],
    "key_features": [
      "Sport and computer games decline sharply with age",
      "Gardening rises dramatically with age (8% to 61%)",
      "Reading increases steadily with age (45% to 73%)",
      "Arts and crafts is the most consistent activity across all age groups"
    ]
  }'::jsonb
WHERE title = 'Participation in Leisure Activities by Age Group in the UK (2018)';
