const { spawn } = require('child_process');
// Import the open package with default import
const open = require('open').default || require('open');
const path = require('path');
const fs = require('fs');

console.log('Starting CRM system...');

// Path to our landing page
const landingPagePath = path.join(__dirname, 'index.html');

// Start backend server
console.log('Starting backend server...');
const backend = spawn('npm', ['run', 'start:backend'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Start frontend server
console.log('Starting frontend server...');
const frontend = spawn('npm', ['run', 'start:frontend'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Open the landing page in browser after delay to let servers start
setTimeout(async () => {
  // Convert the file path to a URL
  const fileUrl = `file://${landingPagePath}`;
  
  console.log('Opening landing page...');
  await open(fileUrl);
  console.log('Browser opened with CRM landing page');
}, 5000);

// Handle process termination
const cleanup = () => {
  console.log('\nShutting down servers...');
  if (backend) backend.kill();
  if (frontend) frontend.kill();
  process.exit(0);
};

// Handle termination signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);