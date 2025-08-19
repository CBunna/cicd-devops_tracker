const express = require('express');
const router = express.Router();
const pool = require('../database');

// GET all topics
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = 'SELECT * FROM topics';
    let values = [];
    let conditions = [];

    // Add filters if provided
    if (category && category !== 'all') {
      conditions.push('category = $' + (values.length + 1));
      values.push(category);
    }

    if (status && status !== 'all') {
      conditions.push('status = $' + (values.length + 1));
      values.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// GET single topic by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM topics WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
});

// POST create new topic
router.post('/', async (req, res) => {
  try {
    const { title, category, status = 'Not Started', notes = '' } = req.body;

    // Validate required fields
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const result = await pool.query(
      'INSERT INTO topics (title, category, status, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, category, status, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

// PUT update existing topic
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, status, notes } = req.body;

    const result = await pool.query(
      'UPDATE topics SET title = $1, category = $2, status = $3, notes = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [title, category, status, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

// DELETE topic
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM topics WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

module.exports = router;