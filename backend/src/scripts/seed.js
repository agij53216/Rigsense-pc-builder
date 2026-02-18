/**
 * RigSense - MongoDB Seed Script
 * Seeds Components (from initialData.js component entries) and Presets.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Component = require('../models/Component');
const Preset = require('../models/Preset');
const prebuiltPCs = require('../data/initialData');

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected.');

        // ─── Clear existing ─────────────────────────────────────────────
        await Component.deleteMany({});
        await Preset.deleteMany({});
        console.log('🗑  Cleared Components and Presets.');

        // ─── Extract unique components from prebuilt data ────────────────
        const componentsMap = new Map();
        prebuiltPCs.forEach(pc => {
            Object.entries(pc.components).forEach(([category, comp]) => {
                if (!componentsMap.has(comp.name)) {
                    componentsMap.set(comp.name, {
                        name: comp.name,
                        category: category,
                        brand: comp.brand || '',
                        price: comp.price,
                        tier: pc.tier,
                        specs: comp.specs || {},
                        performance_score: comp.performance_score || 0,
                        performance: comp.performance_score || 0, // alias
                        wattage: comp.wattage || 0,
                        socket: comp.socket || null,
                        ramType: comp.ramType || null,
                        formFactor: comp.formFactor || null,
                        inStock: true,
                        imageUrl: '',
                        isCustom: false,
                    });
                }
            });
        });

        const componentsToSeed = Array.from(componentsMap.values());
        await Component.insertMany(componentsToSeed, { ordered: false });
        console.log(`✅ Seeded ${componentsToSeed.length} unique components.`);

        // ─── Seed Presets ────────────────────────────────────────────────
        await Preset.insertMany(prebuiltPCs, { ordered: false });
        console.log(`✅ Seeded ${prebuiltPCs.length} preset builds.`);

        console.log('\n🎉 Database seeding COMPLETE!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
}

seed();