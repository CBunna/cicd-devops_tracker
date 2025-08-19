import React from 'react';

const TopicItem = ({ topic, onEdit, onDelete }) => {
  const getStatusClass = (status) => {
    return `status-tag status-${status.toLowerCase().replace(' ', '-')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="topic-item">
      <div className="topic-header">
        <h3 className="topic-title">{topic.title}</h3>
        <div className="topic-actions">
          <button 
            className="edit-btn"
            onClick={() => onEdit(topic)}
          >
            Edit
          </button>
          <button 
            className="delete-btn"
            onClick={() => onDelete(topic.id)}
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="topic-meta">
        <span className="category-tag">{topic.category}</span>
        <span className={getStatusClass(topic.status)}>{topic.status}</span>
      </div>

      {topic.notes && (
        <div className="topic-notes">
          {topic.notes}
        </div>
      )}

      <div className="topic-dates">
        <span>Created: {formatDate(topic.created_at)}</span>
        {topic.updated_at !== topic.created_at && (
          <span>Updated: {formatDate(topic.updated_at)}</span>
        )}
      </div>
    </div>
  );
};

export default TopicItem;