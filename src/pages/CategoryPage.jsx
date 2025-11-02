import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Card } from '../components/ui/card';
import AIToolsForm from '../components/forms/AIToolsForm';
import JobsForm from '../components/forms/JobsForm';
import InternshipsForm from '../components/forms/InternshipsForm';
import ScholarshipsForm from '../components/forms/ScholarshipsForm';

const CategoryPage = ({ category }) => {
  const navigate = useNavigate();
  const { getCategoryData } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryTitles = {
    aiTools: 'AI Tools',
    jobs: 'Jobs',
    internships: 'Internships',
    scholarships: 'Scholarships'
  };

  const entries = getCategoryData(category);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/dashboard-page')}
              className="text-primary hover:text-primary/80 mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-foreground">{categoryTitles[category]}</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/80 transition-colors"
          >
            + Add New
          </button>
        </div>

        {entries.length === 0 ? (
          <Card className="p-12 text-center bg-card border-border">
            <h3 className="text-xl font-semibold text-card-foreground mb-2">No entries yet</h3>
            <p className="text-muted-foreground">
              Be the first to add an entry to this category!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entries.map((entry) => (
              <Card key={entry.id} className="p-6 bg-card border-border">
                <h3 className="text-xl font-semibold text-card-foreground mb-2">{entry.title}</h3>
                <p className="text-muted-foreground mb-4">{entry.description}</p>

                {/* AI Tools specific fields */}
                {category === 'aiTools' && (
                  <div className="mb-4 space-y-2">
                    {entry.category && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Category:</span>
                        <span className="text-sm bg-secondary px-2 py-1 rounded">{entry.category}</span>
                      </div>
                    )}
                    {entry.pricing && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Pricing:</span>
                        <span className="text-sm bg-secondary px-2 py-1 rounded">{entry.pricing}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Jobs specific fields */}
                {category === 'jobs' && (
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Company:</span>
                      <span className="text-sm">{entry.company_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Location:</span>
                      <span className="text-sm">{entry.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Type:</span>
                      <span className="text-sm bg-secondary px-2 py-1 rounded">{entry.job_type}</span>
                    </div>
                    {entry.salary && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Salary:</span>
                        <span className="text-sm">{entry.salary}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Internships specific fields */}
                {category === 'internships' && (
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Organization:</span>
                      <span className="text-sm">{entry.company_organization}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Duration:</span>
                      <span className="text-sm">{entry.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Location:</span>
                      <span className="text-sm bg-secondary px-2 py-1 rounded">{entry.location}</span>
                    </div>
                    {entry.stipend && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Stipend:</span>
                        <span className="text-sm">{entry.stipend}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Deadline:</span>
                      <span className="text-sm text-red-600">{entry.application_deadline}</span>
                    </div>
                  </div>
                )}

                {/* Scholarships specific fields */}
                {category === 'scholarships' && (
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Provider:</span>
                      <span className="text-sm">{entry.provider_organization}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Eligibility:</span>
                      <span className="text-sm">{entry.eligibility}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Deadline:</span>
                      <span className="text-sm text-red-600">{entry.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Amount:</span>
                      <span className="text-sm font-semibold text-green-600">{entry.amount_benefits}</span>
                    </div>
                  </div>
                )}

                <a
                  href={entry.link || entry.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline"
                >
                  {category === 'jobs' || category === 'internships' || category === 'scholarships' ? 'Apply Now →' : 'Visit Link →'}
                </a>
              </Card>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <>
          {category === 'aiTools' && <AIToolsForm onClose={handleCloseModal} />}
          {category === 'jobs' && <JobsForm onClose={handleCloseModal} />}
          {category === 'internships' && <InternshipsForm onClose={handleCloseModal} />}
          {category === 'scholarships' && <ScholarshipsForm onClose={handleCloseModal} />}
        </>
      )}
    </div>
  );
};

export default CategoryPage;