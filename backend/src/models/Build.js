const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    guestId: {
        type: String,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name for your build'],
        trim: true
    },
    components: {
        type: mongoose.Schema.Types.Mixed, // Allow full component objects/snapshots
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    useCase: {
        type: String,
        enum: ['gaming', 'productivity', 'creation', 'general'],
        default: 'general'
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Build', buildSchema);
