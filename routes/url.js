const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');
const ShortenedURL = require('../models/url');
const shortid = require('shortid');

router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const username = req.user.username;
    const shortenedURLs = await ShortenedURL.find({ username });
    const token = req.cookies.token;

    res.render('url/dashboard', { shortenedURLs, token, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/shorten', (req, res) => {
  res.render('url/shorten');
});

router.post('/shorten', authenticateToken, async (req, res) => {
  try {
    const { longURL } = req.body;
    const username = req.user.username;

    const newShortenedURL = new ShortenedURL({
      longURL,
      shortURL: generateShortURL(),
      username,
    });

    await newShortenedURL.save();

    res.redirect('/url/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:shortCode', async (req, res) => {
  try {
    const shortCode = req.params.shortCode;

    const url = await ShortenedURL.findOne({ shortURL: shortCode });

    if (url) {
      return res.redirect(url.longURL);
    } else {
      return res.status(404).send('URL not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

function generateShortURL() {
  return shortid.generate();
}

module.exports = router;
