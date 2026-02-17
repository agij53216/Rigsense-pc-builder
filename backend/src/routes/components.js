const express = require('express');
const router = express.Router();
const {
    getComponents,
    getComponentById,
    getBrands
} = require('../controllers/componentController');

// @desc    Get distinct brands for a category
// @route   GET /api/components/brands
// @access  Public
router.get('/brands', getBrands);

// @desc    Get all components with filtering and sorting
// @route   GET /api/components
// @access  Public
router.get('/', getComponents);

// @desc    Get single component
// @route   GET /api/components/:id
// @access  Public
router.get('/:id', getComponentById);

module.exports = router;
