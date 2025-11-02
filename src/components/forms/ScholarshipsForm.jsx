import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const ScholarshipsForm = ({ onClose }) => {
  const { addEntry } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    provider_organization: '',
    eligibility: '',
    deadline: '',
    amount_benefits: '',
    application_link: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title && formData.provider_organization && formData.eligibility && formData.deadline && formData.amount_benefits && formData.application_link && formData.description) {
      setLoading(true);
      const success = await addEntry('scholarships', formData);
      setLoading(false);

      if (success) {
        setFormData({
          title: '',
          provider_organization: '',
          eligibility: '',
          deadline: '',
          amount_benefits: '',
          application_link: '',
          description: ''
        });
        alert('Scholarship added successfully!');
        onClose();
      } else {
        alert('Failed to add scholarship. Please try again.');
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
        <h2 className="text-xl font-bold mb-4 text-card-foreground">Add New Scholarship</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Scholarship Name *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="e.g., Microsoft AI for Good Scholarship"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Provider / Organization *
            </label>
            <input
              type="text"
              name="provider_organization"
              value={formData.provider_organization}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="e.g., Microsoft"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Eligibility *
            </label>
            <input
              type="text"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="e.g., Undergraduate CS students in India"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Deadline *
            </label>
            <input
              type="text"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="e.g., 31st December 2024"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Amount / Benefits *
            </label>
            <input
              type="text"
              name="amount_benefits"
              value={formData.amount_benefits}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="e.g., ₹2,00,000 or $5,000 grant"
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
              placeholder="https://scholarships.microsoft.com"
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
              placeholder="Short summary of scholarship goals & requirements"
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
              {loading ? 'Adding...' : 'Add Scholarship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScholarshipsForm;