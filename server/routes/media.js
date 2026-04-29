import express from 'express';
import MediaLink from '../models/MediaLink.js';

const router = express.Router();

// Get custom link for a TMDB ID
router.get('/:tmdbId', async (req, res) => {
  try {
    const link = await MediaLink.findOne({ tmdbId: req.params.tmdbId });
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching media link' });
  }
});

// Save or Update custom link (Admin only)
router.post('/save', async (req, res) => {
  const { tmdbId, type, customUrl1, customUrl2, customUrl3, title } = req.body;
  try {
    const link = await MediaLink.findOneAndUpdate(
      { tmdbId },
      { 
        type, 
        customUrl1, 
        customUrl2, 
        customUrl3, 
        customUrl: customUrl1 || customUrl2 || customUrl3, // fallback for legacy code
        title, 
        updatedAt: Date.now() 
      },
      { upsert: true, new: true }
    );
    res.json({ message: 'Success', link });
  } catch (error) {
    res.status(500).json({ message: 'Error saving media link' });
  }
});

export default router;
