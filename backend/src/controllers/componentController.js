const Component = require('../models/Component');
const fs = require('fs');
const path = require('path');

// @desc    Get all components with filtering and sorting
// @route   GET /api/components
// @access  Public
exports.getComponents = async (req, res) => {
    try {
        const logMsg = `GET /api/components request received\n`;
        try {
            fs.appendFileSync(path.join(__dirname, '../../server_debug.log'), logMsg);
        } catch (e) { }

        console.log(logMsg.trim());
        const {
            category,
            tier,
            brand,
            minPrice,
            maxPrice,
            inStock,
            search,
            sort,
            // Compatibility filters
            socket,
            ramType,
            formFactor
        } = req.query;

        let query = {};

        // Filtering
        if (category) query.category = category;
        if (tier) query.tier = tier;
        if (brand) {
            // Support comma-separated brands (e.g. ?brand=Intel,AMD)
            const brands = brand.split(',');
            query.brand = { $in: brands };
        }
        if (inStock === 'true') query.inStock = true;

        // Compatibility Filtering
        if (socket) query.socket = socket;
        if (ramType) query.ramType = ramType;
        if (formFactor) query.formFactor = formFactor;

        // Price Range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Text Search (Simple regex for now, can be upgraded to text index later)
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Sorting
        let sortOption = {};
        if (sort === 'price-asc') sortOption.price = 1;
        else if (sort === 'price-desc') sortOption.price = -1;
        else if (sort === 'performance') sortOption.performance = -1;
        else if (sort === 'name') sortOption.name = 1;
        else sortOption.performance = -1; // Default to performance

        const components = await Component.find(query).sort(sortOption);
        const logMsg2 = `Query: ${JSON.stringify(query)}\nFound: ${components.length} components\n`;
        try {
            fs.appendFileSync(path.join(__dirname, '../../server_debug.log'), logMsg2);
        } catch (e) { }

        console.error(logMsg2.trim());

        if (components.length === 0) {
            console.error('DEBUG: No components found, checking count...');
            const count = await Component.countDocuments();
            console.error(`DEBUG: Total documents in collection: ${count}`);
        }

        res.json(components);
    } catch (error) {
        console.error('Error fetching components:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single component
// @route   GET /api/components/:id
// @access  Public
exports.getComponentById = async (req, res) => {
    try {
        const component = await Component.findById(req.params.id);
        if (component) {
            res.json(component);
        } else {
            res.status(404).json({ message: 'Component not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get distinct brands for a category
// @route   GET /api/components/brands
// @access  Public
exports.getBrands = async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const brands = await Component.distinct('brand', query);
        res.json(brands.sort());
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
