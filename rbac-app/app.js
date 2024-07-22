const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');

const app = express();

mongoose.connect('mongodb://localhost:27017/rbac', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

module.exports = app;
