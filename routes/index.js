const express = require('express');
const router = express.Router();
const moveHandler = require('./move/move');

/* POST move member to channel. */
router.post('/move', moveHandler);

module.exports = router;
