require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');
const recipeImageRoutes = require('./src/routes/recipeImage');


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const userRoutes = require('./src/routes/user');
const recipeRoutes = require('./src/routes/recipes');
const ratingRoutes = require('./src/routes/ratings');

app.use('/user', userRoutes);
app.use('/recipe', recipeRoutes);
app.use('/recipe/:id/rating', ratingRoutes);
app.use('/recipe', recipeImageRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('🍳 Welcome to the Recipe App API!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
