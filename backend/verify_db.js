const mongoose = require('mongoose');
require('dotenv').config();

const Component = require('./src/models/Component');

async function verify() {
    try {
        console.log('URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const count = await Component.countDocuments();
        console.log('Component Count:', count);

        if (count > 0) {
            const sample = await Component.findOne();
            console.log('Sample:', sample);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
