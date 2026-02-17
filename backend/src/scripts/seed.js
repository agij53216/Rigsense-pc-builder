/**
 * RigSense - MongoDB Seed Script
 * 
 * Location: backend/src/scripts/seed.js
 * Source: backend/components.json
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load env vars
const envPath = path.join(__dirname, '../../.env');
require('dotenv').config({ path: envPath });

// ─────────────────────────────────────────
// 1. MONGOOSE SCHEMA
// ─────────────────────────────────────────
const componentSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            enum: ['gpu', 'cpu', 'ram', 'motherboard', 'psu', 'case', 'ssd', 'processor', 'cooling', 'monitor'],
            index: true,
        },
        name: { type: String, required: true },
        brand: { type: String, default: '' },
        price: { type: Number, required: true, index: true },
        performanceScore: { type: Number, default: 0 },
        image: { type: String, default: '' },
        description: { type: String, default: '' },
        purpose: { type: [String], default: [] },
        inStock: { type: Boolean, default: true },

        // CPU / Processor specific
        clockSpeed: { type: String, default: null },
        cores: { type: Number, default: null },
        wattage: { type: Number, default: null },
        socket: { type: String, default: null, index: true },
        ramType: { type: [String], default: [] },

        // GPU specific
        vram: { type: Number, default: null },
        gpuCores: { type: Number, default: null },
        vramType: { type: String, default: null },

        // RAM specific
        capacity: { type: Number, default: null }, // in GB
        ramCapacity: { type: String, default: null }, // raw string e.g. "16GB"

        // PSU specific
        wattCapacity: { type: Number, default: null },
        wattCapacityStr: { type: String, default: null },

        // SSD specific
        storageCapacity: { type: String, default: null },
        storageType: { type: String, default: null },

        // Case / Motherboard
        formFactor: { type: String, default: null },
    },
    { timestamps: true }
);

// Compound index for common query patterns
componentSchema.index({ category: 1, price: 1 });
componentSchema.index({ category: 1, performanceScore: -1 });

const Component = mongoose.model('Component', componentSchema);

// ─────────────────────────────────────────
// 2. DEDUPLICATION
// ─────────────────────────────────────────
function deduplicate(components) {
    const seen = new Set();
    return components.filter(comp => {
        const key = `${comp.category}::${comp.name}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

// ─────────────────────────────────────────
// 3. MAIN SEED FUNCTION
// ─────────────────────────────────────────
async function seed() {
    const jsonPath = path.join(__dirname, '../../components.json');

    console.log('DEBUG: Loaded Env from:', envPath);
    console.log('DEBUG: URI is', process.env.MONGODB_URI ? 'Present' : 'Missing');

    if (!fs.existsSync(jsonPath)) {
        console.error('❌ components.json not found at:', jsonPath);
        process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ Connection Error:', err);
        process.exit(1);
    }

    console.log('📄 Reading JSON file...');
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const components = JSON.parse(fileContent);

    console.log(`📊 Found ${components.length} components in JSON`);
    const unique = deduplicate(components);
    console.log(`🧹 After deduplication: ${unique.length} unique components`);

    // Basic Validation
    const categories = {};
    unique.forEach(c => {
        categories[c.category] = (categories[c.category] || 0) + 1;
    });
    console.log('📦 Category breakdown:', categories);

    console.log('🗑️  Clearing existing components...');
    await Component.deleteMany({});

    console.log('💾 Inserting components into MongoDB...');
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < unique.length; i += batchSize) {
        const batch = unique.slice(i, i + batchSize);
        try {
            await Component.insertMany(batch, { ordered: false });
            inserted += batch.length;
            process.stdout.write(`\r   Inserted ${inserted}/${unique.length} components...`);
        } catch (e) {
            console.error('\n Batch insert error:', e.message);
        }
    }

    console.log(`\n✅ Successfully seeded ${inserted} components!`);
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed crashed:', err);
    process.exit(1);
});