import React from 'react';
import TopicItem from './TopicItem';

const TopicList = ({ topics, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="loading">Loading topics...</div>;
  }

  if (topics.length === 0) {
    return (
      <div className="empty-state">
        <h3>No topics found</h3>
        <p>Start your DevOps learning journey by adding your first topic!</p>
      </div>
    );
  }

  return (
    <div className="topic-list">
      {topics.map(topic => (
        <TopicItem
          key={topic.id}
          topic={topic}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TopicList;