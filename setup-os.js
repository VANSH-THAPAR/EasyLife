const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const platform = os.platform();
const homeDir = os.homedir();
const desktopDir = path.join(homeDir, 'Desktop');
const cliEntry = path.join(__dirname, 'bin', 'vansh.js');

console.log(`Setting up EasyLife for ${platform}...`);

// 1. Create the globally accessible CLI wrapper and Desktop Launcher
if (platform === 'win32') {
  // --- WINDOWS ---
  // Create a .bat file right in the User's Root directory so CMD finds it instantly
  const userRootBat = path.join(homeDir, 'vansh.bat');
  const batContent = `@echo off\r\nnode "${cliEntry}" %*`;
  fs.writeFileSync(userRootBat, batContent);
  console.log(`\n✅ Created Windows CLI Command: ${userRootBat}`);

  // Create a Desktop Shortcut (Batch file)
  const desktopShortcut = path.join(desktopDir, 'Run EasyLife.bat');
  const shortcutContent = `@echo off\r\ncd /d "${__dirname}"\r\nnpm run setup-start\r\npause`;
  fs.writeFileSync(desktopShortcut, shortcutContent);
  console.log(`✅ Created Windows Desktop Shortcut: ${desktopShortcut}`);

} else {
  // --- MAC & LINUX ---
  // Create a global executable in /usr/local/bin (requires sudo, we'll try something safer via profile alias)
  const zshrc = path.join(homeDir, '.zshrc');
  const bashrc = path.join(homeDir, '.bashrc');
  const aliasCommand = `\nalias vansh="node '${cliEntry}'"\n`;

  if (fs.existsSync(zshrc)) {
    fs.appendFileSync(zshrc, aliasCommand);
    console.log(`\n✅ Added custom 'vansh' command to Mac ~/.zshrc`);
  }
  if (fs.existsSync(bashrc)) {
    fs.appendFileSync(bashrc, aliasCommand);
    console.log(`✅ Added custom 'vansh' command to Linux ~/.bashrc`);
  }

  // Create a Desktop Executable (.command for Mac, .desktop for Linux)
  if (platform === 'darwin') {
    const desktopShortcut = path.join(desktopDir, 'Run EasyLife.command');
    fs.writeFileSync(desktopShortcut, `#!/bin/bash\ncd "${__dirname}"\nnpm run setup-start\n`);
    fs.chmodSync(desktopShortcut, 0o755); // make executable
    console.log(`✅ Created Mac Desktop App: ${desktopShortcut}`);
  } else {
    const desktopShortcut = path.join(desktopDir, 'Run EasyLife.sh');
    fs.writeFileSync(desktopShortcut, `#!/bin/bash\ncd "${__dirname}"\nnpm run setup-start\n`);
    fs.chmodSync(desktopShortcut, 0o755);
    console.log(`✅ Created Linux Desktop Script: ${desktopShortcut}`);
  }
}

console.log('\n=============================================');
console.log('🎉 EasyLife successfully installed on your OS!');
console.log('=============================================');
if (platform !== 'win32') {
  console.log('Mac/Linux Users: Please restart your terminal or run "source ~/.zshrc" before testing the vansh command.');
} else {
  console.log("Windows Users: You can now type 'vansh fill form' directly in this CMD window!");
}
