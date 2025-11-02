import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, Heart, TrendingUp, Clock, Shield, Star, Users, Briefcase, ExternalLink, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CareerPath {
  id: string;
  title: string;
  description: string;
  category: string;
  salaryRange: string;
  icon: string;
  marketDemand: string;
  workLifeBalance: string;
  jobSecurity: string;
}

const categories = [
  { id: 'all', label: 'All', icon: '🌟' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { id: 'design', label: 'Design', icon: '🎨' },
  { id: 'business', label: 'Business', icon: '📊' },
  { id: 'education', label: 'Education', icon: '📚' }
];

const careerData: CareerPath[] = [
  {
    id: '1',
    title: 'Software Engineer',
    description: 'A software engineer designs, develops, and maintains software applications and systems. They solve complex problems using programming languages and development tools.',
    category: 'technology',
    salaryRange: '₹3,00,000 - ₹12,00,000 per year',
    icon: '💻',
    marketDemand: 'High',
    workLifeBalance: 'Good',
    jobSecurity: 'High'
  },
  {
    id: '2',
    title: 'Chartered Accountant',
    description: 'A Chartered Accountant (CA) is a professional who provides financial advice, auditing services, and tax consulting to businesses and individuals.',
    category: 'finance',
    salaryRange: '₹5,00,000 - ₹20,00,000 per year',
    icon: '📊',
    marketDemand: 'High',
    workLifeBalance: 'Challenging',
    jobSecurity: 'High'
  },
  {
    id: '3',
    title: 'Doctor',
    description: 'A doctor is a medical professional who diagnoses, treats, and prevents diseases and injuries. They provide medical care and support to patients.',
    category: 'healthcare',
    salaryRange: '₹6,00,000 - ₹25,00,000 per year',
    icon: '❤️',
    marketDemand: 'High',
    workLifeBalance: 'Challenging',
    jobSecurity: 'High'
  },
  {
    id: '4',
    title: 'UX/UI Designer',
    description: 'Create user-friendly and visually appealing digital interfaces. Focus on user experience research and interface design.',
    category: 'design',
    salaryRange: '₹4,00,000 - ₹15,00,000 per year',
    icon: '🎨',
    marketDemand: 'High',
    workLifeBalance: 'Excellent',
    jobSecurity: 'Medium'
  },
  {
    id: '5',
    title: 'Data Scientist',
    description: 'Analyze complex data to help organizations make informed decisions. Use statistical methods and machine learning.',
    category: 'technology',
    salaryRange: '₹5,00,000 - ₹18,00,000 per year',
    icon: '📈',
    marketDemand: 'Very High',
    workLifeBalance: 'Good',
    jobSecurity: 'High'
  },
  {
    id: '6',
    title: 'Marketing Manager',
    description: 'Develop and execute marketing strategies to promote products and services. Lead marketing campaigns and teams.',
    category: 'business',
    salaryRange: '₹4,00,000 - ₹16,00,000 per year',
    icon: '📢',
    marketDemand: 'High',
    workLifeBalance: 'Good',
    jobSecurity: 'Medium'
  }
];

interface CareerExplorerProps {
  selectedStream?: string | null;
}

export const CareerExplorer: React.FC<CareerExplorerProps> = ({ selectedStream }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredCareers, setFilteredCareers] = useState<CareerPath[]>(careerData);
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let filtered = careerData;

    // Filter by selected stream (for 10th to inter students)
    if (selectedStream) {
      const streamCareerMapping: { [key: string]: string[] } = {
        'mpc': ['technology', 'technology'], // Math, Physics, Chemistry -> Engineering, Science
        'bipc': ['healthcare', 'technology'], // Biology, Physics, Chemistry -> Medical, Pharmacy
        'cec': ['business', 'business'], // Civics, Economics, Commerce -> Business, Finance
        'hec': ['education', 'business'], // History, Economics, Civics -> Humanities, Social Sciences
        'mec': ['business', 'finance'], // Math, Economics, Commerce -> Finance, Business Analytics
        'other': ['all'] // Show all careers for other streams
      };

      const relevantCategories = streamCareerMapping[selectedStream] || ['all'];
      if (!relevantCategories.includes('all')) {
        filtered = filtered.filter(career => relevantCategories.includes(career.category));
      }
    }

    // Filter by category (if not already filtered by stream)
    if (selectedCategory !== 'all' && !selectedStream) {
      filtered = filtered.filter(career => career.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(career =>
        career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCareers(filtered);
  }, [searchTerm, selectedCategory, selectedStream]);

  const getBadgeVariant = (value: string) => {
    switch (value.toLowerCase()) {
      case 'high': 
      case 'very high': 
        return 'default';
      case 'medium': 
        return 'secondary';
      case 'good': 
      case 'excellent': 
        return 'default';
      case 'challenging': 
        return 'destructive';
      default: 
        return 'outline';
    }
  };

  const getIcon = (type: string, value: string) => {
    switch (type) {
      case 'demand':
        return <TrendingUp className="w-3 h-3" />;
      case 'balance':
        return <Clock className="w-3 h-3" />;
      case 'security':
        return <Shield className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleCareerClick = (career: CareerPath) => {
    setSelectedCareer(career);
    setIsModalOpen(true);
  };

  const handleExploreCareerPath = (careerId: string) => {
    setIsModalOpen(false);
    window.location.href = `/career/${careerId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-8 animate-fade-in">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Career Explorer
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          Discover detailed career paths, requirements, and opportunities.
        </p>
        <p className="text-sm text-primary font-medium">
          Explore comprehensive information about different professions and plan your future.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <Card className="text-center p-4 hover:shadow-lg transition-all duration-300">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-green-600 font-bold">100+</span>
          </div>
          <div className="text-sm font-medium">Career Paths</div>
        </Card>
        <Card className="text-center p-4 hover:shadow-lg transition-all duration-300">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-blue-600">📋</span>
          </div>
          <div className="text-sm font-medium">Detailed Roadmaps</div>
        </Card>
        <Card className="text-center p-4 hover:shadow-lg transition-all duration-300">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-purple-600">⚡</span>
          </div>
          <div className="text-sm font-medium">Real-time Insights</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search careers, skills, or requirements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              className="transition-all duration-200 hover:scale-105"
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="text-sm text-muted-foreground">
          {filteredCareers.length} career{filteredCareers.length !== 1 ? 's' : ''}
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter by category
        </Button>
      </div>

      {/* Career Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map((career, index) => (
          <Card 
            key={career.id} 
            className="group hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 cursor-pointer animate-scale-in hover:scale-105 border-0 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/20"
            style={{ animationDelay: `${500 + index * 100}ms` }}
            onClick={() => handleCareerClick(career)}
          >
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-200/50 dark:shadow-green-800/50">
                  <span className="text-2xl">{career.icon}</span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-green-600 transition-colors duration-300">
                    {career.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {career.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-foreground">Category:</div>
                  <Badge variant="outline" className="mt-1 capitalize border-green-300 text-green-700 dark:border-green-600 dark:text-green-400">
                    {career.category}
                  </Badge>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 p-3 rounded-lg border border-green-200/50 dark:border-green-800/50">
                  <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Salary Range:
                  </div>
                  <div className="text-sm font-semibold text-green-800 dark:text-green-300">
                    {career.salaryRange}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {getIcon('demand', career.marketDemand)}
                      <span>Market Demand:</span>
                    </div>
                    <Badge variant={getBadgeVariant(career.marketDemand)} className="text-xs">
                      {career.marketDemand}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {getIcon('balance', career.workLifeBalance)}
                      <span>Work-Life Balance:</span>
                    </div>
                    <Badge variant={getBadgeVariant(career.workLifeBalance)} className="text-xs">
                      {career.workLifeBalance}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {getIcon('security', career.jobSecurity)}
                      <span>Job Security:</span>
                    </div>
                    <Badge variant={getBadgeVariant(career.jobSecurity)} className="text-xs">
                      {career.jobSecurity}
                    </Badge>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 border-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCareerClick(career);
                  }}
                >
                  Quick Preview →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCareers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium mb-2">No careers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to discover more career paths.
          </p>
        </div>
      )}

      {/* Attractive Career Preview Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 dark:from-gray-900 dark:via-green-950/20 dark:to-emerald-950/30 border-0 shadow-2xl shadow-green-500/20">
          {selectedCareer && (
            <div className="space-y-6">
              {/* Header */}
              <DialogHeader className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900 dark:to-emerald-800 rounded-2xl flex items-center justify-center shadow-xl shadow-green-200/50 dark:shadow-green-800/50">
                    <span className="text-4xl">{selectedCareer.icon}</span>
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {selectedCareer.title}
                    </DialogTitle>
                    <p className="text-muted-foreground mt-2 text-lg">
                      {selectedCareer.description}
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                      <Badge variant="outline" className="capitalize border-green-300 text-green-700 dark:border-green-600 dark:text-green-400">
                        {selectedCareer.category}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                        {selectedCareer.marketDemand} Demand
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Salary & Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-green-200/50 dark:border-green-800/50 shadow-lg shadow-green-100/50 dark:shadow-green-900/50">
                  <CardContent className="p-4 text-center">
                    <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                      Salary Range
                    </div>
                    <div className="text-lg font-bold text-green-800 dark:text-green-300">
                      {selectedCareer.salaryRange}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 border-blue-200/50 dark:border-blue-800/50 shadow-lg shadow-blue-100/50 dark:shadow-blue-900/50">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                      Market Demand
                    </div>
                    <div className="text-lg font-bold text-blue-800 dark:text-blue-300">
                      {selectedCareer.marketDemand}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border-purple-200/50 dark:border-purple-800/50 shadow-lg shadow-purple-100/50 dark:shadow-purple-900/50">
                  <CardContent className="p-4 text-center">
                    <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                      Job Security
                    </div>
                    <div className="text-lg font-bold text-purple-800 dark:text-purple-300">
                      {selectedCareer.jobSecurity}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/40 dark:to-yellow-950/40 border-orange-200/50 dark:border-orange-800/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                      <Clock className="w-5 h-5" />
                      Work-Life Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={getBadgeVariant(selectedCareer.workLifeBalance)} className="text-sm">
                      {selectedCareer.workLifeBalance}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      This career offers {selectedCareer.workLifeBalance.toLowerCase()} work-life balance with flexible opportunities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40 border-rose-200/50 dark:border-rose-800/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                      <Users className="w-5 h-5" />
                      Career Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Excellent Growth Potential</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Multiple career advancement paths with leadership opportunities.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={() => handleExploreCareerPath(selectedCareer.id)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 h-12 text-lg"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Explore Full Career Path
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-950/20 h-12"
                >
                  <X className="w-5 h-5 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};