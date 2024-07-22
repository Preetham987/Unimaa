const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Article = require('../models/Article');

router.post('/', auth('Maker'), async (req, res) => {
  const { title, content } = req.body;
  try {
    const article = new Article({ title, content, createdBy: req.user._id });
    await article.save();
    res.send(article);
  } catch (err) {
    res.status(500).send({ error: 'Server error.' });
  }
});

router.get('/', auth(['Maker', 'Checker']), async (req, res) => {
  try {
    const articles = await Article.find().populate('createdBy', 'username');
    res.send(articles);
  } catch (err) {
    res.status(500).send({ error: 'Server error.' });
  }
});

router.put('/:id/approve', auth('Checker'), async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send({ error: 'Article not found.' });
    }
    article.status = 'Approved';
    article.approvedBy = req.user._id;
    await article.save();
    res.send(article);
  } catch (err) {
    res.status(500).send({ error: 'Server error.' });
  }
});

router.put('/:id/disapprove', auth('Checker'), async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send({ error: 'Article not found.' });
    }
    article.status = 'Disapproved';
    article.approvedBy = req.user._id;
    await article.save();
    res.send(article);
  } catch (err) {
    res.status(500).send({ error: 'Server error.' });
  }
});

module.exports = router;
