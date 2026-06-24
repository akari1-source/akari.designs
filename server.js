// Simple proxy to fetch Instagram media using a server-side token
// Usage: set INSTAGRAM_ACCESS_TOKEN in environment, then `node server.js`

const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 4000;
const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';

if(!TOKEN){
  console.warn('Warning: INSTAGRAM_ACCESS_TOKEN is not set. /instagram will return 503.');
}

app.get('/instagram', async (req, res) => {
  if(!TOKEN) return res.status(503).json({error:'INSTAGRAM_ACCESS_TOKEN not configured'});
  try{
    // Fetch recent media from Instagram Basic Display / Graph API
    // This endpoint works with a user access token for Instagram Basic Display:
    // https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,thumbnail_url,timestamp
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,thumbnail_url,timestamp&access_token=${TOKEN}`;
    const r = await fetch(url);
    if(!r.ok) return res.status(502).json({error:'Instagram API error', status:r.status});
    const data = await r.json();
    // Normalize items
    const items = (data.data || []).map(it=>({
      id: it.id,
      caption: it.caption || '',
      media_url: it.media_url || it.thumbnail_url || '',
      permalink: it.permalink || ''
    }));
    res.json({items});
  }catch(err){
    res.status(500).json({error:err.message});
  }
});

app.listen(PORT, ()=>{
  console.log(`Instagram proxy running on http://localhost:${PORT}`);
});
