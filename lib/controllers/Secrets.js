const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const data = await Secret.getAll();
      res.json(data);
    } catch (e) {
      next(e);
    }
  });
