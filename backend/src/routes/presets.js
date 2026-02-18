const express = require('express');
const router = express.Router();
const { getPresets, getPresetById } = require('../controllers/presetController');

router.get('/', getPresets);
router.get('/:id', getPresetById);

module.exports = router;
