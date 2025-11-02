import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Target, TrendingUp } from "lucide-react";
import { useExams } from "@/hooks/useExams";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

export default function Exams() {
  const { exams, loading: examsLoading, error } = useExams();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  const handleStartExam = (examId: string) => {
    navigate(`/exam/${examId}`);
  };

  if (examsLoading || profileLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading exams...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-500">Error: {error}</div>
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
            <BookOpen className="w-8 h-8" />
            Available Exams
          </h1>
          <p className="text-muted-foreground mt-2">
            Personalized exams based on your interests: {profile?.interests?.join(', ') || 'None set'}
          </p>
        </div>

        {/* Exams Grid */}
        {exams.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No exams available</h3>
            <p className="text-muted-foreground">
              There are currently no exams in the system. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="bg-card border-border shadow-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">{exam.title}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {exam.subject}
                      </Badge>
                    </div>
                    <Badge
                      variant={exam.difficulty === 'easy' ? 'default' :
                              exam.difficulty === 'medium' ? 'secondary' : 'destructive'}
                    >
                      {exam.difficulty}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {exam.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{exam.duration_minutes} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="w-4 h-4" />
                      <span>{exam.total_questions} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>Passing score: {exam.passing_score}%</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleStartExam(exam.id)}
                    className="w-full"
                  >
                    Start Exam
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="w-5 h-5" />
                View History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Review your past exam performances and track your progress.
              </p>
              <Button variant="outline" onClick={() => navigate('/exam-history')}>
                View Exam History
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="w-5 h-5" />
                Request New Topic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Can't find an exam for your interest? Request a new exam topic.
              </p>
              <Button variant="outline" onClick={() => navigate('/request-exam-topic')}>
                Request Topic
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}