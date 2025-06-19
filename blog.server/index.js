const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const routes = require('./src/routes');
const logger = require('./src/middlewares/logger');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

app.use(express.json());

app.use(logger);

// Routes placeholder
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use routes with `/api` prefix
app.use('/api', routes);

// Error handling middleware (last middleware)
const errorHandler = require('./src/middlewares/errorHandler');
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
