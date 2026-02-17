const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Component = require('../models/Component');

const checkPrices = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const products = await Component.find({});
        console.log('--- DB PRICES ---');
        products.forEach(p => {
            console.log(`Name: ${p.name} | Price: ${p.price}`);
        });
        console.log('-----------------');

        mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

checkPrices();
