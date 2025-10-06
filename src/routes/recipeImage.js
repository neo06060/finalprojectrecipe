const express = require('express');
const multer = require('multer');
const RecipeImage = require('../models/RecipeImage');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

// Store images in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🟢 Public: View image by ID
router.get('/image/:id', async (req, res) => {
  try {
    const recipeImage = await RecipeImage.findById(req.params.id);

    if (!recipeImage || !recipeImage.image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', recipeImage.image.contentType);
    res.send(recipeImage.image.data);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving image' });
  }
});

// 🔐 Private: Upload new image (must be logged in)
router.post('/image', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    const { recipeName } = req.body;
    const author = req.user.username; // from JWT

    if (!recipeName || !req.file) {
      return res.status(400).json({ error: 'recipeName and image are required' });
    }

    const newImage = new RecipeImage({
      author,
      recipeName,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    await newImage.save();
    res.status(201).json({
      message: 'Recipe image uploaded successfully',
      imageId: newImage._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🔐 Private: Edit image (must be logged in + author)
router.put('/image/:id', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    const recipeImage = await RecipeImage.findById(req.params.id);

    if (!recipeImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Check ownership
    if (recipeImage.author !== req.user.username) {
      return res.status(403).json({ error: 'You are not the owner of this image' });
    }

    if (req.file) {
      recipeImage.image.data = req.file.buffer;
      recipeImage.image.contentType = req.file.mimetype;
    }

    if (req.body.recipeName) {
      recipeImage.recipeName = req.body.recipeName;
    }

    await recipeImage.save();
    res.json({ message: 'Image updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🔐 Private: Delete image (must be logged in + author)
router.delete('/image/:id', authenticateJWT, async (req, res) => {
  try {
    const recipeImage = await RecipeImage.findById(req.params.id);

    if (!recipeImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Check ownership
    if (recipeImage.author !== req.user.username) {
      return res.status(403).json({ error: 'You are not the owner of this image' });
    }

    await RecipeImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
