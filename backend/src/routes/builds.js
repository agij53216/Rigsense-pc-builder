const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    validateBuild,
    generateBuild,
    getUserBuilds,
    createBuild,
    updateBuild,
    deleteBuild
} = require('../controllers/buildController');

// @desc    Validate build and get metrics
// @route   POST /api/builds/validate
// @access  Public
router.post('/validate', validateBuild);

// @desc    Generate a build based on budget and use case
// @route   POST /api/builds/generate
// @access  Public
router.post('/generate', generateBuild);

// @desc    Get user builds
// @route   GET /api/builds
// @access  Private
router.get('/', protect, getUserBuilds);

// @desc    Create new build
// @route   POST /api/builds
// @access  Private
router.post('/', protect, createBuild);

// @desc    Update build
// @route   PUT /api/builds/:id
// @access  Private
router.put('/:id', protect, updateBuild);

// @desc    Delete build
// @route   DELETE /api/builds/:id
// @access  Private
router.delete('/:id', protect, deleteBuild);

module.exports = router;
