const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);

app.get('/', (req, res) => {
  res.send('PortFolioX API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
