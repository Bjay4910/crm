import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';

// Handle the 'open' package import with proper typing
// The package can export either a default function or a regular function
import openImport from 'open';
const open: (target: string, options?: object) => Promise<ChildProcess> = 
  (openImport as any).default || openImport;

console.log('Starting CRM system...');

// Path to our landing page
const landingPagePath: string = path.join(__dirname, 'index.html');

// Start backend server
console.log('Starting backend server...');
const backend: ChildProcess = spawn('npm', ['run', 'start:backend'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Start frontend server
console.log('Starting frontend server...');
const frontend: ChildProcess = spawn('npm', ['run', 'start:frontend'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Open the landing page in browser after delay to let servers start
setTimeout(async () => {
  // Convert the file path to a URL
  const fileUrl: string = `file://${landingPagePath}`;
  
  console.log('Opening landing page...');
  await open(fileUrl);
  console.log('Browser opened with CRM landing page');
}, 5000);

// Handle process termination
const cleanup = (): void => {
  console.log('\nShutting down servers...');
  if (backend) backend.kill();
  if (frontend) frontend.kill();
  process.exit(0);
};

// Handle termination signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);