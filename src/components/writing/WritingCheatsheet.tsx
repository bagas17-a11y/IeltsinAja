/**
 * Human+AI Cheatsheet & Hard Tips for IELTS Writing (Academic)
 * Two tracks: Task 1 (Visual Report) and Task 2 (Essay)
 * Task 1: Single structured revision note (Bar Chart Band 9) + Mini MCQ quiz
 */

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, ChevronRight, CheckCircle, XCircle, RotateCcw, Trophy, FileText, PenTool, ArrowRight } from "lucide-react";
import {
  SectionTitle,
  SubSectionTitle,
  KeyList,
  DefinitionCard,
  WorkedExample,
  ExaminerTip,
} from "@/pages/dashboard/revision-notes/RevisionNoteContent";

interface MCQQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

const task1MCQs: MCQQuestion[] = [
  {
    id: "t1q1",
    question: "For the bar chart showing UK and France spending on consumer goods, which overview sentence best matches a Band 7+ style?",
    options: [
      { id: "A", text: "\"The bar chart shows spending on five types of goods.\"" },
      { id: "B", text: "\"Overall, the UK spent more on most consumer goods than France, with cameras receiving the highest expenditure and perfume the least in both countries.\"" },
      { id: "C", text: "\"Overall, cars, computers, books, perfume and cameras all show different amounts of spending.\"" },
    ],
    correctAnswer: "B",
    explanation: "B summarises the main trends (UK higher overall + highest & lowest categories) without listing details, which is what a strong overview does.",
  },
  {
    id: "t1q2",
    question: "Which sentence best shows selective use of numbers instead of \"data dumping\"?",
    options: [
      { id: "A", text: "\"The UK spent £400,000 on cars, £380,000 on computers, about £290,000 on books, around £180,000 on perfume and slightly over £350,000 on cameras.\"" },
      { id: "B", text: "\"In the UK, spending on cameras, at just over £350,000, was the highest figure, while expenditure on perfume was the lowest at about £150,000.\"" },
      { id: "C", text: "\"All categories had different figures in both countries.\"" },
    ],
    correctAnswer: "B",
    explanation: "B chooses only two key numbers (highest and lowest) to support a clear message, which matches the \"4–6 key numbers\" tip.",
  },
  {
    id: "t1q3",
    question: "You want to divide the body paragraphs. Which grouping plan follows the \"pattern, not item-by-item\" rule?",
    options: [
      { id: "A", text: "BP1: Cars, Computers, Books; BP2: Perfume, Cameras." },
      { id: "B", text: "BP1: Categories where the UK spent more than France; BP2: categories where France spent a similar amount or more." },
      { id: "C", text: "BP1: UK data; BP2: France data." },
    ],
    correctAnswer: "B",
    explanation: "B groups by pattern of spending (UK higher vs France similar/higher), which creates stronger comparisons than listing per country or per item.",
  },
  {
    id: "t1q4",
    question: "Which sentence uses comparison language most effectively?",
    options: [
      { id: "A", text: "\"The French figure for cameras was 150,000 and the UK figure was 350,000.\"" },
      { id: "B", text: "\"The UK figure for cameras, at just over £350,000, was more than double that of France, which was only about £150,000.\"" },
      { id: "C", text: "\"The UK and France both had different amounts for cameras.\"" },
    ],
    correctAnswer: "B",
    explanation: "B clearly compares the two numbers (\"more than double\"), turning raw data into a strong comparative statement.",
  },
  {
    id: "t1q5",
    question: "Which sentence is too opinion-based for Task 1 and should be avoided?",
    options: [
      { id: "A", text: "\"Both countries spent the smallest amount of money on perfume.\"" },
      { id: "B", text: "\"The British spent slightly more on cars than the French.\"" },
      { id: "C", text: "\"This clearly proves that British people love shopping much more than French people do.\"" },
    ],
    correctAnswer: "C",
    explanation: "C guesses about people's feelings, which is opinion. Task 1 should stay factual and describe only what the chart shows.",
  },
  {
    id: "t1q6",
    question: "Which introduction best paraphrases the bar-chart question?",
    options: [
      { id: "A", text: "\"The chart below shows the expenditure of two countries on consumer goods in 2010.\"" },
      { id: "B", text: "\"The bar chart illustrates how much money people in France and the UK spent on five categories of consumer goods in 2010, measured in pounds sterling.\"" },
      { id: "C", text: "\"This bar chart is about France, the UK and some things they buy.\"" },
    ],
    correctAnswer: "B",
    explanation: "B mentions visual type, countries, categories, year and units in formal language, which is a complete one-sentence introduction.",
  },
  {
    id: "t1q7",
    question: "Which sentence should NOT appear in the overview paragraph?",
    options: [
      { id: "A", text: "\"Overall, the UK spent more on consumer goods than France.\"" },
      { id: "B", text: "\"Overall, cameras attracted the highest levels of spending, while perfume accounted for the lowest.\"" },
      { id: "C", text: "\"In France, people spent exactly £400,000 on cars and roughly £150,000 on cameras.\"" },
    ],
    correctAnswer: "C",
    explanation: "The overview gives the big picture without precise figures. C is detailed and belongs in a body paragraph.",
  },
  {
    id: "t1q8",
    question: "Which sentence is accurate for this bar chart?",
    options: [
      { id: "A", text: "\"Neither country spent much on perfume, which accounted for about £200,000 in France and less than £150,000 in the UK.\"" },
      { id: "B", text: "\"France spent the most on perfume, at over £400,000.\"" },
      { id: "C", text: "\"Spending on books in France was far higher than in the UK, at nearly £450,000.\"" },
    ],
    correctAnswer: "A",
    explanation: "A correctly reflects the model answer: low spending on perfume, with France slightly above the UK.",
  },
  {
    id: "t1q9",
    question: "You finish a paragraph about categories where the UK spent more. Which linker best introduces the contrasting paragraph about categories where France's spending was similar or higher?",
    options: [
      { id: "A", text: "\"On the other hand,\"" },
      { id: "B", text: "\"For example,\"" },
      { id: "C", text: "\"In conclusion,\"" },
    ],
    correctAnswer: "A",
    explanation: "\"On the other hand\" signals contrast between two groups of data, which matches the grouping strategy.",
  },
  {
    id: "t1q10",
    question: "Which note set best matches a Band 7+ planning stage for this chart?",
    options: [
      { id: "A", text: "\"Cars, computers, books, perfume, cameras – write about each in order.\"" },
      { id: "B", text: "\"Overview: UK more overall; cameras highest; perfume lowest. BP1: categories where UK > France. BP2: categories where France similar/higher. Use 4–6 key numbers only.\"" },
      { id: "C", text: "\"Write as much as possible about every number so it looks detailed.\"" },
    ],
    correctAnswer: "B",
    explanation: "B follows the planning checklist: big-picture overview, clear grouping, and selective data instead of narrating every bar.",
  },
];

