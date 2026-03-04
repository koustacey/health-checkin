import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Checkin routes
app.get('/api/checkins', async (req, res) => {
  // TODO: Implement get checkins
  res.json([]);
});

app.post('/api/checkins', async (req, res) => {
  // TODO: Implement create checkin
  res.json({ success: true });
});

app.delete('/api/checkins/:id', async (req, res) => {
  // TODO: Implement delete checkin
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
