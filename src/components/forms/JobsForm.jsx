import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const JobsForm = ({ onClose }) => {
  const { addEntry } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    job_type: '',
    salary: '',
    application_link: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const jobTypeOptions = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title && formData.company_name && formData.location && formData.job_type && formData.application_link && formData.description) {
      setLoading(true);
      const success = await addEntry('jobs', formData);
      setLoading(false);

      if (success) {
        setFormData({
          title: '',
          company_name: '',
          location: '',
          job_type: '',
          salary: '',
          application_link: '',
          description: ''
        });
        alert('Job added successfully!');
        onClose();
      } else {
        alert('Failed to add job. Please try again.');
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
        <h2 className="text-xl font-bold mb-4 text-card-foreground">Add New Job</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="e.g., Frontend Developer – React.js"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Company Name *
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="e.g., Google"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="e.g., Remote / New Delhi / Bangalore"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Job Type *
            </label>
            <select
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            >
              <option value="">Select job type</option>
              {jobTypeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Salary / Stipend
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="e.g., ₹8,00,000 - ₹12,00,000 per annum"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Application Link / Website *
            </label>
            <input
              type="url"
              name="application_link"
              value={formData.application_link}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="https://careers.company.com"
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
              placeholder="Short summary of role & requirements"
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
              {loading ? 'Adding...' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobsForm;