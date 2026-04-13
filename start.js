const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

function checkAndInstallDependencies(dir) {
  const nodeModulesPath = path.join(dir, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(`📦 Installing dependencies in ${dir}...`);
    try {
      execSync('npm install', { cwd: dir, stdio: 'inherit' });
      console.log(`✅ Successfully installed dependencies in ${dir}`);
    } catch (err) {
      console.error(`❌ Failed to install dependencies in ${dir}`);
      process.exit(1);
    }
  } else {
    console.log(`✅ Dependencies already installed in ${dir} (Skipping download)`);
  }
}

// 1. Install dependencies only once if they don't exist
console.log('🔄 Checking dependencies across all project directories...');
checkAndInstallDependencies(__dirname); // Root
checkAndInstallDependencies(path.join(__dirname, 'Frontend'));
checkAndInstallDependencies(path.join(__dirname, 'DailyJournal'));

// 2. Build the Frontend if it hasn't been built yet
const frontendDistPath = path.join(__dirname, 'Frontend', 'dist');
if (!fs.existsSync(frontendDistPath)) {
  console.log('🏗️ Building Frontend...');
  try {
    execSync('npm run build', { cwd: path.join(__dirname, 'Frontend'), stdio: 'inherit' });
    console.log('✅ Frontend build complete');
  } catch (err) {
    console.error('❌ Failed to build the Frontend');
    process.exit(1);
  }
} else {
  console.log('✅ Frontend already built (Skipping build)');
}

// 3. Start the Backend Server (which serves the frontend)
console.log('🚀 Starting the EasyLife server...');
const serverProcess = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'DailyJournal'),
  stdio: 'inherit'
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});
