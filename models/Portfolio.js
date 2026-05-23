const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  profile: { type: Object, required: true },
  template: { type: String, default: 'developer' },
  socialLinks: [{
    platform: { type: String },
    url: { type: String }
  }]
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
