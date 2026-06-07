-- ============================================================
-- Add two Cambridge-IELTS-format listening tests with
-- template-based Part 1 note completion ({{N}} inline inputs)
-- Test 1: "City Information Service" (easy)
-- Test 2: "Healthcare & Wellness" (medium)
-- ============================================================

INSERT INTO public.listening_test_library (
  title, difficulty, total_questions, duration_minutes,
  sections, topic_tags, is_active
)
VALUES (
  'City Information Service',
  'easy',
  40,
  30,
  '[
    {
      "part_number": 1,
      "context": "A tourist phones the City Information Service to enquire about guided tours",
      "transcript": "OFFICER: Good morning, City Information Service. How may I help you?\nTOURIST: Hello, I am visiting your city next week and I would like some information.\nOFFICER: Of course. Could I take your name please?\nTOURIST: It is Maria Santos.\nOFFICER: And which hotel will you be staying at?\nTOURIST: The Grand Hotel on Park Street.\nOFFICER: What date are you arriving?\nTOURIST: The fourteenth of July.\nOFFICER: And how long will you be staying?\nTOURIST: Six nights.\nOFFICER: What is the main purpose of your visit today?\nTOURIST: I would like to book a city tour.\nOFFICER: Our most popular option is the Historical Walk, departing from Central Museum on Queen Street.\nTOURIST: What time does it start?\nOFFICER: Nine in the morning.\nTOURIST: And how long does it last?\nOFFICER: One hundred and twenty minutes.\nTOURIST: How much does it cost?\nOFFICER: The standard price is twelve pounds, but we offer a ten percent student discount.\nTOURIST: I am a student. With the discount I would pay ten pounds eighty?\nOFFICER: That is correct. Shall I book that for you?\nTOURIST: Yes please. Thank you very much.\nOFFICER: You are most welcome. Enjoy your visit.",
      "question_groups": [
        {
          "type": "note_completion",
          "title": "VISITOR INFORMATION FORM",
          "instruction": "Complete the form below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.",
          "question_range": [1, 5],
          "group_transcript": "OFFICER: Good morning, City Information Service. How may I help you?\nTOURIST: Hello, I am visiting your city next week and I would like some information.\nOFFICER: Of course. Could I take your name please?\nTOURIST: It is Maria Santos.\nOFFICER: And which hotel will you be staying at?\nTOURIST: The Grand Hotel on Park Street.\nOFFICER: What date are you arriving?\nTOURIST: The fourteenth of July.\nOFFICER: And how long will you be staying?\nTOURIST: Six nights.\nOFFICER: What is the main purpose of your visit today?\nTOURIST: I would like to book a city tour.",
          "template": "**VISITOR INFORMATION FORM**\n\nName: {{1}}\n\nHotel: {{2}}\n\nArrival date: {{3}}\n\nLength of stay: {{4}} nights\n\nMain enquiry: {{5}}",
          "items": [
            {"number": 1, "label": "Name", "answer": "Maria Santos", "transcript_quote": "It is Maria Santos", "explanation": "The tourist gives her name as Maria Santos."},
            {"number": 2, "label": "Hotel", "answer": "Grand Hotel", "transcript_quote": "The Grand Hotel on Park Street", "explanation": "The tourist is staying at the Grand Hotel."},
            {"number": 3, "label": "Arrival date", "answer": "14 July / fourteenth of July", "transcript_quote": "The fourteenth of July", "explanation": "The tourist arrives on 14 July."},
            {"number": 4, "label": "Length of stay", "answer": "6 / six", "transcript_quote": "Six nights", "explanation": "The tourist is staying for six nights."},
            {"number": 5, "label": "Main enquiry", "answer": "city tour", "transcript_quote": "I would like to book a city tour", "explanation": "The tourist wants to book a city tour."}
          ]
        },
        {
          "type": "note_completion",
          "title": "CITY TOUR BOOKING",
          "instruction": "Complete the notes below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.",
          "question_range": [6, 10],
          "group_transcript": "OFFICER: Our most popular option is the Historical Walk, departing from Central Museum on Queen Street.\nTOURIST: What time does it start?\nOFFICER: Nine in the morning.\nTOURIST: And how long does it last?\nOFFICER: One hundred and twenty minutes.\nTOURIST: How much does it cost?\nOFFICER: The standard price is twelve pounds, but we offer a ten percent student discount.\nTOURIST: I am a student. With the discount I would pay ten pounds eighty?\nOFFICER: That is correct. Shall I book that for you?\nTOURIST: Yes please. Thank you very much.\nOFFICER: You are most welcome. Enjoy your visit.",
          "template": "**CITY TOUR BOOKING**\n\n- Tour name: {{6}}\n- Departure point: {{7}}\n- Start time: {{8}} a.m.\n- Duration: {{9}} minutes\n- Student price: {{10}}",
          "items": [
            {"number": 6, "label": "Tour name", "answer": "Historical Walk", "transcript_quote": "the Historical Walk", "explanation": "The tourist books the Historical Walk."},
            {"number": 7, "label": "Departure point", "answer": "Central Museum", "transcript_quote": "departing from Central Museum on Queen Street", "explanation": "The tour departs from Central Museum."},
            {"number": 8, "label": "Start time", "answer": "9 / nine", "transcript_quote": "Nine in the morning", "explanation": "The tour starts at nine in the morning."},
            {"number": 9, "label": "Duration", "answer": "120", "transcript_quote": "One hundred and twenty minutes", "explanation": "The tour lasts 120 minutes."},
            {"number": 10, "label": "Student price", "answer": "10.80 / ten pounds eighty", "transcript_quote": "you would pay ten pounds eighty", "explanation": "With student discount the price is ten pounds eighty."}
          ]
        }
      ]
    },
    {
      "part_number": 2,
      "context": "A tour guide giving visitors information about the city main attractions and practical tips",
      "transcript": "Welcome to Green City, everyone. I am Sarah, your city guide. The city was founded in eighteen sixty-five, making it over one hundred and fifty years old. Our most visited attraction is the National Museum, which first opened in nineteen twenty and today houses more than fifty thousand exhibits. The museum is open seven days a week from ten in the morning until six in the evening. Adult admission is fifteen pounds, and children under twelve enter free of charge. A short walk away you will find the famous Botanical Gardens. Covering thirty hectares, the gardens feature plants from over one hundred countries and were established in nineteen ten. Another highlight is the historic Old Quarter, which gained UNESCO World Heritage Site status in two thousand and eight and contains over three hundred listed buildings. For getting around, our bus service runs every ten minutes during peak hours. A one-day travel card costs six pounds fifty and gives you unlimited access to all city buses and trams. The main railway station is a fifteen-minute walk from the city centre, or you can take bus number forty-two. Our tourist information centre on Bridge Street is open daily from nine until five and the staff will be happy to help with any further questions.",
      "question_groups": [
        {
          "type": "multiple_choice",
          "instruction": "Choose the correct letter, A, B or C.",
          "question_range": [11, 14],
          "items": [
            {"number": 11, "question": "When was Green City founded?", "options": {"A": "1860", "B": "1865", "C": "1870"}, "answer": "B", "transcript_quote": "founded in eighteen sixty-five", "explanation": "The city was founded in 1865."},
            {"number": 12, "question": "How much is adult admission to the National Museum?", "options": {"A": "Ten pounds", "B": "Twelve pounds", "C": "Fifteen pounds"}, "answer": "C", "transcript_quote": "Adult admission is fifteen pounds", "explanation": "Adult admission is fifteen pounds."},
            {"number": 13, "question": "How large are the Botanical Gardens?", "options": {"A": "Twenty hectares", "B": "Thirty hectares", "C": "Forty hectares"}, "answer": "B", "transcript_quote": "Covering thirty hectares", "explanation": "The gardens cover thirty hectares."},
            {"number": 14, "question": "Which bus goes to the main railway station?", "options": {"A": "Bus 32", "B": "Bus 42", "C": "Bus 52"}, "answer": "B", "transcript_quote": "take bus number forty-two", "explanation": "Bus 42 goes to the railway station."}
          ]
        },
        {
          "type": "note_completion",
          "title": "CITY VISITOR NOTES",
          "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
          "question_range": [15, 20],
          "items": [
            {"number": 15, "label": "Old Quarter heritage status", "answer": "UNESCO World Heritage Site", "transcript_quote": "gained UNESCO World Heritage Site status", "explanation": "The Old Quarter is a UNESCO World Heritage Site."},
            {"number": 16, "label": "Number of listed buildings in Old Quarter", "answer": "300 / three hundred", "transcript_quote": "contains over three hundred listed buildings", "explanation": "There are over 300 listed buildings."},
            {"number": 17, "label": "Bus frequency during peak hours", "answer": "10 minutes / ten minutes", "transcript_quote": "runs every ten minutes during peak hours", "explanation": "Buses run every ten minutes at peak times."},
            {"number": 18, "label": "Cost of one-day travel card", "answer": "£6.50 / six pounds fifty", "transcript_quote": "A one-day travel card costs six pounds fifty", "explanation": "A one-day travel card costs six pounds fifty."},
            {"number": 19, "label": "Walk time from station to city centre", "answer": "15 / fifteen minutes", "transcript_quote": "a fifteen-minute walk from the city centre", "explanation": "The station is fifteen minutes walk from the centre."},
            {"number": 20, "label": "Location of tourist information centre", "answer": "Bridge Street", "transcript_quote": "tourist information centre on Bridge Street", "explanation": "The tourist centre is on Bridge Street."}
          ]
        }
      ]
    },
    {
      "part_number": 3,
      "context": "Two students, Daniel and Priya, discussing their history project on city development",
      "transcript": "DANIEL: Hi Priya, how is our city development project coming along?\nPRIYA: Really well. I have been focusing on urban expansion patterns from the nineteenth century.\nDANIEL: Great. My section is about the impact of the railway. The arrival of the railway in the eighteen eighties completely transformed the city.\nPRIYA: Yes, I found data showing the population tripled within twenty years of the railway opening.\nDANIEL: I also read that the textile industry played a major role in attracting workers from rural areas.\nPRIYA: Right, and that led to the development of worker housing in the east of the city. I found some fascinating old photographs of those streets.\nDANIEL: Do you think we should focus on economic factors or social changes in our presentation?\nPRIYA: Let us emphasise the social aspect since we have stronger evidence there.\nDANIEL: Agreed. What format should we use?\nPRIYA: Professor Johnson suggested using maps to show how the city boundaries changed decade by decade.\nDANIEL: I can create the maps from the historical data at the city archive.\nPRIYA: Perfect. And I will write the narrative sections.\nDANIEL: Should we include interviews with local historians?\nPRIYA: Yes. I already contacted Dr Harrison at the local museum. She agreed to meet us next Tuesday at two o clock.\nDANIEL: Let us aim to have a draft ready by Friday.\nPRIYA: Agreed. I will send you my sections by Thursday evening so you have time to review.",
      "question_groups": [
        {
          "type": "matching",
          "title": "RESEARCH TASKS AND FINDINGS",
          "instruction": "What did each student do or find? Choose FIVE answers from the box and write the correct letter, A-F, next to questions 21-25.",
          "question_range": [21, 25],
          "options_pool": {
            "A": "researched railway impact",
            "B": "analysed population data",
            "C": "collected historic photographs",
            "D": "will create maps",
            "E": "will write narrative sections",
            "F": "contacted a historian"
          },
          "items": [
            {"number": 21, "label": "Daniel research focus", "answer": "A", "transcript_quote": "My section is about the impact of the railway", "explanation": "Daniel researched the impact of the railway."},
            {"number": 22, "label": "Priya statistical finding", "answer": "B", "transcript_quote": "I found data showing the population tripled", "explanation": "Priya found population data."},
            {"number": 23, "label": "Priya visual evidence", "answer": "C", "transcript_quote": "I found some fascinating old photographs", "explanation": "Priya collected historic photographs."},
            {"number": 24, "label": "Daniel technical contribution", "answer": "D", "transcript_quote": "I can create the maps", "explanation": "Daniel will create the maps."},
            {"number": 25, "label": "Priya presentation role", "answer": "E", "transcript_quote": "I will write the narrative sections", "explanation": "Priya will write the narrative sections."}
          ]
        },
        {
          "type": "multiple_choice",
          "instruction": "Choose the correct letter, A, B or C.",
          "question_range": [26, 30],
          "items": [
            {"number": 26, "question": "What caused the city population to triple?", "options": {"A": "The textile industry", "B": "The arrival of the railway", "C": "The development of housing"}, "answer": "B", "transcript_quote": "population tripled within twenty years of the railway opening", "explanation": "The railway caused the population to triple."},
            {"number": 27, "question": "Which aspect will the presentation emphasise?", "options": {"A": "Economic factors", "B": "Technical development", "C": "Social changes"}, "answer": "C", "transcript_quote": "let us emphasise the social aspect", "explanation": "The students will emphasise social changes."},
            {"number": 28, "question": "Who suggested using maps in the presentation?", "options": {"A": "Daniel", "B": "Priya", "C": "Professor Johnson"}, "answer": "C", "transcript_quote": "Professor Johnson suggested using maps", "explanation": "Professor Johnson suggested the maps idea."},
            {"number": 29, "question": "Where does Dr Harrison work?", "options": {"A": "The city archive", "B": "The university", "C": "The local museum"}, "answer": "C", "transcript_quote": "Dr Harrison at the local museum", "explanation": "Dr Harrison works at the local museum."},
            {"number": 30, "question": "When will Priya send Daniel her sections?", "options": {"A": "Tuesday evening", "B": "Thursday evening", "C": "Friday morning"}, "answer": "B", "transcript_quote": "I will send you my sections by Thursday evening", "explanation": "Priya will send her sections on Thursday evening."}
          ]
        }
      ]
    },
    {
      "part_number": 4,
      "context": "An academic lecture on the principles of sustainable urban design",
      "transcript": "Good afternoon, everyone. Today I want to explore the principles of sustainable urban design and how modern cities are adapting to climate change and rapid population growth. Sustainable urban design has historical roots in the garden city movement, pioneered by Ebenezer Howard in nineteen oh two. Howard envisioned self-contained communities surrounded by greenbelts, each with a maximum population of thirty-two thousand residents. The key concept today is what we call the fifteen-minute city, developed by urban theorist Carlos Moreno in twenty nineteen. The central idea is that all essential services should be accessible within a fifteen-minute walk or cycle from any home. Paris is the most prominent example, with Mayor Hidalgo committing to the transformation in twenty twenty. Several strategies characterise sustainable urban design. First, mixed-use zoning integrates residential, commercial, and recreational spaces, reducing the need for transport. Second, transit-oriented development places housing and services within a four-hundred-metre radius of public transport hubs. Third, green infrastructure manages stormwater and reduces the urban heat island effect. Research shows that cities with more than twenty percent tree coverage experience significantly cooler temperatures. Finally, participatory planning has become central to the field. Cities such as Copenhagen and Bogota have shown that involving residents in design decisions leads to higher adoption of sustainable behaviours and greater community satisfaction.",
      "question_groups": [
        {
          "type": "note_completion",
          "title": "SUSTAINABLE URBAN DESIGN",
          "instruction": "Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
          "question_range": [31, 36],
          "items": [
            {"number": 31, "label": "Year Howard proposed the garden city", "answer": "1902", "transcript_quote": "pioneered by Ebenezer Howard in nineteen oh two", "explanation": "Howard proposed the garden city in 1902."},
            {"number": 32, "label": "Maximum population per garden city", "answer": "32,000 / thirty-two thousand", "transcript_quote": "a maximum population of thirty-two thousand residents", "explanation": "Each garden city would have 32,000 people maximum."},
            {"number": 33, "label": "Developer of the fifteen-minute city concept", "answer": "Carlos Moreno", "transcript_quote": "developed by urban theorist Carlos Moreno", "explanation": "Carlos Moreno developed the fifteen-minute city concept."},
            {"number": 34, "label": "Year Paris committed to the fifteen-minute city", "answer": "2020", "transcript_quote": "committing to the transformation in twenty twenty", "explanation": "Paris committed in 2020."},
            {"number": 35, "label": "Radius around transport hubs", "answer": "400 metres / four hundred metres", "transcript_quote": "within a four-hundred-metre radius of public transport hubs", "explanation": "Housing is placed within 400 metres of transport hubs."},
            {"number": 36, "label": "Tree coverage needed for cooler temperatures", "answer": "20 / twenty percent", "transcript_quote": "more than twenty percent tree coverage", "explanation": "Cities need more than 20% tree coverage."}
          ]
        },
        {
          "type": "sentence_completion",
          "instruction": "Complete each sentence with NO MORE THAN TWO WORDS AND/OR A NUMBER.",
          "question_range": [37, 40],
          "items": [
            {"number": 37, "sentence": "The fifteen-minute city concept states all essential services should be within a _____ walk or cycle from home.", "answer": "fifteen-minute", "transcript_quote": "within a fifteen-minute walk or cycle", "explanation": "Services should be within a fifteen-minute walk or cycle."},
            {"number": 38, "sentence": "Mixed-use zoning integrates different types of spaces to reduce the need for _____.", "answer": "transport", "transcript_quote": "reducing the need for transport", "explanation": "Mixed-use zoning reduces the need for transport."},
            {"number": 39, "sentence": "Green infrastructure manages stormwater and reduces the urban _____ effect.", "answer": "heat island", "transcript_quote": "reduces the urban heat island effect", "explanation": "Green infrastructure reduces the heat island effect."},
            {"number": 40, "sentence": "Cities like Copenhagen and Bogota showed that involving _____ in design decisions improves sustainability outcomes.", "answer": "residents", "transcript_quote": "involving residents in design decisions", "explanation": "Involving residents improves sustainability outcomes."}
          ]
        }
      ]
    }
  ]'::jsonb,
  '["tourism", "city services", "urban planning"]'::jsonb,
  true
);