const task2MCQs: MCQQuestion[] = [
  {
    id: "t2q1",
    question: "Which introduction sentence has a clear position like the Band 9 model essay?",
    options: [
      { id: "A", text: "\"Social networking sites have advantages and disadvantages for people today.\"" },
      { id: "B", text: "\"However, while I believe that such sites are mainly beneficial to the individual, I agree that they have had a damaging effect on local communities.\"" },
      { id: "C", text: "\"This essay will discuss social networking sites.\"" },
    ],
    correctAnswer: "B",
    explanation: "B clearly states the writer's view (beneficial for individuals but harmful for local communities), which is essential for Band 7 Task Response.",
  },
  {
    id: "t2q2",
    question: "The question asks about impact on both individuals and society. Which body-paragraph plan answers this most directly?",
    options: [
      { id: "A", text: "BP1: advantages of social networking for individuals; BP2: disadvantages for local communities and society." },
      { id: "B", text: "BP1: history of Facebook; BP2: how many users Facebook has." },
      { id: "C", text: "BP1: advantages and disadvantages mixed; BP2: more advantages." },
    ],
    correctAnswer: "A",
    explanation: "A mirrors the two aspects in the question (individuals + society), which shows full Task Response.",
  },
  {
    id: "t2q3",
    question: "Which topic sentence is closest in function to the first body paragraph of the model essay?",
    options: [
      { id: "A", text: "\"Social networking sites are very popular nowadays.\"" },
      { id: "B", text: "\"With regards to individuals, the impact that online social media has had on each individual person has clear advantages.\"" },
      { id: "C", text: "\"The internet has changed our lives in many ways.\"" },
    ],
    correctAnswer: "B",
    explanation: "B clearly signals the paragraph focus (positive impact on individuals), just like the model essay.",
  },
  {
    id: "t2q4",
    question: "In the model essay, how are ideas grouped?",
    options: [
      { id: "A", text: "Each paragraph lists as many different ideas as possible with little explanation." },
      { id: "B", text: "One paragraph focuses on individuals, another on local communities/society." },
      { id: "C", text: "One paragraph is only definitions; the other is only examples." },
    ],
    correctAnswer: "B",
    explanation: "The essay groups ideas into two clear \"buckets\" (individual impact vs community/societal impact), which matches the grouping tip.",
  },
  {
    id: "t2q5",
    question: "Which sentence best links from the paragraph about individuals to the paragraph about society, similar to the model?",
    options: [
      { id: "A", text: "\"On the other hand, the effect that Facebook and other social networking sites have had on societies and local communities can only be seen as negative.\"" },
      { id: "B", text: "\"Secondly, Facebook has many features.\"" },
      { id: "C", text: "\"In conclusion, social networking sites are important.\"" },
    ],
    correctAnswer: "A",
    explanation: "A uses \"On the other hand\" and clearly shifts focus from individuals to societies/local communities.",
  },
  {
    id: "t2q6",
    question: "Which example is more like the Band 9 essay (specific and believable)?",
    options: [
      { id: "A", text: "\"For example, this can be good for many people in the world.\"" },
      { id: "B", text: "\"For example, many people are now able to join Facebook groups which allow them to meet others who share common interests.\"" },
      { id: "C", text: "\"For example, social networking is used everywhere.\"" },
    ],
    correctAnswer: "B",
    explanation: "B gives a concrete scenario (Facebook groups, shared interests), which properly supports the main idea.",
  },
  {
    id: "t2q7",
    question: "Which sentence is too informal for Task 2 and should be avoided?",
    options: [
      { id: "A", text: "\"Furthermore, people within local communities are no longer forming close or supportive relationships.\"" },
      { id: "B", text: "\"People spend more and more time online with friends they have never met face-to-face.\"" },
      { id: "C", text: "\"Nowadays, people just hang out on Facebook all the time instead of talking in real life, which is kind of bad.\"" },
    ],
    correctAnswer: "C",
    explanation: "C uses informal language (\"hang out\", \"kind of bad\") that doesn't fit the formal academic tone required in IELTS Writing.",
  },
  {
    id: "t2q8",
    question: "Which conclusion sentence follows the recommended structure (restate position + main idea) without adding new arguments?",
    options: [
      { id: "A", text: "\"To conclude, although social networking sites have brought individuals closer together, they have not had the same effect on local communities or society.\"" },
      { id: "B", text: "\"To conclude, social networking sites were created many years ago and will continue to grow in the future.\"" },
      { id: "C", text: "\"To conclude, social networking sites should be banned immediately around the world.\"" },
    ],
    correctAnswer: "A",
    explanation: "A restates the balanced position from the essay and summarises the key contrast (individual vs community), without new ideas.",
  },
  {
    id: "t2q9",
    question: "Which sentence would weaken Task Response if added to this essay?",
    options: [
      { id: "A", text: "\"Rather than taking part in their local community, many individuals now choose to spend their free time online.\"" },
      { id: "B", text: "\"Furthermore, as people spend more time online, society is becoming increasingly disjointed and fragmented.\"" },
      { id: "C", text: "\"Facebook was founded in 2004 and quickly became one of the most visited websites on the internet.\"" },
    ],
    correctAnswer: "C",
    explanation: "C gives unnecessary background information that does not help answer the question about impact on individuals and society.",
  },
  {
    id: "t2q10",
    question: "Which option shows the best Topic → Explain → Example pattern for a paragraph about negative community effects?",
    options: [
      { id: "A", text: "\"Social networking sites are bad. They have many bad effects. This is a big problem.\"" },
      { id: "B", text: "\"One negative effect is that people are less active in their local community. Instead of joining local events, they spend evenings online. For instance, many young people choose to chat with online friends rather than attend neighbourhood activities.\"" },
      { id: "C", text: "\"Social networking sites exist in every country. For example, Facebook and Instagram are popular.\"" },
    ],
    correctAnswer: "B",
    explanation: "B presents a clear main idea, explains how it happens, and supports it with a concrete example, matching the TEE pattern used in the model essay.",
  },
];

