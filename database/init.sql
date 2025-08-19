-- Initialize the DevOps Tracker database
-- Note: Database is already created via POSTGRES_DB environment variable
-- \c devops_tracker;

-- Create the topics table
CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Not Started',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_topics_category ON topics(category);
CREATE INDEX IF NOT EXISTS idx_topics_status ON topics(status);
CREATE INDEX IF NOT EXISTS idx_topics_created_at ON topics(created_at);

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_topics_updated_at 
    BEFORE UPDATE ON topics 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO topics (title, category, status, notes) VALUES
('Docker Fundamentals', 'Containerization', 'In Progress', 'Learning basic Docker commands and concepts'),
('Kubernetes Basics', 'Orchestration', 'Not Started', 'Need to finish Docker first'),
('CI/CD with Jenkins', 'CI/CD', 'Completed', 'Built first pipeline successfully!'),
('AWS EC2 Basics', 'Cloud', 'In Progress', 'Working through AWS tutorials'),
('Terraform Introduction', 'Infrastructure as Code', 'Not Started', 'Planning to start next week'),
('Prometheus Monitoring', 'Monitoring', 'Not Started', 'Essential for production systems');

-- Grant permissions (adjust as needed)
-- Note: In production, create specific users with limited permissions
GRANT ALL PRIVILEGES ON DATABASE devops_tracker TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;