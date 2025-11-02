import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Card } from '../components/ui/card';
import AddFormModal from '../components/AddFormModal';
import { Zap, Briefcase, GraduationCap, Award, Plus, ArrowRight, ArrowLeft } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { getCategoryCount } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animatedCounts, setAnimatedCounts] = useState({});

  const categories = [
    {
      id: 'aiTools',
      title: 'AI Tools',
      description: 'Cutting-edge AI platforms and innovative tools for productivity and creativity',
      icon: Zap,
      gradient: 'from-blue-500 to-purple-600',
      count: getCategoryCount('aiTools')
    },
    {
      id: 'jobs',
      title: 'Career Opportunities',
      description: 'Premium job listings and career advancement opportunities',
      icon: Briefcase,
      gradient: 'from-green-500 to-teal-600',
      count: getCategoryCount('jobs')
    },
    {
      id: 'internships',
      title: 'Internship Programs',
      description: 'Launch your career with hands-on experience and mentorship',
      icon: GraduationCap,
      gradient: 'from-orange-500 to-red-600',
      count: getCategoryCount('internships')
    },
    {
      id: 'scholarships',
      title: 'Scholarship Programs',
      description: 'Financial aid and funding opportunities for education',
      icon: Award,
      gradient: 'from-pink-500 to-rose-600',
      count: getCategoryCount('scholarships')
    }
  ];

  // Animate counts on load
  useEffect(() => {
    const timer = setTimeout(() => {
      const newAnimatedCounts = {};
      categories.forEach(cat => {
        newAnimatedCounts[cat.id] = cat.count;
      });
      setAnimatedCounts(newAnimatedCounts);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleExplore = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const handleAdd = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* Back Button */}
          <div className="mb-8 animate-fade-in">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-primary transition-colors duration-300 hover:bg-primary/5 rounded-lg group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>

          <div className="text-center animate-fade-in">
            <h1 className="text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Stay Up to Date
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover the latest AI tools, career opportunities, internships, and scholarships.
              Your gateway to staying ahead in the rapidly evolving tech landscape.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-primary font-medium">Always Updated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-r ${cat.gradient} flex items-center justify-center shadow-lg`}>
                <cat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {animatedCounts[cat.id] || 0}
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                {cat.id.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.id}
                className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                <div className="relative p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${category.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {animatedCounts[category.id] || 0}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        Entries
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>

                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleExplore(category.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-primary hover:shadow-primary-lg group-hover:scale-105"
                    >
                      <span className="font-medium">Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => handleAdd(category.id)}
                      className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-3 rounded-lg hover:bg-secondary/80 transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Add</span>
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '800ms' }}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <span className="text-muted-foreground font-medium">
              Content updated regularly • Community driven • Always fresh
            </span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AddFormModal
          category={selectedCategory}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default DashboardPage;