INSERT INTO public.listening_test_library (
  title, difficulty, total_questions, duration_minutes,
  sections, topic_tags, is_active
)
VALUES (
  'Healthcare & Wellness',
  'medium',
  40,
  30,
  '[
    {
      "part_number": 1,
      "context": "A patient phones Riverside Medical Centre to book an appointment with their doctor",
      "transcript": "RECEPTIONIST: Good afternoon, Riverside Medical Centre.\nPATIENT: Hello, I would like to make an appointment with a doctor please.\nRECEPTIONIST: Of course. Could I take your full name?\nPATIENT: Yes, it is James Whitfield.\nRECEPTIONIST: And your date of birth?\nPATIENT: The third of April, nineteen eighty-eight.\nRECEPTIONIST: Thank you. What is your contact phone number?\nPATIENT: It is zero seven nine four, three five six, two one eight zero.\nRECEPTIONIST: Which doctor would you like to see?\nPATIENT: I usually see Doctor Chen.\nRECEPTIONIST: What type of appointment are you looking for?\nPATIENT: I need a general health check-up.\nRECEPTIONIST: Would the twenty-second of June work for you?\nPATIENT: Yes, that is fine.\nRECEPTIONIST: We have two slots available: nine thirty in the morning or two fifteen in the afternoon.\nPATIENT: I would prefer two fifteen please.\nRECEPTIONIST: Are you currently taking any medication?\nPATIENT: Yes, I take metformin for diabetes.\nRECEPTIONIST: Do you have any known allergies?\nPATIENT: I am allergic to penicillin.\nRECEPTIONIST: And which health insurance provider do you use?\nPATIENT: I am with Blue Shield.\nRECEPTIONIST: Perfect. You will receive a confirmation by email.\nPATIENT: Thank you very much.",
      "question_groups": [
        {
          "type": "note_completion",
          "title": "PATIENT REGISTRATION FORM",
          "instruction": "Complete the form below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.",
          "question_range": [1, 4],
          "group_transcript": "RECEPTIONIST: Good afternoon, Riverside Medical Centre.\nPATIENT: Hello, I would like to make an appointment with a doctor please.\nRECEPTIONIST: Of course. Could I take your full name?\nPATIENT: Yes, it is James Whitfield.\nRECEPTIONIST: And your date of birth?\nPATIENT: The third of April, nineteen eighty-eight.\nRECEPTIONIST: Thank you. What is your contact phone number?\nPATIENT: It is zero seven nine four, three five six, two one eight zero.\nRECEPTIONIST: Which doctor would you like to see?\nPATIENT: I usually see Doctor Chen.",
          "template": "**PATIENT REGISTRATION FORM**\n\nPatient name: {{1}}\n\nDate of birth: {{2}}\n\nContact number: {{3}}\n\nPreferred doctor: {{4}}",
          "items": [
            {"number": 1, "label": "Patient name", "answer": "James Whitfield", "transcript_quote": "it is James Whitfield", "explanation": "The patient gives his name as James Whitfield."},
            {"number": 2, "label": "Date of birth", "answer": "3 April 1988 / third of April 1988", "transcript_quote": "The third of April, nineteen eighty-eight", "explanation": "The patient was born on 3 April 1988."},
            {"number": 3, "label": "Contact number", "answer": "07943562180 / 0794 356 2180", "transcript_quote": "zero seven nine four, three five six, two one eight zero", "explanation": "The contact number is 07943562180."},
            {"number": 4, "label": "Preferred doctor", "answer": "Doctor Chen / Dr Chen", "transcript_quote": "I usually see Doctor Chen", "explanation": "The patient prefers Doctor Chen."}
          ]
        },
        {
          "type": "note_completion",
          "title": "APPOINTMENT DETAILS",
          "instruction": "Complete the notes below. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.",
          "question_range": [5, 10],
          "group_transcript": "RECEPTIONIST: What type of appointment are you looking for?\nPATIENT: I need a general health check-up.\nRECEPTIONIST: Would the twenty-second of June work for you?\nPATIENT: Yes, that is fine.\nRECEPTIONIST: We have two slots available: nine thirty in the morning or two fifteen in the afternoon.\nPATIENT: I would prefer two fifteen please.\nRECEPTIONIST: Are you currently taking any medication?\nPATIENT: Yes, I take metformin for diabetes.\nRECEPTIONIST: Do you have any known allergies?\nPATIENT: I am allergic to penicillin.\nRECEPTIONIST: And which health insurance provider do you use?\nPATIENT: I am with Blue Shield.\nRECEPTIONIST: Perfect. You will receive a confirmation by email.\nPATIENT: Thank you very much.",
          "template": "**APPOINTMENT DETAILS**\n\n- Appointment type: {{5}}\n- Date: {{6}}\n- Time: {{7}}\n- Current medication: {{8}}\n- Known allergy: {{9}}\n- Insurance provider: {{10}}",
          "items": [
            {"number": 5, "label": "Appointment type", "answer": "health check-up / general check-up", "transcript_quote": "I need a general health check-up", "explanation": "The patient needs a general health check-up."},
            {"number": 6, "label": "Date", "answer": "22 June / twenty-second of June", "transcript_quote": "the twenty-second of June", "explanation": "The appointment is on 22 June."},
            {"number": 7, "label": "Time", "answer": "2:15 / two fifteen", "transcript_quote": "two fifteen in the afternoon", "explanation": "The appointment is at two fifteen in the afternoon."},
            {"number": 8, "label": "Current medication", "answer": "metformin", "transcript_quote": "I take metformin for diabetes", "explanation": "The patient takes metformin."},
            {"number": 9, "label": "Known allergy", "answer": "penicillin", "transcript_quote": "I am allergic to penicillin", "explanation": "The patient is allergic to penicillin."},
            {"number": 10, "label": "Insurance provider", "answer": "Blue Shield", "transcript_quote": "I am with Blue Shield", "explanation": "The patient is insured with Blue Shield."}
          ]
        }
      ]
    },
    {
      "part_number": 2,
      "context": "The director of Greenway Wellness Centre presenting information about the new facility",
      "transcript": "Good morning, everyone. I am Dr Patricia Walsh, director of the Greenway Wellness Centre. Our centre officially opened in January twenty twenty-four after three years of construction. We are situated on five acres of landscaped grounds and our main building has four floors. The ground floor houses our reception, pharmacy, and diagnostic laboratory. The first floor has twenty-four consultation rooms, staffed by eighteen full-time doctors and twelve specialist nurses. The second floor is dedicated to rehabilitation, including physiotherapy, occupational therapy, and speech therapy. Our rehabilitation gym has eighty pieces of specialist equipment. The third floor contains our mind and body wellness area with a yoga studio for thirty participants, a hydrotherapy pool maintained at thirty-six degrees, and our mental health counselling centre. Membership packages start at forty-five pounds per month for basic access, seventy-five pounds for full access including therapy sessions, and one hundred and twenty pounds for our comprehensive plan which includes nutritional counselling and annual health screening. We are open Monday to Friday from seven in the morning until nine at night, and on weekends from eight until six. New members this month receive a thirty percent discount on their first month.",
      "question_groups": [
        {
          "type": "multiple_choice",
          "instruction": "Choose the correct letter, A, B or C.",
          "question_range": [11, 14],
          "items": [
            {"number": 11, "question": "When did the Greenway Wellness Centre open?", "options": {"A": "January 2022", "B": "January 2023", "C": "January 2024"}, "answer": "C", "transcript_quote": "opened in January twenty twenty-four", "explanation": "The centre opened in January 2024."},
            {"number": 12, "question": "How many consultation rooms does the centre have?", "options": {"A": "Eighteen", "B": "Twenty-two", "C": "Twenty-four"}, "answer": "C", "transcript_quote": "twenty-four consultation rooms", "explanation": "There are twenty-four consultation rooms."},
            {"number": 13, "question": "What temperature is the hydrotherapy pool?", "options": {"A": "34 degrees", "B": "36 degrees", "C": "38 degrees"}, "answer": "B", "transcript_quote": "maintained at thirty-six degrees", "explanation": "The pool is maintained at thirty-six degrees."},
            {"number": 14, "question": "What discount do new members receive this month?", "options": {"A": "20 percent", "B": "25 percent", "C": "30 percent"}, "answer": "C", "transcript_quote": "a thirty percent discount on their first month", "explanation": "New members get a thirty percent discount."}
          ]
        },
        {
          "type": "note_completion",
          "title": "GREENWAY WELLNESS CENTRE NOTES",
          "instruction": "Complete the notes. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
          "question_range": [15, 20],
          "items": [
            {"number": 15, "label": "Size of centre grounds", "answer": "5 / five acres", "transcript_quote": "situated on five acres of landscaped grounds", "explanation": "The centre is on five acres."},
            {"number": 16, "label": "Number of specialist nurses", "answer": "12 / twelve", "transcript_quote": "twelve specialist nurses", "explanation": "There are twelve specialist nurses."},
            {"number": 17, "label": "Equipment pieces in rehabilitation gym", "answer": "80 / eighty", "transcript_quote": "eighty pieces of specialist equipment", "explanation": "The gym has eighty pieces of equipment."},
            {"number": 18, "label": "Yoga studio capacity", "answer": "30 / thirty participants", "transcript_quote": "yoga studio for thirty participants", "explanation": "The yoga studio holds thirty participants."},
            {"number": 19, "label": "Full access membership cost", "answer": "£75 / seventy-five pounds", "transcript_quote": "seventy-five pounds for full access", "explanation": "Full access membership costs seventy-five pounds."},
            {"number": 20, "label": "Weekend closing time", "answer": "6 / six", "transcript_quote": "on weekends from eight until six", "explanation": "The centre closes at six on weekends."}
          ]
        }
      ]
    },
    {
      "part_number": 3,
      "context": "Two students, Emma and Raj, discussing their research report on mental health in universities",
      "transcript": "EMMA: Raj, how is your section of the mental health report coming along?\nRAJ: I have nearly finished the statistical analysis. The data shows that anxiety rates among students have increased by forty percent over the last decade.\nEMMA: That is really concerning. My section focuses on the causes. I have been looking at academic pressure, financial stress, and social media usage.\nRAJ: What did you find to be the most significant factor?\nEMMA: Interestingly, it is academic pressure rather than social media, which most people would assume.\nRAJ: That aligns with what I found. About sixty percent of students cited exam stress as their primary concern.\nEMMA: Our report needs to include recommendations. I was thinking we could suggest mandatory counselling sessions in the first term.\nRAJ: That might be too expensive. What about peer support programmes? They have been shown to be very effective and relatively low cost.\nEMMA: True. Copenhagen University saw a thirty percent reduction in reported mental health issues after introducing a peer mentoring scheme.\nRAJ: That is impressive. We should include that as a case study.\nEMMA: I also want to mention the importance of training academic staff to recognise signs of mental distress.\nRAJ: Professor Martinez mentioned that staff training programmes cost around two thousand pounds per department annually.\nEMMA: That is quite reasonable. Our conclusion should be that early intervention is key.\nRAJ: Agreed. Let us meet tomorrow at three o clock to finalise everything.\nEMMA: Perfect. I will book the library study room.",
      "question_groups": [
        {
          "type": "matching",
          "title": "RESEARCH CONTRIBUTIONS",
          "instruction": "Match each finding or suggestion with the correct student. Choose FIVE answers from the box and write the correct letter, A-F, next to questions 21-25.",
          "question_range": [21, 25],
          "options_pool": {
            "A": "anxiety rate statistics",
            "B": "academic pressure as primary cause",
            "C": "mandatory counselling proposal",
            "D": "peer support recommendation",
            "E": "staff training suggestion",
            "F": "case study from Copenhagen"
          },
          "items": [
            {"number": 21, "label": "Raj statistical finding", "answer": "A", "transcript_quote": "anxiety rates among students have increased by forty percent", "explanation": "Raj found the anxiety rate statistics."},
            {"number": 22, "label": "Emma primary cause identified", "answer": "B", "transcript_quote": "it is academic pressure rather than social media", "explanation": "Emma identified academic pressure as the primary cause."},
            {"number": 23, "label": "Emma original recommendation", "answer": "C", "transcript_quote": "suggest mandatory counselling sessions in the first term", "explanation": "Emma originally proposed mandatory counselling."},
            {"number": 24, "label": "Raj alternative suggestion", "answer": "D", "transcript_quote": "What about peer support programmes", "explanation": "Raj suggested peer support programmes."},
            {"number": 25, "label": "Emma additional point about staff", "answer": "E", "transcript_quote": "training academic staff to recognise signs of mental distress", "explanation": "Emma suggested training academic staff."}
          ]
        },
        {
          "type": "multiple_choice",
          "instruction": "Choose the correct letter, A, B or C.",
          "question_range": [26, 30],
          "items": [
            {"number": 26, "question": "By how much have anxiety rates increased over the last decade?", "options": {"A": "Thirty percent", "B": "Forty percent", "C": "Fifty percent"}, "answer": "B", "transcript_quote": "increased by forty percent over the last decade", "explanation": "Anxiety rates increased by forty percent."},
            {"number": 27, "question": "What did sixty percent of students cite as their primary concern?", "options": {"A": "Financial stress", "B": "Social media", "C": "Exam stress"}, "answer": "C", "transcript_quote": "sixty percent of students cited exam stress", "explanation": "Sixty percent cited exam stress."},
            {"number": 28, "question": "By how much did Copenhagen University reduce mental health issues?", "options": {"A": "Twenty percent", "B": "Thirty percent", "C": "Forty percent"}, "answer": "B", "transcript_quote": "a thirty percent reduction in reported mental health issues", "explanation": "Copenhagen saw a thirty percent reduction."},
            {"number": 29, "question": "How much do staff training programmes cost per department annually?", "options": {"A": "£1,500", "B": "£2,000", "C": "£2,500"}, "answer": "B", "transcript_quote": "two thousand pounds per department annually", "explanation": "Staff training costs two thousand pounds per department."},
            {"number": 30, "question": "What time will the students meet tomorrow?", "options": {"A": "Two o clock", "B": "Three o clock", "C": "Four o clock"}, "answer": "B", "transcript_quote": "meet tomorrow at three o clock", "explanation": "The students will meet at three o clock."}
          ]
        }
      ]
    },
    {
      "part_number": 4,
      "context": "An academic lecture on preventive medicine and its role in public health policy",
      "transcript": "Good afternoon. In today's lecture I want to explore the concept of preventive medicine and its growing importance in public health policy. Preventive medicine can be categorised into three levels. Primary prevention aims to prevent disease before it occurs through vaccination, health education, and environmental modification. Secondary prevention focuses on early detection through screening programmes and routine health checks. Tertiary prevention seeks to reduce the impact of an established disease through rehabilitation and chronic disease management. Historically healthcare systems have focused on curing disease after it occurs. However the economic argument for prevention is compelling. Research by the World Health Organization in two thousand and nineteen estimated that every one dollar invested in preventive measures saves approximately five dollars in future healthcare costs. One of the most successful large-scale examples is the global smallpox eradication programme, completed in nineteen seventy-nine after a ten-year campaign coordinated by the WHO. More recent successes include tobacco control policies. Countries implementing comprehensive tobacco control measures have seen lung cancer rates fall by up to forty percent over twenty years. Mental health is an increasingly important frontier. The WHO estimates that mental health conditions affect one in four people globally. Early intervention programmes in schools have reduced the onset of anxiety and depression by twenty-five percent in some studies. The greatest challenge ahead is addressing the social determinants of health, such as poverty, education, housing quality, and access to healthcare, which account for approximately thirty to forty percent of health outcomes.",
      "question_groups": [
        {
          "type": "note_completion",
          "title": "PREVENTIVE MEDICINE",
          "instruction": "Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.",
          "question_range": [31, 36],
          "items": [
            {"number": 31, "label": "Year WHO economic study conducted", "answer": "2019", "transcript_quote": "World Health Organization in two thousand and nineteen", "explanation": "The WHO study was conducted in 2019."},
            {"number": 32, "label": "Return for every dollar invested in prevention", "answer": "5 / five dollars", "transcript_quote": "saves approximately five dollars in future healthcare costs", "explanation": "Every dollar invested saves five dollars."},
            {"number": 33, "label": "Year smallpox was eradicated", "answer": "1979", "transcript_quote": "completed in nineteen seventy-nine", "explanation": "Smallpox was eradicated in 1979."},
            {"number": 34, "label": "Reduction in lung cancer rates from tobacco control", "answer": "40 / forty percent", "transcript_quote": "lung cancer rates fall by up to forty percent", "explanation": "Tobacco control reduced lung cancer rates by up to 40%."},
            {"number": 35, "label": "Proportion of people globally with mental health conditions", "answer": "1 in 4 / one in four", "transcript_quote": "affect one in four people globally", "explanation": "One in four people globally are affected."},
            {"number": 36, "label": "Reduction in anxiety from school early intervention", "answer": "25 / twenty-five percent", "transcript_quote": "reduced the onset of anxiety and depression by twenty-five percent", "explanation": "School programmes reduced onset by 25%."}
          ]
        },
        {
          "type": "sentence_completion",
          "instruction": "Complete each sentence with NO MORE THAN TWO WORDS AND/OR A NUMBER.",
          "question_range": [37, 40],
          "items": [
            {"number": 37, "sentence": "Primary prevention aims to prevent disease before it occurs through vaccination, health education, and _____.", "answer": "environmental modification", "transcript_quote": "vaccination, health education, and environmental modification", "explanation": "Environmental modification is the third primary prevention method."},
            {"number": 38, "sentence": "Secondary prevention focuses on early detection through _____ and routine health checks.", "answer": "screening programmes", "transcript_quote": "early detection through screening programmes", "explanation": "Secondary prevention uses screening programmes."},
            {"number": 39, "sentence": "Countries with comprehensive tobacco control have seen lung cancer rates fall by up to _____ percent over twenty years.", "answer": "40 / forty", "transcript_quote": "fall by up to forty percent over twenty years", "explanation": "Lung cancer rates fell by up to 40%."},
            {"number": 40, "sentence": "Social determinants of health account for approximately thirty to _____ percent of health outcomes.", "answer": "40 / forty", "transcript_quote": "approximately thirty to forty percent of health outcomes", "explanation": "Social determinants account for 30-40% of outcomes."}
          ]
        }
      ]
    }
  ]'::jsonb,
  '["healthcare", "medical appointments", "public health"]'::jsonb,
  true
);
