const express = require('express');
const multer = require('multer');
const RecipeImage = require('../models/RecipeImage');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
/**
 * 🟢 GET /recipe/:recipeId/images
 * Get all images id for a specific recipe
 */
router.get('/:recipeId/images', async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Find all images for this recipe
    const images = await RecipeImage.find({ recipeId });

    if (!images.length) {
      return res.status(404).json({ message: 'No images found for this recipe' });
    }

    // Return metadata + URLs for each image
    res.json({
      success: true,
      count: images.length,
      data: images.map(img => ({
        id: img._id,
        recipeId: img.recipeId,
        author: img.author,
        url: `/recipe/image/${img._id}` // URL to view the actual image
      }))
    });
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/**
 * 🔐 POST /recipe/:recipeId/image
 * Upload new image for a specific recipe
 */
router.post('/:recipeId/image', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    const { recipeId } = req.params;
    const author = req.user.username;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const newImage = new RecipeImage({
      author,
      recipeId,
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
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 🟢 GET /image/:id
 * View single image by ID (public)
 */
router.get('/image/:id', async (req, res) => {
  try {
    const recipeImage = await RecipeImage.findById(req.params.id);

    if (!recipeImage || !recipeImage.image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', recipeImage.image.contentType);
    res.send(recipeImage.image.data);
  } catch (err) {
    console.error('Error retrieving image:', err);
    res.status(500).json({ error: 'Error retrieving image' });
  }
});

/**
 * 🔐 PUT /image/:id
 * Update image (must be owner)
 */
router.put('/image/:id', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    const recipeImage = await RecipeImage.findById(req.params.id);

    if (!recipeImage) return res.status(404).json({ error: 'Image not found' });
    if (recipeImage.author !== req.user.username) {
      return res.status(403).json({ error: 'You are not the owner of this image' });
    }

    if (req.file) {
      recipeImage.image.data = req.file.buffer;
      recipeImage.image.contentType = req.file.mimetype;
    }

    if (req.body.recipeId) recipeImage.recipeId = req.body.recipeId;

    await recipeImage.save();
    res.json({ message: 'Image updated successfully' });
  } catch (err) {
    console.error('Error updating image:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 🔐 DELETE /image/:id
 * Delete image (must be owner)
 */
router.delete('/image/:id', authenticateJWT, async (req, res) => {
  try {
    const recipeImage = await RecipeImage.findById(req.params.id);

    if (!recipeImage) return res.status(404).json({ error: 'Image not found' });
    if (recipeImage.author !== req.user.username) {
      return res.status(403).json({ error: 'You are not the owner of this image' });
    }

    await RecipeImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
