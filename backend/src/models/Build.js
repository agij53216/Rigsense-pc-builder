const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name for your build'],
        trim: true
    },
    components: {
        cpu: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        gpu: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        motherboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        ram: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        storage: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        psu: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        case: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
        cooling: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' }
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
