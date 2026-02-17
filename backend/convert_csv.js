const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const csvPath = path.join(__dirname, 'components.csv');
const jsonPath = path.join(__dirname, 'components.json');

// Helper functions from seed.js
function parsePurpose(raw) {
    if (!raw || raw.trim() === '') return [];
    try {
        let cleaned = raw.trim();
        if (cleaned.startsWith('"')) cleaned = cleaned.slice(1, -1);
        cleaned = cleaned.replace(/'/g, '"');
        const parsed = JSON.parse(cleaned);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
        return raw.replace(/[\[\]'"]/g, '').split(',').map(s => s.trim()).filter(Boolean);
    }
}

function parseRamType(raw) {
    if (!raw || raw.trim() === '') return [];
    if (raw.includes('[')) return parsePurpose(raw);
    return [raw.trim()];
}

function parseNum(val) {
    if (val === null || val === undefined || val === '') return null;
    const n = parseFloat(val);
    return isNaN(n) ? null : n;
}

function transformRow(row) {
    const category = (row.part || '').trim().toLowerCase();
    const name = (row.name || '').trim();
    const brand = name.split(' ')[0] || 'Generic';

    const doc = {
        category,
        name,
        brand,
        manufacturer: brand,
        price: parseNum(row.price) || 0,
        performanceScore: parseNum(row.performance_score) || 0,
        image: row.image || '',
        features: parsePurpose(row.purpose),
        description: (row.description || '').trim(),
        purpose: parsePurpose(row.purpose),
        inStock: true,

        // Specs
        clockSpeed: row.clock_speed ? row.clock_speed.trim() : null,
        cores: parseNum(row.core),
        wattage: parseNum(row.watt),
        socket: row.socket ? row.socket.trim() : null,
        ramType: parseRamType(row.ram_type),

        // GPU
        vram: parseNum(row.vram),
        gpuCores: parseNum(row.core),
        vramType: null,

        // RAM
        capacity: parseNum(row.capacity),
        ramCapacity: null,

        // PSU
        wattCapacity: parseNum(row.watt),
        wattCapacityStr: row.s_type ? row.s_type.trim() : null,

        // SSD
        storageCapacity: row.capacity ? String(row.capacity).trim() : null,
        storageType: row.s_type ? row.s_type.trim() : null,

        // Form Factor
        formFactor: row.form_factor ? row.form_factor.trim() : null
    };

    // Fix: for GPU
    if (category === 'gpu') {
        doc.ramType = [];
        doc.vramType = row.ram_type ? row.ram_type.trim() : null;
    }

    // Fix: for RAM
    if (category === 'ram') {
        doc.vramType = null;
        doc.ramType = row.ram_type ? [row.ram_type.trim()] : [];
        if (doc.capacity) doc.ramCapacity = doc.capacity + 'GB';
    }

    // Fix: for SSD
    if (category === 'ssd' && doc.capacity) {
        if (doc.capacity < 10) doc.storageCapacity = doc.capacity + 'TB'; // crude heuristic for TB vs GB
        else doc.storageCapacity = doc.capacity + 'GB';
    }

    return doc;
}

const fileContent = fs.readFileSync(csvPath, 'utf-8');
const rows = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
});

const components = rows.map(transformRow).filter(c => c.name && c.price >= 0);

fs.writeFileSync(jsonPath, JSON.stringify(components, null, 2));
console.log(`Converted ${components.length} components to ${jsonPath}`);
