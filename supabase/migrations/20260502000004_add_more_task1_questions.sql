-- ============================================================
-- Additional Task 1 question bank: pie charts and tables
-- Sources: Cambridge IELTS Academic series, IELTS Liz
-- ============================================================

INSERT INTO public.ielts_library
  (task_type, title, question_prompt, model_answer_band9,
   ai_secret_context, target_keywords, visual_type, visual_data, difficulty)
VALUES

-- ============================================================
-- TABLE 1: Consumer Expenditure in Five Countries (2002)
-- Classic Cambridge IELTS 4, Test 3, Task 1
-- ============================================================
(
$$Task 1 Academic$$,
$$Consumer Expenditure in Five Countries (2002)$$,
$$The table below shows the percentage of household income spent on food and drinks, clothing and footwear, and leisure and education in five countries in 2002.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.$$,

$$The table illustrates how households in five countries distributed their spending across three categories — food and drinks, clothing and footwear, and leisure and education — in 2002.

Overall, food and drinks accounted for the largest share of expenditure in every country, while leisure and education consistently represented the smallest proportion. Sweden stands out as a clear outlier, spending considerably less on food than any other nation.

Regarding food and drinks, Italy recorded the highest proportion at 33.9%, closely followed by Turkey (32.1%) and Spain (29.4%). Ireland spent slightly less at 28.9%, while Sweden allocated only 15.8% to this category — roughly half the European average.

In terms of clothing and footwear, Italy again led the group at 9.0%, with Spain second at 8.5%. The remaining three countries — Turkey, Ireland, and Sweden — each spent between 5.4% and 6.7%.

Expenditure on leisure and education was modest across all nations, ranging from 1.8% in Spain to 4.1% in Turkey. Ireland, Italy, and Sweden were clustered between 3.2% and 3.7%, while Spain remained the lowest spender in this category by a notable margin.$$,

$$Classic Cambridge IELTS 4 consumer spending table. Must check: (1) Overview identifying food as dominant category AND Sweden as outlier — both required for Band 7+. (2) Accurate data: Italy 33.9% food (highest), Sweden 15.8% food (lowest), Spain 1.8% leisure (lowest), Turkey 4.1% leisure (highest), Italy 9.0% clothing (highest). (3) Candidate should group by category, not list each country separately. Band 9: clear overview, accurate data, cohesive grouping, rich vocabulary. Penalise: mechanical listing of all data without grouping; missing Sweden outlier; no overview; under 150 words.$$,

$$expenditure, allocate, proportion, account for, category, consistently, outlier, approximately, clustered, modest, notable margin, distributed, closely followed by, in terms of, with regard to, respectively, domestic spending$$,

$$table$$,
$${
  "title": "Percentage of Household Income Spent on Selected Categories in Five Countries (2002)",
  "unit": "%",
  "columns": ["Food & Drinks", "Clothing & Footwear", "Leisure & Education"],
  "series": [
    {"label": "Ireland", "values": {"Food & Drinks": 28.9, "Clothing & Footwear": 6.4, "Leisure & Education": 3.7}},
    {"label": "Italy",   "values": {"Food & Drinks": 33.9, "Clothing & Footwear": 9.0, "Leisure & Education": 3.4}},
    {"label": "Spain",   "values": {"Food & Drinks": 29.4, "Clothing & Footwear": 8.5, "Leisure & Education": 1.8}},
    {"label": "Sweden",  "values": {"Food & Drinks": 15.8, "Clothing & Footwear": 5.4, "Leisure & Education": 3.2}},
    {"label": "Turkey",  "values": {"Food & Drinks": 32.1, "Clothing & Footwear": 6.7, "Leisure & Education": 4.1}}
  ],
  "key_features": [
    "Food & Drinks is the largest category in all five countries",
    "Sweden is the clear outlier — only 15.8% on food vs 29–34% for others",
    "Italy leads in both food (33.9%) and clothing (9.0%)",
    "Spain has the lowest leisure/education spend (1.8%)",
    "Turkey has the highest leisure/education spend (4.1%)"
  ]
}$$::jsonb,
$$medium$$
),

