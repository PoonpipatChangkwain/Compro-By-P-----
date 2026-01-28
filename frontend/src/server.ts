import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import type { Request, Response } from 'express';

const app = express();
const PORT = 8000;
const BACKEND_URL = 'http://localhost:5000';

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// Proxy API endpoint
app.post('/api/run', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'code must be a string' });
    }

    const response = await axios.post(`${BACKEND_URL}/api/run`, { code }, {
      timeout: 10000
    });
    res.json(response.data);
  } catch (error: any) {
    const msg = error.response?.data?.error || error.message || 'Backend error';
    res.status(error.response?.status || 500).json({ error: msg });
  }
});

// Backend office endpoint - get solution
app.post('/api/solution', async (req, res) => {
  try {
    const { username, password } = req.body;
    const response = await axios.post(`${BACKEND_URL}/testfinal`, { username, password }, {
      timeout: 5000
    });
    res.json(response.data);
  } catch (error: any) {
    const msg = error.response?.data?.error || 'Authentication failed';
    res.status(error.response?.status || 401).json({ error: msg });
  }
});

// Serve index.html for all other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);
  console.log(`Backend configured at ${BACKEND_URL}`);
});
