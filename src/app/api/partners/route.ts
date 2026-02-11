import { NextResponse } from "next/server";
import { getPartnersFromDb } from "@/lib/partners-db";

export async function GET() {
  const partners = await getPartnersFromDb();
  return NextResponse.json(partners);
}