-- ============================================================
-- TABLE 2: Indian Students at British Universities (2020–2022)
-- IELTS Liz model answer question
-- ============================================================
(
$$Task 1 Academic$$,
$$Indian Students at British Universities (2020–2022)$$,
$$The table below shows the number of full-time Indian students enrolled at six British universities in 2020/21 and 2021/22, along with the numerical and percentage changes.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.$$,

$$The table details the number of full-time Indian students at six British universities in 2020/21 and 2021/22, along with the absolute and proportional changes between the two years.

Overall, every institution saw an increase in Indian student numbers, though the scale of growth varied substantially. Coventry University experienced by far the most dramatic rise, while Anglia Ruskin University recorded the most modest gain.

Coventry's enrolment more than doubled, surging from 2,385 to 5,290 students — an extraordinary increase of 121.8%. Sheffield and Leicester followed with near-identical growth of approximately 87%, reaching 2,345 and 1,675 students respectively. Greenwich also achieved strong expansion, growing by 51.4% to 2,165 students.

By contrast, BPP University and Anglia Ruskin recorded the smallest proportional gains. BPP grew by 46.8%, adding 505 students, while Anglia Ruskin posted the lowest percentage increase of all six institutions at just 39.7%.

In summary, all universities demonstrated growth, pointing to a broad upward trend in Indian student participation in British higher education.$$,

$$IELTS Liz model answer question — Indian students at British universities. Must check: (1) Overview must note ALL universities grew AND Coventry most dramatic. (2) Precise data: Coventry 121.8% (most dramatic, more than doubled); Sheffield 87.6% and Leicester 87.1% comparable; Anglia Ruskin 39.7% (lowest). (3) Candidate should group universities by growth tier, not list mechanically. (4) Distinguish absolute change from percentage change. Band 9 language: "more than doubled", "comparable", "by contrast". Penalise: ignoring Coventry outlier; listing all numbers without grouping; under 150 words; confusing absolute and percentage figures.$$,

$$enrolment, dramatic growth, more than doubled, surging, consecutive, comparable, magnitude, proportional, modest, by contrast, extraordinary, participation, higher education, expansion, respectively, broad trend, absolute, institutional$$,

$$table$$,
$${
  "title": "Full-time Indian Students at Six British Universities (2020/21 vs 2021/22)",
  "unit": "students / %",
  "columns": ["2020/21", "2021/22", "Change", "% Change"],
  "series": [
    {"label": "Coventry",      "values": {"2020/21": "2,385", "2021/22": "5,290", "Change": "+2,905", "% Change": "+121.8%"}},
    {"label": "Greenwich",     "values": {"2020/21": "1,430", "2021/22": "2,165", "Change": "+735",   "% Change": "+51.4%"}},
    {"label": "BPP",           "values": {"2020/21": "1,075", "2021/22": "1,580", "Change": "+505",   "% Change": "+46.8%"}},
    {"label": "Sheffield",     "values": {"2020/21": "1,250", "2021/22": "2,345", "Change": "+1,095", "% Change": "+87.6%"}},
    {"label": "Leicester",     "values": {"2020/21": "895",   "2021/22": "1,675", "Change": "+780",   "% Change": "+87.1%"}},
    {"label": "Anglia Ruskin", "values": {"2020/21": "1,560", "2021/22": "2,180", "Change": "+620",   "% Change": "+39.7%"}}
  ],
  "key_features": [
    "Coventry most dramatic — over 121% growth (more than doubled)",
    "Sheffield (87.6%) and Leicester (87.1%) nearly identical growth",
    "Anglia Ruskin smallest percentage increase (39.7%)",
    "All six universities showed growth — broad upward trend"
  ]
}$$::jsonb,
$$medium$$
),

