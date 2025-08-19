import React, { useState, useEffect } from 'react';
import './App.css';
import TopicForm from './components/TopicForm';
import TopicList from './components/TopicList';

function App() {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTopic, setEditingTopic] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all'
  });

  const API_BASE = '/api';

  // Fetch topics from the backend
  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/topics`);
      if (!response.ok) {
        throw new Error('Failed to fetch topics');
      }
      const data = await response.json();
      setTopics(data);
      setFilteredTopics(data);
      setError('');
    } catch (err) {
      setError('Failed to load topics. Please check if the backend is running.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new topic
  const handleAddTopic = async (topicData) => {
    try {
      const response = await fetch(`${API_BASE}/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(topicData),
      });

      if (!response.ok) {
        throw new Error('Failed to add topic');
      }

      await fetchTopics(); // Refresh the list
    } catch (err) {
      setError('Failed to add topic. Please try again.');
      console.error('Add topic error:', err);
    }
  };

  // Update existing topic
  const handleUpdateTopic = async (topicData) => {
    try {
      const response = await fetch(`${API_BASE}/topics/${editingTopic.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(topicData),
      });

      if (!response.ok) {
        throw new Error('Failed to update topic');
      }

      setEditingTopic(null);
      await fetchTopics(); // Refresh the list
    } catch (err) {
      setError('Failed to update topic. Please try again.');
      console.error('Update topic error:', err);
    }
  };

  // Delete topic
  const handleDeleteTopic = async (topicId) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        const response = await fetch(`${API_BASE}/topics/${topicId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete topic');
        }

        await fetchTopics(); // Refresh the list
      } catch (err) {
        setError('Failed to delete topic. Please try again.');
        console.error('Delete topic error:', err);
      }
    }
  };

  // Handle form submission
  const handleFormSubmit = (topicData) => {
    if (editingTopic) {
      handleUpdateTopic(topicData);
    } else {
      handleAddTopic(topicData);
    }
  };

  // Handle edit topic
  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTopic(null);
  };

  // Filter topics
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);

    let filtered = topics;

    if (newFilters.category !== 'all') {
      filtered = filtered.filter(topic => topic.category === newFilters.category);
    }

    if (newFilters.status !== 'all') {
      filtered = filtered.filter(topic => topic.status === newFilters.status);
    }

    setFilteredTopics(filtered);
  };

  // Load topics on component mount
  useEffect(() => {
    fetchTopics();
  }, []);

  // Get unique categories for filter dropdown
  const categories = [...new Set(topics.map(topic => topic.category))];
  const statuses = ['Not Started', 'In Progress', 'Completed'];

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 DevOps Learning Tracker</h1>
        <p>Track your journey to DevOps mastery</p>
      </header>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="filters">
        <div className="filter-group">
          <label>Filter by Category:</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Status:</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="main-content">
        <TopicForm 
          onSubmit={handleFormSubmit}
          editingTopic={editingTopic}
          onCancel={handleCancelEdit}
        />
        <TopicList 
          topics={filteredTopics}
          onEdit={handleEditTopic}
          onDelete={handleDeleteTopic}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;