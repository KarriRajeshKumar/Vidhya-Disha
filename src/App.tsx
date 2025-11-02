import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppProvider } from './contexts/AppContext';
import { useParams } from 'react-router-dom';
import CareerHome from "./pages/CareerHome";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CareerPaths from "./pages/CareerPaths";
import CareerDetail from "./pages/CareerDetail";
import DegreeDetailPage from "./pages/DegreeDetailPage";
import Teams from "./pages/Teams";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import AIMentor from "./pages/AIMentor";
import Exams from "./pages/Exams";
import ExamSession from "./pages/ExamSession";
import ExamResults from "./pages/ExamResults";
import ExamHistory from "./pages/ExamHistory";
import RequestExamTopic from "./pages/RequestExamTopic";
import NotFound from "./pages/NotFound";
import DashboardPage from './pages/DashboardPage';
import CategoryPage from './pages/CategoryPage';
import UpToDate from './pages/UpToDate';
import MapPage from './pages/MapPage';
import ResetPassword from './pages/ResetPassword';
import { SupabaseTest } from "./components/debug/SupabaseTest";

const queryClient = new QueryClient();

function CategoryPageWrapper() {
  const { category } = useParams();
  if (!category) return <div className="p-6">No category</div>;
  return <CategoryPage category={category} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CareerHome />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/test-supabase" element={<SupabaseTest />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard-page" element={<DashboardPage />} />
            <Route path="/category/:category" element={<CategoryPageWrapper />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/career-paths" element={
              <ProtectedRoute>
                <CareerPaths />
              </ProtectedRoute>
            } />
            <Route path="/career/:careerId" element={
              <ProtectedRoute>
                <CareerDetail />
              </ProtectedRoute>
            } />
            <Route path="/degree-detail/:branchId" element={
              <ProtectedRoute>
                <DegreeDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/teams" element={
              <ProtectedRoute>
                <Teams />
              </ProtectedRoute>
            } />
            <Route path="/achievements" element={
              <ProtectedRoute>
                <Achievements />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/ai-mentor" element={
              <ProtectedRoute>
                <AIMentor />
              </ProtectedRoute>
            } />
            <Route path="/exams" element={
              <ProtectedRoute>
                <Exams />
              </ProtectedRoute>
            } />
            <Route path="/exam/:examId" element={
              <ProtectedRoute>
                <ExamSession />
              </ProtectedRoute>
            } />
            <Route path="/exam-results/:resultId" element={
              <ProtectedRoute>
                <ExamResults />
              </ProtectedRoute>
            } />
            <Route path="/exam-history" element={
              <ProtectedRoute>
                <ExamHistory />
              </ProtectedRoute>
            } />
            <Route path="/request-exam-topic" element={
              <ProtectedRoute>
                <RequestExamTopic />
              </ProtectedRoute>
            } />
            <Route path="/up-to-date" element={
              <ProtectedRoute>
                <UpToDate />
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;