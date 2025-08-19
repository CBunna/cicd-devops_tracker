import React, { useState } from 'react';

const TopicForm = ({ onSubmit, editingTopic, onCancel }) => {
  const [formData, setFormData] = useState({
    title: editingTopic?.title || '',
    category: editingTopic?.category || '',
    status: editingTopic?.status || 'Not Started',
    notes: editingTopic?.notes || ''
  });

  const categories = [
    'Containerization',
    'Orchestration',
    'CI/CD',
    'Cloud',
    'Monitoring',
    'Infrastructure as Code',
    'Security',
    'Automation',
    'Version Control',
    'Other'
  ];

  const statuses = ['Not Started', 'In Progress', 'Completed'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.category.trim()) {
      onSubmit(formData);
      if (!editingTopic) {
        setFormData({ title: '', category: '', status: 'Not Started', notes: '' });
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
    <div className="topic-form">
      <h2>{editingTopic ? 'Edit Topic' : 'Add New Learning Topic'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Topic Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Docker Fundamentals"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add your learning notes, resources, or progress updates..."
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="submit-btn">
            {editingTopic ? 'Update Topic' : 'Add Topic'}
          </button>
          {editingTopic && (
            <button 
              type="button" 
              onClick={onCancel}
              className="submit-btn"
              style={{ background: '#95a5a6' }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TopicForm;