-- ============================================================
-- TABLE 3: International Tourist Arrivals by World Region (2000–2010)
-- ============================================================
(
$$Task 1 Academic$$,
$$International Tourist Arrivals by World Region (2000–2010)$$,
$$The table below shows the number of international tourist arrivals (in millions) in six world regions in 2000, 2005, and 2010.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.$$,

$$The table shows international tourist arrivals across six global regions over a ten-year period from 2000 to 2010.

Overall, Europe dominated tourist arrivals throughout the period, though Asia and the Pacific experienced the most rapid growth. Every region recorded increases, and the global total rose substantially from 690 million to 944 million.

Europe remained the world's most visited region by a wide margin, with arrivals climbing steadily from 395 million in 2000 to 475 million by 2010. The Americas held second place throughout, though growth was comparatively subdued — rising from 128 to 150 million.

In contrast, Asia and the Pacific saw the most dramatic expansion, nearly doubling from 110 million to 204 million visitors over the decade. The Middle East and Africa also posted notable gains, with arrivals in both regions approximately doubling, albeit from much lower starting points of 24 and 27 million respectively.

South Asia remained the smallest region, yet grew consistently from 6 to 12 million — also doubling across the same period.$$,

$$International tourist arrivals table covering six regions over 10 years. Must check: (1) Overview identifies Europe as dominant AND Asia-Pacific as fastest-growing — both required for Band 7+. (2) Accurate data: Europe 395M → 475M (largest absolute), Asia-Pacific 110M → 204M (nearly doubled, fastest proportional growth), global total 690M → 944M. (3) Middle East (24M → 54M) and Africa (27M → 49M) also approximately doubled. (4) South Asia smallest (6M → 12M, doubled). (5) Americas slow growth (128M → 150M). Band 9: groups regions by growth tier, uses "albeit", "comparatively subdued", "by a wide margin". Penalise: listing all figures without grouping; missing Asia-Pacific trend; no overview.$$,

$$dominated, dramatic expansion, comparatively subdued, notably, approximately doubled, albeit, from lower starting points, consistently, steady growth, wide margin, substantial increase, global total, most visited, rapid growth, decade, proportional$$,

$$table$$,
$${
  "title": "International Tourist Arrivals by World Region (millions)",
  "unit": "millions",
  "columns": ["2000", "2005", "2010"],
  "series": [
    {"label": "Europe",         "values": {"2000": 395, "2005": 440, "2010": 475}},
    {"label": "Americas",       "values": {"2000": 128, "2005": 133, "2010": 150}},
    {"label": "Asia & Pacific", "values": {"2000": 110, "2005": 154, "2010": 204}},
    {"label": "Middle East",    "values": {"2000": 24,  "2005": 37,  "2010": 54}},
    {"label": "Africa",         "values": {"2000": 27,  "2005": 35,  "2010": 49}},
    {"label": "South Asia",     "values": {"2000": 6,   "2005": 9,   "2010": 12}}
  ],
  "key_features": [
    "Europe dominates with 395M → 475M (largest absolute numbers)",
    "Asia & Pacific fastest growing — nearly doubled (110M → 204M)",
    "Middle East and Africa also approximately doubled from smaller bases",
    "Global total rose from 690M to 944M",
    "South Asia smallest region, doubled (6M → 12M)"
  ]
}$$::jsonb,
$$medium$$
),

-- ============================================================
-- TABLE 4: Visits to Six UK Free Museums (2009 and 2014)
-- ============================================================
(
$$Task 1 Academic$$,
$$Visits to UK Free Museums (2009 and 2014)$$,
$$The table below shows the number of visits (in thousands) to six major free museums in the United Kingdom in 2009 and 2014, along with the percentage change.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.$$,

$$The table provides data on visitor numbers to six free museums in the United Kingdom in 2009 and 2014, including the proportional change over this five-year period.

Overall, all six museums attracted more visitors in 2014 than in 2009, with Tate Modern recording the most dramatic percentage growth. The British Museum remained the most visited institution in both years.

The British Museum led in absolute visitor numbers throughout, rising from 5,569 thousand to 6,697 thousand — a 20.3% increase. The National Gallery ranked second in both years, growing from 4,726 to 5,908 thousand visitors, a gain of 25%.

In terms of proportional growth, Tate Modern was the standout performer, with numbers rising by 71.7% from 2,844 to 4,884 thousand. The V&A Museum also expanded considerably, achieving a 51.1% increase, while the Natural History Museum grew strongly by 40.2% to reach 5,256 thousand.

By contrast, the Science Museum recorded the smallest percentage gain at 23.7%, though even this represented a solid increase. The consistent growth across all institutions suggests a broad rise in public engagement with cultural attractions during the period.$$,

$$UK free museum visits table. Must check: (1) Overview identifies all grew AND Tate Modern most dramatic. (2) British Museum largest absolute numbers (5,569k → 6,697k). (3) Tate Modern highest proportional growth (71.7% — nearly doubled). (4) V&A 51.1% and Natural History Museum 40.2% also notable. (5) Science Museum smallest growth at 23.7%. (6) Candidate should group by performance tier. Band 9 language: "standout performer", "by contrast", "consistent growth", "broad rise". Penalise: listing all data mechanically; missing Tate Modern as growth leader; no overview.$$,

$$visitor numbers, proportional, standout performer, dramatic growth, nearly doubled, consistent growth, cultural attractions, public engagement, absolute figures, in terms of proportional growth, by contrast, ranking, institution, solid increase$$,

$$table$$,
$${
  "title": "Visits to Six Major Free UK Museums (thousands)",
  "unit": "thousands",
  "columns": ["2009", "2014", "% Change"],
  "series": [
    {"label": "British Museum",        "values": {"2009": 5569, "2014": 6697, "% Change": "+20.3%"}},
    {"label": "National Gallery",      "values": {"2009": 4726, "2014": 5908, "% Change": "+25.0%"}},
    {"label": "Tate Modern",           "values": {"2009": 2844, "2014": 4884, "% Change": "+71.7%"}},
    {"label": "Natural History Museum","values": {"2009": 3749, "2014": 5256, "% Change": "+40.2%"}},
    {"label": "V&A Museum",            "values": {"2009": 2272, "2014": 3432, "% Change": "+51.1%"}},
    {"label": "Science Museum",        "values": {"2009": 2718, "2014": 3361, "% Change": "+23.7%"}}
  ],
  "key_features": [
    "British Museum largest in absolute terms (5,569k → 6,697k)",
    "Tate Modern highest proportional growth (71.7% — nearly doubled)",
    "V&A Museum second in growth (51.1%)",
    "Science Museum smallest growth (23.7%)",
    "All six museums grew — broad rise in cultural engagement"
  ]
}$$::jsonb,
$$medium$$
),

-- ============================================================
-- PIE CHART 1: Household Expenditure in the UK (2001 vs 2011)
-- ============================================================
(
$$Task 1 Academic$$,
$$Household Expenditure in the UK (2001 vs 2011)$$,
$$The pie charts below show the proportion of household income spent on different categories in the United Kingdom in 2001 and 2011.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.$$,

$$The two pie charts illustrate how UK households allocated their income across six spending categories in 2001 and 2011.

Overall, housing was the largest single expenditure in both years and grew further over the decade, while clothing and transport both declined. Food and drink remained the second largest category throughout.

In 2001, housing accounted for 32% of household spending, followed by food and drink at 22%, and transport at 16%. Recreation made up 13%, while clothing (9%) and other spending (8%) represented the smallest shares.

By 2011, housing had risen to 38% — a significant increase of six percentage points — suggesting rising property and rental costs. Recreation also grew modestly, from 13% to 15%. In contrast, clothing fell from 9% to 6%, and transport declined from 16% to 14%, possibly reflecting greater fuel efficiency and a shift to public transport.

Food and drink remained relatively stable, decreasing only slightly from 22% to 20%, while other spending dropped from 8% to 7%.$$,

$$UK household expenditure pie chart (2001 vs 2011). Must check: (1) Overview: housing largest and grew; clothing declined — both required for Band 7+. (2) Housing: 32% → 38% (biggest change — +6pp). (3) Recreation: 13% → 15% (grew). (4) Clothing: 9% → 6% (fell). (5) Transport: 16% → 14% (fell). (6) Food: 22% → 20% (stable/slight decrease). (7) Candidate should compare 2001 vs 2011 for each category, not just describe each chart separately. Band 9: uses "percentage points", "proportion", "in contrast", speculation about reasons. Penalise: describing charts separately without comparison; missing housing growth; no overview.$$,

$$proportion, allocation, account for, percentage points, in contrast, relatively stable, significant increase, declining, suggesting, expenditure, household income, category, distribution, over the decade, grew modestly, fell sharply$$,

$$pie_chart$$,
$${
  "title": "Proportion of Household Income Spent on Different Categories in the UK",
  "unit": "%",
  "charts": [
    {
      "label": "2001",
      "segments": {
        "Housing": 32,
        "Food & Drink": 22,
        "Transport": 16,
        "Recreation": 13,
        "Clothing": 9,
        "Other": 8
      }
    },
    {
      "label": "2011",
      "segments": {
        "Housing": 38,
        "Food & Drink": 20,
        "Transport": 14,
        "Recreation": 15,
        "Clothing": 6,
        "Other": 7
      }
    }
  ],
  "key_features": [
    "Housing grew from 32% to 38% — biggest change (+6 percentage points)",
    "Clothing fell from 9% to 6%",
    "Transport declined from 16% to 14%",
    "Recreation grew modestly from 13% to 15%",
    "Food & Drink relatively stable (22% → 20%)"
  ]
}$$::jsonb,
$$medium$$
),

-- ============================================================
-- PIE CHART 2: Why Students Choose to Study Abroad (UG vs PG)
-- ============================================================
(
$$Task 1 Academic$$,
$$Reasons Students Choose to Study Abroad: Undergraduates vs Postgraduates$$,
$$The pie charts below show the main reasons given by undergraduate and postgraduate students for choosing to study abroad.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.$$,

$$The two pie charts compare the motivations of undergraduate and postgraduate students when deciding to study abroad.

Overall, the two groups showed markedly different priorities. Undergraduates were primarily motivated by cultural experience, whereas career prospects dominated among postgraduates. Both groups placed similar weight on academic reputation.

Among undergraduates, cultural experience was the leading reason at 35%, followed by career prospects at 28% and academic reputation at 20%. Language learning accounted for 12%, while other reasons made up the remaining 5%.

The postgraduate picture was quite different. Career prospects became the dominant motivation at 42%, with academic reputation rising to 30% — together accounting for nearly three-quarters of responses. Cultural experience fell sharply to 15%, and language learning dropped to just 8%. Other reasons remained unchanged at 5%.

In summary, as students progress from undergraduate to postgraduate level, their motivations become increasingly career and academically focused, while the importance of cultural immersion and language acquisition diminishes considerably.$$,

$$Pie chart comparing motivations for studying abroad at UG vs PG level. Must check: (1) Overview contrasting UG (cultural experience dominant) vs PG (career prospects dominant). (2) UG data: Cultural experience 35%, Career 28%, Academic rep 20%, Language 12%, Other 5%. (3) PG data: Career 42%, Academic rep 30%, Cultural 15%, Language 8%, Other 5%. (4) Candidate must compare the two charts, not describe each separately. (5) Key trends: cultural experience 35% → 15% (sharp drop); career 28% → 42% (rise); academic rep 20% → 30% (rise). Band 9: observes the overall shift in priority with level of study; uses "markedly different", "dominant", "sharply". Penalise: describing each chart separately without cross-chart comparison; missing the main contrast; under 150 words.$$,

$$markedly different, dominant, priorities, motivations, by contrast, sharply, cultural immersion, academic reputation, career prospects, diminishes, considerable, cross-chart comparison, undergraduate, postgraduate, whereas, increasingly$$,

$$pie_chart$$,
$${
  "title": "Main Reasons for Choosing to Study Abroad",
  "unit": "%",
  "charts": [
    {
      "label": "Undergraduates",
      "segments": {
        "Cultural experience": 35,
        "Career prospects": 28,
        "Academic reputation": 20,
        "Language learning": 12,
        "Other": 5
      }
    },
    {
      "label": "Postgraduates",
      "segments": {
        "Career prospects": 42,
        "Academic reputation": 30,
        "Cultural experience": 15,
        "Language learning": 8,
        "Other": 5
      }
    }
  ],
  "key_features": [
    "Undergraduates led by cultural experience (35%); postgraduates by career prospects (42%)",
    "Cultural experience fell sharply: 35% → 15%",
    "Career prospects rose from 28% to 42%",
    "Academic reputation also rose: 20% → 30%",
    "Language learning declined: 12% → 8%"
  ]
}$$::jsonb,
$$medium$$
),

