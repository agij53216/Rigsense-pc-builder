const Preset = require('../models/Preset');

// @desc    Get all presets
// @route   GET /api/presets
// @access  Public
exports.getPresets = async (req, res) => {
    try {
        const presets = await Preset.find({});
        res.status(200).json(presets);
    } catch (error) {
        console.error('Error fetching presets:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single preset by ID
// @route   GET /api/presets/:id
// @access  Public
exports.getPresetById = async (req, res) => {
    try {
        const preset = await Preset.findOne({ id: req.params.id });
        if (!preset) {
            return res.status(404).json({ message: 'Preset not found' });
        }
        res.status(200).json(preset);
    } catch (error) {
        console.error('Error fetching preset:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
