const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooling']
    },
    price: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        required: false
    },
    tier: {
        type: String,
        enum: ['budget', 'mid', 'premium'],
        required: false
    },
    // Flexible specs object (from new data structure)
    specs: {
        type: Object,
        default: {}
    },
    // Performance score (0-100)
    performance_score: {
        type: Number,
        default: 0
    },
    // Alias for compatibility if needed, or can use virtual
    performance: {
        type: Number,
        default: 0
    },
    wattage: {
        type: Number,
        default: 0
    },
    socket: { type: String },
    ramType: { type: String },
    formFactor: { type: String },

    // New fields
    highlights: [{ type: String }],
    features: [{ type: String }],

    // Detailed Specs (Data from CSV)
    clockSpeed: String,
    cores: Number,
    vram: Number,
    gpuCores: Number,
    capacity: Number, // RAM/Storage size (numeric)
    storageCapacity: String, // String representation
    storageType: String,

    // Description from CSV
    description: String
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    toObject: {
        virtuals: true
    }
});

module.exports = mongoose.model('Component', componentSchema);
