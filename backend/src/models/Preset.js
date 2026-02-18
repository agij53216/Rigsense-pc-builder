const mongoose = require('mongoose');

const presetSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // 'pb-budget-general' etc.
    name: { type: String, required: true },
    tagline: { type: String },
    tier: {
        type: String,
        enum: ['budget', 'mid', 'premium'],
        required: true
    },
    useCase: {
        type: String,
        enum: ['gaming', 'editing', 'streaming', 'workstation', 'general'],
        required: true
    },
    totalPrice: { type: Number, required: true },
    totalWattage: { type: Number },
    ai_score: { type: Number },
    description: { type: String },
    highlights: [{ type: String }],
    fps: [{
        game: String,
        resolution: String,
        fps: Number
    }],
    // Store components as references or embedded objects? 
    // Given the data structure, they are embedded with specific specs *for that build*.
    // However, to allow "Open in Builder", we might want to link to actual Components.
    // For now, let's embed the structure to match the frontend mock exactly for speed,
    // but also allow an optional array of Component IDs for the "Builder" mode.
    components: {
        type: Object, // Stores the Record<ComponentCategory, BuildComponent>
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Preset', presetSchema);
