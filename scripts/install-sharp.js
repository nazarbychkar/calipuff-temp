#!/usr/bin/env node

/**
 * Cross-platform script to install sharp with proper platform binaries
 * Works with both npm and pnpm
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Detect package manager and check availability
const hasPnpmLock = fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'));
const hasNpmLock = fs.existsSync(path.join(process.cwd(), 'package-lock.json'));
const hasYarnLock = fs.existsSync(path.join(process.cwd(), 'yarn.lock'));

// Check if package manager command is available
function isCommandAvailable(cmd) {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

let packageManager = 'npm';
if (hasPnpmLock && isCommandAvailable('pnpm')) {
  packageManager = 'pnpm';
} else if (hasYarnLock && isCommandAvailable('yarn')) {
  packageManager = 'yarn';
} else {
  packageManager = 'npm';
}

console.log(`📦 Detected package manager: ${packageManager}`);

// Install sharp with platform-specific binaries
const commands = packageManager === 'pnpm' 
  ? [
      'pnpm add sharp --save-optional',
      'pnpm rebuild sharp',
      'pnpm add sharp --force'
    ]
  : packageManager === 'yarn'
  ? [
      'yarn add sharp --optional',
      'yarn rebuild sharp',
      'yarn add sharp --force'
    ]
  : [
      'npm install --include=optional sharp',
      'npm rebuild sharp',
      'npm install sharp --force'
    ];

let success = false;
for (const cmd of commands) {
  try {
    console.log(`🔄 Running: ${cmd}`);
    execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
    success = true;
    console.log(`✅ Successfully installed sharp`);
    break;
  } catch (error) {
    console.log(`⚠️  Command failed, trying next...`);
    continue;
  }
}

if (!success) {
  console.log(`⚠️  Warning: Could not install sharp, but continuing...`);
  process.exit(0); // Don't fail the build
}

