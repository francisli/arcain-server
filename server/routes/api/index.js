const express = require('express');

const router = express.Router();

router.use('/assets', require('./assets'));
router.use('/auth', require('./auth'));
router.use('/contact', require('./contact'));
router.use('/invites', require('./invites'));
router.use('/pages', require('./pages'));
router.use('/passwords', require('./passwords'));
router.use('/photos', require('./photos'));
router.use('/projects', require('./projects'));
router.use('/users', require('./users'));

module.exports = router;
