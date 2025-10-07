require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Import routes
const userRoutes = require('./src/routes/user');
const recipeRoutes = require('./src/routes/recipe');
const ratingRoutes = require('./src/routes/rating');
const recipeImageRoutes = require('./src/routes/recipeImage');

// API Routes
app.use('/user', userRoutes);
app.use('/recipe', recipeRoutes);
app.use('/recipe', recipeImageRoutes);
app.use('/recipe/:id/rating', ratingRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route
app.get('/', (req, res) => {
  res.send('🍳 Welcome to the Recipe App API!');
});

// Error handling (optional)
app.use((err, req, res, next) => {
  console.error('💥 Global Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
