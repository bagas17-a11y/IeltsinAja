import { useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  humanAiCurriculum,
  getModule,
  getMaterial,
  getMaterialsByModule,
} from "@/content";
import type { CurriculumModule } from "@/content/curriculum";
import type { LessonMaterial } from "@/content/materials";
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Crown,
  Lock,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Quote,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const moduleIcons = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenTool,
  speaking: Mic,
};

/** Render body text with **bold** and paragraph breaks */
function LessonBody({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-foreground/90 leading-relaxed">
      {text.split(/\n\n+/).map((para, i) => (
        <p key={i} className="text-sm">
          {para.split(/(\*\*[^*]+\*\*)/g).map((bit, j) =>
            /^\*\*[^*]+\*\*$/.test(bit) ? (
              <strong key={j} className="font-semibold text-foreground">
                {bit.slice(2, -2)}
              </strong>
            ) : (
              <span key={j}>{bit}</span>
            )
          )}
        </p>
      ))}
    </div>
  );
}

function LessonContent({ material }: { material: LessonMaterial }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">{material.summary}</p>
      </div>

      <LessonBody text={material.body} />

      {material.keyPoints.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            Key points
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/90">
            {material.keyPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {material.examples && material.examples.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
            <Quote className="w-4 h-4 text-accent" />
            Examples
          </h4>
          <ul className="space-y-2">
            {material.examples.map((ex, i) => (
              <li key={i} className="text-sm">
                {ex.label && (
                  <span className="font-medium text-foreground/80 block mb-0.5">{ex.label}</span>
                )}
                <span className="text-foreground/90">{ex.content}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {material.commonMistakes && material.commonMistakes.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-destructive/80" />
            Common mistakes
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/90">
            {material.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {material.practiceTips && material.practiceTips.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            Practice tips
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-foreground/90">
            {material.practiceTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {material.ieltsTip && (
        <div className="rounded-lg border border-elite-gold/30 bg-elite-gold/5 p-4">
          <h4 className="text-sm font-semibold text-elite-gold flex items-center gap-2 mb-2">
            <GraduationCap className="w-4 h-4" />
            IELTS tip
          </h4>
          <p className="text-sm text-foreground/90">{material.ieltsTip}</p>
        </div>
      )}
    </div>
  );
}

export default function MaterialsPage() {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const moduleId = (searchParams.get("module") as CurriculumModule["id"]) || "writing";
  const topicId = searchParams.get("topic") || null;

  const isElite = profile?.subscription_tier === "elite";

  const currentModule = useMemo(() => {
    try {
      return getModule(moduleId);
    } catch {
      return humanAiCurriculum[0];
    }
  }, [moduleId]);

  const materialsForModule = useMemo(
    () => getMaterialsByModule(currentModule.id),
    [currentModule.id]
  );

  const selectedMaterial = useMemo(() => {
    if (!topicId) return materialsForModule[0] ?? null;
    return materialsForModule.find((m) => m.topicId === topicId) ?? materialsForModule[0] ?? null;
  }, [topicId, materialsForModule]);

  // Sync URL with default topic when module has materials but no topic in URL
  useEffect(() => {
    if (topicId || materialsForModule.length === 0) return;
    const first = materialsForModule[0];
    if (first) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("topic", first.topicId);
        return next;
      });
    }
  }, [moduleId, materialsForModule, topicId, setSearchParams]);

  const setModule = (id: CurriculumModule["id"]) => {
    const materials = getMaterialsByModule(id);
    const firstTopicId = materials[0]?.topicId ?? null;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("module", id);
      if (firstTopicId) next.set("topic", firstTopicId);
      else next.delete("topic");
      return next;
    });
  };

  const setTopic = (id: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("topic", id);
      return next;
    });
  };

  if (!isElite) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-full bg-elite-gold/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-elite-gold" />
          </div>
          <h1 className="text-3xl font-light mb-4">
            Unlock <span className="text-elite-gold">Human+AI Materials</span>
          </h1>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Access the full curriculum and detailed lesson content for Listening, Reading, Writing,
            and Speaking. Upgrade to the Human+AI package to use this feature.
          </p>
          <div className="glass-card p-6 mb-8">
            <h3 className="text-lg font-light mb-4">What you get:</h3>
            <ul className="space-y-3 text-left max-w-md mx-auto">
              {[
                "Full curriculum for all 4 modules",
                "Detailed lessons with examples and tips",
                "Common mistakes and practice advice",
                "IELTS-specific tips per topic",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-foreground/80">
                  <Crown className="w-4 h-4 text-elite-gold flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Button
            onClick={() => window.location.assign("/pricing-selection")}
            className="bg-elite-gold/20 text-elite-gold border border-elite-gold/30 hover:bg-elite-gold/30"
          >
            View plans
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-light flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-elite-gold" />
            Human+AI Materials
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curriculum and detailed lessons for all four IELTS modules.
          </p>
        </div>

        <Tabs
          value={moduleId}
          onValueChange={(v) => setModule(v as CurriculumModule["id"])}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-2xl grid-cols-4 h-auto gap-1 p-1">
            {humanAiCurriculum.map((mod) => {
              const Icon = moduleIcons[mod.id];
              return (
                <TabsTrigger
                  key={mod.id}
                  value={mod.id}
                  className={cn(
                    "flex items-center gap-2 py-2.5",
                    moduleId === mod.id && "bg-elite-gold/20 text-elite-gold data-[state=active]:shadow-none"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {mod.title}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {humanAiCurriculum.map((mod) => (
            <TabsContent key={mod.id} value={mod.id} className="mt-4 focus-visible:outline-none">
              <div className="flex gap-6 flex-col lg:flex-row">
                {/* Topic list */}
                <Card className="lg:w-72 flex-shrink-0">
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">Topics</CardTitle>
                    <CardDescription className="text-xs">
                      {currentModule.topics.length} topics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ScrollArea className="h-[280px] lg:h-[400px] pr-4">
                      <nav className="space-y-0.5">
                        {currentModule.topics.map((topic) => {
                          const hasMaterial = materialsForModule.some((m) => m.topicId === topic.id);
                          const isSelected = selectedMaterial?.topicId === topic.id;
                          return (
                            <button
                              key={topic.id}
                              onClick={() => hasMaterial && setTopic(topic.id)}
                              disabled={!hasMaterial}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                                isSelected
                                  ? "bg-elite-gold/20 text-elite-gold font-medium"
                                  : hasMaterial
                                  ? "text-foreground/80 hover:bg-muted/50"
                                  : "text-muted-foreground/60 cursor-default"
                              )}
                            >
                              {topic.title}
                            </button>
                          );
                        })}
                      </nav>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Lesson content */}
                <Card className="flex-1 min-w-0">
                  <CardHeader className="pb-2">
                    {selectedMaterial ? (
                      <>
                        <CardTitle className="text-lg">{selectedMaterial.title}</CardTitle>
                        {selectedMaterial.level && (
                          <CardDescription className="capitalize">
                            Level: {selectedMaterial.level}
                          </CardDescription>
                        )}
                      </>
                    ) : (
                      <CardTitle className="text-lg text-muted-foreground">
                        Select a topic
                      </CardTitle>
                    )}
                  </CardHeader>
                  <CardContent>
                    {selectedMaterial ? (
                      <ScrollArea className="h-[60vh] pr-4">
                        <LessonContent material={selectedMaterial} />
                      </ScrollArea>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Choose a topic from the list to read the full lesson.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