-- ============================================================
-- PIE CHART 3: Transport to Work in a European City (1995 vs 2015)
-- ============================================================
(
$$Task 1 Academic$$,
$$Transport Used to Commute to Work in a European City (1995 vs 2015)$$,
$$The pie charts below show the modes of transport used by workers to commute to work in a European city in 1995 and 2015.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.$$,

$$The two pie charts compare how workers commuted to their workplace in a European city in 1995 and 2015, revealing significant shifts in transport preferences over the twenty-year period.

Overall, private car use declined considerably, while cycling and public transport gained share. The private car remained the most common mode in both years, though its dominance clearly weakened.

In 1995, the private car accounted for 55% of all commutes, making it by far the most prevalent mode. Public transport followed at 25%, with cycling at 10% and walking at 8%. Other modes represented just 2%.

By 2015, the picture had changed noticeably. Car use fell to 38%, a reduction of 17 percentage points. In contrast, cycling nearly doubled to 18%, and public transport grew to 32%. Walking also increased slightly to 10%, while other modes remained unchanged.

These changes suggest a broad shift towards more sustainable transport options, possibly driven by improved cycling infrastructure, higher fuel costs, or government policy encouraging greener commuting.$$,

$$Transport mode pie chart comparing 1995 vs 2015. Must check: (1) Overview: car declined; cycling and public transport grew — both required. (2) Car: 55% → 38% (-17 percentage points) — largest absolute change. (3) Cycling: 10% → 18% (nearly doubled). (4) Public transport: 25% → 32% (+7 pp). (5) Walking: 8% → 10% (slight increase). (6) Must compare cross-charts, not describe each separately. Band 9: uses "percentage points", "nearly doubled", suggests reasons for change. Penalise: no cross-chart comparison; missing car decline trend; no overview.$$,

$$commute, modes of transport, proportion, declined, considerably, percentage points, in contrast, nearly doubled, sustainable, infrastructure, prevalent, dominance, weakened, shift, green transport, private car, public transport, cycling$$,

$$pie_chart$$,
$${
  "title": "Modes of Transport Used to Commute to Work in a European City",
  "unit": "%",
  "charts": [
    {
      "label": "1995",
      "segments": {
        "Private car": 55,
        "Public transport": 25,
        "Cycling": 10,
        "Walking": 8,
        "Other": 2
      }
    },
    {
      "label": "2015",
      "segments": {
        "Private car": 38,
        "Public transport": 32,
        "Cycling": 18,
        "Walking": 10,
        "Other": 2
      }
    }
  ],
  "key_features": [
    "Private car fell from 55% to 38% (–17 percentage points)",
    "Cycling nearly doubled: 10% → 18%",
    "Public transport grew: 25% → 32%",
    "Walking increased slightly: 8% → 10%",
    "Shift towards sustainable transport options over 20 years"
  ]
}$$::jsonb,
$$medium$$
),

-- ============================================================
-- PIE CHART 4: Waste Composition in a City (2000 vs 2020)
-- ============================================================
(
$$Task 1 Academic$$,
$$Waste Composition in a City (2000 vs 2020)$$,
$$The pie charts below show the composition of waste produced in a city in 2000 and 2020.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.$$,

$$The two pie charts illustrate how the composition of municipal waste in a city changed between 2000 and 2020.

Overall, food waste remained the largest category in both years, but its share declined. The most striking change was the dramatic rise in plastic waste, which almost doubled over the two-decade period.

In 2000, food waste made up the largest proportion at 38%, followed by paper and cardboard at 32%, and plastic at 14%. Metal and glass each accounted for roughly 8% and 6% respectively, while other waste contributed only 2%.

By 2020, the composition had shifted considerably. Plastic waste surged to 26%, an increase of 12 percentage points, likely reflecting growing plastic consumption and packaging trends. Paper and cardboard declined from 32% to 22%, possibly due to greater digitalisation. Food waste also fell to 30%, though it remained the single largest category.

Metal and glass remained relatively stable at 7% and 5%, while other waste grew slightly to 10%, suggesting a diversification of waste types over the period.$$,

$$Municipal waste composition pie chart (2000 vs 2020). Must check: (1) Overview: food waste largest in both years; plastic surged — both required for Band 7+. (2) Plastic: 14% → 26% (almost doubled, +12 pp) — most dramatic change. (3) Paper: 32% → 22% (-10 pp, significant decline). (4) Food waste: 38% → 30% (declined but still largest). (5) Metal and glass relatively stable. (6) Other: 2% → 10% (grew). Band 9: uses "most striking", "surged", "almost doubled", reasons for change (digitalisation, packaging trends). Penalise: describing each chart separately; missing plastic surge; no overview.$$,

$$composition, municipal waste, proportion, surged, almost doubled, percentage points, dramatic rise, digitalisation, packaging, relatively stable, diversification, single largest category, striking change, declined, consumption trends$$,

$$pie_chart$$,
$${
  "title": "Composition of Municipal Waste in a City",
  "unit": "%",
  "charts": [
    {
      "label": "2000",
      "segments": {
        "Food waste": 38,
        "Paper & Cardboard": 32,
        "Plastic": 14,
        "Metal": 8,
        "Glass": 6,
        "Other": 2
      }
    },
    {
      "label": "2020",
      "segments": {
        "Food waste": 30,
        "Paper & Cardboard": 22,
        "Plastic": 26,
        "Metal": 7,
        "Glass": 5,
        "Other": 10
      }
    }
  ],
  "key_features": [
    "Plastic surged from 14% to 26% — almost doubled (+12 percentage points)",
    "Paper & Cardboard declined from 32% to 22%",
    "Food waste still largest but fell from 38% to 30%",
    "Metal and glass remained relatively stable",
    "Other waste grew from 2% to 10%"
  ]
}$$::jsonb,
$$medium$$
);
