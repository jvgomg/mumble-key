#!/usr/bin/env tsx

import { randomBytes } from 'crypto';
import { existsSync, readFileSync, appendFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Generate a cryptographically secure random secret
function generateSecret(bytes: number = 32): string {
  return randomBytes(bytes).toString('base64url');
}

// Main function
function main(): void {
  const secret = generateSecret();
  const envLine = `CRON_SECRET=${secret}`;
  
  console.log('\n🔐 Generated CRON_SECRET:');
  console.log('─'.repeat(50));
  console.log(envLine);
  console.log('─'.repeat(50));
  
  // Check if .env.local exists
  const envPath = join(process.cwd(), '.env.local');
  
  try {
    if (existsSync(envPath)) {
      // Read existing content
      const content = readFileSync(envPath, 'utf8');
      
      // Check if CRON_SECRET already exists
      if (content.includes('CRON_SECRET=')) {
        console.log('\n⚠️  Warning: CRON_SECRET already exists in .env.local');
        console.log('   Copy the above value to update it manually.\n');
      } else {
        // Append to file
        appendFileSync(envPath, `\n${envLine}\n`);
        console.log('\n✅ Added CRON_SECRET to .env.local\n');
      }
    } else {
      // Create new file
      writeFileSync(envPath, `${envLine}\n`);
      console.log('\n✅ Created .env.local with CRON_SECRET\n');
    }
  } catch (error) {
    console.error('\n❌ Could not write to .env.local:', error);
    console.log('   Copy the above value and add it manually.\n');
  }
}

// Run the script
main();