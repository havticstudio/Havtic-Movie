import express from 'express';
import axios from 'axios';

const router = express.Router();

const SERVERS = [
  {
    id: 1,
    name: 'Server 1',
    getUrl: (tmdbId, type, season, episode) =>
      type === 'tv'
        ? `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
        : `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`,
    // Phrases that indicate content NOT found on this server
    notFoundPatterns: ['not found', 'no source', '404', 'unavailable', 'nothing here'],
  },
  {
    id: 2,
    name: 'Server 2',
    getUrl: (tmdbId, type, season, episode) =>
      type === 'tv'
        ? `https://superembed.stream/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
        : `https://superembed.stream/embed/movie?tmdb=${tmdbId}`,
    notFoundPatterns: ['not found', 'no source', '404', 'unavailable'],
  },
  {
    id: 3,
    name: 'Server 3',
    getUrl: (tmdbId, type, season, episode) =>
      type === 'tv'
        ? `https://autoembed.to/tv/tmdb/${tmdbId}-${season}-${episode}`
        : `https://autoembed.to/movie/tmdb/${tmdbId}`,
    notFoundPatterns: ['not found', 'no source', '404', 'unavailable'],
  },
];

// Check which server has content for a given TMDB ID
router.get('/find-server', async (req, res) => {
  const { tmdbId, type = 'movie', season = 1, episode = 1 } = req.query;

  if (!tmdbId) return res.status(400).json({ message: 'tmdbId is required' });

  for (const server of SERVERS) {
    const url = server.getUrl(tmdbId, type, season, episode);
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html',
        },
        timeout: 6000,
        validateStatus: (status) => status < 500,
      });

      if (response.status !== 200) continue;

      const html = (response.data || '').toLowerCase();

      // Check if this page has actual video content
      const hasVideo =
        html.includes('.m3u8') ||
        html.includes('.mp4') ||
        html.includes('jwplayer') ||
        html.includes('videojs') ||
        html.includes('plyr') ||
        html.includes('hls.js') ||
        html.includes('player') ||
        html.includes('source src');

      const isNotFound = server.notFoundPatterns.some(p => html.includes(p));

      if (hasVideo && !isNotFound) {
        return res.json({ 
          found: true, 
          serverId: server.id, 
          serverName: server.name, 
          url 
        });
      }
    } catch (err) {
      // Timeout or network error - try next server
      continue;
    }
  }

  // No server found with content
  return res.json({ found: false, serverId: 1, serverName: 'Server 1', url: SERVERS[0].getUrl(tmdbId, type, season, episode) });
});

export default router;
