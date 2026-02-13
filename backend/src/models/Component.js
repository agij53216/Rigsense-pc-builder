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
    specs: {
        type: Object, // Changed from Map to Object to be more flexible with JSON
        default: {}
    },
    // Single performance score 0-100 to match frontend
    performance: {
        type: Number,
        default: 0
    },
    imageUrl: {
        type: String,
        required: false
    },
    manufacturer: {
        type: String,
        required: false
    },
    inStock: {
        type: Boolean,
        default: true
    },
    discount: {
        type: Number,
        default: 0
    },
    features: [{
        type: String
    }],
    isCustom: {
        type: Boolean,
        default: false
    },
    // Compatibility fields
    socket: { type: String, required: false },
    ramType: { type: [String], required: false }, // Array to support multiple types/compatibility
    wattage: { type: Number, required: false },
    formFactor: { type: String, required: false },

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
