const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

// Middleware to verify token (basic)
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // In production, verify JWT properly
  next();
};

// GET /api/portfolio/:userId (public)
// Get portfolio with social links
router.get('/:userId', async (req, res) => {
  try {
    console.log('GET /api/portfolio/:userId - userId:', req.params.userId);
    const user = await User.findById(req.params.userId);
    console.log('User found:', user ? user._id : 'NOT FOUND');
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const portfolio = await Portfolio.findOne({ user: user._id });
    console.log('Portfolio found:', portfolio ? 'YES' : 'NO');
    
    if (!portfolio) {
      // Return empty portfolio if doesn't exist
      console.log('Returning empty portfolio for user:', user._id);
      return res.json({
        profile: { name: user.name, email: user.email, bio: '', skills: [], projects: [] },
        template: 'developer',
        socialLinks: []
      });
    }
    
    res.json({
      profile: portfolio.profile,
      template: portfolio.template,
      socialLinks: portfolio.socialLinks || []
    });
  } catch (err) {
    console.error('Error in GET /api/portfolio/:userId:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// PUT /api/portfolio/:userId
// Update portfolio profile and template
router.put('/:userId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    let portfolio = await Portfolio.findOne({ user: user._id });
    
    if (!portfolio) {
      // Create new portfolio if doesn't exist
      portfolio = new Portfolio({
        user: user._id,
        profile: req.body.profile || { name: user.name, email: user.email },
        template: req.body.template || 'developer'
      });
    } else {
      // Update existing portfolio
      portfolio.profile = req.body.profile || portfolio.profile;
      portfolio.template = req.body.template || portfolio.template;
    }
    
    await portfolio.save();
    res.json({
      profile: portfolio.profile,
      template: portfolio.template,
      socialLinks: portfolio.socialLinks || []
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Update social links
router.put('/:userId/social-links', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: user._id },
      { socialLinks: req.body.socialLinks },
      { new: true }
    );
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    res.json({ socialLinks: portfolio.socialLinks });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
