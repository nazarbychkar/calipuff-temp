import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message:
      "No manual action required. Prisma migrations manage the schema automatically.",
  });
}

export async function GET() {
  return NextResponse.json({
    success: true,
    migration_status:
      "managed_by_prisma",
    note:
      "Run `pnpm prisma migrate dev` to apply the latest schema locally.",
  });
}
