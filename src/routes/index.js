const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');

// Mount routes
router.use('/recipe', require('./recipe')); 
router.use('/rating', require('./rating'));
router.use('/auth', require('./auth'));
router.use('/image', require('./recipeImages')); 


// GitHub OAuth
router.get('/login', passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/api-docs', session: true }),
  async (req, res) => {
    const githubId = req.user.id;
    let user = await User.findOne({ githubId });
    if (!user) user = await User.create({ githubId });

    req.session.user = user;
    res.redirect('/');
  }
);

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => res.send("Logged out"));
  });
});

module.exports = router;
