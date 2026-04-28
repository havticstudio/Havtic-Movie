import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const API_KEY = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

if (API_KEY) {
  console.log(`✅ TMDB connected successfully`);
}

// Use router.use to handle all requests to this router (mounted at /api/tmdb)
router.use(async (req, res) => {
  if (!API_KEY) {
    console.error('❌ TMDB_API_KEY IS MISSING IN ROUTE!');
  }
  const path = req.url.split('?')[0]; 
  try {
    const params = {
      ...req.query,
      api_key: API_KEY,
    };

    const response = await axios.get(`${BASE_URL}${path}`, { params });
    res.json(response.data);
  } catch (error) {
    console.error(`[TMDB Proxy] Error fetching ${BASE_URL}${path}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal Server Error' });
  }
});

export default router;