interface MCQPracticeProps {
  questions: MCQQuestion[];
  taskName: string;
  introImage?: string;
  modelAnswerImage?: string;
}

function MCQPractice({ questions, taskName, introImage, modelAnswerImage }: MCQPracticeProps) {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showReferenceImage, setShowReferenceImage] = useState(true);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  const handleAnswer = (answerId: string) => {
    if (showResult) return;
    setSelectedAnswer(answerId);
    setShowResult(true);
    if (answerId === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
    setShowReferenceImage(true);
  };

  if (!started) {
    return (
      <div className="space-y-6">
        {introImage && (
          <div className="rounded-lg overflow-hidden border border-border/30">
            <img 
              src={introImage} 
              alt={`${taskName} reference material`}
              className="w-full h-auto"
            />
          </div>
        )}
        <div className="text-center py-6">
          <h4 className="text-lg font-semibold mb-2">Ready to Practice {taskName}?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Study the {taskName === "Task 1" ? "bar chart" : "essay question"} above, then test your knowledge with {questions.length} MCQs based on a Band 9 model answer.
          </p>
          <Button onClick={() => setStarted(true)}>
            Start Practice
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="space-y-6">
        <div className="text-center py-6">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-accent" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Practice Complete!</h3>
          <p className="text-muted-foreground mb-4">
            You scored {score} out of {questions.length} ({percentage}%)
          </p>
          <div className="flex gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-6 max-w-md mx-auto">
            <Lightbulb className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
            <p className="text-sm text-left">
              {percentage >= 80 
                ? `Excellent! You have a strong grasp of ${taskName} strategies.`
                : percentage >= 60 
                ? "Good progress! Review the tips slides for areas you missed."
                : "Keep practicing! Re-read the tips slides and try again."}
            </p>
          </div>
          <Button onClick={handleRestart} variant="outline" className="mb-6">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>

        {modelAnswerImage && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-center">Band 9 Model Answer</h4>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Study this model answer to see how the strategies you practiced are applied.
            </p>
            <div className="rounded-lg overflow-hidden border border-border/30">
              <img 
                src={modelAnswerImage} 
                alt={`${taskName} Band 9 model answer`}
                className="w-full h-auto"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {introImage && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Reference: {taskName === "Task 1" ? "Bar Chart" : "Essay Question"}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowReferenceImage(!showReferenceImage)}
              className="text-xs h-7"
            >
              {showReferenceImage ? "Hide" : "Show"}
            </Button>
          </div>
          {showReferenceImage && (
            <div className="rounded-lg overflow-hidden border border-border/30">
              <img 
                src={introImage} 
                alt={`${taskName} reference material`}
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      )}

      <div className="border-t border-border/30 pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-muted-foreground">Score: {score}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
        <p className="text-sm font-medium whitespace-pre-line">{currentQuestion.question}</p>
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrect = option.id === currentQuestion.correctAnswer;
          let buttonClass = "w-full text-left p-4 rounded-lg border transition-colors ";
          
          if (showResult) {
            if (isCorrect) {
              buttonClass += "bg-green-500/10 border-green-500/50 text-green-400";
            } else if (isSelected && !isCorrect) {
              buttonClass += "bg-red-500/10 border-red-500/50 text-red-400";
            } else {
              buttonClass += "bg-secondary/20 border-border/30 text-muted-foreground";
            }
          } else {
            buttonClass += isSelected 
              ? "bg-accent/20 border-accent/50" 
              : "bg-secondary/20 border-border/30 hover:border-accent/30";
          }

          return (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id)}
              disabled={showResult}
              className={buttonClass}
            >
              <div className="flex items-start gap-3">
                <span className="font-semibold text-sm">{option.id}.</span>
                <span className="text-sm">{option.text}</span>
                {showResult && isCorrect && (
                  <CheckCircle className="w-4 h-4 text-green-500 ml-auto shrink-0" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-red-500 ml-auto shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
          <p className="text-sm">
            <strong className="text-accent">Explanation:</strong>{" "}
            <span className="text-muted-foreground">{currentQuestion.explanation}</span>
          </p>
        </div>
      )}

      {showResult && (
        <div className="flex justify-end">
          <Button onClick={handleNext}>
            {currentIndex < questions.length - 1 ? (
              <>
                Next Question
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                See Results
                <Trophy className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

/** Bar chart image for UK/France consumer goods 2010 (Band 9 model) */
const TASK1_CHART_IMAGE = "/assets/Screenshot_2026-02-20_at_5.37.54_PM-65ae8c4b-53ac-4130-ac38-7dd99e743023.png";

function Task1RevisionNotes({
  task1IntroImage,
  task1ModelImage,
  onStartQuiz,
  showQuizInline,
  mcqPractice,
}: {
  task1IntroImage: string;
  task1ModelImage: string;
  onStartQuiz: () => void;
  showQuizInline: boolean;
  mcqPractice: React.ReactNode;
}) {
  return (
    <div className="space-y-8 text-slate-200">
      {/* 1. Task Overview */}
      <SectionTitle number={1} title='Task Overview – "What Task 1 Wants"' />
      <p className="text-sm text-slate-300 leading-relaxed">
        You must <strong className="text-white">summarise visual information</strong> (charts, graphs, tables, diagrams, maps/processes). For this lesson, the visual is a <strong className="text-white">bar chart</strong> comparing spending on consumer goods in France and the UK in 2010.
      </p>
      <KeyList
        items={[
          <>Select the <strong>main features</strong>.</>,
          <>Make <strong>clear comparisons</strong>.</>,
          <>Give a <strong>big-picture overview</strong>.</>,
          <>Minimum <strong>150 words</strong> in about <strong>20 minutes</strong>.</>,
          "Task 1 counts less than Task 2, but a weak Task 1 can drag your overall Writing band down.",
        ]}
      />
      <DefinitionCard title="Key idea">
        Task 1 is a <strong>short, factual report</strong> – not an opinion essay and not a list of every number.
      </DefinitionCard>

      {/* 2. The Question & Chart */}
      <SectionTitle number={2} title="The Question & Chart" />
      <SubSectionTitle title="The Question" />
      <p className="text-sm text-slate-300">
        The chart below shows the expenditure of two countries on consumer goods in 2010. (pounds sterling)
      </p>
      <p className="text-sm text-slate-400 mt-2">
        Categories: <strong className="text-slate-300">Cars, Computers, Books, Perfume, Cameras</strong>. Each category has two bars: one for <strong className="text-slate-300">France</strong>, one for the <strong className="text-slate-300">UK</strong>.
      </p>
      <div className="rounded-lg overflow-hidden border border-[#334155] my-4">
        <img src={task1IntroImage || TASK1_CHART_IMAGE} alt="Bar chart: UK and France spending on consumer goods 2010" className="w-full h-auto" />
      </div>
      <ExaminerTip>
        Before reading the tips, look at the chart and note <strong>three things you notice first</strong> (e.g. who spends more overall, the highest/lowest category, any big gap).
      </ExaminerTip>

      {/* 3. Tip 1 – Understand the Task & Structure */}
      <SectionTitle number={3} title="Tip 1 – Understand the Task & Use a Safe Structure" />
      <p className="text-sm text-slate-300 leading-relaxed">
        Task 1’s <strong className="text-white">purpose</strong> is to describe and summarise; its <strong className="text-white">tone</strong> is academic and objective. The most exam-proof structure is:
      </p>
      <KeyList
        items={[
          "Introduction – 1 sentence: paraphrase what the visual shows.",
          "Overview – 1–2 sentences: biggest trends / contrasts (no detailed numbers).",
          "Body Paragraph 1 – key group of features + comparisons + selective numbers.",
          "Body Paragraph 2 – remaining key group + comparisons + selective numbers.",
        ]}
      />
      <SubSectionTitle title="Model answer example" />
      <WorkedExample>
        <p className="italic text-slate-200">&quot;The chart illustrates the amount of money spent on five consumer goods (cars, computers, books, perfume and cameras) in France and the UK in 2010. Units are measured in pounds sterling.&quot;</p>
      </WorkedExample>
      <p className="text-sm text-slate-300 mt-2">Why this works:</p>
      <KeyList
        items={[
          <>It <strong>paraphrases</strong> the question (e.g. &quot;illustrates&quot; instead of &quot;shows&quot;).</>,
          <>It includes <strong>what</strong> (amount spent), <strong>items</strong> (5 goods), <strong>where</strong> (France and UK), <strong>when</strong> (2010), and <strong>units</strong> (pounds sterling).</>,
          "One clean sentence – perfect for the introduction.",
        ]}
      />

      {/* 4. Tip 2 – Always Write an Overview */}
      <SectionTitle number={4} title="Tip 2 – Always Write an Overview (Non-Negotiable)" />
      <p className="text-sm text-slate-300 leading-relaxed">
        The overview is the <strong className="text-white">&quot;big picture&quot; summary</strong>. It is a make-or-break rule for Band 7+: mid-bands often miss or weaken the overview. An overview should mention 2–3 of: who spends more overall; which categories are highest/lowest; any striking differences.
      </p>
      <SubSectionTitle title="Model answer example" />
      <WorkedExample>
        <p className="italic text-slate-200">&quot;Overall, the UK spent more money on consumer goods than France in the period given. Both the British and the French spent most of their money on cars whereas the least amount of money was spent on perfume in the UK compared to cameras in France. Furthermore, the most significant difference in expenditure between the two countries was on cameras.&quot;</p>
      </WorkedExample>
      <p className="text-sm text-slate-300 mt-2">This overview gives the main trends (UK higher overall, cars highest, perfume/UK and cameras/France lowest, biggest gap = cameras) without detailed figures.</p>

      {/* 5. Tip 3 – Group Data Instead of Listing */}
      <SectionTitle number={5} title="Tip 3 – Group Data Instead of Listing" />
      <p className="text-sm text-slate-300 leading-relaxed">
        Do not describe each bar in order. Group by <strong className="text-white">pattern</strong>: e.g. categories where the UK spent more vs. categories where France spent similar or more.
      </p>
      <SubSectionTitle title="Model answer example" />
      <WorkedExample>
        <p className="text-slate-200 mb-2"><strong>Body 1</strong> (UK higher): &quot;In terms of cars, people in the UK spent about £450,000… Similarly, the British expenditure was higher on books… In the UK, expenditure on cameras (just over £350,000) was over double that of France…&quot;</p>
        <p className="text-slate-200"><strong>Body 2</strong> (France higher/similar): &quot;On the other hand, the amount of money paid out on the remaining goods was higher in France. Above £350,000 was spent by the French on computers… Neither of the countries spent much on perfume…&quot;</p>
      </WorkedExample>
      <ExaminerTip>
        Grouping by pattern (UK &gt; France vs France similar/higher) creates stronger comparisons than listing per country or per item.
      </ExaminerTip>

      {/* 6. Tip 4 – Use Comparisons & Selective Numbers */}
      <SectionTitle number={6} title="Tip 4 – Use Comparisons & Selective Numbers" />
      <p className="text-sm text-slate-300 leading-relaxed">
        Use 4–6 key numbers only. Turn data into <strong className="text-white">comparative statements</strong> (e.g. &quot;more than double&quot;, &quot;the highest figure&quot;, &quot;the lowest at about…&quot;). Avoid dumping every figure in one paragraph.
      </p>
      <SubSectionTitle title="Model answer example" />
      <WorkedExample>
        <p className="text-slate-200">&quot;In the UK, expenditure on cameras (just over £350,000) was over double that of France, which was only £150,000.&quot; / &quot;Neither of the countries spent much on perfume which accounted for £200,000 of expenditure in France but under £150,000 in the UK.&quot;</p>
      </WorkedExample>

      {/* 7. Tip 5 – Keep Report Style: Formal & Factual */}
      <SectionTitle number={7} title="Tip 5 – Keep Report Style: Formal & Factual" />
      <p className="text-sm text-slate-300 leading-relaxed">
        No opinions, no causes unless shown in the visual. Use formal, objective language. Avoid &quot;people preferred&quot; or &quot;this proves that…&quot;. Stay with what the chart shows.
      </p>
      <SubSectionTitle title="Model answer example" />
      <p className="text-sm text-slate-300">The Band 9 sample uses factual phrasing: &quot;people in the UK spent about…&quot;, &quot;the amount of money paid out&quot;, &quot;accounted for&quot;. It never guesses why or adds opinion.</p>

      {/* 8. Tip 6 – Paragraphing & Cohesion */}
      <SectionTitle number={8} title="Tip 6 – Paragraphing & Cohesion" />
      <p className="text-sm text-slate-300 leading-relaxed">
        Use clear linkers and topic sentences so the reader sees the structure: <strong className="text-white">In terms of…</strong>, <strong className="text-white">Similarly…</strong>, <strong className="text-white">On the other hand…</strong>. One main idea per paragraph.
      </p>
      <SubSectionTitle title="Model answer example" />
      <WorkedExample>
        <p className="text-slate-200">&quot;In terms of cars…&quot; opens the first body; &quot;Similarly&quot; adds the next comparison; &quot;On the other hand, the amount of money paid out on the remaining goods was higher in France&quot; introduces the contrast paragraph.</p>
      </WorkedExample>

      {/* 9. Mini MCQ Quiz */}
      <SectionTitle number={9} title="Mini MCQ Quiz – Quick Refresh" />
      <p className="text-sm text-slate-300 mb-4">
        Quick refresh using the same Band 9 bar chart model. Test your understanding with 10 MCQs.
      </p>
      {showQuizInline ? (
        mcqPractice
      ) : (
        <div className="rounded-lg border border-[#334155] bg-[#1e293b]/60 p-6 text-center">
          <Button
            onClick={onStartQuiz}
            className="bg-[rgba(59,130,246,0.25)] text-blue-200 border border-blue-500/30 hover:bg-[rgba(59,130,246,0.35)]"
          >
            Start Mini Quiz
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

function Task2Tips() {
  return (
    <Accordion type="multiple" defaultValue={["slide1"]} className="w-full space-y-3">
      <AccordionItem value="slide1" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
          Slide 1 – What Task 2 Really Wants
        </AccordionTrigger>
        <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-3">
          <ul className="list-disc pl-5 space-y-1">
            <li>40 minutes, minimum 250 words.</li>
            <li>You must <strong>answer all parts</strong> of the question and keep a <strong>clear position</strong> (opinion) from start to finish.</li>
            <li>Task 2 is worth <strong>more marks</strong> than Task 1.</li>
          </ul>
          <div className="flex gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <Lightbulb className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
            <p className="text-sm"><strong>Examiner Tip:</strong> Many Band 5–6 essays partly answer the question but leave one part under-developed. Every part of the prompt must be clearly addressed.</p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="slide2" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
          Slide 2 – The 4 Assessment Areas
        </AccordionTrigger>
        <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-3">
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Task Response</strong> – did you answer the question fully with a clear, consistent position and supported ideas?</li>
            <li><strong>Coherence & Cohesion</strong> – are your paragraphs logical and clearly linked?</li>
            <li><strong>Lexical Resource</strong> – is your vocabulary varied and accurate?</li>
            <li><strong>Grammatical Range & Accuracy</strong> – do you use a mix of sentence types with good control?</li>
          </ol>
          <p className="text-green-400 mt-2"><strong>Band 7 summary:</strong> clear position + developed ideas + logical organisation + flexible vocab/grammar with only minor errors.</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="slide3" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
          Slide 3 – Ideal 4/5-Paragraph Blueprint
        </AccordionTrigger>
        <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-3">
          <p>Use this "exam-proof" structure:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Intro (2 sentences)</strong> – paraphrase + thesis (your position + 2 main reasons).</li>
            <li><strong>Body 1</strong> – main reason 1: Topic → Explain → Example → Link.</li>
            <li><strong>Body 2</strong> – main reason 2: Topic → Explain → Example → Link.</li>
            <li><strong>Optional Body 3</strong> – other side / second question / extra angle when needed.</li>
            <li><strong>Conclusion</strong> – restate position + summarise reasons (no new ideas).</li>
          </ol>
          <div className="p-3 bg-secondary/30 rounded-lg border border-border/30 mt-2">
            <p className="text-xs text-muted-foreground italic">Template: "Many people argue that ____. This essay argues that ____ because ____ and ____."</p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="slide4" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
          Slide 4 – Planning Checklist (7 Steps)
        </AccordionTrigger>
        <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-3">
          <p>Before writing, spend 5–8 minutes:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Read the question carefully</strong> – identify type (agree/disagree, both views, problem/solution, etc.) and how many parts.</li>
            <li><strong>Decide your position</strong> – mostly agree? partly disagree?</li>
            <li><strong>Choose grouping</strong> – decide 2 main "buckets" for your body paragraphs (reasons, views, causes/solutions).</li>
            <li><strong>Generate support</strong> – for each bucket, write "why/how" + one specific example.</li>
            <li><strong>Plan paragraph roles</strong> – Intro, BP1, BP2 (+ optional BP3), Conclusion.</li>
            <li><strong>Write (30–34 mins)</strong> – follow the structure; keep each paragraph focused on one main idea.</li>
            <li><strong>Quick edit (2–3 mins)</strong> – check that your position is consistent and all parts of the question are clearly answered.</li>
          </ol>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="slide5" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
          Slide 5 – What Band 5/6/7 Essays Look Like
        </AccordionTrigger>
        <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-3">
          <ul className="space-y-2">
            <li><strong className="text-red-400">Band 5:</strong> position may change; ideas repeated or off-topic; examples very general; weak paragraph focus.</li>
            <li><strong className="text-yellow-400">Band 6:</strong> clear essay shape, but one part under-developed; examples sometimes generic; linkers mechanical.</li>
            <li><strong className="text-green-400">Band 7:</strong> position clear from intro to conclusion; each paragraph develops one main idea with explanation + example; flow is logical, referencing used well.</li>
          </ul>
          <p className="text-accent italic">Ask yourself: "Which description feels closest to my last essay?"</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="slide6" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
          Slide 6 – Building a Body Paragraph (TEE Pattern)
        </AccordionTrigger>
        <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-3">
          <p>Use the <strong>TEE</strong> pattern:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Topic sentence</strong> – one clear main idea.</li>
            <li><strong>Explain</strong> – 1–2 sentences explaining why/how.</li>
            <li><strong>Example</strong> – 1 sentence with a simple, believable example.</li>
            <li>(Optional) mini link back to the question.</li>
          </ul>
          <div className="p-3 bg-secondary/30 rounded-lg border border-border/30 mt-2">
            <p className="text-xs font-medium text-foreground mb-1">Example (social-media essay):</p>
            <p className="text-xs italic">"One major benefit of social networking sites is that they allow people to stay in touch with friends and family who live far away. This means individuals can share daily updates and support each other despite the distance. For instance, Facebook groups enable relatives in different countries to communicate regularly at almost no cost."</p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="slide7" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
          Slide 7 – Grouping Ideas
        </AccordionTrigger>
        <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-3">
          <p className="text-red-400">Don't list 4–5 mini points.</p>
          <p className="text-green-400">Choose <strong>two strong "idea buckets"</strong> and fully develop each.</p>
          <p className="mt-2"><strong>Examples of grouping:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Agree/Disagree</strong> → BP1 reason 1 (e.g., individual benefits), BP2 reason 2 (e.g., social costs).</li>
            <li><strong>Problem/Solution</strong> → BP1 causes, BP2 solutions.</li>
            <li><strong>Discuss both views</strong> → BP1 view A, BP2 view B (plus your final view).</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="slide8" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
          Slide 8 – Style: Formal and Precise
        </AccordionTrigger>
        <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-3">
          <p><strong>Key rules:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>No contractions (don't → do not).</li>
            <li>Avoid slang and very informal words (kids, a lot of, stuff).</li>
            <li>Use safe academic phrases: <em>a key factor, has a negative impact, leads to, in the long term</em>.</li>
            <li>Mix simple and complex sentences; do not make every sentence extremely long.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="slide9" className="border rounded-lg px-4">
        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
          Slide 9 – Conclusions that Actually Help Your Score
        </AccordionTrigger>
        <AccordionContent className="pb-4 text-sm text-muted-foreground space-y-3">
          <p>Conclusion should:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Restate your position in different words.</li>
            <li>Summarise your main reasons.</li>
            <li>Avoid new ideas.</li>
          </ul>
          <div className="p-3 bg-secondary/30 rounded-lg border border-border/30 mt-2">
            <p className="text-xs font-medium text-foreground mb-1">Template:</p>
            <p className="text-xs italic">"In conclusion, although social networking sites offer clear benefits to individuals, I believe they have a largely negative effect on local communities because ____ and ____."</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function WritingCheatsheet() {
  const [task1View, setTask1View] = useState<"tips" | "practice">("tips");
  const [task2View, setTask2View] = useState<"tips" | "practice">("tips");

  const task1IntroImage = "/assets/Screenshot_2026-02-20_at_5.37.54_PM-65ae8c4b-53ac-4130-ac38-7dd99e743023.png";
  const task1ModelImage = "/assets/Screenshot_2026-02-20_at_5.38.04_PM-99881072-8647-4bcb-9077-cc069a1a62f4.png";
  const task2IntroImage = "/assets/Screenshot_2026-02-20_at_5.38.52_PM-ce56c242-72bd-4574-89c5-37ea2a0fe99d.png";
  const task2ModelImage = "/assets/Screenshot_2026-02-20_at_5.39.03_PM-d7e3f998-4916-40ab-bc3d-06ffb56055b3.png";

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        Master IELTS Academic Writing with our Human+AI system. Two tracks: <strong>Task 1 (Visual Report)</strong> and <strong>Task 2 (Essay)</strong>.
      </p>

      <Tabs defaultValue="task1" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="task1" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Task 1 (Report)
          </TabsTrigger>
          <TabsTrigger value="task2" className="flex items-center gap-2">
            <PenTool className="w-4 h-4" />
            Task 2 (Essay)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="task1" className="mt-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Task 1: Bar Chart Band 9 Guided Notes</h3>
              {task1View === "practice" && (
                <Button variant="outline" size="sm" onClick={() => setTask1View("tips")}>
                  Back to Notes
                </Button>
              )}
            </div>

            <Task1RevisionNotes
              task1IntroImage={task1IntroImage}
              task1ModelImage={task1ModelImage}
              onStartQuiz={() => setTask1View("practice")}
              showQuizInline={task1View === "practice"}
              mcqPractice={
                <div className="p-6 rounded-lg border border-[#334155] bg-[#1e293b]/40">
                  <MCQPractice
                    questions={task1MCQs}
                    taskName="Task 1"
                    introImage={task1IntroImage}
                    modelAnswerImage={task1ModelImage}
                  />
                </div>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="task2" className="mt-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Task 2: From Question to Band 7+ Essay</h3>
              <div className="flex gap-2">
                <Button
                  variant={task2View === "tips" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTask2View("tips")}
                >
                  Tips Slides
                </Button>
                <Button
                  variant={task2View === "practice" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTask2View("practice")}
                >
                  Practice MCQs
                </Button>
              </div>
            </div>

            {task2View === "tips" ? (
              <>
                <Task2Tips />
                <div className="text-center py-6 border-t border-border/30">
                  <h4 className="text-lg font-semibold mb-2">Ready to Test Your Knowledge?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Apply what you've learned with 10 interactive MCQs based on a Band 9 model essay.
                  </p>
                  <Button onClick={() => setTask2View("practice")}>
                    Practise Task 2 Now
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-6 bg-secondary/20 rounded-lg border border-border/30">
                <h4 className="text-base font-semibold mb-4">Task 2 Practice – MCQs Based on Band 9 Model Essay</h4>
                <MCQPractice 
                  questions={task2MCQs} 
                  taskName="Task 2"
                  introImage={task2IntroImage}
                  modelAnswerImage={task2ModelImage}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
