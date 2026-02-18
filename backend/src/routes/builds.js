const express = require('express');
const router = express.Router();
const { protect, optionalProtect } = require('../middleware/auth');
const {
    validateBuild,
    generateBuild,
    getBuilds,
    saveBuild,
    updateBuild,
    deleteBuild,
    calculateBuild
} = require('../controllers/buildController');

// @desc    Validate build and get metrics
// @route   POST /api/builds/validate
// @access  Public
router.post('/validate', validateBuild);

// @desc    Calculate build metrics (public/stateless)
router.post('/calculate', calculateBuild);

// @desc    Generate a build based on budget and use case
// @route   POST /api/builds/generate
// @access  Public
router.post('/generate', generateBuild);

// @desc    Get user/guest builds
// @route   GET /api/builds
// @access  Public/Private
router.get('/', optionalProtect, getBuilds);

// @desc    Create new build
// @route   POST /api/builds
// @access  Public/Private
router.post('/', optionalProtect, saveBuild);

// @desc    Update build
// @route   PUT /api/builds/:id
// @access  Private
router.put('/:id', protect, updateBuild);

// @desc    Delete build
// @route   DELETE /api/builds/:id
// @access  Public/Private
router.delete('/:id', optionalProtect, deleteBuild);

module.exports = router;
