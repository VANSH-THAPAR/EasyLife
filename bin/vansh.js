#!/usr/bin/env node

const path = require('path');
const readline = require('readline');
const process = require('process');

// Determine command
const args = process.argv.slice(2).join(' ');

if (args === 'fill form') {
  // We need to require the automate script from the correct relative path
  const automatePath = path.join(__dirname, '../DailyJournal/automate.js');
  const { submitDailyJournal } = require(automatePath);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n--- EasyLife CLI: Daily Journal Automation ---');
  
  rl.question('Full Name (e.g. Vansh Thapar): ', (fullName) => {
    rl.question('Squad Number (e.g. 85): ', async (squad) => {
      rl.close();
      
      if (!fullName.trim() || !squad.trim()) {
        console.log('Error: Name and Squad are required. Exiting...');
        process.exit(1);
      }
      
      // Calculate email format automatically
      const formattedName = fullName.trim().toLowerCase().replace(/\s+/g, '.');
      const emailId = `${formattedName}.s${squad}@kalvium.community`.toLowerCase();
      
      // Setup payload matching the frontend configuration
      const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc8RRUAG8n8nPB9dm21m_MxwHQ-JuDnEj7GnvwEkWXykkKFuQ/viewform';
      const message = 'Completed CLI tasks for EasyLife automation setup.';
      
      console.log(`\nInitializing cross-platform headless browser for: ${emailId}...`);
      try {
        await submitDailyJournal(formUrl, message, emailId);
        console.log('\nSUCCESS: Please review the final page and hit Submit!');
      } catch (err) {
        console.error('\nAUTOMATION FAILED:', err.message);
      }
    });
  });
} 
else if (args === 'ui' || args === 'start') {
  console.log('\nStarting EasyLife Full UI Server...');
  // Boots the node server natively from the CLI terminal
  const { execSync } = require('child_process');
  execSync('npm run setup-start', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
} 
else {
  console.log('\nEasyLife Automation Toolkit\n');
  console.log('Available Commands:');
  console.log('  vansh fill form   - Runs the Google Form automation directly in the terminal');
  console.log('  vansh ui          - Starts the local web dashboard');
  console.log('\n');
}
