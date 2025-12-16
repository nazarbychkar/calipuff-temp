#!/usr/bin/env ts-node

/**
 * Script to ensure all Prisma migrations are applied
 * Run this on the server if migrations are out of sync
 */

import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";

function main() {
  console.log("🔍 Checking Prisma migrations...");
  
  // Check if .env exists
  const envPath = path.join(process.cwd(), ".env");
  if (!existsSync(envPath)) {
    console.error("❌ .env file not found");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in environment");
    process.exit(1);
  }

  try {
    console.log("📦 Deploying Prisma migrations...");
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      env: process.env,
    });
    
    console.log("✅ Migrations deployed successfully");
    
    console.log("🔧 Regenerating Prisma Client...");
    execSync("npx prisma generate", {
      stdio: "inherit",
      env: process.env,
    });
    
    console.log("✅ Prisma Client regenerated successfully");
    console.log("🎉 All done! You can now restart your application.");
  } catch (error) {
    console.error("❌ Error applying migrations:", error);
    process.exit(1);
  }
}

main();

