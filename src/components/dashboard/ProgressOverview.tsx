import { useUserProgress, SkillBreakdown } from "@/hooks/useUserProgress";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  Target,
  Lightbulb,
  Clock,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Eye,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const examTypeIcons = {
  reading: BookOpen,
  listening: Headphones,
  writing: PenTool,
  speaking: Mic,
};

const examTypeColors = {
  reading: "text-blue-400",
  listening: "text-purple-400",
  writing: "text-green-400",
  speaking: "text-orange-400",
};

export function ProgressOverview() {
  const { profile } = useAuth();
  const {
    progress,
    isLoading,
    getBandScoreTrend,
    getSkillBreakdown,
    getAIRecommendations,
    getOverallAverage,
  } = useUserProgress();

  const [selectedEntry, setSelectedEntry] = useState<typeof progress[0] | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  const trendData = getBandScoreTrend(10);
  const skills = getSkillBreakdown();
  const recommendations = getAIRecommendations();
  const overallAverage = getOverallAverage();
  const targetBand = profile?.target_band_score || 7.0;

  const radarData = [
    { skill: "Reading", value: skills.reading, fullMark: 9 },
    { skill: "Listening", value: skills.listening, fullMark: 9 },
    { skill: "Writing", value: skills.writing, fullMark: 9 },
    { skill: "Speaking", value: skills.speaking, fullMark: 9 },
  ];

  const progressToTarget = overallAverage
    ? Math.min(100, (overallAverage / targetBand) * 100)
    : 0;

  const chartConfig = {
    score: {
      label: "Band Score",
      color: "hsl(var(--accent))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Score Card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Overall Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-accent">
              {overallAverage ? overallAverage.toFixed(1) : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {progress.length} exam{progress.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        {/* Target Tracker Card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Target Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-light text-foreground">
                {overallAverage?.toFixed(1) || "0"}
              </span>
              <span className="text-muted-foreground mb-1">/ {targetBand}</span>
            </div>
            <Progress value={progressToTarget} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {progressToTarget >= 100
                ? "Target achieved! 🎉"
                : `${(targetBand - (overallAverage || 0)).toFixed(1)} bands to go`}
            </p>
          </CardContent>
        </Card>

        {/* Total Exams Card */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Total Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light text-foreground">{progress.length}</div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {(["reading", "listening", "writing", "speaking"] as const).map((type) => {
                const count = progress.filter((p) => p.exam_type === type).length;
                if (count === 0) return null;
                const Icon = examTypeIcons[type];
                return (
                  <Badge key={type} variant="outline" className="text-xs">
                    <Icon className={`w-3 h-3 mr-1 ${examTypeColors[type]}`} />
                    {count}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Band Score Trend */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Band Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <LineChart data={trendData}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    domain={[0, 9]}
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--accent))", r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                Complete exams to see your trend
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skill Breakdown Radar */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Skill Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.values(skills).some((v) => v > 0) ? (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 9]}
                      tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="hsl(var(--accent))"
                      fill="hsl(var(--accent))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                Complete exams to see skill breakdown
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Card className="glass-card border-accent/30">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-accent" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-accent/5 border border-accent/20"
                >
                  <p className="text-sm font-medium text-foreground">{rec.weakness}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rec.suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* History List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Exam History</CardTitle>
        </CardHeader>
        <CardContent>
          {progress.length > 0 ? (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {progress.map((entry) => {
                  const Icon = examTypeIcons[entry.exam_type];
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center`}
                        >
                          <Icon className={`w-4 h-4 ${examTypeColors[entry.exam_type]}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium capitalize">{entry.exam_type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.completed_at).toLocaleDateString()} •{" "}
                            {entry.time_taken
                              ? `${Math.floor(entry.time_taken / 60)}m ${entry.time_taken % 60}s`
                              : "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium text-accent">
                            Band {entry.band_score?.toFixed(1) || "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {entry.correct_answers}/{entry.total_questions}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              No exam history yet. Start practicing!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="capitalize flex items-center gap-2">
              {selectedEntry && (
                <>
                  {(() => {
                    const Icon = examTypeIcons[selectedEntry.exam_type];
                    return <Icon className={`w-5 h-5 ${examTypeColors[selectedEntry.exam_type]}`} />;
                  })()}
                  {selectedEntry.exam_type} Exam Details
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Band Score</p>
                  <p className="text-xl font-light text-accent">
                    {selectedEntry.band_score?.toFixed(1) || "—"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Score</p>
                  <p className="text-xl font-light">
                    {selectedEntry.correct_answers}/{selectedEntry.total_questions}
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Time Taken</p>
                <p className="text-sm">
                  {selectedEntry.time_taken
                    ? `${Math.floor(selectedEntry.time_taken / 60)} minutes ${selectedEntry.time_taken % 60} seconds`
                    : "Not recorded"}
                </p>
              </div>
              {selectedEntry.feedback && (
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">AI Feedback</p>
                  <p className="text-sm">{selectedEntry.feedback}</p>
                </div>
              )}
              {selectedEntry.errors_log.length > 0 && (
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-2">Error Breakdown</p>
                  <div className="space-y-1">
                    {selectedEntry.errors_log.map((err, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{err.type}</span>
                        <Badge variant="outline">{err.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground text-center">
                Completed on {new Date(selectedEntry.completed_at).toLocaleString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
