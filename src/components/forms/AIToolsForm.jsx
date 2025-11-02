import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const AIToolsForm = ({ onClose }) => {
  const { addEntry } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    toolCategory: '',
    pricing: ''
  });
  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    'Image',
    'Text',
    'Video',
    'Coding',
    'Audio',
    'Business',
    'Productivity',
    'Other'
  ];

  const pricingOptions = [
    'Free',
    'Freemium',
    'Paid',
    'Subscription'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.link) {
      setLoading(true);
      const success = await addEntry('aiTools', formData);
      setLoading(false);

      if (success) {
        setFormData({
          title: '',
          description: '',
          link: '',
          toolCategory: '',
          pricing: ''
        });
        alert('AI tool added successfully!');
        onClose();
      } else {
        alert('Failed to add AI tool. Please try again.');
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
        <h2 className="text-xl font-bold mb-4 text-card-foreground">Add New AI Tool</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Tool Name *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="e.g., ChatGPT 5"
            />
          </div>

          <div className="mb-4">
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
              placeholder="Short overview of what it does"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Website / Link *
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
              placeholder="https://example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Category / Type
            </label>
            <select
              name="toolCategory"
              value={formData.toolCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            >
              <option value="">Select category</option>
              {categoryOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-card-foreground mb-1">
              Pricing
            </label>
            <select
              name="pricing"
              value={formData.pricing}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            >
              <option value="">Select pricing</option>
              {pricingOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
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
              {loading ? 'Adding...' : 'Add Tool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIToolsForm;