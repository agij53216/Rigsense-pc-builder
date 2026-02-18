const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function testPythonWithDB() {
    try {
        console.log("Reading components from DB export (components.json)...");
        // We'll read the components.json to simulate DB data
        const componentsPath = path.join(__dirname, 'components.json');

        let components = [];
        if (fs.existsSync(componentsPath)) {
            const raw = fs.readFileSync(componentsPath, 'utf8');
            components = JSON.parse(raw);
        } else {
            console.error("components.json not found, using empty array");
        }

        const inputData = {
            request: { budget: 150000, useCase: 'gaming' },
            database: components
        };

        const isWindows = process.platform === 'win32';
        const venvPython = isWindows ? 'python' : 'python3';
        const scriptPath = path.join(__dirname, 'src/ai/optimizer.py');

        console.log(`Spawning ${venvPython} with ${scriptPath}`);
        console.log(`Input data size: ${JSON.stringify(inputData).length} characters`);

        const pythonProcess = spawn(venvPython, [scriptPath]);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdin.write(JSON.stringify(inputData));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
            if (code !== 0) {
                console.error("STDERR:", errorString);
            } else {
                console.log("STDOUT start:", dataString.substring(0, 200));
                try {
                    const result = JSON.parse(dataString);
                    console.log("Parsed Result Status:", result.status);
                } catch (e) {
                    console.error("Failed to parse JSON:", e.message);
                    console.log("Raw output:", dataString);
                }
            }
        });

    } catch (error) {
        console.error("Test failed:", error);
    }
}

testPythonWithDB();
