const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  avatar: { type: String },
  profession: { type: String },
  skills: [String],
  interests: [String],
  projects: [
    {
      title: String,
      description: String,
      link: String,
      image: String
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);
