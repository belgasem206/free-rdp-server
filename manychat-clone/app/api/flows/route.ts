import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();
const WORKSPACE_ID = "seed-ws"; // demo workspace

export async function GET() {
  const flows = await prisma.flow.findMany({
    where: { workspaceId: WORKSPACE_ID },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(flows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description } = body ?? {};
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  const flow = await prisma.flow.create({
    data: { name, description, workspaceId: WORKSPACE_ID },
  });
  return NextResponse.json(flow, { status: 201 });
}
