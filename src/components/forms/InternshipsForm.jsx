import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const InternshipsForm = ({ onClose }) => {
  const { addEntry } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    company_organization: '',
    duration: '',
    location: '',
    stipend: '',
    application_deadline: '',
    application_link: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const locationOptions = [
    'On-site',
    'Remote',
    'Hybrid'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title && formData.company_organization && formData.duration && formData.location && formData.application_deadline && formData.application_link && formData.description) {
      setLoading(true);
      const success = await addEntry('internships', formData);
      setLoading(false);

      if (success) {
        setFormData({
          title: '',
          company_organization: '',
          duration: '',
          location: '',
          stipend: '',
          application_deadline: '',
          application_link: '',
          description: ''
        });
        alert('Internship added successfully!');
        onClose();
      } else {
        alert('Failed to add internship. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-card-foreground">Add New Internship</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Internship Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="e.g., AI Research Intern"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Company / Organization *
            </label>
            <input
              type="text"
              name="company_organization"
              value={formData.company_organization}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="e.g., Microsoft Research"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Duration *
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="e.g., 3 months, 6 months"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Location *
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            >
              <option value="">Select location type</option>
              {locationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Stipend
            </label>
            <input
              type="text"
              name="stipend"
              value={formData.stipend}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="e.g., ₹15,000 per month"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Application Deadline *
            </label>
            <input
              type="text"
              name="application_deadline"
              value={formData.application_deadline}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="e.g., 30th November 2024"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Application Link *
            </label>
            <input
              type="url"
              name="application_link"
              value={formData.application_link}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="https://careers.company.com/internships"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="Overview of work & skills required"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-border rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 shadow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Internship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InternshipsForm;