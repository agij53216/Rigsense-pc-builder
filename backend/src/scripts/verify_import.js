const axios = require('axios');

async function verify() {
    try {
        console.log('Fetching components...');
        const res = await axios.get('http://localhost:5000/api/components');
        console.log(`✅ Status: ${res.status}`);
        console.log(`📊 Total Components: ${res.data.length}`);

        if (res.data.length > 0) {
            console.log('🔍 First Component:', JSON.stringify(res.data[0], null, 2));

            // Check category breakdown
            const breakdown = {};
            res.data.forEach(c => breakdown[c.category] = (breakdown[c.category] || 0) + 1);
            console.log('📦 Breakdown:', breakdown);
        } else {
            console.error('❌ No components returned!');
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

verify();
