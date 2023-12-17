const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/url/dashboard');
  } else {
    res.render('index');
  }
});

module.exports = router;
