import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/hooks/useProfile";
import { useCareerData } from "@/hooks/useCareerData";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, DollarSign, Clock, TrendingUp, Users, Star, CheckCircle, Loader2, Play, Brain } from "lucide-react";
import { CareerQuiz } from "@/components/quiz/CareerQuiz";
import { QuizResults } from "@/components/quiz/QuizResults";
import { CareerExplorer } from "@/components/career/CareerExplorer";
import { StreamContent } from "@/components/career/StreamContent";
import { DegreeBranchContent } from "@/components/career/DegreeBranchContent";
import { AptitudeQuiz } from "@/components/quiz/AptitudeQuiz";
import { AptitudeResults } from "@/components/quiz/AptitudeResults";
import { DegreeAptitudeQuiz } from "@/components/quiz/DegreeAptitudeQuiz";
import { DegreeAptitudeResults } from "@/components/quiz/DegreeAptitudeResults";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileAnalysis {
  technical: number;
  creative: number;
  analytical: number;
  leadership: number;
  communication: number;
  regionalImpact: number;
}

interface CareerRecommendation {
  title: string;
  description: string;
  matchScore: number;
  salaryRange: string;
  marketDemand: string;
  workLifeBalance: string;
  jobSecurity: string;
  category: string;
  icon: string;
  profileMatch: ProfileAnalysis;
}

interface AptitudeResult {
  mathematics: number;
  physics: number;
  chemistry: number;
  biology: number;
  commerce: number;
  humanities: number;
  arts: number;
  technology: number;
}

interface DegreeAptitudeResult {
  computerScience: number;
  engineering: number;
  medicine: number;
  business: number;
  arts: number;
  science: number;
  law: number;
  design: number;
}

export default function CareerPaths() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("quiz");
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { careerPaths, userProgress, loading: careerLoading, startCareerPath } = useCareerData();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    sessionId: string;
    profileAnalysis: ProfileAnalysis;
    careerRecommendations: CareerRecommendation[];
  } | null>(null);
  const [checkingQuizStatus, setCheckingQuizStatus] = useState(true);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);

  // Aptitude quiz states for 10th to inter students
  const [aptitudeCompleted, setAptitudeCompleted] = useState(false);
  const [aptitudeResults, setAptitudeResults] = useState<AptitudeResult | null>(null);
  const [showAptitudeResults, setShowAptitudeResults] = useState(false);
  const [showStreamSelection, setShowStreamSelection] = useState(false);
  const [showAptitudeQuiz, setShowAptitudeQuiz] = useState(false);

  // Degree aptitude quiz states for inter to degree students
  const [degreeAptitudeCompleted, setDegreeAptitudeCompleted] = useState(false);
  const [degreeAptitudeResults, setDegreeAptitudeResults] = useState<DegreeAptitudeResult | null>(null);
  const [showDegreeAptitudeResults, setShowDegreeAptitudeResults] = useState(false);
  const [showDegreeBranchSelection, setShowDegreeBranchSelection] = useState(false);
  const [selectedDegreeBranch, setSelectedDegreeBranch] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkQuizCompletion();
    }
  }, [user]);

  // Check for stored aptitude results for 10th to inter students (always called)
  useEffect(() => {
    const storedResults = localStorage.getItem('aptitude_results');
    if (storedResults) {
      try {
        const results = JSON.parse(storedResults);
        setAptitudeResults(results);
        setAptitudeCompleted(true);
        setShowStreamSelection(true);
      } catch (error) {
        console.error('Error parsing stored aptitude results:', error);
        localStorage.removeItem('aptitude_results');
      }
    }
  }, []);

  // Check for stored degree aptitude results for inter to degree students
  useEffect(() => {
    const storedResults = localStorage.getItem('degree_aptitude_results');
    if (storedResults) {
      try {
        const results = JSON.parse(storedResults);
        setDegreeAptitudeResults(results);
        setDegreeAptitudeCompleted(true);
        setShowDegreeBranchSelection(true);
      } catch (error) {
        console.error('Error parsing stored degree aptitude results:', error);
        localStorage.removeItem('degree_aptitude_results');
      }
    }
  }, []);

  const checkQuizCompletion = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setQuizCompleted(true);
        const recommendations = typeof data.career_recommendations === 'object' && data.career_recommendations 
          ? (data.career_recommendations as any).recommendations || data.career_recommendations
          : [];
        
        setQuizResults({
          sessionId: data.session_id,
          profileAnalysis: data.profile_analysis as unknown as ProfileAnalysis,
          careerRecommendations: Array.isArray(recommendations) ? recommendations : []
        });
        setActiveTab("explorer");
      }
    } catch (error) {
      console.error('Error checking quiz completion:', error);
    } finally {
      setCheckingQuizStatus(false);
    }
  };

  const handleQuizComplete = (results: {
    sessionId: string;
    profileAnalysis: ProfileAnalysis;
    careerRecommendations: CareerRecommendation[];
  }) => {
    setQuizResults(results);
    setQuizCompleted(true);
    setActiveTab("results");
  };

  const handleContinueToExplorer = () => {
    setActiveTab("explorer");
  };

  const handleAptitudeComplete = (results: AptitudeResult) => {
    // Store results in localStorage
    localStorage.setItem('aptitude_results', JSON.stringify(results));
    setAptitudeResults(results);
    setAptitudeCompleted(true);
    setShowAptitudeResults(true);
  };

  const handleContinueToStreams = () => {
    setShowAptitudeResults(false);
    setShowStreamSelection(true);
  };

  const handleRetakeAptitude = () => {
    // Clear stored results
    localStorage.removeItem('aptitude_results');
    setAptitudeResults(null);
    setAptitudeCompleted(false);
    setShowAptitudeResults(false);
    setShowStreamSelection(false);
    setShowAptitudeQuiz(true);
  };

  const handleDegreeAptitudeComplete = (results: DegreeAptitudeResult) => {
    // Store results in localStorage
    localStorage.setItem('degree_aptitude_results', JSON.stringify(results));
    setDegreeAptitudeResults(results);
    setDegreeAptitudeCompleted(true);
    setShowDegreeAptitudeResults(true);
  };

  const handleContinueToDegreeBranches = () => {
    setShowDegreeAptitudeResults(false);
    setShowDegreeBranchSelection(true);
  };

  const handleRetakeDegreeAptitude = () => {
    // Clear stored results
    localStorage.removeItem('degree_aptitude_results');
    setDegreeAptitudeResults(null);
    setDegreeAptitudeCompleted(false);
    setShowDegreeAptitudeResults(false);
    setShowDegreeBranchSelection(false);
  };

  if (profileLoading || careerLoading || checkingQuizStatus) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Please Log In</h1>
            <p className="text-muted-foreground">You need to be logged in to access career paths.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Determine if user is in 10th to inter level
  const savedEducationLevel = localStorage.getItem('education_level');
  const profileEducationLevel = (profile as any)?.education_level;
  const is10thToInter = (savedEducationLevel || profileEducationLevel) === '10th_to_inter';

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {is10thToInter ? 'Intermediate Career Guidance' : 'AI Career Discovery'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {is10thToInter
              ? 'Choose your intermediate stream to explore career opportunities'
              : 'Take our AI-powered quiz to unlock personalized career recommendations'
            }
          </p>
        </div>

        {/* Content based on education level */}
        {is10thToInter ? (
          <div className="space-y-8">
            {/* Aptitude-Based Career Guidance */}
            <div className="max-w-6xl mx-auto">
              {aptitudeCompleted && aptitudeResults && !showStreamSelection ? (
                <AptitudeResults
                  results={aptitudeResults}
                  onContinueToStreams={handleContinueToStreams}
                />
              ) : showStreamSelection ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Choose Your Intermediate Stream</h2>
                    <p className="text-muted-foreground mb-6">
                      Based on your aptitude results, select a stream to explore detailed career guidance
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleRetakeAptitude}
                      className="mb-4"
                    >
                      🔄 Retake Aptitude Assessment
                    </Button>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6">
                    {[
                      { id: 'mpc', name: 'MPC (Math, Physics, Chemistry)', icon: '🔬', description: 'Perfect for engineering, medicine, and science careers' },
                      { id: 'bipc', name: 'BiPC (Biology, Physics, Chemistry)', icon: '🧬', description: 'Ideal for medical, pharmacy, and life sciences' },
                      { id: 'mbipc', name: 'MBiPC (Math, Biology, Physics, Chemistry)', icon: '🧪', description: 'Comprehensive science stream for medical and research careers' },
                      { id: 'cec', name: 'CEC (Civics, Economics, Commerce)', icon: '📊', description: 'Great for business, finance, and commerce fields' },
                      { id: 'hec', name: 'HEC (History, Economics, Civics)', icon: '📚', description: 'Suitable for humanities and social sciences' },
                      { id: 'hpc', name: 'HPC (History, Political Science, Civics)', icon: '🏛️', description: 'Perfect for law, politics, and government careers' },
                      { id: 'hpp', name: 'HPP (History, Political Science, Psychology)', icon: '🧠', description: 'Ideal for psychology, counseling, and social work' },
                      { id: 'mec', name: 'MEC (Math, Economics, Commerce)', icon: '💰', description: 'Excellent for finance, accounting, and business analytics' },
                      { id: 'other', name: 'Other Streams', icon: '🎯', description: 'Explore careers based on your unique interests' }
                    ].map((stream) => (
                      <Card
                        key={stream.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          selectedStream === stream.id
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedStream(stream.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl mb-4">{stream.icon}</div>
                          <h3 className="font-semibold text-lg mb-2">{stream.name}</h3>
                          <p className="text-sm text-muted-foreground">{stream.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {selectedStream && (
                    <div className="mt-8">
                      <StreamContent selectedStream={selectedStream} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Discover Your Perfect Career Path</h2>
                    <p className="text-muted-foreground text-lg mb-6">
                      Take our comprehensive aptitude assessment to understand your interests and strengths
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg max-w-2xl mx-auto">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What you'll get:</h3>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Detailed interest analysis across 8 subjects</li>
                        <li>• Personalized stream recommendations</li>
                        <li>• Career insights and guidance</li>
                        <li>• Complete syllabus, roadmap, and resources</li>
                      </ul>
                    </div>
                  </div>
                  <AptitudeQuiz onQuizComplete={handleAptitudeComplete} />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Dynamic aptitude-based flow for inter to degree students */
          <div className="space-y-8">
            <div className="max-w-6xl mx-auto">
              {degreeAptitudeCompleted && degreeAptitudeResults && !showDegreeBranchSelection ? (
                <DegreeAptitudeResults
                  results={degreeAptitudeResults}
                  onContinueToBranches={handleContinueToDegreeBranches}
                  onRetakeQuiz={handleRetakeDegreeAptitude}
                />
              ) : showDegreeBranchSelection ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Choose Your Degree Branch</h2>
                    <p className="text-muted-foreground mb-6">
                      Based on your aptitude results, select a degree branch to explore detailed career guidance
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleRetakeDegreeAptitude}
                      className="mb-4"
                    >
                      🔄 Retake Degree Aptitude Assessment
                    </Button>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6">
                    {[
                      { id: 'computerScience', name: 'Computer Science', icon: '💻', description: 'Programming, AI, software development' },
                      { id: 'engineering', name: 'Engineering', icon: '⚙️', description: 'Technical design and innovation' },
                      { id: 'medicine', name: 'Medicine (MBBS)', icon: '🏥', description: 'Healthcare and medical practice' },
                      { id: 'business', name: 'Business & Management', icon: '📊', description: 'Corporate management and entrepreneurship' },
                      { id: 'arts', name: 'Arts & Humanities', icon: '🎨', description: 'Literature, philosophy, social sciences' },
                      { id: 'science', name: 'Pure Sciences', icon: '🔬', description: 'Research and advanced scientific study' },
                      { id: 'law', name: 'Law & Justice', icon: '⚖️', description: 'Legal practice and justice system' },
                      { id: 'design', name: 'Design & Creative', icon: '🎨', description: 'Visual design and creative industries' }
                    ].map((branch) => (
                      <Card
                        key={branch.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          selectedDegreeBranch === branch.id
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedDegreeBranch(branch.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl mb-4">{branch.icon}</div>
                          <h3 className="font-semibold text-lg mb-2">{branch.name}</h3>
                          <p className="text-sm text-muted-foreground">{branch.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {selectedDegreeBranch && (
                    <div className="mt-8 space-y-6">
                      <DegreeBranchContent selectedBranch={selectedDegreeBranch} />

                      <div className="text-center pt-8 border-t border-border">
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => navigate(`/degree-detail/${selectedDegreeBranch}`)}
                        >
                          🔍 Explore in Detail
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                          Get comprehensive information about this branch including syllabus, career opportunities, and more
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Discover Your Degree Path</h2>
                    <p className="text-muted-foreground text-lg mb-6">
                      Take our comprehensive degree aptitude assessment to understand your interests and find the perfect branch
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg max-w-2xl mx-auto">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What you'll get:</h3>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Detailed interest analysis across 8 degree branches</li>
                        <li>• Personalized branch recommendations</li>
                        <li>• Complete syllabus, roadmap, and resources</li>
                        <li>• Career opportunities and salary insights</li>
                      </ul>
                    </div>
                  </div>
                  <DegreeAptitudeQuiz onQuizComplete={handleDegreeAptitudeComplete} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}