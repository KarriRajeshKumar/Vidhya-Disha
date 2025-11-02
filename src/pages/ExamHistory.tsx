import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useExamHistory } from "@/hooks/useExams";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { History, Trophy, Target, Clock, RotateCcw } from "lucide-react";

export default function ExamHistory() {
  const { profile } = useProfile();
  const { history, loading } = useExamHistory(profile?.user_id);
  const navigate = useNavigate();

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading exam history...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <History className="w-8 h-8" />
            Exam History
          </h1>
          <p className="text-muted-foreground mt-2">
            Review your past exam performances and track your progress
          </p>
        </div>

        {/* Stats Overview */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-foreground mb-2">{history.length}</div>
                <p className="text-sm text-muted-foreground">Total Exams</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-foreground mb-2">
                  {Math.round(history.reduce((acc, h) => acc + h.score, 0) / history.length)}%
                </div>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-foreground mb-2">
                  {history.filter(h => h.score >= 60).length}
                </div>
                <p className="text-sm text-muted-foreground">Passed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-foreground mb-2">
                  {Math.round(history.reduce((acc, h) => acc + h.time_taken_minutes, 0) / history.length)}m
                </div>
                <p className="text-sm text-muted-foreground">Avg Time</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History List */}
        {history.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No exam history yet</h3>
              <p className="text-muted-foreground mb-6">
                Take your first exam to start building your history and track your progress.
              </p>
              <Button onClick={() => navigate('/exams')}>
                Browse Exams
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {history.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        {result.exams?.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(result.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={result.score >= (result.exams?.passing_score || 60) ? "default" : "destructive"}
                    >
                      {result.score >= (result.exams?.passing_score || 60) ? "PASSED" : "FAILED"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>{result.score}%</strong> Score
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {result.correct_answers}/{result.total_questions} Correct
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {result.time_taken_minutes} minutes
                      </span>
                    </div>

                    <div>
                      <Badge variant="outline" className="text-xs">
                        {result.exams?.subject}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/exam/${result.exam_id}`)}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Retake
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate('/exams')}>
            Back to Exams
          </Button>
        </div>
      </div>
    </Layout>
  );
}